import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { getReports, getAlerts } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    highRisk: 0,
    safe: 0,
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportsRes = await getReports();
        const alertsRes = await getAlerts();
        
        // Mock data if backend empty for demonstration
        const reports = reportsRes.length > 0 ? reportsRes : [
          { type: 'audio', risk_score: 85, result: 'Deepfake' },
          { type: 'text', risk_score: 15, result: 'Safe' },
          { type: 'text', risk_score: 90, result: 'Phishing' },
          { type: 'audio', risk_score: 25, result: 'Real' },
          { type: 'text', risk_score: 45, result: 'Medium Risk' },
        ];
        
        const alerts = alertsRes.length > 0 ? alertsRes : [
          { id: 1, message: 'Deepfake audio detected from upload', risk_level: 'High', created_at: new Date().toISOString() },
          { id: 2, message: 'Phishing URL found in text analysis', risk_level: 'High', created_at: new Date(Date.now() - 3600000).toISOString() },
        ];

        setRecentAlerts(alerts.slice(0, 5));
        
        let high = 0;
        let safe = 0;
        
        const chartDistribution = [
          { name: 'Low (0-30)', count: 0 },
          { name: 'Medium (31-70)', count: 0 },
          { name: 'High (71-100)', count: 0 },
        ];

        reports.forEach(r => {
          if (r.risk_score > 70) {
            high++;
            chartDistribution[2].count++;
          } else if (r.risk_score <= 30) {
            safe++;
            chartDistribution[0].count++;
          } else {
            chartDistribution[1].count++;
          }
        });

        setStats({
          totalScans: reports.length,
          highRisk: high,
          safe: safe
        });
        
        setChartData(chartDistribution);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="glass-panel p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
        <p className="text-slate-400">Overview of recent analysis and threat detections.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total Scans" 
              value={stats.totalScans} 
              icon={<Activity size={28} className="text-cyber-blue" />} 
              color="bg-cyber-blue"
            />
            <StatCard 
              title="High Risk Threats" 
              value={stats.highRisk} 
              icon={<AlertTriangle size={28} className="text-cyber-red" />} 
              color="bg-cyber-red"
            />
            <StatCard 
              title="Safe Inputs" 
              value={stats.safe} 
              icon={<CheckCircle size={28} className="text-cyber-green" />} 
              color="bg-cyber-green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="glass-panel p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Shield size={20} className="text-cyber-blue" />
                Risk Distribution
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <RechartsTooltip 
                      cursor={{fill: '#1e293b'}}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'
                        } />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <AlertTriangle size={20} className="text-cyber-red" />
                Recent Alerts
              </h3>
              <div className="space-y-4">
                {recentAlerts.length > 0 ? recentAlerts.map((alert, idx) => (
                  <div key={idx} className="bg-dark-900 border border-slate-700/50 p-4 rounded-lg flex items-start gap-3 hover:border-cyber-red/50 transition-colors">
                    <div className="mt-1 w-2 h-2 rounded-full bg-cyber-red flex-shrink-0 animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-400 text-sm text-center py-4">No recent alerts.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
