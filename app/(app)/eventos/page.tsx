"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Check,
  Star,
  Filter,
} from "lucide-react";
import { type Event } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";

const typeLabels: Record<Event["type"], string> = {
  "semana-academica": "Semana Acadêmica",
  workshop: "Workshop",
  palestra: "Palestra",
  monitoria: "Monitoria",
  congresso: "Congresso",
};

const typeColors: Record<Event["type"], string> = {
  "semana-academica": "bg-primary/10 text-primary",
  workshop: "bg-success/10 text-success",
  palestra: "bg-warning/10 text-warning",
  monitoria: "bg-danger/10 text-danger",
  congresso: "bg-muted/10 text-muted border border-border",
};

const filters = ["Todos", "Recomendados", "Inscritos", "Workshop", "Palestra", "Monitoria", "Congresso"];

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [active, setActive] = useState("Todos");

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) return;
        const data = (await response.json()) as Event[];
        setEvents(data);
      } catch {
        setEvents([]);
      }
    }

    loadEvents();
  }, []);

  const filtered = events.filter((ev) => {
    if (active === "Todos") return true;
    if (active === "Recomendados") return ev.isRecommended;
    if (active === "Inscritos") return ev.isRegistered;
    return ev.type === active.toLowerCase() || typeLabels[ev.type] === active;
  });

  const registered = events.filter((e) => e.isRegistered);
  const recommended = events.filter((e) => e.isRecommended && !e.isRegistered);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted uppercase tracking-wide font-medium">Total de Eventos</p>
          <p className="text-2xl font-bold text-foreground mt-1">{events.length}</p>
          <p className="text-xs text-muted">disponíveis agora</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-muted uppercase tracking-wide font-medium">Inscrições</p>
          <p className="text-2xl font-bold text-success mt-1">{registered.length}</p>
          <p className="text-xs text-muted">confirmadas</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-primary uppercase tracking-wide font-semibold">Recomendados</p>
          <p className="text-2xl font-bold text-primary mt-1">{recommended.length}</p>
          <p className="text-xs text-muted">baseado no seu perfil</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted shrink-0" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
              active === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface text-muted border-border hover:border-primary/40 hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 flex items-center justify-center py-16 text-muted">
            <p className="text-sm">Nenhum evento encontrado para este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event: ev }: { event: Event }) {
  return (
    <div
      className={cn(
        "bg-surface rounded-xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-sm",
        ev.isRegistered ? "border-success/30" : "border-border"
      )}
    >
      {/* Type + badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", typeColors[ev.type])}>
          {typeLabels[ev.type]}
        </span>
        {ev.isRecommended && (
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Star className="w-3 h-3" /> Recomendado
          </span>
        )}
        {ev.isRegistered && (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <Check className="w-3 h-3" /> Inscrito
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground leading-snug text-pretty">{ev.title}</h3>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{formatDate(ev.date)}</span>
          <Clock className="w-3.5 h-3.5 shrink-0 ml-1" />
          <span>{ev.time}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{ev.location}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted leading-relaxed line-clamp-2">{ev.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {ev.tags.map((tag) => (
          <span key={tag} className="text-xs bg-surface-muted text-muted px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Action */}
      <div className="pt-1 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted">{ev.organizer}</span>
        <button
          className={cn(
            "text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
            ev.isRegistered
              ? "bg-success/10 text-success cursor-default"
              : "bg-primary text-primary-foreground hover:bg-primary-hover"
          )}
        >
          {ev.isRegistered ? "Inscrito" : "Inscrever-se"}
        </button>
      </div>
    </div>
  );
}
