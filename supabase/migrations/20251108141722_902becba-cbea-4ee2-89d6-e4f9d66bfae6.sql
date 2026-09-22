-- Tornar user_id nullable para permitir documentos sem autenticação
ALTER TABLE public.documentos_gerados 
ALTER COLUMN user_id DROP NOT NULL;

-- Remover as políticas RLS existentes
DROP POLICY IF EXISTS "Usuários podem ver seus próprios documentos" ON public.documentos_gerados;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios documentos" ON public.documentos_gerados;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios documentos" ON public.documentos_gerados;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios documentos" ON public.documentos_gerados;

-- Desabilitar RLS temporariamente (até implementar autenticação)
ALTER TABLE public.documentos_gerados DISABLE ROW LEVEL SECURITY;

-- Criar políticas públicas para permitir acesso sem autenticação
-- NOTA: Isso torna os dados públicos. Quando implementar autenticação, essas políticas devem ser atualizadas
CREATE POLICY "Permitir leitura pública" 
ON public.documentos_gerados 
FOR SELECT 
USING (true);

CREATE POLICY "Permitir inserção pública" 
ON public.documentos_gerados 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública" 
ON public.documentos_gerados 
FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusão pública" 
ON public.documentos_gerados 
FOR DELETE 
USING (true);

-- Reabilitar RLS com as novas políticas públicas
ALTER TABLE public.documentos_gerados ENABLE ROW LEVEL SECURITY;