import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../../components/common/Card';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { getMatchById } from '../../services/matchingService';
import './MatchingResultPage.css';

export default function MatchingResultPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('accessToken');
  const { t } = useTranslation();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getMatchById(id, accessToken)
      .then(setMatch)
      .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <LoadingState />;
  if (error || !match) return <ErrorState message={error} onRetry={load} />;

  const kootas = match.koota_breakdown;
  const scorePercent = Math.round((match.total_score / match.max_score) * 100);

  return (
    <div className="matching-result-page">
      <Card>
        <div className="match-summary">
          <div className="match-names">
            <span>{match.groom_name}</span>
            <span className="match-heart">&hearts;</span>
            <span>{match.bride_name}</span>
          </div>
          <div className="match-score-circle" style={{ '--score-percent': `${scorePercent}%` }}>
            <span className="match-score-value">{match.total_score}</span>
            <span className="match-score-max">/ {match.max_score}</span>
          </div>
          <p className="match-verdict">{match.verdict}</p>
        </div>
      </Card>

      <Card title={t('matching.kootaBreakdown')}>
        <table className="report-table">
          <thead>
            <tr>
              <th>{t('matching.koota')}</th>
              <th>{t('matching.score')}</th>
              <th>{t('matching.description')}</th>
            </tr>
          </thead>
          <tbody>
            {kootas.map((k) => (
              <tr key={k.name}>
                <td data-label={t('matching.koota')}>{k.name}</td>
                <td data-label={t('matching.score')}>{k.score} / {k.maxScore}</td>
                <td data-label={t('matching.description')}>{k.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
