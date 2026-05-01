import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AudioAnalysis from './pages/AudioAnalysis';
import PhishingDetection from './pages/PhishingDetection';
import RiskReports from './pages/RiskReports';
import Alerts from './pages/Alerts';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex min-h-screen bg-dark-900 text-slate-200">
      {!isAuthPage && <Sidebar />}
      <main className={`flex-1 ${!isAuthPage ? 'ml-64 p-8' : ''} overflow-y-auto h-screen relative`}>
        {!isAuthPage && (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-green/10 rounded-full blur-[120px] pointer-events-none"></div>
          </>
        )}
        
        <div className={`relative z-10 ${!isAuthPage ? 'max-w-7xl mx-auto' : 'w-full h-full'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/audio" element={<AudioAnalysis />} />
            <Route path="/phishing" element={<PhishingDetection />} />
            <Route path="/reports" element={<RiskReports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
