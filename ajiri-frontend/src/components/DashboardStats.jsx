import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import apiService from '../services/api';

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    successfulProcessing: 0,
    avgProcessingTime: 0,
    totalDataProcessed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiService.getDocumentStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.totalDocuments || 0,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Success Rate',
      value: stats.totalDocuments ? Math.round((stats.successfulProcessing / stats.totalDocuments) * 100) + '%' : '0%',
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Avg Processing Time',
      value: stats.avgProcessingTime ? Math.round(stats.avgProcessingTime) + 'ms' : '0ms',
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-8%'
    },
    {
      title: 'Data Processed',
      value: formatFileSize(stats.totalDataProcessed),
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+23%'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {statCards.map((stat, index) => (
        <div key={index} className="rounded-xl border bg-gradient-to-br from-white to-blue-50 text-card-foreground shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-700">{stat.title}</h3>
            <div className="p-2 rounded-lg bg-blue-100">
              <stat.icon className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-600">
              <span className="text-emerald-600 font-medium">{stat.change}</span> from last month
            </p>
          </div>
        </div>
      ))}
    </>
  );
}