import type { TeamData } from "@/lib/types";

export const seedData: TeamData = {
  viewerId: null,
  members: [
    { id: "m1", name: "김하은", role: "팀장", active: true },
    { id: "m2", name: "박서준", role: "개발", active: true },
    { id: "m3", name: "이지우", role: "디자인", active: true },
    { id: "m4", name: "최민재", role: "기획", active: true },
    { id: "m5", name: "정유나", role: "운영", active: true },
    { id: "m6", name: "한소율", role: "개발", active: true },
    { id: "m7", name: "오준호", role: "디자인", active: true },
    { id: "m8", name: "윤서아", role: "기획", active: true },
    { id: "m9", name: "배도윤", role: "개발", active: true },
    { id: "m10", name: "신예린", role: "운영", active: true },
    { id: "m11", name: "장우진", role: "기획", active: true },
  ],
  events: [
    {
      id: "e1",
      title: "11월 팀 워크숍",
      date: "2026-11-14",
      time: "14:00",
      place: "성수 공유오피스 2층",
      note: "하반기 목표를 다시 맞추고, 각자 맡은 일을 한 장으로 정리합니다.",
      attendance: [
        { memberId: "m1", status: "going", memo: "진행 맡음" },
        { memberId: "m2", status: "going", memo: "발표 자료 준비" },
        { memberId: "m3", status: "undecided", memo: "" },
        { memberId: "m4", status: "absent", memo: "외부 미팅" },
        { memberId: "m5", status: "undecided", memo: "" },
        { memberId: "m6", status: "undecided", memo: "" },
        { memberId: "m7", status: "undecided", memo: "" },
        { memberId: "m8", status: "undecided", memo: "" },
        { memberId: "m9", status: "undecided", memo: "" },
        { memberId: "m10", status: "undecided", memo: "" },
        { memberId: "m11", status: "undecided", memo: "" },
      ],
    },
    {
      id: "e2",
      title: "송년회",
      date: "2026-12-19",
      time: "18:30",
      place: "을지로 골목",
      note: "한 해를 마무리합니다. 2차 장소는 추첨으로 정할 예정이에요.",
      attendance: [
        { memberId: "m1", status: "going", memo: "" },
        { memberId: "m2", status: "undecided", memo: "" },
        { memberId: "m3", status: "undecided", memo: "" },
        { memberId: "m4", status: "going", memo: "케이크 예약" },
        { memberId: "m5", status: "undecided", memo: "" },
        { memberId: "m6", status: "undecided", memo: "" },
        { memberId: "m7", status: "undecided", memo: "" },
        { memberId: "m8", status: "undecided", memo: "" },
        { memberId: "m9", status: "undecided", memo: "" },
        { memberId: "m10", status: "undecided", memo: "" },
        { memberId: "m11", status: "undecided", memo: "" },
      ],
    },
    {
      id: "e3",
      title: "10월 회고",
      date: "2026-10-16",
      time: "16:00",
      place: "회의실 A",
      note: "스프린트를 돌아보고 회식 메뉴를 정했습니다.",
      attendance: [
        { memberId: "m1", status: "going", memo: "" },
        { memberId: "m2", status: "going", memo: "" },
        { memberId: "m3", status: "going", memo: "" },
        { memberId: "m4", status: "absent", memo: "반차" },
        { memberId: "m5", status: "going", memo: "마지막 회고" },
      ],
    },
  ],
  ladders: [],
  dice: [],
};

export function cloneSeed(): TeamData {
  return structuredClone(seedData);
}
