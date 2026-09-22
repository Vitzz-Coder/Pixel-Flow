import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  empresa_alvo: string;
  servico_principal: string;
  dor_cliente: string;
  solucao_unica: string;
  tom_mensagem: string;
}

const GerarContrato = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    empresa_alvo: "",
    servico_principal: "",
    dor_cliente: "",
    solucao_unica: "",
    tom_mensagem: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateMessage = async () => {
    // Validação simples
    if (!formData.empresa_alvo || !formData.servico_principal || !formData.dor_cliente || !formData.solucao_unica || !formData.tom_mensagem) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do formulário.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Aqui você pode adicionar a lógica para chamar uma edge function
      toast({
        title: "Mensagem gerada!",
        description: "A mensagem de prospecção foi criada com sucesso.",
      });
    } catch (error) {
      console.error("Erro:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar mensagem",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8" />
          Gerador de Copy IA
        </h1>
        <p className="text-muted-foreground mt-2">
          Crie mensagens de prospecção personalizadas e persuasivas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Prospecção</CardTitle>
          <CardDescription>
            Preencha os dados para gerar uma mensagem personalizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="empresa_alvo">Nome da Empresa Alvo</Label>
              <Input
                id="empresa_alvo"
                value={formData.empresa_alvo}
                onChange={(e) => updateFormData("empresa_alvo", e.target.value)}
                placeholder="Ex: Barbearia X"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servico_principal">Seu Serviço Principal</Label>
              <Input
                id="servico_principal"
                value={formData.servico_principal}
                onChange={(e) => updateFormData("servico_principal", e.target.value)}
                placeholder="Ex: Criação de Site Otimizado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dor_cliente">Principal Dor do Cliente</Label>
              <Input
                id="dor_cliente"
                value={formData.dor_cliente}
                onChange={(e) => updateFormData("dor_cliente", e.target.value)}
                placeholder="Ex: Não ter clientes online"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solucao_unica">Sua Solução Única</Label>
              <Input
                id="solucao_unica"
                value={formData.solucao_unica}
                onChange={(e) => updateFormData("solucao_unica", e.target.value)}
                placeholder="Ex: Sistema de Agendamento Automático"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tom_mensagem">Tom da Mensagem</Label>
              <Select
                value={formData.tom_mensagem}
                onValueChange={(value) => updateFormData("tom_mensagem", value)}
              >
                <SelectTrigger id="tom_mensagem">
                  <SelectValue placeholder="Selecione o tom da mensagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="direto">Direto/Ousado</SelectItem>
                  <SelectItem value="amigavel">Amigável</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateMessage} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Gerando..." : "Gerar Mensagem de Prospecção"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GerarContrato;