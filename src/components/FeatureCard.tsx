import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function FeatureCard({ title, description, icon: Icon, onClick }: FeatureCardProps) {
  return (
    <Card
      className="relative overflow-hidden bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group shadow-card hover:shadow-glow"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6 h-full flex flex-col">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground flex-grow">
          {description}
        </p>
        
        <div className="mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Acessar →
        </div>
      </div>
    </Card>
  );
}
