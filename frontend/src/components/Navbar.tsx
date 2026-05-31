import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { auth, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="brand">Team Task Tracker</div>
      <div className="nav-links">
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/" end>
          Home
        </NavLink>
        {auth.accessToken ? (
          <>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/tasks">
              Tasks
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/projects">
              Projects
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/users">
              Users
            </NavLink>
            <button className="button button-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/login">
              Login
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/register">
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
