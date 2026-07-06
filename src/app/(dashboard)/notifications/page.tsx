import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  Swords,
  TrendingUp,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  MOCK_NOTIFICATIONS,
  type Notification,
  type NotificationType,
} from "@/features/notifications/notifications-data";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };

const ICON_BY_TYPE: Record<NotificationType, LucideIcon> = {
  MATCH_FOUND: Swords,
  RANK_CHANGE: TrendingUp,
  SUBMISSION_GRADED: CheckCircle2,
  COMMENT_REPLY: MessageSquare,
  SKILL_UNLOCKED: Sparkles,
  SYSTEM: Bell,
};

const DAY_MS = 24 * 60 * 60 * 1000;

function isToday(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < DAY_MS;
}

function NotificationRow({ item }: { item: Notification }) {
  const Icon = ICON_BY_TYPE[item.type];
  return (
    <Link
      href={item.href}
      className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:bg-accent sm:px-4 sm:py-3"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
        <Icon />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {item.title}
          </p>
          {!item.read && (
            <span className="size-1.5 shrink-0 rounded-full bg-terminal" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
          {item.body}
        </p>
      </div>
      <span className="mt-0.5 shrink-0 font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {timeAgo(item.createdAt)}
      </span>
    </Link>
  );
}

function Group({ label, items }: { label: string; items: Notification[] }) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-2">
      <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <NotificationRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function NotificationsPage() {
  const items = [...MOCK_NOTIFICATIONS].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
  const today = items.filter((item) => isToday(item.createdAt));
  const earlier = items.filter((item) => !isToday(item.createdAt));
  const unreadCount = items.reduce((n, item) => (item.read ? n : n + 1), 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? (
              <>
                You have{" "}
                <span className="font-mono text-foreground">{unreadCount}</span>{" "}
                unread.
              </>
            ) : (
              "You're all caught up."
            )}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-6">
          <Group label="Today" items={today} />
          <Group label="Earlier" items={earlier} />
        </div>
      )}
    </div>
  );
}
