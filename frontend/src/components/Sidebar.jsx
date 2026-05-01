import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mic, 
  ShieldAlert, 
  FileText, 
  Bell, 
  User,
  ShieldCheck,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/audio', name: 'Audio Analysis', icon: <Mic size={20} /> },
    { path: '/phishing', name: 'Phishing Detection', icon: <ShieldAlert size={20} /> },
    { path: '/reports', name: 'Risk Reports', icon: <FileText size={20} /> },
    { path: '/alerts', name: 'Alerts & Notifications', icon: <Bell size={20} /> },
    { path: '/profile', name: 'User Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-dark-800 border-r border-slate-700 flex flex-col fixed left-0 top-0">
      <div className="h-20 flex items-center px-6 border-b border-slate-700">
        <div className="flex items-center gap-3 text-cyber-green">
          <ShieldCheck size={32} />
          <h1 className="text-xl font-bold text-white tracking-wide">Cyber<span className="text-cyber-green">Sentinel</span></h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700/50'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-700 flex flex-col gap-4">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-dark-700 hover:bg-cyber-red/20 text-slate-400 hover:text-cyber-red transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
        <div className="text-sm text-slate-500 text-center">
          &copy; 2026 CyberSentinel
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
