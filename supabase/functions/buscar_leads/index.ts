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
    const { tipo_negocio, regiao } = await req.json();

    console.log('Buscando leads:', { tipo_negocio, regiao });

    // Validação dos parâmetros de entrada
    if (!tipo_negocio || !regiao) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Os parâmetros tipo_negocio e regiao são obrigatórios',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Obter a API key do Lovable AI
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY não configurado');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Configuração da API não encontrada',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Construir o prompt em linguagem natural conforme solicitado
    const prompt = `Busque empresas de ${tipo_negocio} na cidade/região de ${regiao}, e liste o nome, endereço e telefone de cada uma. Retorne até 50 resultados.
    
    Retorne EXATAMENTE no formato JSON abaixo, sem nenhum texto adicional:
    {
      "empresas": [
        {
          "nome": "nome da empresa",
          "endereco": "endereço completo",
          "telefone": "telefone com DDD",
          "site": "site se disponível",
          "avaliacao": "avaliação se disponível"
        }
      ]
    }`;
    
    console.log('Enviando requisição para Lovable AI');

    // Usar Lovable AI para fazer a busca
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um assistente especializado em buscar informações sobre empresas na internet. Sempre retorne os dados no formato JSON solicitado, sem texto adicional.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Erro na API do Lovable AI:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Erro ao buscar dados: ${aiResponse.status}`,
        }),
        {
          status: aiResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const aiData = await aiResponse.json();
    console.log('Resposta do Lovable AI recebida');

    // Extrair o conteúdo da resposta
    const content = aiData.choices?.[0]?.message?.content || '';
    
    // Função para limpar e validar telefone no formato E.164
    const limparTelefone = (telefone: string): string | null => {
      if (!telefone) return null;
      
      // Remover todos os caracteres não numéricos
      const telefoneLimpo = telefone.replace(/\D/g, '');
      
      if (!telefoneLimpo) return null;
      
      // Adicionar código do país 55 se não começar com ele
      const telefoneComCodigo = telefoneLimpo.startsWith('55') 
        ? telefoneLimpo 
        : `55${telefoneLimpo}`;
      
      // Validar se contém sequências repetitivas de 0000 ou 8888
      if (/0{4,}|8{4,}/.test(telefoneComCodigo)) {
        return null; // Telefone inválido
      }
      
      return telefoneComCodigo;
    };

    // Tentar parsear o JSON da resposta
    let empresas = [];
    try {
      // Remover markdown code blocks se houver
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }
      
      const parsed = JSON.parse(jsonStr);
      const empresasBrutas = parsed.empresas || [];
      
      // Limpar telefones e filtrar empresas com telefones inválidos
      empresas = empresasBrutas
        .map((empresa: any) => {
          const telefoneLimpo = limparTelefone(empresa.telefone);
          return telefoneLimpo ? { ...empresa, telefone: telefoneLimpo } : null;
        })
        .filter((empresa: any) => empresa !== null);
      
    } catch (e) {
      console.error('Erro ao parsear resposta JSON:', e);
      console.log('Conteúdo recebido:', content);
      
      // Retornar erro mais informativo
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Erro ao processar resposta da IA',
          debug: content.substring(0, 500),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Encontradas ${empresas.length} empresas válidas após filtro de telefones`);

    return new Response(
      JSON.stringify({
        success: true,
        empresas: empresas,
        total: empresas.length,
        parametros: {
          tipo_negocio,
          regiao,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno ao processar requisição',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
