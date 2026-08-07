import { useState, useEffect, useCallback } from 'react';
import { Users, FileClock, CheckCircle, TrendingUp } from 'lucide-react';
import api from '../api/client';
import StatusCard from '../components/StatusCard';

export default function Dashboard() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = useCallback(async () => {
    try {
      const res = await api.get('/api/vendors');
      setVendors(res.data.vendors || []);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchVendors();
    }, 0);
    const interval = window.setInterval(() => {
      void fetchVendors();
    }, 30000);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [fetchVendors]);

  const pendingCount = vendors.filter(v => v.status === 'Documents pending').length;
  const approvedCount = vendors.filter(v => v.status === 'Approved').length;

  return (
    <div>
      <div className="text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight">
            Where Procurement<br/>Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Efficiency</span>
          </h1>
          <p className="text-xl text-dark-300 max-w-2xl mx-auto font-light leading-relaxed">
            Transform your vendor onboarding process. We blend AI, automation, and intelligent routing to create a seamless experience.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Vendors', value: vendors.length, icon: Users },
            { label: 'Pending Docs', value: pendingCount, icon: FileClock },
            { label: 'Approved', value: approvedCount, icon: CheckCircle },
            { label: 'Avg Onboarding', value: '4.2 Days', icon: TrendingUp },
          ].map((metric, i) => (
            <div key={i} className="card-panel p-8 text-center flex flex-col items-center justify-center space-y-4 hover:scale-[1.03] transition-transform duration-300 hover:border-primary-500/30">
              <div className="p-4 rounded-2xl bg-dark-900 border border-dark-700 text-primary-400 shadow-inner">
                <metric.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-white">{metric.value}</p>
                <p className="text-sm font-medium text-dark-400 uppercase tracking-wider mt-2">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-white">Our Vendors</h2>
          <p className="text-dark-400 mt-4 text-lg">Active onboarding workflows at a glance.</p>
        </div>
        
        {vendors.length === 0 && !loading ? (
          <div className="card-panel p-16 text-center max-w-2xl mx-auto border-2 border-dashed border-dark-700 bg-dark-900">
            <h3 className="text-2xl font-display font-bold text-white">No vendors found</h3>
            <p className="text-dark-400 mt-2 text-lg">Start by onboarding a new vendor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map(v => (
              <StatusCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
