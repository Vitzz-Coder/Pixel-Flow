import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  Copy,
  MessageCircle,
  Save,
  RefreshCw,
  Check,
  Send
} from "lucide-react";

export default function GeradorCopy() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    empresa: searchParams.get("empresa") || "",
    setor: "Academias",
    problema: "Sem site",
    tom: "Consultivo",
  });

  // Result State
  const [results, setResults] = useState<{
    whatsapp: string;
    email: string;
    instagram: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!formData.empresa) {
      toast.error("Por favor, informe o nome da empresa");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gerar_copy", {
        body: {
          empresa: formData.empresa,
          setor: formData.setor,
          problema: formData.problema,
          tom: formData.tom,
        },
      });

      if (error) throw error;

      if (data?.success && data?.copy) {
        // Handle both JSON response and plain string response from the AI function
        const parsedCopy = typeof data.copy === 'string'
          ? JSON.parse(data.copy)
          : data.copy;

        setResults(parsedCopy);
        toast.success("Copies geradas com sucesso!");
      } else {
        toast.error("Erro ao gerar copies. Tente novamente.");
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("Erro na integração com a IA. Verifique a configuração.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, channel: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(channel);
    toast.success(`Copy de ${channel} copiada!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = async () => {
    if (!results) return;
    try {
      const { error } = await supabase.from('copies_geradas').insert([
        {
          empresa: formData.empresa,
          setor: formData.setor,
          problema: formData.problema,
          tom: formData.tom,
          whatsapp: results.whatsapp,
          email: results.email,
          instagram: results.instagram,
        }
      ]);
      if (error) throw error;
      toast.success("Copy salva no repositório!");
    } catch (error) {
      toast.error("Erro ao salvar copy.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Configuration Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white">Configurações da Copy</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Nome da Empresa / Lead</Label>
              <Input
                placeholder="Ex: Academia Fit Life"
                className="bg-slate-950/50 border-white/10 focus:border-violet-500/50 transition-all"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Nicho / Setor</Label>
              <Select
                value={formData.setor}
                onValueChange={(v) => setFormData({ ...formData, setor: v })}
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
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Problema Identificado</Label>
              <Select
                value={formData.problema}
                onValueChange={(v) => setFormData({ ...formData, problema: v })}
              >
                <SelectTrigger className="bg-slate-950/50 border-white/10">
                  <SelectValue placeholder="Selecione o problema" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  <SelectItem value="Sem site">Sem Site</SelectItem>
                  <SelectItem value="Site antigo/lento">Site Antigo ou Lento</SelectItem>
                  <SelectItem value="Falta de posicionamento no Google">Falta de posicionamento no Google</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Tom de Voz</Label>
              <div className="flex flex-wrap gap-2">
                {["Consultivo", "Direto/Curto", "Persuasivo"].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setFormData({ ...formData, tom: tone })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      formData.tom === tone
                        ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/20"
                        : "bg-slate-800/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                    }`}
                  >
                    {tone}
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
                Gerando Copies...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Copies com IA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Area */}
      <div className="lg:col-span-8 space-y-6">
        {!results ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/30 border border-dashed border-white/10 rounded-3xl">
            <div className="p-6 rounded-full bg-slate-800/50 text-slate-600 mb-4">
              <Sparkles className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">Pronto para criar sua abordagem?</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Configure os detalhes do lead no painel lateral e clique em gerar para criar copies persuasivas para múltiplos canais.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="whatsapp" className="w-full">
              <TabsList className="bg-slate-900/80 border border-white/10 p-1 gap-1">
                <TabsTrigger value="whatsapp" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400">
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="email" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400">
                  E-mail Frio
                </TabsTrigger>
                <TabsTrigger value="instagram" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-slate-400">
                  Instagram DM
                </TabsTrigger>
              </TabsList>

              <TabsContent value="whatsapp">
                <ResultCard
                  title="Abordagem WhatsApp"
                  content={results.whatsapp}
                  channel="whatsapp"
                  onCopy={copyToClipboard}
                  copied={copied}
                  onSave={handleSave}
                  onRegenerate={handleGenerate}
                />
              </TabsContent>
              <TabsContent value="email">
                <ResultCard
                  title="E-mail Profissional"
                  content={results.email}
                  channel="email"
                  onCopy={copyToClipboard}
                  copied={copied}
                  onSave={handleSave}
                  onRegenerate={handleGenerate}
                />
              </TabsContent>
              <TabsContent value="instagram">
                <ResultCard
                  title="Instagram DM"
                  content={results.instagram}
                  channel="instagram"
                  onCopy={copyToClipboard}
                  copied={copied}
                  onSave={handleSave}
                  onRegenerate={handleGenerate}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  title,
  content,
  channel,
  onCopy,
  copied,
  onSave,
  onRegenerate
}: {
  title: string;
  content: string;
  channel: string;
  onCopy: (t: string, c: string) => void;
  copied: string | null;
  onSave: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-white/5 border-white/10 hover:bg-violet-600 hover:text-white transition-all"
            onClick={() => onRegenerate()}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Nova Variação
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-white/5 border-white/10 hover:bg-violet-600 hover:text-white transition-all"
            onClick={onSave}
          >
            <Save className="mr-1 h-3 w-3" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed font-serif italic">
        {content}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button
          variant="outline"
          className="text-xs h-9 bg-white/5 border-white/10 hover:bg-violet-600 hover:text-white transition-all flex items-center gap-2"
          onClick={() => onCopy(content, channel)}
        >
          {copied === channel ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copiar Mensagem
            </>
          )}
        </Button>

        {channel === 'whatsapp' && (
          <Button
            className="text-xs h-9 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(content)}`, '_blank')}
          >
            <Send className="h-3 w-3" />
            Enviar via WhatsApp
          </Button>
        )}
      </div>
    </div>
  );
}
