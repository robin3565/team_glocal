"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { memberName } from "@/lib/format";
import { TeamProvider, useTeam } from "@/lib/team-store";

const tabs = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/schedule", label: "일정", icon: "calendar" },
  { href: "/events", label: "추첨", icon: "draw" },
  { href: "/me", label: "마이", icon: "user" },
  { href: "/admin", label: "관리", icon: "gear" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TeamProvider>
      <div className="flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[linear-gradient(180deg,#f7f9fd_0%,#eef3fb_100%)]">
        <Suspense fallback={<AppHeaderFallback />}>
          <AppHeader />
        </Suspense>
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 py-4">{children}</main>
        <Suspense fallback={<TabBarFallback />}>
          <TabBar />
        </Suspense>
      </div>
    </TeamProvider>
  );
}

function parentHref(pathname: string) {
  if (pathname.startsWith("/schedule/")) return "/schedule";
  if (pathname.startsWith("/events/")) return "/events";
  return "/";
}

function AppHeader() {
  const pathname = usePathname();
  const { members, viewerId } = useTeam();
  const viewer = members.find((member) => member.id === viewerId);
  const nested = pathname.split("/").filter(Boolean).length > 1;

  return (
    <header className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 bg-card/80 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 shadow-[0_1px_0_var(--line)] backdrop-blur">
      {nested ? (
        <Link
          href={parentHref(pathname)}
          className="grid size-10 place-items-center rounded-xl bg-green-soft text-lg font-semibold text-green"
          aria-label="뒤로"
        >
          ‹
        </Link>
      ) : (
        <span className="grid size-10 place-items-center rounded-xl bg-green text-xs font-bold text-white">G</span>
      )}
      <p className="truncate text-center text-base font-bold">글로컬 공책</p>
      <Link
        href="/me"
        aria-label={viewer ? `${memberName(members, viewer.id)} 마이페이지` : "본인 선택"}
        className="grid size-10 place-items-center rounded-xl bg-ink text-sm font-bold text-white"
      >
        {viewer ? viewer.name.slice(0, 1) : "나"}
      </Link>
    </header>
  );
}

function AppHeaderFallback() {
  return (
    <header className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center bg-card px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 shadow-[0_1px_0_var(--line)]">
      <span />
      <p className="text-center text-base font-bold">글로컬 공책</p>
      <span />
    </header>
  );
}

function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="grid shrink-0 grid-cols-5 gap-1 bg-card/90 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-1px_0_var(--line)] backdrop-blur"
      aria-label="주요 메뉴"
    >
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[11px] font-semibold ${
              active ? "bg-green-soft text-green" : "text-muted"
            }`}
          >
            <TabIcon name={tab.icon} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function TabBarFallback() {
  return (
    <nav
      className="grid shrink-0 grid-cols-5 gap-1 bg-card/90 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-1px_0_var(--line)] backdrop-blur"
      aria-label="주요 메뉴"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className="flex flex-col items-center gap-0.5 px-1 py-1 text-[11px] font-semibold text-muted"
        >
          <TabIcon name={tab.icon} />
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

function TabIcon({ name }: { name: (typeof tabs)[number]["icon"] }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "home") {
    return (
      <svg {...props}>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
      </svg>
    );
  }
  if (name === "calendar") {
    return (
      <svg {...props}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5V7M16 3.5V7M4 10h16" />
      </svg>
    );
  }
  if (name === "draw") {
    return (
      <svg {...props}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "user") {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19.5c1.4-3 3.6-4.5 6.5-4.5s5.1 1.5 6.5 4.5" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
    </svg>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="inline-flex rounded-full bg-green-soft px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-green">
          {kicker}
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
