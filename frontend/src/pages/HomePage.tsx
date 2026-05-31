import { useEffect, useState } from 'react';
import HealthCard from '../components/HealthCard';
import { getHealthStatus } from '../api/health.api';
import { HealthResponse } from '../types';

const HomePage = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealthStatus()
      .then((response) => {
        setHealth(response);
      })
      .catch(() => {
        setError('Unable to reach API.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main>
      <h1>Team Task Tracker</h1>
      <p>Foundation setup for Phase 1.</p>
      <HealthCard health={health} loading={isLoading} error={error} />
    </main>
  );
};

export default HomePage;
