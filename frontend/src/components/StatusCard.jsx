import { Link } from 'react-router-dom';
import { Building2, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import clsx from 'clsx';

export default function StatusCard({ vendor }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'documents pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'under review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
      case 'issues found':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-surface-50 text-surface-600 border-surface-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'documents pending':
        return <Clock className="w-4 h-4 mr-1.5" />;
      case 'under review':
        return <FileText className="w-4 h-4 mr-1.5" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'rejected':
      case 'issues found':
        return <AlertCircle className="w-4 h-4 mr-1.5" />;
      default:
        return <Clock className="w-4 h-4 mr-1.5" />;
    }
  };

  const receivedDocs = vendor.documents?.filter(d => d.status === 'Received').length || 0;
  const totalDocs = vendor.documents?.length || 0;
  const progress = totalDocs > 0 ? (receivedDocs / totalDocs) * 100 : 0;

  return (
    <Link to={`/vendor/${vendor.id}`} className="block group">
      <div className="glass-panel p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-200 relative overflow-hidden">
        {/* Progress Bar Background */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }} 
        />
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-surface-50 rounded-xl group-hover:bg-brand-50 transition-colors">
              <Building2 className="w-5 h-5 text-surface-500 group-hover:text-brand-600 transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 group-hover:text-brand-700 transition-colors">
                {vendor.company_name}
              </h3>
              <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">
                {vendor.vendor_type} Vendor
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(vendor.status))}>
            {getStatusIcon(vendor.status)}
            {vendor.status}
          </div>

          <div className="flex justify-between items-end">
            <div className="text-sm text-surface-500">
              <span className="font-medium text-surface-900">{receivedDocs}</span> of {totalDocs} docs
            </div>
            <div className="text-xs text-surface-400">
              Added {new Date(vendor.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
