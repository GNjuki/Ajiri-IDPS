import { Routes, Route } from 'react-router-dom';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardOverview } from './DashboardOverview';
import { DashboardUpload } from './DashboardUpload';

export function Dashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="lg:hidden h-16"></div>
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/upload" element={<DashboardUpload />} />
        </Routes>
      </div>
    </div>
  );
}