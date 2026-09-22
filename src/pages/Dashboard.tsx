import { useEffect, useState } from "react";
import {
  Search,
  Sparkles,
  Code,
  FileText,
  Users,
  FileCheck,
  ArrowRight,
  Clock,
  Zap
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
      gradient: "from-violet-500 to-indigo-500",
      color: "text-violet-400"
    },
    {
      step: 2,
      title: "Gerar Copy",
      description: "Crie mensagens persuasivas",
      icon: Sparkles,
      route: "/gerador-copy",
      gradient: "from-cyan-500 to-blue-500",
      color: "text-cyan-400"
    },
    {
      step: 3,
      title: "Gerar Contrato",
      description: "Formalize o acordo comercial",
      icon: FileText,
      route: "/gerar-contrato",
      gradient: "from-emerald-500 to-teal-500",
      color: "text-emerald-400"
    },
    {
      step: 4,
      title: "Criar Briefing",
      description: "Defina o escopo do projeto",
      icon: Code,
      route: "/construtor-sites",
      gradient: "from-amber-500 to-orange-500",
      color: "text-amber-400"
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 overflow-hidden relative">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 relative group">
            <Zap className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-lg group-hover:blur-xl transition-all" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-4xl font-extrabold mb-1 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight truncate">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-400 text-lg font-medium truncate">
              Sua central de comando para prospecção e fechamento de negócios.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 px-8 py-6 text-lg font-semibold transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
          onClick={() => navigate("/prospector-leads")}
        >
          Iniciar Nova Prospecção
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[
          { label: "Leads Encontrados", value: "128", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Contratos Criados", value: "42", icon: FileCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Copies Geradas", value: "89", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((metric, i) => (
          <Card key={i} className="bg-slate-900/60 backdrop-blur-md border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group w-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors truncate">{metric.label}</p>
                  <p className="text-3xl font-bold mt-1 text-white truncate">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${metric.bg} ${metric.color} shrink-0`}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Section */}
      <div className="space-y-6 w-full">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white tracking-tight truncate">Fluxo de Trabalho do Prestador de Serviço</h2>
          <Badge variant="outline" className="text-violet-400 border-violet-500/30 bg-violet-500/10 px-2 py-0 shrink-0">Sequencial</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {workflowSteps.map((step, javaIndex) => (
            <Card
              key={step.title}
              className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-md border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer w-full"
              onClick={() => navigate(step.route)}
            >
              {/* Neon Top Accent */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.gradient}`} />

              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Passo {step.step}</span>
                  <step.icon className={`h-5 w-5 ${step.color} shrink-0`} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors truncate">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{step.description}</p>
                <div className="flex items-center text-xs font-semibold text-violet-400 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  Acessar agora <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <Card className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border-white/10 hover:border-violet-500/50 transition-all duration-300 w-full">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2 truncate">
              <Clock className="h-5 w-5 text-violet-400 shrink-0" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 shrink-0">
                        {activity.type === 'Lead' ? <Search className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{activity.title}</p>
                        <p className="text-xs text-slate-500 truncate">{activity.date}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] bg-white/5 text-slate-400 border-white/10 shrink-0 ml-2">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Search className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
                <p className="text-sm font-medium">Nenhuma atividade recente encontrada.</p>
                <p className="text-xs">Comece prospectando novos leads!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 w-full">
          <Card className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border-violet-500/30 p-6 shadow-card backdrop-blur-md w-full">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-violet-400 shrink-0" />
              <h3 className="text-lg font-bold text-white truncate">Dica do Dia 💡</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tente personalizar a primeira frase da sua copy com um dado real encontrado no prospector para aumentar a taxa de conversão em até 3x.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
