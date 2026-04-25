"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import type { Student } from "@/lib/mock-data";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Visão geral do seu semestre" },
  "/desempenho": { title: "Desempenho", subtitle: "Notas e frequência do semestre atual" },
  "/eventos": { title: "Eventos", subtitle: "Eventos acadêmicos e atividades" },
  "/recursos": { title: "Recursos", subtitle: "Materiais, provas e videoaulas" },
  "/assistente": { title: "Assistente", subtitle: "Tire dúvidas com a IA da UNIOESTE" },
};

export function Topbar() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "UniHub", subtitle: "" };
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        const response = await fetch("/api/student");
        if (!response.ok) return;
        const data = (await response.json()) as Student | null;
        setStudent(data);
      } catch {
        setStudent(null);
      }
    }

    loadStudent();
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-foreground leading-tight">{page.title}</h1>
        <p className="text-sm text-muted">{page.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Notificações"
          className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-muted transition-colors text-muted"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2.5 md:hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {student?.initials ?? "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
