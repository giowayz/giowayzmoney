export type UserRole = "lead" | "admin";
export type SubmissionStatus = "pending" | "approved" | "rejected" | "paid";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface OfferRow {
  id: string;
  slug: string;
  name: string;
  bank: string;
  category: string;
  action: string;
  note: string | null;
  price: number;
  tracking_link: string;
  action_deadline_days: number | null;
  default_hold_days: number;
  is_active: boolean;
  created_at: string;
}

export interface Submission {
  id: string;
  lead_id: string;
  offer_id: string;
  screenshot_path: string;
  status: SubmissionStatus;
  submitted_at: string;
  approved_at: string | null;
  hold_days: number | null;
  hold_ends_at: string | null;
  payout_amount: number | null;
  paid_at: string | null;
  admin_comment: string | null;
  offers?: Pick<OfferRow, "name" | "bank" | "category" | "price" | "slug">;
}

export interface LinkClick {
  id: string;
  lead_id: string | null;
  offer_id: string;
  clicked_at: string;
  offers?: Pick<OfferRow, "name" | "bank" | "slug">;
}

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "На проверке",
  approved: "Одобрено — в холде",
  rejected: "Отклонено",
  paid: "Выплачено",
};
