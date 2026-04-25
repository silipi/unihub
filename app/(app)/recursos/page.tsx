"use client";

import { useState } from "react";
import {
  FileText,
  Video,
  Presentation,
  Download,
  Search,
  Filter,
  BookOpen,
} from "lucide-react";
import { resources, subjects, type Resource } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeIcons: Record<Resource["type"], React.ReactNode> = {
  prova: <FileText className="w-4 h-4" />,
  resumo: <BookOpen className="w-4 h-4" />,
  videoaula: <Video className="w-4 h-4" />,
  material: <FileText className="w-4 h-4" />,
  slide: <Presentation className="w-4 h-4" />,
};

const typeColors: Record<Resource["type"], string> = {
  prova: "bg-danger/10 text-danger",
  resumo: "bg-success/10 text-success",
  videoaula: "bg-primary/10 text-primary",
  material: "bg-warning/10 text-warning",
  slide: "bg-muted/10 text-muted",
};

const typeLabels: Record<Resource["type"], string> = {
  prova: "Prova",
  resumo: "Resumo",
  videoaula: "Videoaula",
  material: "Material",
  slide: "Slides",
};

const filters = ["Todos", "Prova", "Resumo", "Videoaula", "Material", "Slides"];

export default function RecursosPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [subjectFilter, setSubjectFilter] = useState("Todas");

  const filtered = resources.filter((r) => {
    const matchesSearch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      typeFilter === "Todos" || typeLabels[r.type] === typeFilter;

    const matchesSubject =
      subjectFilter === "Todas" || r.subjectCode === subjectFilter;

    return matchesSearch && matchesType && matchesSubject;
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted uppercase tracking-wide font-medium">Total</p>
          <p className="text-2xl font-bold text-foreground mt-1">{resources.length}</p>
          <p className="text-xs text-muted">recursos disponíveis</p>
        </div>
        {(["prova", "resumo", "videoaula"] as Resource["type"][]).map((type) => {
          const count = resources.filter((r) => r.type === type).length;
          return (
            <div key={type} className="bg-surface rounded-xl border border-border p-4">
              <p className="text-xs text-muted uppercase tracking-wide font-medium">{typeLabels[type]}s</p>
              <p className="text-2xl font-bold text-foreground mt-1">{count}</p>
              <p className="text-xs text-muted">disponíveis</p>
            </div>
          );
        })}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="search"
            placeholder="Buscar por nome, disciplina ou tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted shrink-0" />
          {/* Type filters */}
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                typeFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-muted border-border hover:border-primary/40 hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted">Disciplina:</span>
          {["Todas", ...subjects.map((s) => s.code)].map((code) => {
            const label = code === "Todas" ? "Todas" : subjects.find((s) => s.code === code)?.name.split(" ")[0] + "..." || code;
            return (
              <button
                key={code}
                onClick={() => setSubjectFilter(code)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                  subjectFilter === code
                    ? "bg-foreground text-background border-foreground"
                    : "bg-surface text-muted border-border hover:border-foreground/40 hover:text-foreground"
                )}
              >
                {code === "Todas" ? "Todas" : code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <ResourceCard key={r.id} resource={r} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 gap-2 text-muted">
            <Search className="w-8 h-8 opacity-30" />
            <p className="text-sm">Nenhum resultado encontrado para &quot;{search}&quot;</p>
            <p className="text-xs">Tente outros termos ou remova os filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceCard({ resource: r }: { resource: Resource }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      {/* Type badge + downloads */}
      <div className="flex items-center justify-between">
        <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full", typeColors[r.type])}>
          {typeIcons[r.type]}
          {typeLabels[r.type]}
        </span>
        <span className="text-xs text-muted flex items-center gap-1">
          <Download className="w-3 h-3" />
          {r.downloads.toLocaleString("pt-BR")}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground leading-snug text-pretty">{r.title}</h3>

      {/* Subject */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted">
          <span className="font-medium text-foreground">{r.subjectCode}</span> — {r.subject}
        </p>
        <p className="text-xs text-muted">{r.professor}</p>
      </div>

      {/* Year/semester */}
      {(r.year || r.semester) && (
        <p className="text-xs text-muted">
          {r.year && `${r.year}`}
          {r.year && r.semester && " · "}
          {r.semester && `Semestre ${r.semester}`}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {r.tags.map((tag) => (
          <span key={tag} className="text-xs bg-surface-muted text-muted px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted">
          {r.size} · {r.uploadedBy}
        </span>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
          <Download className="w-3.5 h-3.5" />
          Baixar
        </button>
      </div>
    </div>
  );
}
