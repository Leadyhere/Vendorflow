import { Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import VendorOnboarding from './pages/VendorOnboarding';
import VendorDetail from './pages/VendorDetail';

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 font-sans text-dark-200 selection:bg-primary-500 selection:text-white relative overflow-hidden">
      
      {/* Interactive Elegant Cursor Glow - Hyped Version */}
      <div 
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.15), transparent 80%),
            radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(216, 180, 254, 0.2), transparent 80%)
          `
        }}
      />
      
      {/* Trailing Soft Blob */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-0 w-64 h-64 rounded-full bg-primary-500/40 blur-[80px] mix-blend-screen transition-transform duration-500 ease-out animate-pulse"
        style={{
          transform: `translate(${mousePos.x - 128}px, ${mousePos.y - 128}px)`
        }}
      />

      <header className="sticky top-0 z-50 bg-dark-900/60 backdrop-blur-xl border-b border-dark-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12 relative z-10">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-primary-600/20 border border-primary-500/30 rounded-xl flex items-center justify-center group-hover:bg-primary-600/40 group-hover:scale-110 transition-all duration-300">
                  <ShieldCheck className="w-6 h-6 text-primary-400" />
                </div>
                <span className="text-2xl font-display font-bold text-white tracking-tight">
                  VendorFlow
                </span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-[15px] font-medium text-dark-300 hover:text-white hover:scale-105 transition-all duration-200">
                  Dashboard
                </Link>
                <Link to="/onboard" className="text-[15px] font-medium text-dark-300 hover:text-white hover:scale-105 transition-all duration-200">
                  New Vendor
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-6 relative z-10">
              <Link to="/onboard" className="btn-primary py-2 px-5 hidden md:inline-flex active:scale-95 transition-transform duration-150">
                Start Onboarding
              </Link>
              <div className="h-10 w-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-white font-display font-bold shadow-md hover:border-primary-500/50 hover:bg-dark-700 transition-all duration-300 cursor-pointer hover:scale-110">
                P
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full animate-fade-in relative z-10">
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
