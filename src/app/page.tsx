"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { formatDate, isPastDate, memberName } from "@/lib/format";
import { useTeam } from "@/lib/team-store";

export default function HomePage() {
  const { members, events } = useTeam();
  const upcoming = events
    .filter((event) => !isPastDate(event.date))
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextEvent = upcoming[0];
  const activeMembers = members.filter((member) => member.active);

  return (
    <div className="grid gap-8">
      <PageHeader
        kicker="TEAM NOTE"
        title="이번 달, 팀이 모이는 곳"
        description="다음 모임과 함께하는 팀원을 한눈에 봅니다."
      />

      <section className="grid gap-4">
        <article className="rounded-2xl border border-ink bg-card p-5 shadow-[4px_4px_0_#241c14]">
          <p className="text-xs font-semibold tracking-[0.14em] text-green">다음 일정</p>
          {nextEvent ? (
            <>
              <h2 className="mt-3 text-2xl font-bold">{nextEvent.title}</h2>
              <p className="mt-2 text-sm text-muted">
                {formatDate(nextEvent.date)} {nextEvent.time} · {nextEvent.place}
              </p>
              <p className="mt-3 text-sm leading-6">{nextEvent.note}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {nextEvent.attendance.map((row) => (
                  <span key={row.memberId} className="inline-flex items-center gap-2 text-sm">
                    {memberName(members, row.memberId)}
                    <StatusPill status={row.status} />
                  </span>
                ))}
              </div>
              <Link href={`/schedule/${nextEvent.id}`} className="mt-5 inline-block text-sm font-semibold text-green">
                일정 자세히 보기
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">다가오는 일정이 없습니다.</p>
          )}
        </article>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold">함께하는 팀원 {activeMembers.length}명</h2>
          <Link href="/admin" className="text-sm font-semibold text-green">
            명단 수정
          </Link>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {activeMembers.map((member) => (
            <li key={member.id} className="rounded-full border border-line bg-card px-3 py-1.5 text-sm">
              <span className="font-semibold">{member.name}</span>
              <span className="ml-2 text-muted">{member.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
