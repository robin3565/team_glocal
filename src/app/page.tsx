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
        <article className="overflow-hidden rounded-3xl bg-ink text-white shadow-[0_20px_40px_-24px_rgba(23,32,51,0.85)]">
          <div className="bg-[linear-gradient(145deg,#3d62f5_0%,#243056_58%,#172033_100%)] p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/70">다음 일정</p>
            {nextEvent ? (
              <>
                <h2 className="mt-3 text-2xl font-bold">{nextEvent.title}</h2>
                <p className="mt-2 text-sm text-white/75">
                  {formatDate(nextEvent.date)} {nextEvent.time} · {nextEvent.place}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/90">{nextEvent.note}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {nextEvent.attendance.map((row) => (
                    <span key={row.memberId} className="inline-flex items-center gap-2 text-sm">
                      {memberName(members, row.memberId)}
                      <StatusPill status={row.status} />
                    </span>
                  ))}
                </div>
                <Link
                  href={`/schedule/${nextEvent.id}`}
                  className="mt-5 inline-flex rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ink"
                >
                  일정 자세히 보기
                </Link>
              </>
            ) : (
              <p className="mt-3 text-sm text-white/75">다가오는 일정이 없습니다.</p>
            )}
          </div>
        </article>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold">함께하는 팀원 {activeMembers.length}명</h2>
          <Link href="/admin" className="text-sm font-semibold text-green">
            명단 수정
          </Link>
        </div>
        <ul className="mt-3 grid gap-2">
          {activeMembers.map((member) => (
            <li key={member.id} className="flex items-center gap-3 rounded-2xl border border-line bg-card px-3 py-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-green-soft text-sm font-bold text-green">
                {member.name.slice(0, 1)}
              </span>
              <span className="font-semibold">{member.name}</span>
              <span className="ml-auto text-sm text-muted">{member.role}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
