"use client";

import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import { formatFullDate, memberName } from "@/lib/format";
import { useTeam } from "@/lib/team-store";

export function ScheduleDetail({ id }: { id: string }) {
  const { events, members, viewerId } = useTeam();
  const event = events.find((item) => item.id === id);

  if (!event) {
    return (
      <div className="grid gap-3">
        <h1 className="text-2xl font-bold">일정을 찾지 못했습니다</h1>
        <Link href="/schedule" className="text-sm font-semibold text-green">
          일정 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link href="/schedule" className="text-sm font-semibold text-green">
          일정 목록
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{event.title}</h1>
        <p className="mt-2 text-sm text-muted">
          {formatFullDate(event.date)} {event.time} · {event.place}
        </p>
      </div>

      <p className="max-w-2xl rounded-2xl bg-card px-4 py-3 text-sm leading-6">{event.note}</p>

      <section>
        <h2 className="text-lg font-bold">참석 기록</h2>
        <ul className="mt-3 grid gap-2">
          {event.attendance.map((row) => {
            const mine = row.memberId === viewerId;
            return (
              <li
                key={row.memberId}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                  mine ? "border-ink bg-card shadow-[3px_3px_0_#241c14]" : "border-line bg-card"
                }`}
              >
                <div>
                  <p className="font-semibold">
                    {memberName(members, row.memberId)}
                    {mine ? <span className="ml-2 text-xs text-green">내 기록</span> : null}
                  </p>
                  <p className="mt-1 text-sm text-muted">{row.memo || "메모 없음"}</p>
                </div>
                <StatusPill status={row.status} />
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm text-muted">
          본인 참석과 메모는{" "}
          <Link href="/me" className="font-semibold text-green">
            마이페이지
          </Link>
          에서 수정합니다.
        </p>
      </section>
    </div>
  );
}
