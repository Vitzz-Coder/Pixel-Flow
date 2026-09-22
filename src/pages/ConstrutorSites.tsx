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
  Copy,
  Save,
  Layout,
  Palette,
  Type,
  Check
} from "lucide-react";

interface BriefingResult {
  estrutura: string[];
  copy: {
    secao: string;
    texto: string;
  }[];
  estilo: {
    cores: string;
    fontes: string;
  };
}

export default function ConstrutorSites() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [briefing, setBriefing] = useState<BriefingResult | null>(null);

  const [formData, setFormData] = useState({
    nomeProjeto: "",
    nicho: "Academias",
    objetivo: "Gerar Leads no WhatsApp",
    estilo: "Moderno/Minimalista",
  });

  const handleGenerate = async () => {
    if (!formData.nomeProjeto) {
      toast.error("Por favor, informe o nome do projeto");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gerar_briefing", {
        body: {
          projeto: formData.nomeProjeto,
          nicho: formData.nicho,
          objetivo: formData.objetivo,
          estilo: formData.estilo,
        },
      });

      if (error) throw error;

      if (data?.success && data?.briefing) {
        const parsed = typeof data.briefing === 'string'
          ? JSON.parse(data.briefing)
          : data.briefing;
        setBriefing(parsed);
        toast.success("Briefing gerado com sucesso!");
      } else {
        toast.error("Erro ao gerar briefing.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro na integração com a IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyFullBriefing = async () => {
    if (!briefing) return;
    const text = `PROJETO: ${formData.nomeProjeto}\n\nESTRUTURA:\n${briefing.estrutura.join(", ")}\n\nCOPY:\n${briefing.copy.map(c => `${c.secao}: ${c.texto}`).join("\n\n")}\n\nESTILO:\nCores: ${briefing.estilo.cores}\nFontes: ${briefing.estilo.fontes}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Briefing copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!briefing) return;
    try {
      const { error } = await supabase.from('projetos').insert([
        {
          nome: formData.nomeProjeto,
          nicho: formData.nicho,
          briefing: JSON.stringify(briefing),
          data_criacao: new Date().toISOString(),
        }
      ]);
      if (error) throw error;
      toast.success("Projeto salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar projeto.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Left Column: Configuration */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Layout className="h-5 w-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Briefing de Site</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Nome da Empresa/Projeto</Label>
              <Input
                placeholder="Ex: Studio Fit"
                className="bg-slate-950/50 border-white/10 focus:border-violet-500/50 transition-all"
                value={formData.nomeProjeto}
                onChange={(e) => setFormData({ ...formData, nomeProjeto: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Nicho de Atuação</Label>
              <Select
                value={formData.nicho}
                onValueChange={(v) => setFormData({ ...formData, nicho: v })}
              >
                <SelectTrigger className="bg-slate-950/50 border-white/10">
                  <SelectValue placeholder="Selecione o nicho" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  <SelectItem value="Academias">Academias</SelectItem>
                  <SelectItem value="Restaurantes">Restaurantes</SelectItem>
                  <SelectItem value="Clínicas">Clínicas</SelectItem>
                  <SelectItem value="Advogados">Advogados</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Objetivo do Site</Label>
              <Select
                value={formData.objetivo}
                onValueChange={(v) => setFormData({ ...formData, objetivo: v })}
              >
                <SelectTrigger className="bg-slate-950/50 border-white/10">
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  <SelectItem value="Gerar Leads no WhatsApp">Gerar Leads no WhatsApp</SelectItem>
                  <SelectItem value="Vender Serviço">Vender Serviço</SelectItem>
                  <SelectItem value="Autoridade/Institucional">Autoridade/Institucional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Estilo Visual</Label>
              <div className="flex flex-wrap gap-2">
                {["Moderno/Minimalista", "Corporativo", "Dark Neon"].map((style) => (
                  <button
                    key={style}
                    onClick={() => setFormData({ ...formData, estilo: style })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      formData.estilo === style
                        ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/20"
                        : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    {style}
                  </button>
                ))}
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
                Gerando Briefing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Briefing com IA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Area */}
      <div className="lg:col-span-8 space-y-6">
        {!briefing ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/30 border border-dashed border-white/10 rounded-3xl">
            <div className="p-6 rounded-full bg-slate-800/50 text-slate-600 mb-4">
              <Layout className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">Nenhum briefing gerador</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Configure as informações do projeto no painel lateral para gerar a estrutura completa do seu site.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Briefing Estratégico</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 hover:bg-violet-600 hover:text-white transition-all flex items-center gap-2"
                  onClick={copyFullBriefing}
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copiado!" : "Copiar Tudo"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 hover:bg-violet-600 hover:text-white transition-all flex items-center gap-2"
                  onClick={handleSave}
                >
                  <Save className="h-3 w-3" />
                  Salvar Projeto
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Estrutura */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layout className="h-5 w-5 text-violet-400" />
                  <h3 className="text-lg font-bold text-white">Estrutura de Seções</h3>
                </div>
                <div className="space-y-2">
                  {briefing.estrutura.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 text-slate-300 text-sm">
                      <span className="h-5 w-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Guia de Estilo */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-5 w-5 text-violet-400" />
                  <h3 className="text-lg font-bold text-white">Guia de Estilo</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-2">Cores Sugeridas</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{briefing.estilo.cores}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-2">Tipografia</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{briefing.estilo.fontes}</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Copys (Full Width) */}
              <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="h-5 w-5 text-violet-400" />
                  <h3 className="text-lg font-bold text-white">Sugestões de Texto e Copy</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {briefing.copy.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950/50 border border-white/5 space-y-2">
                      <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">{item.secao}</p>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
