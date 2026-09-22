import { useEffect, useState } from "react";
import {
  Search,
  Sparkles,
  Code,
  FileText,
  Users,
  FileCheck,
  ArrowRight,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const navigate = useNavigate();
  const [recentActivities, setRecentActivities] = useState<{ id: string, title: string, type: string, date: string }[]>([]);

  useEffect(() => {
    async function fetchRecent() {
      // Fetch recent leads from supabase
      const { data, error } = await supabase
        .from('leads')
        .select('id, nome as title, tipo as type, data_criacao as date')
        .order('data_criacao', { ascending: false })
        .limit(5);

      if (data && !error) {
        setRecentActivities(data.map(item => ({
          ...item,
          title: item.title || "Lead sem nome",
          type: item.type || "Lead",
          date: new Date(item.date).toLocaleDateString('pt-BR')
        })));
      }
    }
    fetchRecent();
  }, []);

  const workflowSteps = [
    {
      step: 1,
      title: "Prospectar",
      description: "Encontre novos clientes potenciais",
      icon: Search,
      route: "/prospector-leads",
      color: "text-blue-500"
    },
    {
      step: 2,
      title: "Gerar Copy",
      description: "Crie mensagens persuasivas",
      icon: Sparkles,
      route: "/gerador-copy",
      color: "text-purple-500"
    },
    {
      step: 3,
      title: "Gerar Contrato",
      description: "Formalize o acordo comercial",
      icon: FileText,
      route: "/gerar-contrato",
      color: "text-green-500"
    },
    {
      step: 4,
      title: "Criar Briefing",
      description: "Defina o escopo do projeto",
      icon: Code,
      route: "/construtor-sites",
      color: "text-orange-500"
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Bem-vindo de volta, Leandro
          </h1>
          <p className="text-muted-foreground text-lg">
            Sua central de comando para prospecção e fechamento de negócios.
          </p>
        </div>
        <Button
          size="lg"
          className="shadow-glow px-6 py-6 text-lg font-semibold"
          onClick={() => navigate("/prospector-leads")}
        >
          Iniciar Nova Prospecção
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leads Encontrados</p>
                <p className="text-3xl font-bold mt-1">128</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contratos Criados</p>
                <p className="text-3xl font-bold mt-1">42</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                <FileCheck className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Copies Geradas</p>
                <p className="text-3xl font-bold mt-1">89</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Fluxo de Trabalho do Prestador de Serviço</h2>
          <Badge variant="outline" className="text-primary border-primary/30">Sequencial</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowSteps.map((step, index) => (
            <Card
              key={step.title}
              className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all cursor-pointer bg-gradient-card shadow-card"
              onClick={() => navigate(step.route)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary opacity-50 uppercase tracking-wider">Passo {step.step}</span>
                  <step.icon className={`h-5 w-5 ${step.color}`} />
                </div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <div className="flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Acessar agora <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
              {/* Visual Connector (Desktop only) */}
              {index < workflowSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border/30 z-10" />
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/30 transition-colors border border-transparent hover:border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {activity.type === 'Lead' ? <Search className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>Nenhuma atividade recente encontrada.</p>
                <p className="text-xs">Comece prospectando novos leads!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20 p-6 shadow-card">
            <h3 className="text-lg font-bold mb-2">Dica do Dia 💡</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tente personalizar a primeira frase da sua copy com um dado real encontrado no prospector para aumentar a taxa de conversão em até 3x.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
