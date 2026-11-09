"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { APP_TODAY, formatFullDate, memberName } from "@/lib/format";
import { useTeam } from "@/lib/team-store";
import type { TeamEvent } from "@/lib/types";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

export default function SchedulePage() {
  const { events, members, addEvent } = useTeam();
  const [year, month] = APP_TODAY.split("-").map(Number);
  const [cursor, setCursor] = useState({ year, month });
  const [selected, setSelected] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const cells = useMemo(() => buildMonth(cursor.year, cursor.month), [cursor.year, cursor.month]);
  const byDate = useMemo(() => {
    const map = new Map<string, TeamEvent[]>();
    for (const event of events) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [events]);

  const selectedEvents = selected ? (byDate.get(selected) ?? []) : [];

  function shiftMonth(amount: number) {
    setCursor((current) => {
      const date = new Date(current.year, current.month - 1 + amount, 1);
      return { year: date.getFullYear(), month: date.getMonth() + 1 };
    });
    setSelected(null);
  }

  return (
    <div className="grid gap-5">
      <PageHeader kicker="SCHEDULE" title="팀 일정" description="날짜를 누르면 그날 일정이 나옵니다." />

      <section className="rounded-2xl border border-line bg-card p-3">
        <div className="flex items-center justify-between px-1 pb-3">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="grid size-9 place-items-center rounded-full text-lg"
            aria-label="이전 달"
          >
            ‹
          </button>
          <h2 className="text-base font-bold">
            {cursor.year}년 {cursor.month}월
          </h2>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="grid size-9 place-items-center rounded-full text-lg"
            aria-label="다음 달"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-muted">
          {weekdays.map((day) => (
            <p key={day} className={day === "일" ? "text-persimmon" : day === "토" ? "text-green" : undefined}>
              {day}
            </p>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7">
          {cells.map((day, index) => {
            if (!day) return <span key={`empty-${index}`} />;
            const iso = toIso(cursor.year, cursor.month, day);
            const dayEvents = byDate.get(iso) ?? [];
            const isToday = iso === APP_TODAY;
            const isSelected = iso === selected;
            const weekday = index % 7;

            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelected(iso)}
                aria-pressed={isSelected}
                aria-label={`${cursor.month}월 ${day}일${dayEvents.length ? `, 일정 ${dayEvents.length}개` : ""}`}
                className={`flex h-11 flex-col items-center justify-center rounded-xl text-sm ${
                  isSelected
                    ? "bg-ink font-bold text-card"
                    : isToday
                      ? "font-bold text-green"
                      : weekday === 0
                        ? "text-persimmon"
                        : ""
                }`}
              >
                {day}
                <span
                  className={`mt-0.5 size-1 rounded-full ${
                    dayEvents.length === 0 ? "bg-transparent" : isSelected ? "bg-card" : "bg-green"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setAdding(true)}
        className="rounded-xl bg-green px-4 py-2.5 text-sm font-semibold text-white"
      >
        일정 추가
      </button>

      <section aria-live="polite">
        {selected === null ? (
          <p className="px-1 text-sm text-muted">날짜를 눌러 주세요.</p>
        ) : (
          <>
            <h2 className="px-1 text-sm font-semibold text-muted">{formatFullDate(selected)}</h2>
            {selectedEvents.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-muted">
                이 날 일정이 없습니다.
              </p>
            ) : (
              <ul className="mt-3 grid gap-3">
                {selectedEvents.map((event) => (
                  <li key={event.id} className="rounded-2xl border border-line bg-card p-4 shadow-[0_12px_30px_-24px_#172033]">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-lg font-bold">{event.title}</h3>
                        <p className="shrink-0 text-sm text-muted">{event.time}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted">{event.place}</p>
                      <p className="mt-3 text-sm leading-6">{event.note}</p>
                      <ul className="mt-3 grid gap-2">
                        {event.attendance.map((row) => (
                          <li key={row.memberId} className="flex items-center justify-between gap-3 text-sm">
                            <span>
                              <span className="font-semibold">{memberName(members, row.memberId)}</span>
                              {row.memo ? <span className="mt-0.5 block text-xs text-muted">{row.memo}</span> : null}
                            </span>
                            <StatusPill status={row.status} />
                          </li>
                        ))}
                      </ul>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {adding ? (
        <EventForm
          key={selected ?? "today"}
          date={selected ?? APP_TODAY}
          onCancel={() => setAdding(false)}
          onSave={(event) => {
            addEvent(event);
            const [eventYear, eventMonth] = event.date.split("-").map(Number);
            setCursor({ year: eventYear, month: eventMonth });
            setSelected(event.date);
            setAdding(false);
          }}
        />
      ) : null}
    </div>
  );
}

function EventForm({
  date,
  onCancel,
  onSave,
}: {
  date: string;
  onCancel: () => void;
  onSave: (event: { title: string; date: string; time: string; place: string; note: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState(date);
  const [time, setTime] = useState("19:00");
  const [place, setPlace] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (!title.trim()) {
      setError("일정 이름을 입력해 주세요.");
      return;
    }
    if (!eventDate) {
      setError("날짜를 선택해 주세요.");
      return;
    }
    onSave({ title, date: eventDate, time, place, note });
  }

  return (
    <form
      className="grid gap-3 rounded-2xl border border-line bg-card p-4 shadow-[0_12px_30px_-24px_#172033]"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <h2 className="text-lg font-bold">일정 추가</h2>
      <label className="grid gap-1 text-xs text-muted">
        이름
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="11월 팀 워크숍"
          className="rounded-xl border border-line px-3 py-2 text-sm text-foreground"
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1 text-xs text-muted">
          날짜
          <input
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
            className="rounded-xl border border-line px-3 py-2 text-sm text-foreground"
          />
        </label>
        <label className="grid gap-1 text-xs text-muted">
          시간
          <input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="rounded-xl border border-line px-3 py-2 text-sm text-foreground"
          />
        </label>
      </div>
      <label className="grid gap-1 text-xs text-muted">
        장소
        <input
          value={place}
          onChange={(event) => setPlace(event.target.value)}
          placeholder="성수 공유오피스"
          className="rounded-xl border border-line px-3 py-2 text-sm text-foreground"
        />
      </label>
      <label className="grid gap-1 text-xs text-muted">
        메모
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          className="rounded-xl border border-line px-3 py-2 text-sm text-foreground"
        />
      </label>
      {error ? <p className="text-sm text-persimmon">{error}</p> : null}
      <div className="flex gap-2">
        <button type="submit" className="rounded-xl bg-green px-4 py-2 text-sm font-semibold text-white">
          저장
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
          취소
        </button>
      </div>
    </form>
  );
}

function buildMonth(year: number, month: number) {
  const startOffset = new Date(year, month - 1, 1).getDay();
  const days = new Date(year, month, 0).getDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
