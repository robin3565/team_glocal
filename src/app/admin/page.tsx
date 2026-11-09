"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { recordCount } from "@/lib/format";
import { useTeam } from "@/lib/team-store";

export default function AdminPage() {
  const { members, events, ladders, updateMember, addMember, resetDemo } = useTeam();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const active = members.filter((member) => member.active);
  const hidden = members.filter((member) => !member.active);

  function submitMember() {
    if (!name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    addMember({ name, role });
    setName("");
    setRole("");
    setError("");
  }

  return (
    <div className="grid gap-8">
      <PageHeader
        kicker="ADMIN"
        title="팀원 관리"
        description="이름을 바꾸거나 목록에서 숨겨도 일정 참석과 추첨 결과는 지워지지 않습니다. 기록은 팀원 번호에 붙어 있고, 화면에는 지금 이름이 보입니다."
        action={
          <button
            type="button"
            onClick={resetDemo}
            className="rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold"
          >
            예시로 되돌리기
          </button>
        }
      />

      <MemberList
        title="현재 팀원"
        members={active}
        events={events}
        ladders={ladders}
        updateMember={updateMember}
      />
      <MemberList
        title="목록에서 숨긴 팀원"
        members={hidden}
        events={events}
        ladders={ladders}
        updateMember={updateMember}
        empty="숨긴 팀원이 없습니다."
      />

      <section className="rounded-2xl border border-line bg-card p-4 shadow-[0_12px_30px_-24px_#172033]">
        <h2 className="text-lg font-bold">팀원 추가</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름"
            aria-label="새 팀원 이름"
            className="rounded-xl border border-line px-3 py-2 text-sm"
          />
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="역할"
            aria-label="새 팀원 역할"
            className="rounded-xl border border-line px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={submitMember}
            className="rounded-xl bg-green px-4 py-2 text-sm font-semibold text-white"
          >
            추가
          </button>
        </div>
        {error ? <p className="mt-2 text-sm text-persimmon">{error}</p> : null}
      </section>
    </div>
  );
}

function MemberList({
  title,
  members,
  events,
  ladders,
  updateMember,
  empty,
}: {
  title: string;
  members: { id: string; name: string; role: string; active: boolean }[];
  events: { attendance: { memberId: string }[] }[];
  ladders: { results: { memberId: string }[] }[];
  updateMember: (
    memberId: string,
    patch: Partial<{ name: string; role: string; active: boolean }>,
  ) => void;
  empty?: string;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      {members.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 grid gap-3">
          {members.map((member) => {
            const counts = recordCount(member.id, events, ladders);
            return (
              <li key={member.id} className="rounded-2xl border border-line bg-card p-4">
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    value={member.name}
                    aria-label={`${member.name} 이름`}
                    onChange={(event) => updateMember(member.id, { name: event.target.value })}
                    className="rounded-xl border border-line px-3 py-2 text-sm font-semibold"
                  />
                  <input
                    value={member.role}
                    aria-label={`${member.name} 역할`}
                    onChange={(event) => updateMember(member.id, { role: event.target.value })}
                    className="rounded-xl border border-line px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => updateMember(member.id, { active: !member.active })}
                    className="rounded-full border border-line px-3 py-2 text-sm font-semibold"
                  >
                    {member.active ? "목록에서 숨기기" : "다시 표시"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted">
                  일정 {counts.schedules}건 · 추첨 {counts.games}건
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
