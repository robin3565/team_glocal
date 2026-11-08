export type AttendanceStatus = "going" | "absent" | "undecided";

export type Member = {
  id: string;
  name: string;
  role: string;
  active: boolean;
};

export type Attendance = {
  memberId: string;
  status: AttendanceStatus;
  memo: string;
};

export type TeamEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  note: string;
  attendance: Attendance[];
};

export type LadderResult = {
  memberId: string;
  prize: string;
};

export type LadderRecord = {
  id: string;
  title: string;
  date: string;
  order: string[];
  prizes: string[];
  links: boolean[][];
  results: LadderResult[];
};

export type TeamData = {
  members: Member[];
  events: TeamEvent[];
  ladders: LadderRecord[];
  viewerId: string | null;
};
