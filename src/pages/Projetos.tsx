import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Project {
  id: string;
  nome_projeto: string;
  status: string;
  data_criacao: string;
}

const statusColors: Record<string, string> = {
  "Em Desenvolvimento": "bg-primary/20 text-primary border-primary/30",
  "Concluído": "bg-green-500/20 text-green-500 border-green-500/30",
  "Pausado": "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
};

export default function Projetos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projetos")
        .select("*")
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Meus Projetos
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus projetos em desenvolvimento
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      <Card className="bg-gradient-card border border-border/50 shadow-card">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando projetos...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum projeto encontrado. Crie seu primeiro projeto!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-foreground">Nome do Projeto</TableHead>
                  <TableHead className="text-foreground">Data de Criação</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-border/30">
                    <TableCell className="font-medium">{project.nome_projeto}</TableCell>
                    <TableCell>{format(new Date(project.data_criacao), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[project.status] || "bg-muted text-muted-foreground"}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
