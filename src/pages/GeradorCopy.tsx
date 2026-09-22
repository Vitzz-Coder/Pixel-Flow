import { Button } from "@/components/ui/button";

export default function GeradorCopy() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="p-6 rounded-full bg-primary/10 text-primary">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.293a1 1 0 111.414 1.414L11 6.536 // No, just a placeholder
            "
          />
        </svg>
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
        Gerador de Copies IA
      </h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Esta funcionalidade está sendo preparada para transformar suas prospecções em vendas.
        Em breve você poderá gerar copies persuasivas e personalizadas.
      </p>
      <Button onClick={() => window.history.back()} variant="outline">
        Voltar para o Dashboard
      </Button>
    </div>
  );
}
