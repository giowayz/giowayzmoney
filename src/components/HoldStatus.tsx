import type { Submission } from "@/types/database";
import { STATUS_LABELS } from "@/types/database";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  approved: "bg-[#5046e4]/15 text-[#9382ff]",
  rejected: "bg-red-500/15 text-red-400",
  paid: "bg-green-500/15 text-green-400",
};

function daysLeft(holdEndsAt: string | null): number | null {
  if (!holdEndsAt) return null;
  const diffMs = new Date(holdEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function HoldStatus({ submission }: { submission: Submission }) {
  const colorClass = STATUS_COLORS[submission.status] ?? "bg-[#10093a] shimmer-text-soft";
  const remaining = submission.status === "approved" ? daysLeft(submission.hold_ends_at) : null;

  return (
    <div className="flex flex-col items-end gap-1">
      <span className={`rounded-[32px] px-3 py-1 text-xs font-medium ${colorClass}`}>
        {STATUS_LABELS[submission.status]}
      </span>
      {submission.status === "approved" && remaining !== null && (
        <span className="text-xs shimmer-text-soft">
          {remaining > 0 ? `Холд: ещё ${remaining} дн.` : "Холд завершён"}
        </span>
      )}
    </div>
  );
}
