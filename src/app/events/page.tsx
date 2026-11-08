"use client";

import Link from "next/link";
import { PageHeader } from "@/components/app-shell";
import { formatDate, memberName } from "@/lib/format";
import { tallyByMember, tallyEntries, winningResults } from "@/lib/ladder";
import { useTeam } from "@/lib/team-store";

export default function EventsPage() {
  const { ladders, members } = useTeam();
  const latest = [...ladders].sort((a, b) => b.date.localeCompare(a.date) || ladders.indexOf(a) - ladders.indexOf(b))[0];
  const tallies = tallyByMember(ladders);
  const rankedMembers = members
    .filter((member) => member.active || tallies.has(member.id))
    .sort((a, b) => {
      const wins = (id: string) => tallies.get(id)?.get("당첨") ?? 0;
      return wins(b.id) - wins(a.id) || members.indexOf(a) - members.indexOf(b);
    });

  return (
    <div className="grid gap-6">
      <PageHeader
        kicker="LADDER"
        title="사다리"
        description="새 사다리를 타고, 최근 결과와 팀원별 누적을 확인합니다."
      />

      <Link
        href="/events/new"
        className="rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-card"
      >
        새 사다리
      </Link>

      <section>
        <h2 className="px-1 text-sm font-semibold text-muted">최근 결과</h2>
        {latest ? (
          <Link
            href={`/events/${latest.id}`}
            className="mt-3 block rounded-2xl border border-line bg-card p-4 hover:border-ink"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold">{latest.title}</h3>
              <p className="text-sm text-muted">{formatDate(latest.date)}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              {winningResults(latest.results)
                .map((result) =>
                  result.prize === "당첨"
                    ? memberName(members, result.memberId)
                    : `${memberName(members, result.memberId)} ${result.prize}`,
                )
                .join(" · ")}
            </p>
          </Link>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-muted">
            아직 사다리 결과가 없습니다.
          </p>
        )}
      </section>

      <section>
        <h2 className="px-1 text-sm font-semibold text-muted">누적 결과</h2>
        {rankedMembers.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-muted">
            아직 누적된 결과가 없습니다.
          </p>
        ) : (
          <ul className="mt-3 overflow-hidden rounded-2xl border border-line bg-card">
            {rankedMembers.map((member) => {
              const entries = tallyEntries(tallies.get(member.id));
              return (
                <li
                  key={member.id}
                  className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0"
                >
                  <p className="shrink-0 font-semibold">{member.name}</p>
                  {entries.length === 0 ? (
                    <p className="text-sm text-muted">아직 없음</p>
                  ) : (
                    <p className="text-right text-sm leading-5">
                      {entries.map(([prize, count], index) => (
                        <span key={prize} className={prize === "당첨" ? "font-bold text-green" : "text-muted"}>
                          {index > 0 ? " · " : ""}
                          {prize} {count}
                        </span>
                      ))}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
