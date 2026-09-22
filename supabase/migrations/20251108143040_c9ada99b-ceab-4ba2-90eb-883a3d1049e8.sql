-- Criar tabela de projetos
CREATE TABLE public.projetos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_projeto text NOT NULL,
  data_criacao timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'Em Desenvolvimento',
  user_id uuid,
  prompt_gerado text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;

-- Políticas públicas temporárias (até implementar autenticação)
CREATE POLICY "Permitir leitura pública" 
ON public.projetos 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção pública" 
ON public.projetos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública" 
ON public.projetos 
FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusão pública" 
ON public.projetos 
FOR DELETE 
USING (true);