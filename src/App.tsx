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
import GeradorCopy from "./pages/GeradorCopy";
import Repositorio from "./pages/Repositorio";
import NotFound from "./pages/NotFound";
import { Menu } from "lucide-react";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0F17]">
      {/* Ambient Glows - Adjusted to be relative to the main container */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />

      <AppSidebar />
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 md:p-6 relative z-10">
        <header className="sticky top-0 z-10 h-16 border-b border-white/5 bg-[#0B0F17]/80 backdrop-blur-md flex items-center px-0 mb-8">
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </header>
        <div className="w-full">
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
          <Route path="/gerador-copy" element={<Layout><GeradorCopy /></Layout>} />
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
