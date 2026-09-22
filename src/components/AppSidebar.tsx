import { LayoutDashboard, FileStack, FileText, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuSections = [
  {
    label: "Visão Geral",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Vendas & Leads",
    items: [
      { title: "Prospector de Leads", url: "/prospector-leads", icon: Search },
      { title: "Gerador de Copies", url: "/gerador-copy", icon: FileText },
    ],
  },
  {
    label: "Documentos",
    items: [
      { title: "Gerador de Contratos", url: "/gerar-contrato", icon: FileText },
    ],
  },
  {
    label: "Criação",
    items: [
      { title: "Briefing de Sites", url: "/construtor-sites", icon: FileStack },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-white/5 bg-[#070A10] h-screen sticky top-0 overflow-hidden">
      <SidebarContent className="flex flex-col justify-between h-full overflow-hidden">
        <div className="space-y-4">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              PIXEL FLOW LAB
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Digital Asset Creation</p>
          </div>

          {menuSections.map((section) => (
            <SidebarGroup key={section.label} className="space-y-1">
              <SidebarGroupLabel className="text-slate-500 text-xs uppercase tracking-widest font-semibold px-4 mb-1">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === "/"}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-violet-600/20 text-violet-400 border-l-2 border-violet-500"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5" />
                          {open && <span className="text-sm font-medium">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>

        <div className="p-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/10 shadow-lg shadow-violet-500/10">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-xs">
                PF
              </AvatarFallback>
            </Avatar>
            {open && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-200 truncate">Pixel Flow User</p>
                <p className="text-[10px] text-slate-500 truncate">user@pixelflow.lab</p>
                <Badge variant="outline" className="mt-1 h-4 px-1 text-[8px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  Plano Pro / Ativo
                </Badge>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
