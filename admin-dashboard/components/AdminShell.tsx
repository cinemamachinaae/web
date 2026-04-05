"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Image as ImageIcon, 
  Layers, 
  Home, 
  Wrench, 
  User, 
  HelpCircle, 
  Mail, 
  Columns, 
  ClipboardList, 
  CheckCircle2, 
  BarChart3,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Bell
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { group: "General", items: [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ]},
  { group: "Configuration", items: [
    { name: "Site Settings", href: "/settings", icon: Settings },
    { name: "Brand Assets", href: "/brand-assets", icon: ImageIcon },
    { name: "Media Assets", href: "/media-assets", icon: ImageIcon },
    { name: "Ecosystems", href: "/ecosystems", icon: Layers },
  ]},
  { group: "Content", items: [
    { name: "Homepage", href: "/content-home", icon: Home },
    { name: "Services", href: "/content-services", icon: Wrench },
    { name: "About", href: "/content-about", icon: User },
    { name: "Why Setup", href: "/content-why", icon: HelpCircle },
    { name: "Contact", href: "/content-contact", icon: Mail },
    { name: "Comparison", href: "/comparison", icon: Columns },
  ]},
  { group: "Production", items: [
    { name: "Change Log", href: "/changelog", icon: ClipboardList },
    { name: "Verification", href: "/verification", icon: CheckCircle2 },
  ]},
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-bottom border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-bronze flex items-center justify-center text-background font-bold text-xl">
              C
            </div>
            {isSidebarOpen && (
              <span className="text-lg font-bold tracking-tight text-white uppercase">
                Cinema Machina
              </span>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-foreground/60 hover:text-bronze"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-8">
          {navItems.map((group) => (
            <div key={group.group}>
              {isSidebarOpen && (
                <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-3">
                  {group.group}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "sidebar-link",
                        isActive ? "sidebar-link-active" : "sidebar-link-inactive",
                        !isSidebarOpen && "justify-center px-0"
                      )}
                    >
                      <item.icon size={18} className={cn(isActive ? "text-bronze" : "text-inherit")} />
                      {isSidebarOpen && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="sidebar-link sidebar-link-inactive w-full">
            <LogOut size={18} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-foreground/60 hover:text-bronze hidden lg:block"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              Admin Dashboard <ChevronRight size={14} className="text-foreground/30" /> 
              <span className="text-bronze">
                {navItems.flatMap(g => g.items).find(i => i.href === pathname)?.name || "Overview"}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-foreground/60 hover:text-bronze relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-bronze rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <div className="text-right">
                <p className="text-xs font-bold text-white">Administrator</p>
                <p className="text-[10px] text-foreground/50">Production Environment</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-border border border-bronze/20 overflow-hidden">
                <img 
                  src="https://ui-avatars.com/api/?name=Admin&background=121212&color=E2C19B" 
                  alt="Admin" 
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
