import { useState, useEffect } from 'react';
import { Users, FileClock, CheckCircle, TrendingUp } from 'lucide-react';
import api from '../api/client';
import StatusCard from '../components/StatusCard';

export default function Dashboard() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
    // Poll every 30 seconds as requested
    const interval = setInterval(fetchVendors, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await api.get('/api/vendors');
      setVendors(res.data.vendors || []);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = vendors.filter(v => v.status === 'Documents pending').length;
  const approvedCount = vendors.filter(v => v.status === 'Approved').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Procurement Dashboard</h1>
          <p className="text-surface-500 mt-1">Monitor and manage all vendor onboarding workflows.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: vendors.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Docs', value: pendingCount, icon: FileClock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approved', value: approvedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Onboarding', value: '4.2 Days', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((metric, i) => (
          <div key={i} className="glass-panel p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-500">{metric.label}</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{metric.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${metric.bg}`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Vendor Grid */}
      <div>
        <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center">
          Active Onboardings
          {loading && <span className="ml-3 text-sm font-normal text-surface-400 animate-pulse">Syncing...</span>}
        </h2>
        
        {vendors.length === 0 && !loading ? (
          <div className="glass-panel p-12 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="text-lg font-medium text-surface-900">No vendors found</h3>
            <p className="text-surface-500 mt-1 max-w-sm mx-auto">Start by onboarding a new vendor to see them appear on your dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map(v => (
              <StatusCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
