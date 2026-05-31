import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const DashboardPage = () => {
  const { auth } = useAppContext();

  return (
    <section className="card">
      <h2>Dashboard</h2>
      <p>Welcome back, {auth.user?.fullName ?? 'Team member'}.</p>
      <div className="section-grid">
        <div className="card message-bar">
          <h3>Account</h3>
          <p>
            Role: <strong>{auth.user?.role}</strong>
          </p>
          <p>
            Organization: <strong>{auth.user?.organizationId}</strong>
          </p>
        </div>
        <div className="card message-bar">
          <h3>Quick actions</h3>
          <Link className="button button-primary" to="/tasks">
            View Tasks
          </Link>
          <Link className="button button-secondary" to="/projects">
            View Projects
          </Link>
          <Link className="button button-secondary" to="/users">
            View Team
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
