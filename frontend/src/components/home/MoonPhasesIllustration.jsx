const PHASES = [0, 0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25];

function MoonPhase({ cx, cy, r, phase }) {
  // phase: 0 = new moon (dark), 0.5 = full moon (lit), 1 = new again.
  const litFraction = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
  const clipId = `moon-clip-${cx}-${cy}`;

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--color-border)" />
      <clipPath id={clipId}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <ellipse
        cx={cx}
        cy={cy}
        rx={r * litFraction}
        ry={r}
        fill="var(--color-secondary)"
        clipPath={`url(#${clipId})`}
      />
    </g>
  );
}

/**
 * A simple lunar-phase strip illustration, purely decorative, built from
 * inline SVG circles/ellipses - no external image dependency.
 */
export default function MoonPhasesIllustration({ className }) {
  const spacing = 50;
  const radius = 18;
  const width = PHASES.length * spacing;

  return (
    <svg viewBox={`0 0 ${width} 50`} className={className} role="presentation" aria-hidden="true">
      {PHASES.map((phase, i) => (
        <MoonPhase key={i} cx={spacing * i + spacing / 2} cy={25} r={radius} phase={phase} />
      ))}
    </svg>
  );
}
