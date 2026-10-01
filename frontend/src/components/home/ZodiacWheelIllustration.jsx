const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

/**
 * A decorative Vedic-style zodiac wheel built entirely from inline SVG
 * shapes/text - no external image, so no licensing concerns and it
 * inherits the brand color tokens automatically in both themes.
 */
export default function ZodiacWheelIllustration({ className }) {
  const center = 200;
  const outerR = 180;
  const midR = 140;
  const innerR = 90;

  const segments = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Zodiac wheel illustration">
      <circle cx={center} cy={center} r={outerR} fill="none" stroke="var(--color-secondary)" strokeWidth="2" />
      <circle cx={center} cy={center} r={midR} fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
      <circle cx={center} cy={center} r={innerR} fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2" />

      {segments.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = center + midR * Math.cos(rad);
        const y1 = center + midR * Math.sin(rad);
        const x2 = center + outerR * Math.cos(rad);
        const y2 = center + outerR * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-border)" strokeWidth="1" />;
      })}

      {segments.map((angle, i) => {
        const rad = ((angle + 15) * Math.PI) / 180;
        const r = (midR + outerR) / 2;
        const x = center + r * Math.cos(rad);
        const y = center + r * Math.sin(rad);
        return (
          <text
            key={angle}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
            fill="var(--color-primary)"
          >
            {SIGN_SYMBOLS[i]}
          </text>
        );
      })}

      <circle cx={center} cy={center} r="6" fill="var(--color-secondary)" />

      {/* Small decorative stars scattered inside the inner circle, placed
          with the golden-angle spiral so they look organically distributed
          without overlapping the center point. */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = i * 137.5 * (Math.PI / 180);
        const r = (innerR - 20) * Math.sqrt(i / 24);
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r="1.5" fill="var(--color-secondary)" opacity="0.6" />;
      })}
    </svg>
  );
}
