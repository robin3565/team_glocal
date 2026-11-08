import type { AttendanceStatus } from "@/lib/types";
import { attendanceLabel } from "@/lib/format";

const tone: Record<AttendanceStatus, string> = {
  going: "bg-green-soft text-green",
  absent: "bg-persimmon-soft text-persimmon",
  undecided: "bg-[#efe6d4] text-muted",
};

export function StatusPill({ status }: { status: AttendanceStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone[status]}`}>
      {attendanceLabel(status)}
    </span>
  );
}
