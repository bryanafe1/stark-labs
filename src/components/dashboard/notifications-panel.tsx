"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Swords,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Bell,
  type LucideIcon,
} from "lucide-react";
import type { NotificationType } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn, timeAgo } from "@/lib/utils";
import { fadeInUp } from "@/components/motion/motion-primitives";
import type { DashboardNotification } from "@/types/dashboard";

const ICONS: Partial<Record<NotificationType, LucideIcon>> = {
  MATCH_FOUND: Swords,
  RANK_CHANGE: TrendingUp,
  COMMENT_REPLY: MessageSquare,
  POST_MENTION: MessageSquare,
  SKILL_UNLOCKED: Sparkles,
  SUBMISSION_GRADED: Sparkles,
  SYSTEM: Bell,
};

export function NotificationsPanel({
  notifications,
}: {
  notifications: DashboardNotification[];
}) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Activity</CardTitle>
        {unread > 0 && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
            {unread} new
          </span>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-1">
        {notifications.map((n, i) => {
          const Icon = ICONS[n.type] ?? Bell;
          return (
            <motion.div
              key={n.id}
              variants={fadeInUp}
              initial="hidden"
              animate="show"
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={n.href ?? "#"}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent",
                  !n.read && "bg-primary/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                    n.read
                      ? "bg-secondary text-muted-foreground"
                      : "bg-primary/15 text-primary",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  {n.body && (
                    <p className="truncate text-xs text-muted-foreground">
                      {n.body}
                    </p>
                  )}
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
