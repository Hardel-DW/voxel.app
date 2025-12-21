import { t } from "@/lib/i18n";

export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greeting.morning");
    if (hour < 18) return t("home.greeting.afternoon");
    return t("home.greeting.evening");
}

export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("time.just_now");
    if (minutes < 60) return t("time.minutes_ago", { count: minutes });
    if (hours < 24) return t("time.hours_ago", { count: hours });
    if (days < 7) return t("time.days_ago", { count: days });
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(timestamp);
}
