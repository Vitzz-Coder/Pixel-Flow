import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { empresa_alvo, servico_principal, dor_cliente, solucao_unica, tom_mensagem } = await req.json();

    // Validação dos campos obrigatórios
    if (!empresa_alvo || !servico_principal || !dor_cliente || !solucao_unica || !tom_mensagem) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY não configurada');
      return new Response(
        JSON.stringify({ error: 'Configuração da API não encontrada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Definir o tom da mensagem
    const tomsPrompt: Record<string, string> = {
      'formal': 'profissional e respeitoso',
      'direto': 'direto, ousado e impactante',
      'amigavel': 'amigável e conversacional'
    };

    const tonalidade = tomsPrompt[tom_mensagem.toLowerCase()] || 'profissional';

    // Montar o prompt persuasivo para o Gemini
    const prompt = `Você é um especialista em copywriting para prospecção B2B. Crie uma mensagem de prospecção altamente persuasiva e direta.

INFORMAÇÕES DO PROSPECTO:
- Empresa Alvo: ${empresa_alvo}
- Serviço Oferecido: ${servico_principal}
- Dor Principal do Cliente: ${dor_cliente}
- Solução Única: ${solucao_unica}
- Tom da Mensagem: ${tonalidade}

INSTRUÇÕES CRÍTICAS:
1. A mensagem deve ser CURTA e DIRETA - máximo 4 parágrafos curtos
2. Use o tom ${tonalidade}
3. Comece com um gancho que chame atenção e mencione a dor específica
4. Apresente a solução única de forma clara e com valor percebido
5. Termine com uma call-to-action simples e objetiva
6. NÃO use saudações genéricas como "Prezado" ou "Caro"
7. NÃO inclua despedidas formais extensas
8. Seja específico sobre o ${empresa_alvo} e como ${servico_principal} resolve ${dor_cliente}
9. Use quebras de linha para facilitar a leitura
10. A mensagem deve ser pronta para enviar por WhatsApp ou email

FORMATO DE SAÍDA:
Retorne APENAS a mensagem de prospecção, sem introduções, explicações ou metadados adicionais.`;

    console.log('Enviando requisição para Gemini API...');

    // Chamada à API do Gemini
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Erro na API do Gemini:', geminiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar copy com IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    console.log('Resposta do Gemini recebida');

    const mensagemGerada = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!mensagemGerada) {
      console.error('Mensagem não encontrada na resposta do Gemini');
      return new Response(
        JSON.stringify({ error: 'Erro ao processar resposta da IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ mensagem: mensagemGerada }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função gerar_copy:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
