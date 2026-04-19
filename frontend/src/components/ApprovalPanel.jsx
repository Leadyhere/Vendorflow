import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import api from '../api/client';

export default function ApprovalPanel({ vendorId, currentStatus, onStatusChange }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async (type) => {
    setLoading(type);
    try {
      await api.post(`/api/vendors/${vendorId}/approve`, null, { params: { approver_type: type } });
      onStatusChange();
    } catch (err) {
      console.error(err);
      alert('Approval scheduling failed');
    } finally {
      setLoading(false);
    }
  };

  const isUnderReview = currentStatus === 'Under review';
  const pendingLegal = currentStatus === 'Pending Legal Approval';
  const pendingFinance = currentStatus === 'Pending Finance Approval';

  return (
    <div className="card-panel p-8 md:p-10">
      <h3 className="text-3xl font-display font-bold text-white mb-8 pb-6 border-b border-dark-700">Approval Routing</h3>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-[1.5rem] border border-dark-700 bg-dark-900/50">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full">
            <div className={`p-3 rounded-2xl ${pendingFinance || currentStatus === 'Approved' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50' : 'bg-dark-800 text-dark-500 border border-dark-700 shadow-inner'}`}>
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">Legal Team</p>
              <p className="text-sm font-medium text-dark-400">Requires SOC2 and NDA validation</p>
            </div>
          </div>
          <button 
            onClick={() => handleApprove('Legal')}
            disabled={!isUnderReview || loading}
            className="btn-secondary w-full sm:w-auto flex-shrink-0"
          >
            {loading === 'Legal' ? 'Scheduling...' : 'Request Approval'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-[1.5rem] border border-dark-700 bg-dark-900/50">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full">
            <div className={`p-3 rounded-2xl ${currentStatus === 'Approved' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50' : 'bg-dark-800 text-dark-500 border border-dark-700 shadow-inner'}`}>
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">Finance Team</p>
              <p className="text-sm font-medium text-dark-400">Requires Bank Details validation</p>
            </div>
          </div>
          <button 
            onClick={() => handleApprove('Finance')}
            disabled={!pendingLegal || loading}
            className="btn-secondary w-full sm:w-auto flex-shrink-0"
          >
            {loading === 'Finance' ? 'Scheduling...' : 'Request Approval'}
          </button>
        </div>
      </div>
    </div>
  );
}
