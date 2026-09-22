import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Parse do corpo da requisição
    const { tipo, nome_cliente, conteudo_gerado } = await req.json();

    console.log('Salvando documento:', { tipo, nome_cliente });

    // Validar dados
    if (!tipo || !nome_cliente || !conteudo_gerado) {
      console.error('Dados inválidos:', { tipo, nome_cliente, conteudo_gerado });
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: tipo, nome_cliente, conteudo_gerado' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!['Contrato', 'Prompt'].includes(tipo)) {
      console.error('Tipo inválido:', tipo);
      return new Response(
        JSON.stringify({ error: 'Tipo deve ser "Contrato" ou "Prompt"' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Inserir documento na tabela (sem user_id até implementar autenticação)
    const { data, error } = await supabaseClient
      .from('documentos_gerados')
      .insert({
        tipo,
        nome_cliente,
        conteudo_gerado,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar documento:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log('Documento salvo com sucesso:', data.id);

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erro geral:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});