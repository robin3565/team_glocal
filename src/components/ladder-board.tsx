const winnerColor = "#1f6b4a";
const pathColors = ["#1f6b4a", "#d85a2a", "#2457c5", "#8a4b1f", "#6b3fa0", "#0e7490"];

export function LadderBoard({
  names,
  prizes,
  links,
  reveal,
}: {
  names: string[];
  prizes: string[];
  links: boolean[][];
  reveal: boolean;
}) {
  const columnWidth = 56;
  const rowHeight = 28;
  const width = Math.max(names.length, 1) * columnWidth;
  const height = Math.max(links.length, 1) * rowHeight;
  const winnerDraw = prizes.includes("당첨");

  const xOf = (column: number) => columnWidth / 2 + column * columnWidth;

  const paths = names.map((_, start) => {
    const points: string[] = [];
    let column = start;
    points.push(`${xOf(column)},0`);
    links.forEach((line, row) => {
      const y = rowHeight / 2 + row * rowHeight;
      points.push(`${xOf(column)},${y}`);
      if (column > 0 && line[column - 1]) column -= 1;
      else if (column < line.length && line[column]) column += 1;
      points.push(`${xOf(column)},${y}`);
    });
    points.push(`${xOf(column)},${height}`);
    return { points: points.join(" "), end: column };
  });

  return (
    <div className="w-full">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${names.length}, minmax(0, 1fr))` }}>
        {names.map((name, index) => (
          <p
            key={`${name}-${index}`}
            className="mx-auto h-14 text-[11px] font-semibold leading-none [text-orientation:upright] [writing-mode:vertical-rl]"
          >
            {name}
          </p>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="사다리 그림"
        className="mt-2 h-auto w-full"
      >
        {names.map((_, column) => (
          <line
            key={column}
            x1={xOf(column)}
            x2={xOf(column)}
            y1={0}
            y2={height}
            stroke="#c9b89a"
            strokeWidth="3"
          />
        ))}
        {links.map((line, row) =>
          line.map((rung, column) =>
            rung ? (
              <line
                key={`${row}-${column}`}
                x1={xOf(column)}
                x2={xOf(column + 1)}
                y1={rowHeight / 2 + row * rowHeight}
                y2={rowHeight / 2 + row * rowHeight}
                stroke="#c9b89a"
                strokeWidth="3"
              />
            ) : null,
          ),
        )}
        {reveal
          ? paths.map((path, index) => {
              const won = prizes[path.end] === "당첨";
              if (winnerDraw && !won) return null;
              return (
                <polyline
                  key={index}
                  points={path.points}
                  fill="none"
                  stroke={winnerDraw ? winnerColor : pathColors[index % pathColors.length]}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ladder-path"
                />
              );
            })
          : null}
      </svg>
      <div
        className="grid pt-1"
        style={{ gridTemplateColumns: `repeat(${prizes.length}, minmax(0, 1fr))` }}
      >
        {prizes.map((prize, index) => (
          <p
            key={`${prize}-${index}`}
            className={`mx-auto h-10 text-[11px] leading-none [text-orientation:upright] [writing-mode:vertical-rl] ${
              prize === "당첨" ? "font-bold text-green" : "text-muted"
            }`}
          >
            {prize}
          </p>
        ))}
      </div>
    </div>
  );
}
