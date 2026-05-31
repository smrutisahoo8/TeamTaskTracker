import { HealthResponse } from '../types';

interface HealthCardProps {
  health: HealthResponse | null;
  loading: boolean;
  error: string | null;
}

const HealthCard = ({ health, loading, error }: HealthCardProps) => {
  return (
    <section>
      <h2>API Health</h2>
      {loading && <p>Checking API status...</p>}
      {error && <p>{error}</p>}
      {health && (
        <div>
          <p>Status: {health.success ? 'Online' : 'Offline'}</p>
          <p>Message: {health.message}</p>
        </div>
      )}
    </section>
  );
};

export default HealthCard;
