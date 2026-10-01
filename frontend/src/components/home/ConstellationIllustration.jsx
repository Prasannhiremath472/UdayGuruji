const STAR_POSITIONS = [
  [20, 30], [60, 15], [110, 45], [150, 20], [190, 55],
  [40, 80], [90, 90], [140, 85], [180, 100], [30, 120],
];

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 7], [7, 8], [5, 9],
];

/**
 * A simple constellation line-art pattern for decorative section
 * backgrounds/dividers - inline SVG, no external image dependency.
 */
export default function ConstellationIllustration({ className }) {
  return (
    <svg viewBox="0 0 220 140" className={className} role="presentation" aria-hidden="true">
      {CONNECTIONS.map(([a, b]) => {
        const [x1, y1] = STAR_POSITIONS[a];
        const [x2, y2] = STAR_POSITIONS[b];
        return (
          <line
            key={`${a}-${b}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-secondary)"
            strokeWidth="0.75"
            opacity="0.5"
          />
        );
      })}
      {STAR_POSITIONS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.5 : 1.5} fill="var(--color-secondary)" />
      ))}
    </svg>
  );
}
