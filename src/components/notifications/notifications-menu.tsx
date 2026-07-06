"use client";

import * as React from "react";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import {
  MOCK_NOTIFICATIONS,
  type Notification,
  type NotificationType,
} from "@/features/notifications/notifications-data";

const ICON_BY_TYPE: Record<NotificationType, LucideIcon> = {
  MATCH_FOUND: Swords,
  RANK_CHANGE: TrendingUp,
  SUBMISSION_GRADED: CheckCircle2,
  COMMENT_REPLY: MessageSquare,
  SKILL_UNLOCKED: Sparkles,
  SYSTEM: Bell,
};

const MAX_IN_DROPDOWN = 6;

export function NotificationsMenu() {
  const [items, setItems] = React.useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = items.reduce((n, item) => (item.read ? n : n + 1), 0);
  const visible = items.slice(0, MAX_IN_DROPDOWN);

  const markAllRead = () =>
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));

  const markOneRead = (id: string) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
          className="relative"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold leading-none text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <DropdownMenuLabel className="px-0 py-0">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Mark all read
            </button>
          )}
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        {visible.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </div>
        ) : (
          <div className="max-h-[22rem] overflow-y-auto py-1">
            {visible.map((item) => {
              const Icon = ICON_BY_TYPE[item.type];
              return (
                <DropdownMenuItem
                  key={item.id}
                  asChild
                  onSelect={() => markOneRead(item.id)}
                  className="items-start gap-2.5 px-2.5 py-2.5"
                >
                  <Link href={item.href}>
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
                      <Icon />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-foreground">
                          {item.title}
                        </span>
                        {!item.read && (
                          <span className="size-1.5 shrink-0 rounded-full bg-terminal" />
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-1 truncate text-xs text-muted-foreground">
                        {item.body}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                        {timeAgo(item.createdAt)}
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}

        <DropdownMenuSeparator className="mx-0 my-0" />

        <div className="p-1">
          <DropdownMenuItem asChild className="justify-center py-2">
            <Link
              href="/notifications"
              className="text-sm font-medium text-foreground"
            >
              View all
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
