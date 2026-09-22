import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Minha Área
        </h1>
        <p className="text-muted-foreground">
          Configurações da conta
        </p>
      </div>

      <Card className="bg-gradient-card border border-border/50 shadow-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Configurações de Conta</h2>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm text-muted-foreground">Nome de Usuário</Label>
                <p className="text-lg font-medium mt-1">Victor</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="text-lg font-medium mt-1">victor@exemplo.com</p>
              </div>
            </div>
            
            <div className="border-t border-border/50 pt-6">
              <Label className="text-sm text-muted-foreground">Limite de Buscas</Label>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  50 buscas restantes
                </Badge>
                <span className="text-sm text-muted-foreground">de 100 mensais</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
