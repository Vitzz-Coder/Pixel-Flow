import { LayoutDashboard, Settings, FolderKanban, FileStack, FileText, FolderOpen, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const areaDeTrabalho = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Minha Área", url: "/configuracoes", icon: Settings },
  { title: "Gerar Contrato", url: "/gerar-contrato", icon: FileText },
  { title: "Prospector Leads", url: "/prospector-leads", icon: Search },
  { title: "Construtor Sites", url: "/construtor-sites", icon: FileStack },
];

const gavetaDeProjetos = [
  { title: "Meus Projetos", url: "/projetos", icon: FolderKanban },
  { title: "Meus Documentos", url: "/repositorio", icon: FolderOpen },
  { title: "Ativos Gerados", url: "/ativos", icon: FileStack },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            PIXEL FLOW LAB
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Digital Asset Creation</p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            🛠️ Área de Trabalho
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {areaDeTrabalho.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-glow"
                            : "hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4 bg-primary/20" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            🗃️ Gaveta de Projetos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gavetaDeProjetos.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-glow"
                            : "hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
