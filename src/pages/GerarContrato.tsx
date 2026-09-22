import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  Printer,
  Copy,
  Save,
  FileText,
  Check
} from "lucide-react";

export default function GerarContrato() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contractText, setContractText] = useState("");

  const [formData, setFormData] = useState({
    tipoServico: "Desenvolvimento de Site",
    clienteNome: "",
    clienteDocumento: "",
    cidadeUF: "",
    valorTotal: "",
    entradaSinal: "",
    prazoEntrega: "",
    formaPagamento: "Pix",
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.clienteNome || !formData.valorTotal) {
      toast.error("Por favor, preencha o nome do cliente e o valor total.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gerar_contrato", {
        body: {
          servico: formData.tipoServico,
          cliente: formData.clienteNome,
          documento: formData.clienteDocumento,
          local: formData.cidadeUF,
          valor: formData.valorTotal,
          entrada: formData.entradaSinal,
          prazo: formData.prazoEntrega,
          pagamento: formData.formaPagamento,
        },
      });

      if (error) throw error;

      if (data?.success && data?.contrato) {
        setContractText(data.contrato);
        toast.success("Contrato gerado com sucesso!");
      } else {
        toast.error("Erro ao gerar o texto do contrato.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro na integração com a IA. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contractText) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('contratos_gerados').insert([
        {
          cliente: formData.clienteNome,
          servico: formData.tipoServico,
          conteudo: contractText,
          valor: formData.valorTotal,
          data_criacao: new Date().toISOString(),
        }
      ]);
      if (error) throw error;
      toast.success("Contrato salvo no histórico!");
    } catch (error) {
      toast.error("Erro ao salvar contrato.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(contractText);
    setCopied(true);
    toast.success("Contrato copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Left Column: Configuration */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Configurações do Contrato</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Tipo de Serviço</Label>
              <Select
                value={formData.tipoServico}
                onValueChange={(v) => updateForm("tipoServico", v)}
              >
                <SelectTrigger className="bg-slate-950/50 border-white/10">
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  <SelectItem value="Desenvolvimento de Site">Desenvolvimento de Site</SelectItem>
                  <SelectItem value="Design & Identidade Visual">Design & Identidade Visual</SelectItem>
                  <SelectItem value="Marketing & Tráfego">Marketing & Tráfego</SelectItem>
                  <SelectItem value="Serviço Personalizado">Serviço Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Nome do Cliente</Label>
                <Input
                  placeholder="Nome/Empresa"
                  className="bg-slate-950/50 border-white/10"
                  value={formData.clienteNome}
                  onChange={(e) => updateForm("clienteNome", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">CPF/CNPJ</Label>
                <Input
                  placeholder="00.000.000/0001-00"
                  className="bg-slate-950/50 border-white/10"
                  value={formData.clienteDocumento}
                  onChange={(e) => updateForm("clienteDocumento", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Cidade / UF</Label>
              <Input
                placeholder="Ex: Jundiaí - SP"
                className="bg-slate-950/50 border-white/10"
                value={formData.cidadeUF}
                onChange={(e) => updateForm("cidadeUF", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Valor Total (R$)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-slate-950/50 border-white/10"
                  value={formData.valorTotal}
                  onChange={(e) => updateForm("valorTotal", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Entrada (%)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  className="bg-slate-950/50 border-white/10"
                  value={formData.entradaSinal}
                  onChange={(e) => updateForm("entradaSinal", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Prazo (Dias)</Label>
                <Input
                  type="number"
                  placeholder="15"
                  className="bg-slate-950/50 border-white/10"
                  value={formData.prazoEntrega}
                  onChange={(e) => updateForm("prazoEntrega", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Pagamento</Label>
                <Select
                  value={formData.formaPagamento}
                  onValueChange={(v) => updateForm("formaPagamento", v)}
                >
                  <SelectTrigger className="bg-slate-950/50 border-white/10">
                    <SelectValue placeholder="Forma" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="Pix">Pix</SelectItem>
                    <SelectItem value="Boleto">Boleto</SelectItem>
                    <SelectItem value="Cartão">Cartão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 py-6 font-semibold transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando Contrato...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Contrato com IA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="lg:col-span-7 space-y-6">
        {!contractText ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/30 border border-dashed border-white/10 rounded-3xl">
            <div className="p-6 rounded-full bg-slate-800/50 text-slate-600 mb-4">
              <FileText className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">Nenhum documento gerador</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Preencha as condições comerciais no painel lateral para gerar um contrato profissional.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Pré-visualização do Documento</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 hover:bg-violet-600 hover:text-white transition-all"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-3 w-3 mr-1 text-emerald-400" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 hover:bg-violet-600 hover:text-white transition-all"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 hover:bg-violet-600 hover:text-white transition-all"
                  onClick={handlePrint}
                >
                  <Printer className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </div>
            </div>

            {/* Document Page Simulation */}
            <div className="bg-white text-slate-900 p-12 rounded-sm shadow-2xl min-h-[842px] w-full mx-auto print:p-0 print:shadow-none print:bg-white">
              <div className="max-w-2xl mx-auto space-y-6 font-serif">
                <div className="text-center space-y-2 mb-12">
                  <h1 className="text-2xl font-bold uppercase tracking-widest">Contrato de Prestação de Serviços</h1>
                  <div className="h-1 w-20 bg-slate-900 mx-auto" />
                </div>

                <div className="whitespace-pre-wrap leading-relaxed text-justify text-sm">
                  {contractText}
                </div>

                <div className="mt-20 grid grid-cols-2 gap-12 text-center">
                  <div className="space-y-2">
                    <div className="border-t border-slate-400 pt-2">
                      <p className="font-bold">Prestador de Serviços</p>
                      <p className="text-xs">Pixel Flow Lab</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="border-t border-slate-400 pt-2">
                      <p className="font-bold">Contratante</p>
                      <p className="text-xs">{formData.clienteNome}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
