import type { LadderRecord, LadderResult } from "@/lib/types";

export function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = next[index];
    next[index] = next[swap];
    next[swap] = current;
  }
  return next;
}

export function buildLinks(count: number, rows: number, random: () => number) {
  const gaps = Math.max(count - 1, 0);
  const links: boolean[][] = [];

  for (let row = 0; row < rows; row += 1) {
    const line = Array.from({ length: gaps }, () => false);
    const order = shuffle(
      Array.from({ length: gaps }, (_, index) => index),
      random,
    );
    for (const gap of order) {
      if (line[gap - 1] || line[gap + 1]) continue;
      if (random() < 0.5) line[gap] = true;
    }
    links.push(line);
  }

  if (links.every((line) => line.every((rung) => !rung)) && gaps > 0) {
    links[0][Math.floor(random() * gaps)] = true;
  }

  return links;
}

export function traceColumn(start: number, links: boolean[][]) {
  let column = start;
  for (const line of links) {
    if (column > 0 && line[column - 1]) column -= 1;
    else if (column < line.length && line[column]) column += 1;
  }
  return column;
}

export function createLadder(
  order: string[],
  prizes: string[],
  seed: number,
  rows = Math.max(8, order.length),
): Pick<LadderRecord, "order" | "prizes" | "links" | "results"> {
  const random = createRng(seed);
  const links = buildLinks(order.length, rows, random);
  const placed = shuffle(prizes, random);
  const results: LadderResult[] = order.map((memberId, start) => ({
    memberId,
    prize: placed[traceColumn(start, links)] ?? "",
  }));

  return { order, prizes: placed, links, results };
}

export function winningResults<T extends { prize: string }>(results: T[]) {
  const winners = results.filter((result) => result.prize === "당첨");
  return winners.length > 0 ? winners : results;
}

export function tallyByMember(ladders: { results: LadderResult[] }[]) {
  const counts = new Map<string, Map<string, number>>();

  for (const game of ladders) {
    for (const result of game.results) {
      const prizes = counts.get(result.memberId) ?? new Map<string, number>();
      prizes.set(result.prize, (prizes.get(result.prize) ?? 0) + 1);
      counts.set(result.memberId, prizes);
    }
  }

  return counts;
}

export function tallyEntries(prizes: Map<string, number> | undefined) {
  if (!prizes) return [];
  return [...prizes.entries()]
    .filter(([prize]) => prize !== "꽝")
    .sort(([left, leftCount], [right, rightCount]) => {
      const rank = (prize: string) => (prize === "당첨" ? 0 : 1);
      return rank(left) - rank(right) || rightCount - leftCount || left.localeCompare(right, "ko");
    });
}
