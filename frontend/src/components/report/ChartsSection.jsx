import { useTranslation } from 'react-i18next';
import NorthIndianChart from './NorthIndianChart';
import { groupPlanetsByHouse, chartJsonToHouseMap } from '../../utils/kundaliTransform';
import './ReportSections.css';

export default function ChartsSection({ planets, charts }) {
  const { t } = useTranslation();

  const d1Houses = groupPlanetsByHouse(planets);
  const d9Chart = (charts || []).find((c) => c.chart_type === 'D9');
  const otherCharts = (charts || []).filter((c) => c.chart_type !== 'D1' && c.chart_type !== 'D9');

  return (
    <section className="report-section">
      <h2 className="report-section-title">{t('report.divisionalCharts')}</h2>
      <div className="charts-grid">
        <NorthIndianChart houses={d1Houses} title={t('report.rashiChart')} />
        {d9Chart ? (
          <NorthIndianChart
            houses={chartJsonToHouseMap(
              typeof d9Chart.chart_json === 'string' ? JSON.parse(d9Chart.chart_json) : d9Chart.chart_json
            )}
            title={t('report.navamsaChart')}
          />
        ) : null}
        {otherCharts.map((chart) => (
          <NorthIndianChart
            key={chart.id}
            houses={chartJsonToHouseMap(
              typeof chart.chart_json === 'string' ? JSON.parse(chart.chart_json) : chart.chart_json
            )}
            title={chart.chart_type}
          />
        ))}
      </div>
    </section>
  );
}
