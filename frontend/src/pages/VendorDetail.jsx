import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import api from '../api/client';
import DocUpload from '../components/DocUpload';
import ApprovalPanel from '../components/ApprovalPanel';
import ChatAgent from '../components/ChatAgent';

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVendor = useCallback(async () => {
    try {
      const res = await api.get(`/api/vendors/${id}`);
      setVendor(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void fetchVendor();
    }, 0);
    const interval = window.setInterval(() => {
      void fetchVendor();
    }, 15000);

    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [fetchVendor]);

  if (loading && !vendor) return <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!vendor) return <div className="text-center py-32 text-dark-500 text-lg">Vendor not found.</div>;

  const totalDocs = vendor.documents?.length || 0;
  const receivedDocs = vendor.documents?.filter(d => d.status === 'Received').length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative">
      <div className="mb-12 relative z-10">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-dark-400 hover:text-primary-400 transition-colors mb-6 uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-display font-bold text-white tracking-tight">{vendor.company_name}</h1>
            <p className="text-lg text-primary-400 mt-2 font-medium">{vendor.vendor_type} • <span className="text-dark-400">{vendor.contact_email}</span></p>
          </div>
          <div className="bg-dark-800 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm self-start md:self-auto border border-dark-700 shadow-inner">
            {vendor.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="card-panel p-8 md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-dark-700">
              <div>
                <h2 className="text-3xl font-display font-bold text-white">Document Requirements</h2>
                <p className="text-dark-400 mt-2">Intelligently extracted and validated.</p>
              </div>
              <div className="mt-4 sm:mt-0 bg-dark-900 border border-dark-700 text-primary-400 px-5 py-2 rounded-full font-bold shadow-inner">
                {receivedDocs} / {totalDocs} Complete
              </div>
            </div>

            <div className="space-y-6">
              {vendor.documents?.map((doc, idx) => (
                <div key={idx} className={`p-6 rounded-3xl border transition-colors ${doc.status === 'Received' ? 'border-emerald-900/50 bg-emerald-900/10' : 'border-dark-700 bg-dark-900/50'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className={`mt-1 flex-shrink-0 ${doc.status === 'Received' ? 'text-emerald-500' : 'text-primary-500'}`}>
                        {doc.status === 'Received' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{doc.name}</h4>
                        {doc.status === 'Received' && doc.extracted_data ? (
                          <div className="mt-3 space-y-2 text-sm text-dark-300">
                            <p><strong className="text-dark-100">Validation:</strong> {doc.extracted_data.valid ? 'Passed' : 'Failed'}</p>
                            {doc.extracted_data.expiry_date && <p><strong className="text-dark-100">Expiry Date:</strong> {doc.extracted_data.expiry_date}</p>}
                            {doc.extracted_data.registration_number && <p><strong className="text-dark-100">Reg Number:</strong> {doc.extracted_data.registration_number}</p>}
                          </div>
                        ) : (
                          <p className="text-primary-400 font-medium mt-1">Pending Submission</p>
                        )}
                      </div>
                    </div>
                    {doc.status !== 'Received' && (
                      <div className="sm:ml-auto">
                        <DocUpload vendorId={vendor.id} docName={doc.name} onUploadSuccess={fetchVendor} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ApprovalPanel vendorId={vendor.id} currentStatus={vendor.status} onStatusChange={fetchVendor} />
        </div>

        <div className="space-y-10">
          <ChatAgent />
        </div>
      </div>
    </div>
  );
}
