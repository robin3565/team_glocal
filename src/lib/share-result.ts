import { memberName } from "@/lib/format";
import { winningResults } from "@/lib/ladder";
import type { LadderResult, Member } from "@/lib/types";

export function ladderShareText(title: string, results: LadderResult[], members: Member[]) {
  const shown = winningResults(results);
  const winnersOnly = shown.length < results.length;
  const lines = shown.map((result) =>
    winnersOnly ? memberName(members, result.memberId) : `${memberName(members, result.memberId)} ${result.prize}`,
  );
  return `${title}\n${winnersOnly ? "당첨" : "결과"}\n${lines.join("\n")}`;
}

export async function shareLadderText(title: string, text: string) {
  if (typeof navigator.share === "function") {
    await navigator.share({ title, text });
    return "shared" as const;
  }
  await navigator.clipboard.writeText(text);
  return "copied" as const;
}
