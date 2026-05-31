import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';

const AppRoutes = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </MainLayout>
);

export default AppRoutes;
