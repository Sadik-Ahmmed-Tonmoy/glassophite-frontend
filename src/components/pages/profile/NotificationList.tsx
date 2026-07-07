"use client";

import { CheckCheck, Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/redux/features/notification/notificationApi";

export default function NotificationList() {
  const { theme: styles, isDark } = useProfileTheme();
  const { data, isLoading } = useGetNotificationsQuery(undefined, { pollingInterval: 15000 });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const notifications = (data as any)?.data ?? [];

  const unread = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className={cn("rounded-2xl border shadow-sm overflow-hidden transition-all duration-500", styles.card, styles.cardGlow)}>
      <div className={cn("flex items-center justify-between px-5 py-4 border-b", isDark ? "border-white/[0.06]" : "border-gray-100")}>
        <div className="flex items-center gap-2">
          <Bell className={cn("w-5 h-5", styles.icon)} />
          <h3 className={cn("text-lg font-semibold", styles.text)}>Notifications</h3>
          {unread > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#007C74] text-white">
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={() => markAllRead(undefined)}
            className="inline-flex items-center gap-1 text-xs text-[#007C74] hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className={cn("w-8 h-8 mx-auto mb-2", styles.icon)} />
            <p className={cn("text-sm", styles.textMuted)}>No notifications yet</p>
            <p className={cn("text-xs mt-1", styles.textMutedLighter)}>
              Notifications about your orders and account will appear here.
            </p>
          </div>
        ) : (
          notifications.map((n: any) => (
            <div
              key={n.id}
              onClick={() => { if (!n.isRead) markRead(n.id); }}
              className={cn(
                "px-5 py-4 transition-colors cursor-pointer",
                !n.isRead
                  ? isDark ? "bg-white/[0.02]" : "bg-[#007C74]/[0.03]"
                  : ""
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                  n.isRead ? "bg-transparent" : "bg-[#007C74]"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", styles.text)}>{n.title}</p>
                  <p className={cn("text-xs mt-0.5", styles.textMutedLighter)}>{n.message}</p>
                  <p className={cn("text-[11px] mt-1.5", styles.textMutedLighter)}>
                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
