import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Briefcase, FileCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import api from '../api/client';
import DocUpload from '../components/DocUpload';
import ApprovalPanel from '../components/ApprovalPanel';
import ChatAgent from '../components/ChatAgent';

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVendor = async () => {
    try {
      const res = await api.get(`/api/vendors/${id}`);
      setVendor(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
    // Poll for updates (e.g. background job status change)
    const interval = setInterval(fetchVendor, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !vendor) return <div className="flex justify-center p-12"><div className="animate-pulse flex space-x-4"><div className="w-12 h-12 bg-surface-200 rounded-full"></div></div></div>;
  if (!vendor) return <div className="text-center p-12 text-surface-500">Vendor not found</div>;

  const totalDocs = vendor.documents?.length || 0;
  const receivedDocs = vendor.documents?.filter(d => d.status === 'Received').length || 0;
  const isComplete = totalDocs > 0 && receivedDocs === totalDocs;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-surface-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{vendor.company_name}</h1>
          <div className="flex items-center space-x-3 mt-1 text-sm text-surface-500">
            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" />{vendor.vendor_type}</span>
            <span>•</span>
            <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{vendor.contact_email}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Document Checklist */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-surface-900 flex items-center">
                  <FileCheck className="w-5 h-5 mr-2 text-brand-600" />
                  Document Checklist
                </h2>
                <p className="text-sm text-surface-500 mt-1">
                  {receivedDocs} of {totalDocs} documents securely extracted and validated by AI
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                  {Math.round((receivedDocs / totalDocs) * 100)}% Complete
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {vendor.documents?.map((doc, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${doc.status === 'Received' ? 'border-emerald-200 bg-emerald-50/30' : 'border-surface-200 bg-white'} transition-colors`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {doc.status === 'Received' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium text-surface-900">{doc.name}</h4>
                        {doc.status === 'Received' && doc.extracted_data ? (
                          <div className="mt-2 text-sm text-surface-600 space-y-1">
                            <p><span className="font-medium text-surface-900">Extracted Valid:</span> {doc.extracted_data.valid ? 'Yes ✅' : 'No ❌'}</p>
                            {doc.extracted_data.expiry_date && <p><span className="font-medium text-surface-900">Expiry:</span> {doc.extracted_data.expiry_date}</p>}
                            {doc.extracted_data.registration_number && <p><span className="font-medium text-surface-900">Reg No:</span> {doc.extracted_data.registration_number}</p>}
                          </div>
                        ) : (
                          <p className="text-sm text-amber-600 mt-1">Awaiting upload</p>
                        )}
                      </div>
                    </div>
                    {doc.status !== 'Received' && (
                      <DocUpload vendorId={vendor.id} docName={doc.name} onUploadSuccess={fetchVendor} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ApprovalPanel vendorId={vendor.id} currentStatus={vendor.status} onStatusChange={fetchVendor} />
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-6 bg-gradient-to-br from-surface-900 to-surface-800 text-white">
            <h3 className="font-semibold text-surface-100 mb-4">Onboarding Status</h3>
            <div className="text-3xl font-display font-bold mb-2">{vendor.status}</div>
            <p className="text-sm text-surface-400">Vendor ID: {vendor.id}</p>
          </div>

          <ChatAgent />
        </div>
      </div>
    </div>
  );
}
