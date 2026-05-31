import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <section className="page-home">
      <div className="hero-card">
        <div>
          <h1>Team Task Tracker</h1>
          <p>Manage tasks, projects, and users from a secure team workspace.</p>
          <div className="hero-actions">
            <Link to="/login" className="button button-primary">
              Sign In
            </Link>
            <Link to="/register" className="button button-secondary">
              Register
            </Link>
          </div>
        </div>
        <HealthCard health={health} loading={isLoading} error={error} />
      </div>
    </section>
  );
};

export default HomePage;
