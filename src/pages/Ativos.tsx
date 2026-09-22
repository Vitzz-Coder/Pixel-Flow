import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Document {
  id: string;
  tipo: string;
  nome_cliente: string;
  conteudo_gerado: string;
  data_criacao: string;
}

export default function Ativos() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("documentos_gerados")
        .select("*")
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os documentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDialogOpen(true);
  };

  const contratos = documents.filter((d) => d.tipo === "Contrato");
  const prompts = documents.filter((d) => d.tipo === "Prompt");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Ativos Gerados
        </h1>
        <p className="text-muted-foreground">
          Visualize e gerencie seus documentos gerados por IA
        </p>
      </div>

      <Tabs defaultValue="contratos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="contratos" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Prompts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contratos" className="space-y-4">
          <Card className="bg-gradient-card border border-border/50 shadow-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contratos Gerados</h2>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando documentos...
                </div>
              ) : contratos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum contrato encontrado
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-foreground">Cliente</TableHead>
                      <TableHead className="text-foreground">Data de Criação</TableHead>
                      <TableHead className="text-foreground">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contratos.map((doc) => (
                      <TableRow key={doc.id} className="border-border/30">
                        <TableCell className="font-medium">{doc.nome_cliente}</TableCell>
                        <TableCell>{format(new Date(doc.data_criacao), "dd/MM/yyyy HH:mm")}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocument(doc)}
                            className="h-8 border-border/50 hover:border-primary/50 hover:text-primary"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver Conteúdo
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <Card className="bg-gradient-card border border-border/50 shadow-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Prompts Gerados</h2>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando documentos...
                </div>
              ) : prompts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum prompt encontrado
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-foreground">Projeto</TableHead>
                      <TableHead className="text-foreground">Data de Criação</TableHead>
                      <TableHead className="text-foreground">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prompts.map((doc) => (
                      <TableRow key={doc.id} className="border-border/30">
                        <TableCell className="font-medium">{doc.nome_cliente}</TableCell>
                        <TableCell>{format(new Date(doc.data_criacao), "dd/MM/yyyy HH:mm")}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocument(doc)}
                            className="h-8 border-border/50 hover:border-primary/50 hover:text-primary"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver Conteúdo
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.tipo} - {selectedDocument?.nome_cliente}
            </DialogTitle>
            <DialogDescription>
              Criado em {selectedDocument && format(new Date(selectedDocument.data_criacao), "dd/MM/yyyy 'às' HH:mm")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap text-sm">
            {selectedDocument?.conteudo_gerado}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
