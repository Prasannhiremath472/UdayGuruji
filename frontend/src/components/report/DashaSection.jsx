import { useTranslation } from 'react-i18next';
import { translatePlanet } from '../../i18n/astrologyTerms';
import { buildDashaTree } from '../../utils/kundaliTransform';
import './ReportSections.css';

function DashaRow({ node, lang, t }) {
  return (
    <>
      <tr>
        <td data-label={t('report.mahadasha')}>{translatePlanet(node.planet, lang)}</td>
        <td data-label={t('report.startDate')}>{node.start_date}</td>
        <td data-label={t('report.endDate')}>{node.end_date}</td>
      </tr>
      {(node.children || []).map((child) => (
        <tr key={child.id} className="dasha-sub-row">
          <td data-label={t('report.antardasha')}>&nbsp;&nbsp;&rarr; {translatePlanet(child.planet, lang)}</td>
          <td data-label={t('report.startDate')}>{child.start_date}</td>
          <td data-label={t('report.endDate')}>{child.end_date}</td>
        </tr>
      ))}
    </>
  );
}

export default function DashaSection({ dashas }) {
  const { t, i18n } = useTranslation();
  const tree = buildDashaTree(dashas);

  if (!tree || tree.length === 0) {
    return (
      <section className="report-section">
        <h2 className="report-section-title">{t('report.vimshottariDasha')}</h2>
        <p className="report-no-data">{t('report.noData')}</p>
      </section>
    );
  }

  const currentMahadasha = tree.find((node) => node.ai_narrative);

  return (
    <section className="report-section">
      <h2 className="report-section-title">{t('report.vimshottariDasha')}</h2>
      {currentMahadasha ? (
        <div className="dasha-narrative-callout">
          <h3 className="report-subsection-title">
            {t('report.currentDashaOutlook', { planet: translatePlanet(currentMahadasha.planet, i18n.language) })}
          </h3>
          <p className="ai-generated-text">{currentMahadasha.ai_narrative}</p>
          <p className="ai-disclaimer">{t('report.aiDisclaimer')}</p>
        </div>
      ) : null}
      <table className="report-table">
        <thead>
          <tr>
            <th>{t('report.mahadasha')}</th>
            <th>{t('report.startDate')}</th>
            <th>{t('report.endDate')}</th>
          </tr>
        </thead>
        <tbody>
          {tree.map((node) => (
            <DashaRow key={node.id} node={node} lang={i18n.language} t={t} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
