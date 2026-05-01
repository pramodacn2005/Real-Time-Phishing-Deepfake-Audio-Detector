import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Shield, Check, Settings2, Trash2 } from 'lucide-react';
import { getAlerts } from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        if (data.length === 0) {
          // Mock data
          setAlerts([
            { id: 1, message: 'CRITICAL: High confidence deepfake audio detected from User Upload', risk_level: 'High', created_at: new Date().toISOString(), isNew: true },
            { id: 2, message: 'Phishing URL pattern detected in text analysis', risk_level: 'High', created_at: new Date(Date.now() - 3600000).toISOString(), isNew: false },
            { id: 3, Suspicious: 'Suspicious keywords identified in recent scan', risk_level: 'Medium', created_at: new Date(Date.now() - 86400000).toISOString(), isNew: false },
          ]);
        } else {
          setAlerts(data.map(a => ({...a, isNew: false})));
        }
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);

  const removeAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Bell className="text-cyber-yellow" /> Alerts & Notifications
          </h1>
          <p className="text-slate-400">Manage high-risk event notifications and system alerts.</p>
        </div>
        
        <div className="glass-panel px-4 py-2 flex items-center gap-4 border border-slate-700 bg-dark-800">
          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Settings2 size={16} /> Push Notifications
          </span>
          <button 
            className={`w-12 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-cyber-blue' : 'bg-slate-600'}`}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`}></span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-cyber-yellow border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`glass-panel p-5 relative overflow-hidden transition-all duration-300 hover:translate-x-1 ${
                alert.isNew ? 'border-cyber-yellow/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : ''
              }`}
            >
              {/* Severity Left Border Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                alert.risk_level === 'High' ? 'bg-cyber-red' : 
                alert.risk_level === 'Medium' ? 'bg-cyber-yellow' : 'bg-cyber-green'
              }`}></div>
              
              <div className="flex justify-between items-start pl-3">
                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-full h-min ${
                    alert.risk_level === 'High' ? 'bg-cyber-red/10 text-cyber-red' : 
                    alert.risk_level === 'Medium' ? 'bg-cyber-yellow/10 text-cyber-yellow' : 'bg-cyber-green/10 text-cyber-green'
                  }`}>
                    {alert.risk_level === 'High' ? <AlertTriangle size={20} /> : <Shield size={20} />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{
                        alert.risk_level === 'High' ? 'CRITICAL THREAT DETECTED' : 'Warning'
                      }</h3>
                      {alert.isNew && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyber-blue text-white animate-pulse">NEW</span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-3">{alert.message || alert.Suspicious}</p>
                    <p className="text-xs text-slate-500 font-mono">
                      Timestamp: {new Date(alert.created_at).toLocaleString()} | ID: ALRT-{alert.id.toString().padStart(4, '0')}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button className="p-2 text-slate-400 hover:text-cyber-green hover:bg-dark-700 rounded-lg transition-colors" title="Mark as Resolved">
                    <Check size={18} />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-cyber-red hover:bg-dark-700 rounded-lg transition-colors" 
                    title="Dismiss"
                    onClick={() => removeAlert(alert.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {alerts.length === 0 && (
            <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-dark-800 flex items-center justify-center mb-4">
                <Shield size={32} className="text-cyber-green" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">System is Secure</h3>
              <p className="text-slate-400 max-w-md">There are currently no active alerts. The system is actively monitoring all inputs for potential threats.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Alerts;
