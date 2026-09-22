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
    const { 
      nome_cliente,
      nome_servico,
      valor_servico,
      prazo_entrega,
      forma_pagamento,
      descricao_servico,
      cidade,
      estado,
      data_contrato
    } = await req.json();

    console.log('Generating contract for:', nome_cliente);

    // Get Gemini API key from secrets
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Build detailed prompt for contract generation
    const prompt = `Gere um contrato profissional e completo de prestação de serviços com as seguintes informações:

CONTRATANTE: ${nome_cliente}
SERVIÇO: ${nome_servico}
DESCRIÇÃO DO SERVIÇO: ${descricao_servico}
VALOR: ${valor_servico}
PRAZO DE ENTREGA: ${prazo_entrega}
FORMA DE PAGAMENTO: ${forma_pagamento}
LOCAL: ${cidade}, ${estado}
DATA DO CONTRATO: ${data_contrato}

O contrato deve incluir:
1. Título e identificação das partes
2. Objeto do contrato (descrição detalhada dos serviços)
3. Obrigações do contratante
4. Obrigações do contratado
5. Valor e forma de pagamento
6. Prazo de execução
7. Cláusulas de rescisão
8. Cláusulas de confidencialidade (se aplicável)
9. Foro competente
10. Data e local

Formate o contrato de forma profissional, clara e juridicamente adequada.`;

    // Call Gemini API
    const geminiResponse = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', JSON.stringify(geminiData, null, 2));

    // Extract generated text from Gemini response
    const contratoGerado = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!contratoGerado) {
      console.error('No text found in response. Full response:', JSON.stringify(geminiData));
      throw new Error('No content generated from Gemini');
    }

    return new Response(
      JSON.stringify({ 
        contrato: contratoGerado,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in gerar_contrato function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
