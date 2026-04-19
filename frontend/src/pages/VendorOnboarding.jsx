import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto animate-fade-in mt-12 mb-20 relative">
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Onboard New Vendor</h1>
        <p className="text-dark-400 mt-4 text-lg">Enter the vendor details below. Our AI will seamlessly generate their onboarding requirements.</p>
      </div>

      <div className="card-panel p-10 md:p-12 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-dark-400 mb-2 uppercase tracking-widest">Company Name</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g. Acme Corporation"
              value={formData.company_name}
              onChange={e => setFormData({...formData, company_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-400 mb-2 uppercase tracking-widest">Primary Contact</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="e.g. contact@acme.com"
              value={formData.contact_email}
              onChange={e => setFormData({...formData, contact_email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-400 mb-2 uppercase tracking-widest">Vendor Type</label>
            <select
              className="input-field appearance-none"
              value={formData.vendor_type}
              onChange={e => setFormData({...formData, vendor_type: e.target.value})}
            >
              <option value="Goods">Goods Supplier</option>
              <option value="Services">Services Provider</option>
              <option value="IT">IT / Software Vendor</option>
            </select>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Generating Checklist...
                </>
              ) : (
                <>
                  Continue to Checklist
                  <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
