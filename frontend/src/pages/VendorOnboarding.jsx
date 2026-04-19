import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    vendor_type: 'Goods'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/vendors', formData);
      if (res.data.vendor_id) {
        navigate(`/vendor/${res.data.vendor_id}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Onboard New Vendor</h1>
        <p className="text-surface-500 mt-2">Enter the vendor details. Gemini AI will automatically generate the required document checklist based on the vendor type.</p>
      </div>

      <div className="glass-panel p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Company Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-5 w-5 text-surface-400" />
              </div>
              <input
                type="text"
                required
                className="input-field pl-10"
                placeholder="Acme Corporation"
                value={formData.company_name}
                onChange={e => setFormData({...formData, company_name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Primary Contact Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-surface-400" />
              </div>
              <input
                type="email"
                required
                className="input-field pl-10"
                placeholder="contact@acme.com"
                value={formData.contact_email}
                onChange={e => setFormData({...formData, contact_email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Vendor Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-surface-400" />
              </div>
              <select
                className="input-field pl-10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center] bg-[length:16px_16px]"
                value={formData.vendor_type}
                onChange={e => setFormData({...formData, vendor_type: e.target.value})}
              >
                <option value="Goods">Goods Supplier</option>
                <option value="Services">Services Provider</option>
                <option value="IT">IT / Software Vendor</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Generating AI Checklist...
                </>
              ) : (
                <>
                  Continue to Checklist
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
