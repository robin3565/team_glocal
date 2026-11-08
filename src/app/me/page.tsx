"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app-shell";
import { formatDate, memberName } from "@/lib/format";
import { useTeam } from "@/lib/team-store";
import type { AttendanceStatus } from "@/lib/types";

const statuses: AttendanceStatus[] = ["going", "absent", "undecided"];
const statusText: Record<AttendanceStatus, string> = {
  going: "참석",
  absent: "불참",
  undecided: "미정",
};

export default function MyPage() {
  const { members, events, ladders, viewerId, setViewer, updateAttendance } = useTeam();
  const viewer = members.find((member) => member.id === viewerId);
  const activeMembers = members.filter((member) => member.active);
  const orderedEvents = [...events].sort((a, b) => b.date.localeCompare(a.date));
  const myLadders = ladders
    .filter((game) => game.results.some((result) => result.memberId === viewerId))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="grid gap-8">
      <PageHeader
        kicker="MY PAGE"
        title={viewer ? `${viewer.name}의 기록` : "본인을 선택하세요"}
        description="팀원은 계정을 만들지 않고 자기 이름을 고릅니다. 여기서 본인 일정만 고치고, 본인이 걸린 사다리를 봅니다."
      />

      <section>
        <h2 className="text-sm font-semibold">누구로 볼까요</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {activeMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              aria-pressed={member.id === viewerId}
              onClick={() => setViewer(member.id)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                member.id === viewerId ? "bg-green text-white" : "border border-line bg-card"
              }`}
            >
              {member.name}
              <span className="ml-1 text-xs opacity-70">{member.role}</span>
            </button>
          ))}
        </div>
        {viewer && !viewer.active ? (
          <p className="mt-3 text-sm text-muted">
            이 팀원은 선택 목록에서 빠져 있습니다. 이미 남은 기록은 계속 볼 수 있습니다.
          </p>
        ) : null}
      </section>

      {viewer ? (
        <>
          <section>
            <h2 className="text-lg font-bold">내 일정</h2>
            <ul className="mt-3 grid gap-3">
              {orderedEvents.map((event) => {
                const row = event.attendance.find((item) => item.memberId === viewer.id);
                return (
                  <li key={event.id} className="rounded-2xl border border-line bg-card p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link href={`/schedule/${event.id}`} className="font-bold">
                        {event.title}
                      </Link>
                      <p className="text-sm text-muted">
                        {formatDate(event.date)} {event.time}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`${event.title} 참석`}>
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          aria-pressed={(row?.status ?? "undecided") === status}
                          onClick={() => updateAttendance(event.id, viewer.id, { status })}
                          className={`rounded-full px-3 py-1.5 text-sm ${
                            (row?.status ?? "undecided") === status
                              ? "bg-ink text-card"
                              : "border border-line"
                          }`}
                        >
                          {statusText[status]}
                        </button>
                      ))}
                    </div>
                    <label className="mt-3 grid gap-1 text-xs text-muted">
                      메모
                      <input
                        value={row?.memo ?? ""}
                        onChange={(input) =>
                          updateAttendance(event.id, viewer.id, { memo: input.target.value })
                        }
                        placeholder="준비물, 늦는 이유"
                        className="rounded-xl border border-line px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold">내가 걸린 사다리</h2>
            {myLadders.length === 0 ? (
              <p className="mt-3 text-sm text-muted">아직 참여한 사다리가 없습니다.</p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {myLadders.map((game) => {
                  const mine = game.results.find((result) => result.memberId === viewer.id);
                  return (
                    <li key={game.id}>
                      <Link
                        href={`/events/${game.id}`}
                        className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3"
                      >
                        <span>
                          <span className="block font-semibold">{game.title}</span>
                          <span className="text-sm text-muted">{formatDate(game.date)}</span>
                        </span>
                        <span className="font-semibold">{mine?.prize}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-sm text-muted">지금 보는 이름: {memberName(members, viewer.id)}</p>
          </section>
        </>
      ) : null}
    </div>
  );
}
