import { Search, Sparkles, Code, FileText } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Prospector de Leads",
    description: "Encontre empresas e salve a lista para uso.",
    icon: Search,
    route: "/prospector-leads",
  },
  {
    title: "Gerador de Copy IA",
    description: "Crie mensagens de prospecção e textos para uso imediato em projetos.",
    icon: Sparkles,
    route: "/gerador-copy",
  },
  {
    title: "Construtor de Sites IA",
    description: "Inicie o fluxo de 10 passos para gerar o código-fonte de um novo site.",
    icon: Code,
    route: "/construtor-sites",
  },
  {
    title: "Gerador de Contratos",
    description: "Crie e salve rascunhos de contratos para formalização de negócios.",
    icon: FileText,
    route: "/gerar-contrato",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Gerencie e crie seus ativos digitais em um só lugar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            {...feature}
            onClick={() => navigate(feature.route)}
          />
        ))}
      </div>

      <div className="bg-gradient-card border border-border/50 rounded-lg p-6 shadow-card">
        <h2 className="text-xl font-semibold mb-4">Estatísticas Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4 border border-border/30">
            <p className="text-sm text-muted-foreground">Projetos Ativos</p>
            <p className="text-3xl font-bold text-primary mt-1">0</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 border border-border/30">
            <p className="text-sm text-muted-foreground">Leads Salvos</p>
            <p className="text-3xl font-bold text-primary mt-1">0</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 border border-border/30">
            <p className="text-sm text-muted-foreground">Documentos Gerados</p>
            <p className="text-3xl font-bold text-primary mt-1">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
