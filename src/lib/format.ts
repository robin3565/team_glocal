import type { AttendanceStatus, Member } from "@/lib/types";

export const APP_TODAY = "2026-11-08";

const statusLabel: Record<AttendanceStatus, string> = {
  going: "참석",
  absent: "불참",
  undecided: "미정",
};

export function attendanceLabel(status: AttendanceStatus) {
  return statusLabel[status];
}

export function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(year, month - 1, day));
}

export function formatClock(isoDateTime: string) {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(date);
}

export function formatFullDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(year, month - 1, day));
}

export function isPastDate(isoDate: string) {
  return isoDate < APP_TODAY;
}

export function memberName(members: Member[], memberId: string) {
  return members.find((member) => member.id === memberId)?.name ?? "이름 없는 팀원";
}

export function recordCount(
  memberId: string,
  events: { attendance: { memberId: string }[] }[],
  ladders: { results: { memberId: string }[] }[],
) {
  const schedules = events.filter((event) =>
    event.attendance.some((row) => row.memberId === memberId),
  ).length;
  const games = ladders.filter((game) =>
    game.results.some((row) => row.memberId === memberId),
  ).length;
  return { schedules, games };
}
