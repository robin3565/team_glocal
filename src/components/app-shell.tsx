"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { memberName } from "@/lib/format";
import { TeamProvider, useTeam } from "@/lib/team-store";

const tabs = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/schedule", label: "일정", icon: "calendar" },
  { href: "/events", label: "사다리", icon: "ladder" },
  { href: "/me", label: "마이", icon: "user" },
  { href: "/admin", label: "관리", icon: "gear" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TeamProvider>
      <div className="flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-background">
        <Suspense fallback={<AppHeaderFallback />}>
          <AppHeader />
        </Suspense>
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4">{children}</main>
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
    <header className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 border-b border-line bg-background px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      {nested ? (
        <Link
          href={parentHref(pathname)}
          className="grid size-10 place-items-center rounded-full text-lg font-semibold"
          aria-label="뒤로"
        >
          ‹
        </Link>
      ) : (
        <span className="grid size-10 place-items-center text-xs font-bold tracking-widest text-green">G</span>
      )}
      <p className="truncate text-center text-base font-bold">글로컬 공책</p>
      <Link
        href="/me"
        aria-label={viewer ? `${memberName(members, viewer.id)} 마이페이지` : "본인 선택"}
        className="grid size-10 place-items-center rounded-full bg-green text-sm font-bold text-white"
      >
        {viewer ? viewer.name.slice(0, 1) : "나"}
      </Link>
    </header>
  );
}

function AppHeaderFallback() {
  return (
    <header className="grid shrink-0 grid-cols-[2.5rem_1fr_2.5rem] items-center border-b border-line px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
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
      className="grid shrink-0 grid-cols-5 border-t border-line bg-card pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1"
      aria-label="주요 메뉴"
    >
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 px-1 py-1 text-[11px] font-semibold ${
              active ? "text-green" : "text-muted"
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
      className="grid shrink-0 grid-cols-5 border-t border-line bg-card pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1"
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
  if (name === "ladder") {
    return (
      <svg {...props}>
        <path d="M7 3v18M17 3v18M7 8h10M7 13h10M7 18h10" />
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
        <p className="text-[11px] font-semibold tracking-[0.16em] text-green">{kicker}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
