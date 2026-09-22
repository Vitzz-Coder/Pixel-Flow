import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";

interface Empresa {
  nome: string;
  endereco: string;
  telefone: string;
  site: string;
  avaliacao: string;
}

const ProspectorLeads = () => {
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [regiao, setRegiao] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePesquisar = async () => {
    if (!tipoNegocio.trim() || !regiao.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    setEmpresas([]);

    try {
      const { data, error } = await supabase.functions.invoke("buscar_leads", {
        body: {
          tipo_negocio: tipoNegocio,
          regiao: regiao,
        },
      });

      if (error) {
        console.error("Erro ao buscar leads:", error);
        toast.error("Erro ao buscar empresas. Tente novamente.");
        return;
      }

      if (data?.success && data?.empresas) {
        setEmpresas(data.empresas);
        toast.success(`${data.empresas.length} empresas encontradas!`);
      } else {
        toast.warning("Nenhuma empresa encontrada");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao buscar empresas. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Prospector de Leads</h1>
        <p className="text-muted-foreground">
          Encontre empresas e salve a lista para uso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parâmetros de Busca</CardTitle>
          <CardDescription>
            Informe o tipo de negócio e a região para buscar empresas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_negocio">Tipo de Negócio</Label>
              <Input
                id="tipo_negocio"
                placeholder="Ex: Restaurantes, Academias, Clínicas"
                value={tipoNegocio}
                onChange={(e) => setTipoNegocio(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regiao">Região</Label>
              <Input
                id="regiao"
                placeholder="Ex: São Paulo, Rio de Janeiro"
                value={regiao}
                onChange={(e) => setRegiao(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button
            onClick={handlePesquisar}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Pesquisar
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {empresas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Empresas Encontradas</CardTitle>
            <CardDescription>
              {empresas.length} {empresas.length === 1 ? "empresa encontrada" : "empresas encontradas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Avaliação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empresas.map((empresa, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{empresa.nome}</TableCell>
                      <TableCell>{empresa.endereco}</TableCell>
                      <TableCell className="whitespace-nowrap">{empresa.telefone}</TableCell>
                      <TableCell>
                        {empresa.site ? (
                          <a
                            href={empresa.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Visitar
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{empresa.avaliacao || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProspectorLeads;
