import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import CreateReference from './pages/CreateReference';
import ReferenceList from './pages/ReferenceList';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateReference />} />
        <Route path="/references" element={<ReferenceList />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


