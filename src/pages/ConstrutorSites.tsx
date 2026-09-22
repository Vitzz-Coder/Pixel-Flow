import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TOTAL_STEPS = 10;

export default function ConstrutorSites() {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nomeProjeto: "",
    publicoAlvo: "",
    objetivo: "",
    estiloVisual: "",
    tomVoz: "",
    corPrimaria: "",
    corSecundaria: "",
    fonte: "",
    paginas: "",
    ctaPrincipal: "",
    funcionalidadeBackend: "",
    moduloDados: "nao",
    tabelaServicos: "",
    componentesVisuais: "",
    conteudoIA: "nao",
    linkReferencia: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const generatePrompt = async () => {
    const prompt = `Aja como um Engenheiro de Produto Sênior. Sua missão é criar um aplicativo SaaS completo e de alta conversão para o projeto ${formData.nomeProjeto}.

O público-alvo é ${formData.publicoAlvo}. O objetivo é ${formData.objetivo}. O estilo visual deve ser ${formData.estiloVisual} e ${formData.tomVoz} com as cores ${formData.corPrimaria} e ${formData.corSecundaria} e fonte ${formData.fonte}.${formData.linkReferencia ? ` O design deve se inspirar no layout de ${formData.linkReferencia}.` : ""}

A aplicação deve ser multi-página com a estrutura: ${formData.paginas}. O CTA principal é ${formData.ctaPrincipal}. A funcionalidade de backend principal é ${formData.funcionalidadeBackend} e deve ser implementada no Supabase.${formData.moduloDados === "sim" ? ` Crie as seguintes tabelas no banco de dados: ${formData.tabelaServicos}.` : ""} O dashboard deve incluir ${formData.componentesVisuais}.

Gere os textos do site de forma automática e criativa, focando em alta conversão.`;

    try {
      // Salvar documento via Edge Function
      const { error } = await supabase.functions.invoke("salvar_documento", {
        body: {
          tipo: "Prompt",
          nome_cliente: formData.nomeProjeto,
          conteudo_gerado: prompt,
        },
      });

      if (error) {
        console.error("Erro ao salvar documento:", error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar o prompt no repositório.",
          variant: "destructive",
        });
        return;
      }

      // Copiar para área de transferência
      await navigator.clipboard.writeText(prompt);
      
      toast({
        title: "Prompt Gerado!",
        description: "O prompt foi salvo e copiado para a área de transferência.",
      });
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar o prompt.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nomeProjeto">Nome do Projeto</Label>
              <Input
                id="nomeProjeto"
                placeholder="Ex: AgênciaTech Digital"
                value={formData.nomeProjeto}
                onChange={(e) => updateField("nomeProjeto", e.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="publicoAlvo">Público-alvo</Label>
              <Textarea
                id="publicoAlvo"
                placeholder="Ex: Pequenas empresas que precisam de presença digital"
                value={formData.publicoAlvo}
                onChange={(e) => updateField("publicoAlvo", e.target.value)}
                maxLength={500}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label>Objetivo Principal</Label>
            <RadioGroup value={formData.objetivo} onValueChange={(value) => updateField("objetivo", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gerar-leads" id="leads" />
                <Label htmlFor="leads" className="cursor-pointer">Gerar Leads</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vendas-online" id="vendas" />
                <Label htmlFor="vendas" className="cursor-pointer">Vendas Online</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agendamento" id="agendamento" />
                <Label htmlFor="agendamento" className="cursor-pointer">Agendamento de Serviços</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="portfolio" id="portfolio" />
                <Label htmlFor="portfolio" className="cursor-pointer">Portfólio/Vitrine</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="informativo" id="informativo" />
                <Label htmlFor="informativo" className="cursor-pointer">Site Informativo</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="estiloVisual">Estilo Visual</Label>
              <Input
                id="estiloVisual"
                placeholder="Ex: Moderno, Minimalista, Elegante, Vibrante"
                value={formData.estiloVisual}
                onChange={(e) => updateField("estiloVisual", e.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="tomVoz">Tom de Voz</Label>
              <Input
                id="tomVoz"
                placeholder="Ex: Profissional, Descontraído, Inspirador, Técnico"
                value={formData.tomVoz}
                onChange={(e) => updateField("tomVoz", e.target.value)}
                maxLength={100}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="corPrimaria">Cor Primária</Label>
              <Input
                id="corPrimaria"
                placeholder="Ex: Azul vibrante, Verde neon, Roxo escuro"
                value={formData.corPrimaria}
                onChange={(e) => updateField("corPrimaria", e.target.value)}
                maxLength={50}
              />
            </div>
            <div>
              <Label htmlFor="corSecundaria">Cor Secundária</Label>
              <Input
                id="corSecundaria"
                placeholder="Ex: Branco, Cinza claro, Preto"
                value={formData.corSecundaria}
                onChange={(e) => updateField("corSecundaria", e.target.value)}
                maxLength={50}
              />
            </div>
            <div>
              <Label htmlFor="fonte">Fonte Preferida</Label>
              <Input
                id="fonte"
                placeholder="Ex: Inter, Roboto, Playfair Display, Montserrat"
                value={formData.fonte}
                onChange={(e) => updateField("fonte", e.target.value)}
                maxLength={50}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="paginas">Páginas do Site</Label>
              <Textarea
                id="paginas"
                placeholder="Ex: Home, Sobre, Serviços, Portfolio, Contato"
                value={formData.paginas}
                onChange={(e) => updateField("paginas", e.target.value)}
                maxLength={300}
              />
            </div>
            <div>
              <Label htmlFor="ctaPrincipal">CTA Principal (Call-to-Action)</Label>
              <Input
                id="ctaPrincipal"
                placeholder="Ex: Solicitar Orçamento, Agendar Consulta, Começar Agora"
                value={formData.ctaPrincipal}
                onChange={(e) => updateField("ctaPrincipal", e.target.value)}
                maxLength={100}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <Label>Funcionalidade de Backend</Label>
            <RadioGroup value={formData.funcionalidadeBackend} onValueChange={(value) => updateField("funcionalidadeBackend", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nenhuma" id="nenhuma" />
                <Label htmlFor="nenhuma" className="cursor-pointer">Nenhuma (Site estático)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="login" id="login" />
                <Label htmlFor="login" className="cursor-pointer">Sistema de Login</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agendamento" id="agendamento-backend" />
                <Label htmlFor="agendamento-backend" className="cursor-pointer">Sistema de Agendamento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dashboard" id="dashboard" />
                <Label htmlFor="dashboard" className="cursor-pointer">Dashboard Administrativo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="formulario" id="formulario" />
                <Label htmlFor="formulario" className="cursor-pointer">Formulário de Contato com DB</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <Label>Módulo de Dados (Tabelas no Banco)</Label>
            <RadioGroup value={formData.moduloDados} onValueChange={(value) => updateField("moduloDados", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="dados-nao" />
                <Label htmlFor="dados-nao" className="cursor-pointer">Não precisa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="dados-sim" />
                <Label htmlFor="dados-sim" className="cursor-pointer">Sim, preciso de banco de dados</Label>
              </div>
            </RadioGroup>
            
            {formData.moduloDados === "sim" && (
              <div className="mt-4">
                <Label htmlFor="tabelaServicos">Descreva as tabelas necessárias</Label>
                <Textarea
                  id="tabelaServicos"
                  placeholder="Ex: Tabela de usuários, Tabela de serviços, Tabela de agendamentos"
                  value={formData.tabelaServicos}
                  onChange={(e) => updateField("tabelaServicos", e.target.value)}
                  maxLength={500}
                />
              </div>
            )}
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="componentesVisuais">Componentes Visuais de Destaque</Label>
              <Textarea
                id="componentesVisuais"
                placeholder="Ex: Carrossel de imagens, Cards com hover animado, Seção de depoimentos, Galeria de portfolio"
                value={formData.componentesVisuais}
                onChange={(e) => updateField("componentesVisuais", e.target.value)}
                maxLength={500}
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <Label>Conteúdo Gerado por IA</Label>
            <RadioGroup value={formData.conteudoIA} onValueChange={(value) => updateField("conteudoIA", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="conteudo-nao" />
                <Label htmlFor="conteudo-nao" className="cursor-pointer">Não, fornecerei o conteúdo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="conteudo-sim" />
                <Label htmlFor="conteudo-sim" className="cursor-pointer">Sim, gere textos automaticamente</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkReferencia">Link de Site de Referência (Opcional)</Label>
              <Input
                id="linkReferencia"
                type="url"
                placeholder="https://exemplo.com"
                value={formData.linkReferencia}
                onChange={(e) => updateField("linkReferencia", e.target.value)}
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Cole o link de um site que você admira para inspiração de design
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Construtor de Sites IA
        </h1>
        <p className="text-muted-foreground">
          Responda 10 perguntas para gerar o prompt perfeito de criação do seu site
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Passo {currentStep} de {TOTAL_STEPS}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
        <div className="min-h-[300px]">{renderStep()}</div>

        <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button onClick={nextStep}>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={generatePrompt} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Gerar Prompt de Criação
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-secondary/30 border-border/30">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Dica:</strong> Seja específico nas suas respostas para obter um prompt mais detalhado e preciso.
        </p>
      </Card>
    </div>
  );
}
