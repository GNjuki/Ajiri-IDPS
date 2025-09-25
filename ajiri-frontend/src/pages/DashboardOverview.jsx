import { useAuth } from '../context/AuthContext';
import { DashboardStats } from '../components/DashboardStats';
import { RecentDocuments } from '../components/RecentDocuments';
import { DocumentArrowUpIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export function DashboardOverview() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Process Documents',
      description: 'Upload and analyze documents with AI-powered OCR',
      icon: DocumentArrowUpIcon,
      path: '/dashboard/upload'
    }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.firstName || (user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}` : user?.username?.split('@')[0] || user?.username)}!
        </h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-xl border bg-gradient-to-br from-white to-indigo-50 text-card-foreground shadow-lg">
            <div className="flex flex-col space-y-1.5 p-6 border-b border-indigo-100">
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-600">Get started with document processing</p>
            </div>
            <div className="p-6 pt-0">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="flex items-center justify-between rounded-lg border border-blue-200 p-4 hover:bg-blue-50 transition-colors bg-gradient-to-r from-white to-blue-25"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <RecentDocuments />
        </div>
      </div>
    </div>
  );
}