import { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
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
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Approval Routing</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 bg-surface-50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${pendingFinance || currentStatus === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-surface-200 text-surface-500'}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-surface-900">Legal Team</p>
              <p className="text-sm text-surface-500">Requires SOC2 and NDA validation</p>
            </div>
          </div>
          <button 
            onClick={() => handleApprove('Legal')}
            disabled={!isUnderReview || loading}
            className="btn-secondary"
          >
            {loading === 'Legal' ? 'Scheduling...' : 'Request Legal Approval'}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-surface-200 bg-surface-50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${currentStatus === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-surface-200 text-surface-500'}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-surface-900">Finance Team</p>
              <p className="text-sm text-surface-500">Requires Bank Details validation</p>
            </div>
          </div>
          <button 
            onClick={() => handleApprove('Finance')}
            disabled={!pendingLegal || loading}
            className="btn-secondary"
          >
            {loading === 'Finance' ? 'Scheduling...' : 'Request Finance Approval'}
          </button>
        </div>
      </div>
    </div>
  );
}
