import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Users,
} from "lucide-react";
import { subjects, student } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function GradeCircle({ value, size = "lg" }: { value: number; size?: "sm" | "lg" }) {
  const good = value >= 7;
  const bad = value < 6;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold shrink-0",
        size === "lg" ? "w-14 h-14 text-xl" : "w-10 h-10 text-base",
        good
          ? "bg-success/10 text-success"
          : bad
          ? "bg-danger/10 text-danger"
          : "bg-warning/10 text-warning"
      )}
    >
      {value.toFixed(1)}
    </div>
  );
}

function FrequencyBar({ value, required }: { value: number; required: number }) {
  const atRisk = value < required;
  const color = atRisk ? "bg-danger" : value < required + 5 ? "bg-warning" : "bg-success";
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs font-semibold w-10 text-right shrink-0",
          atRisk ? "text-danger" : "text-muted"
        )}
      >
        {value}%
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: "ok" | "alert" | "danger" }) {
  if (status === "ok")
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> Em dia
      </span>
    );
  if (status === "alert")
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">
        <AlertTriangle className="w-3 h-3" /> Atenção
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-danger bg-danger/10 px-2 py-0.5 rounded-full">
      <XCircle className="w-3 h-3" /> Risco
    </span>
  );
}

export default function DesempenhoPage() {
  const totalCredits = subjects.reduce((acc, s) => acc + s.credits, 0);
  const avgGrade =
    subjects.reduce((acc, s) => acc + (s.gradePartial ?? 0), 0) / subjects.length;
  const atRisk = subjects.filter((s) => s.status !== "ok").length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-1">
          <p className="text-xs text-muted uppercase tracking-wide font-medium">CR Geral</p>
          <p className="text-2xl font-bold text-foreground">{student.cr.toFixed(1)}</p>
          <p className="text-xs text-muted">Histórico acumulado</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-1">
          <p className="text-xs text-muted uppercase tracking-wide font-medium">Média Atual</p>
          <p
            className={cn(
              "text-2xl font-bold",
              avgGrade >= 7 ? "text-success" : avgGrade < 6 ? "text-danger" : "text-warning"
            )}
          >
            {avgGrade.toFixed(1)}
          </p>
          <p className="text-xs text-muted">Semestre 2025/1</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 flex flex-col gap-1">
          <p className="text-xs text-muted uppercase tracking-wide font-medium">Créditos</p>
          <p className="text-2xl font-bold text-foreground">{totalCredits}</p>
          <p className="text-xs text-muted">Este semestre</p>
        </div>
        <div
          className={cn(
            "rounded-xl border p-4 flex flex-col gap-1",
            atRisk > 0
              ? "bg-danger/5 border-danger/20"
              : "bg-surface border-border"
          )}
        >
          <p className="text-xs text-muted uppercase tracking-wide font-medium">Em Atenção</p>
          <p className={cn("text-2xl font-bold", atRisk > 0 ? "text-danger" : "text-success")}>
            {atRisk}
          </p>
          <p className="text-xs text-muted">Disciplinas</p>
        </div>
      </div>

      {/* AI insight */}
      {atRisk > 0 && (
        <div className="bg-warning/5 border border-warning/30 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Alerta de desempenho</p>
            <p className="text-sm text-muted mt-0.5 leading-relaxed">
              Você tem{" "}
              <strong className="text-foreground">
                {subjects.find((s) => s.status === "danger")?.name}
              </strong>{" "}
              abaixo da média e com frequência inferior ao mínimo exigido. Considere buscar a
              monitoria disponível e conversar com o professor antes da P1.
            </p>
          </div>
        </div>
      )}

      {/* Subjects */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted" />
          <h3 className="font-semibold text-foreground">Disciplinas — 2025/1</h3>
        </div>
        <div className="divide-y divide-border">
          {subjects.map((s) => (
            <div key={s.id} className="px-5 py-4 flex flex-col gap-3">
              {/* Header row */}
              <div className="flex items-start gap-4">
                <GradeCircle value={s.gradePartial ?? 0} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-foreground leading-snug">{s.name}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {s.code} · {s.professor}
                      </p>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                </div>
              </div>

              {/* Grade detail */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-muted rounded-lg p-3">
                <div>
                  <p className="text-xs text-muted">Nota Parcial</p>
                  <p
                    className={cn(
                      "text-sm font-bold mt-0.5",
                      s.gradePartial !== null && s.gradePartial >= 7
                        ? "text-success"
                        : s.gradePartial !== null && s.gradePartial < 6
                        ? "text-danger"
                        : "text-warning"
                    )}
                  >
                    {s.gradePartial?.toFixed(1) ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">Nota Final</p>
                  <p className="text-sm font-bold text-muted mt-0.5">—</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Créditos</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{s.credits}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Mínimo aprovação</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">7.0</p>
                </div>
              </div>

              {/* Frequency */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-muted" />
                    <span className="text-xs text-muted">Frequência</span>
                  </div>
                  <span className="text-xs text-muted">
                    Mínimo: {s.frequencyRequired}%
                  </span>
                </div>
                <FrequencyBar value={s.frequency} required={s.frequencyRequired} />
                {s.frequency < s.frequencyRequired && (
                  <p className="text-xs text-danger font-medium">
                    Frequência abaixo do mínimo exigido ({s.frequencyRequired}%)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carga horária */}
      <div className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-3">
        <h3 className="font-semibold text-foreground">Progresso no Curso</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Horas concluídas</span>
          <span className="font-semibold text-foreground">
            {student.hoursCompleted.toLocaleString("pt-BR")} /{" "}
            {student.hoursRequired.toLocaleString("pt-BR")} h
          </span>
        </div>
        <div className="w-full h-3 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: `${(student.hoursCompleted / student.hoursRequired) * 100}%`,
            }}
          />
        </div>
        <p className="text-xs text-muted">
          {((student.hoursCompleted / student.hoursRequired) * 100).toFixed(0)}% do curso concluído
          · {student.semester}º semestre de 8
        </p>
      </div>
    </div>
  );
}
