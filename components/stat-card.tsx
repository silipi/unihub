import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
};

const variantStyles = {
  default: "bg-primary/8 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export function StatCard({ label, value, sub, icon: Icon, variant = "default" }: Props) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 flex items-start gap-4">
      <div className={cn("flex items-center justify-center w-11 h-11 rounded-lg shrink-0", variantStyles[variant])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
