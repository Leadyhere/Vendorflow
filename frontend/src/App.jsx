import { Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, UserPlus } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import VendorOnboarding from './pages/VendorOnboarding';
import VendorDetail from './pages/VendorDetail';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 font-sans text-surface-900">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 glass-panel border-b-0 rounded-none bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="p-2 bg-brand-50 rounded-xl group-hover:bg-brand-100 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-brand-600" />
                </div>
                <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                  VendorFlow
                </span>
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link to="/" className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/onboard" className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-surface-600 hover:text-brand-600 transition-colors">
                  <UserPlus className="h-4 w-4" />
                  <span>New Vendor</span>
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 shadow-inner flex items-center justify-center text-white font-medium text-sm">
                P
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboard" element={<VendorOnboarding />} />
          <Route path="/vendor/:id" element={<VendorDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
