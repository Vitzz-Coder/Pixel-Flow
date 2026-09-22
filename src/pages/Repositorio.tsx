import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Documento {
  id: string;
  tipo: string;
  nome_cliente: string;
  conteudo_gerado: string;
  data_criacao: string;
}

const Repositorio = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    carregarDocumentos();
  }, []);

  const carregarDocumentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("documentos_gerados")
        .select("*")
        .order("data_criacao", { ascending: false });

      if (error) throw error;

      setDocumentos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar documentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (doc: Documento) => {
    setSelectedDoc(doc);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setSelectedDoc(null);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meus Documentos</h1>
        <p className="text-muted-foreground mt-2">
          Repositório de contratos e prompts gerados
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos Gerados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : documentos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum documento encontrado
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nome do Cliente</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Badge
                          variant={
                            doc.tipo === "Contrato" ? "default" : "secondary"
                          }
                        >
                          {doc.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {doc.nome_cliente}
                      </TableCell>
                      <TableCell>
                        {format(new Date(doc.data_criacao), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirModal(doc)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Conteúdo
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDoc?.tipo} - {selectedDoc?.nome_cliente}
            </DialogTitle>
            <DialogDescription>
              Criado em{" "}
              {selectedDoc &&
                format(new Date(selectedDoc.data_criacao), "dd/MM/yyyy HH:mm")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
              {selectedDoc?.conteudo_gerado}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Repositorio;