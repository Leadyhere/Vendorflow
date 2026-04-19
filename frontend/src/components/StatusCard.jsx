import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function StatusCard({ vendor }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'documents pending':
        return 'text-amber-400 bg-amber-900/30 border border-amber-900/50';
      case 'under review':
        return 'text-primary-400 bg-primary-900/30 border border-primary-900/50';
      case 'approved':
        return 'text-emerald-400 bg-emerald-900/30 border border-emerald-900/50';
      default:
        return 'text-dark-300 bg-dark-800 border border-dark-700';
    }
  };

  const receivedDocs = vendor.documents?.filter(d => d.status === 'Received').length || 0;
  const totalDocs = vendor.documents?.length || 0;

  return (
    <Link to={`/vendor/${vendor.id}`} className="block group">
      <div className="card-panel p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-2 hover:border-primary-500/50 h-full flex flex-col">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-dark-900 border border-dark-700 text-white flex items-center justify-center font-display font-bold text-xl shadow-inner group-hover:border-primary-500/50 transition-colors">
              {vendor.company_name.charAt(0)}
            </div>
            <h3 className="text-xl font-display font-bold text-white group-hover:text-primary-400 transition-colors">
              {vendor.company_name}
            </h3>
          </div>
          <p className="text-xs font-bold text-dark-500 uppercase tracking-widest ml-16 mt-[-10px]">
            {vendor.vendor_type}
          </p>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex justify-between items-center text-sm border-b border-dark-700/50 pb-4">
            <span className="text-dark-400">Documentation</span>
            <span className="font-bold text-white">{receivedDocs} / {totalDocs}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className={clsx("inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider", getStatusColor(vendor.status))}>
              {vendor.status}
            </div>
            <span className="text-xs font-medium text-dark-500">
              {new Date(vendor.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
