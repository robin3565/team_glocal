"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cloneSeed } from "@/lib/seed";
import type {
  AttendanceStatus,
  LadderRecord,
  Member,
  TeamData,
} from "@/lib/types";

const STORAGE_KEY = "glocal-team-notebook-v2";
const seedSnapshot = cloneSeed();

type TeamContextValue = TeamData & {
  ready: boolean;
  setViewer: (memberId: string | null) => void;
  updateMember: (memberId: string, patch: Partial<Pick<Member, "name" | "role" | "active">>) => void;
  addMember: (member: Pick<Member, "name" | "role">) => void;
  updateAttendance: (
    eventId: string,
    memberId: string,
    patch: { status?: AttendanceStatus; memo?: string },
  ) => void;
  addEvent: (event: { title: string; date: string; time: string; place: string; note: string }) => void;
  addLadder: (record: LadderRecord) => void;
  resetDemo: () => void;
};

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TeamData>(seedSnapshot);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved) as TeamData);
      } catch {
        setData(cloneSeed());
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const value = useMemo<TeamContextValue>(
    () => ({
      ...data,
      ready,
      setViewer: (memberId) => setData((current) => ({ ...current, viewerId: memberId })),
      updateMember: (memberId, patch) =>
        setData((current) => ({
          ...current,
          members: current.members.map((member) =>
            member.id === memberId ? { ...member, ...patch } : member,
          ),
        })),
      addMember: (member) =>
        setData((current) => ({
          ...current,
          members: [
            ...current.members,
            {
              id: `m_${crypto.randomUUID().slice(0, 8)}`,
              name: member.name.trim(),
              role: member.role.trim(),
              active: true,
            },
          ],
        })),
      updateAttendance: (eventId, memberId, patch) =>
        setData((current) => ({
          ...current,
          events: current.events.map((event) => {
            if (event.id !== eventId) return event;
            const exists = event.attendance.some((row) => row.memberId === memberId);
            const attendance = exists
              ? event.attendance.map((row) =>
                  row.memberId === memberId ? { ...row, ...patch } : row,
                )
              : [
                  ...event.attendance,
                  {
                    memberId,
                    status: patch.status ?? "undecided",
                    memo: patch.memo ?? "",
                  },
                ];
            return { ...event, attendance };
          }),
        })),
      addEvent: (event) =>
        setData((current) => ({
          ...current,
          events: [
            ...current.events,
            {
              id: `e_${crypto.randomUUID().slice(0, 8)}`,
              title: event.title.trim(),
              date: event.date,
              time: event.time,
              place: event.place.trim(),
              note: event.note.trim(),
              attendance: current.members
                .filter((member) => member.active)
                .map((member) => ({ memberId: member.id, status: "undecided" as const, memo: "" })),
            },
          ],
        })),
      addLadder: (record) =>
        setData((current) => ({
          ...current,
          ladders: [record, ...current.ladders],
        })),
      resetDemo: () => setData(cloneSeed()),
    }),
    [data, ready],
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const value = useContext(TeamContext);
  if (!value) throw new Error("useTeam는 TeamProvider 안에서만 쓸 수 있습니다.");
  return value;
}
