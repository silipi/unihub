"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  CalendarDays,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { student } from "@/lib/mock-data";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/desempenho", label: "Desempenho", icon: TrendingUp },
  { href: "/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/recursos", label: "Recursos", icon: BookOpen },
  { href: "/assistente", label: "Assistente", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-surface border-r border-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm leading-tight">UniHub</p>
          <p className="text-xs text-muted">UNIOESTE Cascavel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1" aria-label="Menu principal">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border px-3 py-4 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-surface-muted hover:text-foreground transition-colors w-full text-left">
          <Settings className="w-4 h-4 shrink-0" />
          Configurações
        </button>
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
            {student.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
            <p className="text-xs text-muted truncate">{student.matricula}</p>
          </div>
          <button
            aria-label="Sair"
            className="text-muted hover:text-danger transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
