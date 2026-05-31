import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">{children}</main>
    </div>
  );
};

export default MainLayout;
