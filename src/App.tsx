import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Projetos from "./pages/Projetos";
import Ativos from "./pages/Ativos";
import Configuracoes from "./pages/Configuracoes";
import GerarContrato from "./pages/GerarContrato";
import ProspectorLeads from "./pages/ProspectorLeads";
import ConstrutorSites from "./pages/ConstrutorSites";
import Repositorio from "./pages/Repositorio";
import NotFound from "./pages/NotFound";
import { Menu } from "lucide-react";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1">
        <header className="sticky top-0 z-10 h-16 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center px-6">
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/projetos" element={<Layout><Projetos /></Layout>} />
          <Route path="/ativos" element={<Layout><Ativos /></Layout>} />
          <Route path="/gerar-contrato" element={<Layout><GerarContrato /></Layout>} />
          <Route path="/prospector-leads" element={<Layout><ProspectorLeads /></Layout>} />
          <Route path="/construtor-sites" element={<Layout><ConstrutorSites /></Layout>} />
          <Route path="/repositorio" element={<Layout><Repositorio /></Layout>} />
          <Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
