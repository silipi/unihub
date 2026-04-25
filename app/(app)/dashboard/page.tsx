import { Star, AlertTriangle, CalendarClock, BookOpen, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/stat-card";
import { student, subjects, events, deadlines } from "@/lib/mock-data";
import { formatDate, daysUntil, cn } from "@/lib/utils";

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function DashboardPage() {
  const alertSubjects = subjects.filter((s) => s.status === "alert" || s.status === "danger");
  const upcomingEvents = events.filter((e) => !e.isRegistered).slice(0, 3);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-foreground text-balance">
            Olá, {student.name.split(" ")[0]}! 👋
          </h2>
          <p className="text-muted mt-1 text-sm">
            {student.course} · {student.semester}º semestre · {student.campus}
          </p>
        </div>
        <span className="text-xs text-muted bg-surface border border-border rounded-full px-3 py-1.5 font-medium">
          2025/1 · Semestre em andamento
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Coef. de Rendimento"
          value={student.cr.toFixed(1)}
          sub="Histórico acumulado"
          icon={Star}
          variant="success"
        />
        <StatCard
          label="IRA"
          value={`${student.ira}%`}
          sub="Índice de Rendimento"
          icon={TrendingUp}
        />
        <StatCard
          label="Disciplinas cursando"
          value={subjects.length}
          sub="No semestre atual"
          icon={BookOpen}
        />
        <StatCard
          label="Em atenção"
          value={alertSubjects.length}
          sub="Precisam de foco"
          icon={AlertTriangle}
          variant={alertSubjects.length > 0 ? "danger" : "success"}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desempenho snapshot */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Disciplinas do Semestre</h3>
            <Link href="/desempenho" className="text-xs text-primary font-medium hover:underline">
              Ver tudo
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {subjects.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{s.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {s.status === "danger" && (
                        <span className="text-xs font-semibold text-danger bg-danger/10 px-2 py-0.5 rounded-full">
                          Risco
                        </span>
                      )}
                      {s.status === "alert" && (
                        <span className="text-xs font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                          Atenção
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-sm font-bold w-8 text-right",
                          s.status === "danger"
                            ? "text-danger"
                            : s.status === "alert"
                            ? "text-warning"
                            : "text-foreground"
                        )}
                      >
                        {s.gradePartial?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={s.gradePartial ?? 0}
                    max={10}
                    color={
                      s.status === "danger"
                        ? "bg-danger"
                        : s.status === "alert"
                        ? "bg-warning"
                        : "bg-primary"
                    }
                  />
                  <p className="text-xs text-muted mt-1">Frequência: {s.frequency}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aside */}
        <div className="flex flex-col gap-4">
          {/* Deadlines */}
          <div className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Prazos Próximos</h3>
              <CalendarClock className="w-4 h-4 text-muted" />
            </div>
            <div className="flex flex-col gap-2">
              {deadlines.map((d) => {
                const days = daysUntil(d.date);
                return (
                  <div
                    key={d.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg",
                      d.urgent ? "bg-danger/5 border border-danger/20" : "bg-surface-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 shrink-0 w-2 h-2 rounded-full",
                        d.urgent ? "bg-danger" : days <= 7 ? "bg-warning" : "bg-primary"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug text-pretty">
                        {d.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {formatDate(d.date)} · em {days} dia{days !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI alert */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Insight da IA</p>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Sua nota em <strong>Cálculo Numérico</strong> está abaixo do mínimo. Há uma monitoria disponível esta semana — recomendo participar.
            </p>
            <Link
              href="/assistente"
              className="text-xs text-primary font-semibold hover:underline mt-1"
            >
              Pedir ajuda ao assistente →
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Eventos em Destaque</h3>
          <Link href="/eventos" className="text-xs text-primary font-medium hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((ev) => (
            <div key={ev.id} className="flex flex-col gap-2 p-4 rounded-lg bg-surface-muted border border-border">
              <div className="flex items-center gap-2">
                {ev.isRecommended && (
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    Recomendado
                  </span>
                )}
                <span className="text-xs text-muted capitalize">{ev.type.replace("-", " ")}</span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-snug text-pretty">{ev.title}</p>
              <p className="text-xs text-muted">{formatDate(ev.date)} · {ev.time}</p>
              <p className="text-xs text-muted truncate">{ev.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
