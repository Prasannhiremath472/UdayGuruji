import { useTranslation } from 'react-i18next';
import { translatePlanet } from '../../i18n/astrologyTerms';
import './NorthIndianChart.css';

// North Indian style diamond chart: 12 fixed house label positions: the
// four corner triangles, four edge triangles and four inner triangles
// created by the two diagonals and the inner diamond outline drawn below.
const LABEL_POSITIONS = {
  1: [150, 60],
  2: [90, 40],
  3: [40, 90],
  4: [90, 150],
  5: [40, 210],
  6: [90, 260],
  7: [90, 340],
  8: [90, 400],
  9: [190, 340],
  10: [220, 150],
  11: [250, 60],
  12: [210, 40],
};

export default function NorthIndianChart({ houses, title }) {
  const { i18n } = useTranslation();

  return (
    <figure className="chart-figure">
      {title ? <figcaption className="chart-title">{title}</figcaption> : null}
      <svg viewBox="0 0 300 440" className="chart-svg" role="img" aria-label={title}>
        <rect x="10" y="10" width="280" height="420" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
        <polygon points="10,10 290,10 290,430 10,430" fill="none" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="10" y1="10" x2="290" y2="430" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="290" y1="10" x2="10" y2="430" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="150" y1="10" x2="10" y2="150" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="150" y1="10" x2="290" y2="150" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="150" y1="430" x2="10" y2="290" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="150" y1="430" x2="290" y2="290" stroke="var(--color-border)" strokeWidth="1" />

        {Object.entries(LABEL_POSITIONS).map(([house, [x, y]]) => {
          const planetsInHouse = (houses[house] || []).map((p) => translatePlanet(p, i18n.language));
          return (
            <text key={house} x={x} y={y} textAnchor="middle" className="chart-house-text">
              <tspan x={x} dy="0" className="chart-house-number">{house}</tspan>
              {planetsInHouse.map((p, idx) => (
                <tspan key={p + idx} x={x} dy="14">{p}</tspan>
              ))}
            </text>
          );
        })}
      </svg>
    </figure>
  );
}
