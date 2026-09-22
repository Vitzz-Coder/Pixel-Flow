-- Criar tabela para documentos gerados
CREATE TABLE public.documentos_gerados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('Contrato', 'Prompt')),
  nome_cliente TEXT NOT NULL,
  conteudo_gerado TEXT NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.documentos_gerados ENABLE ROW LEVEL SECURITY;

-- Policies para usuários autenticados
CREATE POLICY "Usuários podem ver seus próprios documentos"
  ON public.documentos_gerados
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios documentos"
  ON public.documentos_gerados
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios documentos"
  ON public.documentos_gerados
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios documentos"
  ON public.documentos_gerados
  FOR DELETE
  USING (auth.uid() = user_id);

-- Índice para melhor performance nas consultas
CREATE INDEX idx_documentos_user_id ON public.documentos_gerados(user_id);
CREATE INDEX idx_documentos_data_criacao ON public.documentos_gerados(data_criacao DESC);