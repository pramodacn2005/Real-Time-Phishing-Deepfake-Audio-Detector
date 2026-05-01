import React, { useState, useEffect } from 'react';
import { FileText, Filter, Download, Search } from 'lucide-react';
import { getReports } from '../services/api';

const RiskReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        // If empty, supply some mock data for UI visual demonstration
        if (data.length === 0) {
          setReports([
            { id: 101, type: 'audio', result: 'Deepfake', risk_score: 92, created_at: new Date().toISOString() },
            { id: 102, type: 'text', result: 'Safe', risk_score: 12, created_at: new Date(Date.now() - 86400000).toISOString() },
            { id: 103, type: 'text', result: 'Phishing', risk_score: 88, created_at: new Date(Date.now() - 172800000).toISOString() },
            { id: 104, type: 'audio', result: 'Real', risk_score: 25, created_at: new Date(Date.now() - 259200000).toISOString() },
            { id: 105, type: 'text', result: 'Medium Risk', risk_score: 65, created_at: new Date(Date.now() - 345600000).toISOString() },
          ]);
        } else {
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    if (filterType === 'all') return true;
    return report.type === filterType;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="text-cyber-blue" /> Scan History & Reports
          </h1>
          <p className="text-slate-400">View detailed logs of all previously analyzed audio and text inputs.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="btn-secondary flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden flex flex-col h-[70vh]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-700 bg-dark-900/50 flex justify-between items-center">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-cyber-blue text-white' : 'text-slate-400 hover:bg-dark-700'}`}
            >
              All Scans
            </button>
            <button 
              onClick={() => setFilterType('audio')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${filterType === 'audio' ? 'bg-cyber-blue text-white' : 'text-slate-400 hover:bg-dark-700'}`}
            >
              Audio Only
            </button>
            <button 
              onClick={() => setFilterType('text')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${filterType === 'text' ? 'bg-cyber-blue text-white' : 'text-slate-400 hover:bg-dark-700'}`}
            >
              Text/URL Only
            </button>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="bg-dark-800 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-cyber-blue w-64 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-dark-800/80 text-xs uppercase text-slate-400 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Scan ID</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Type</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Result</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Risk Score</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 text-slate-300 font-mono text-sm">#{report.id}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(report.created_at).toLocaleString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        report.type === 'audio' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {report.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-200 font-medium">{report.result}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-dark-900 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${
                              report.risk_score > 70 ? 'bg-cyber-red' : 
                              report.risk_score > 30 ? 'bg-cyber-yellow' : 'bg-cyber-green'
                            }`}
                            style={{ width: `${report.risk_score}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-bold ${
                          report.risk_score > 70 ? 'text-cyber-red' : 
                          report.risk_score > 30 ? 'text-cyber-yellow' : 'text-cyber-green'
                        }`}>{Math.round(report.risk_score)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="text-cyber-blue hover:text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      No reports found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-slate-700 bg-dark-900/50 flex justify-between items-center text-sm text-slate-400">
          <span>Showing 1 to {filteredReports.length} of {filteredReports.length} entries</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded bg-dark-800 hover:bg-dark-700 disabled:opacity-50" disabled>Prev</button>
            <button className="px-2 py-1 rounded bg-cyber-blue text-white">1</button>
            <button className="px-2 py-1 rounded bg-dark-800 hover:bg-dark-700 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="glass-panel max-w-md w-full p-6 relative animate-fade-in">
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-4">Report Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Scan ID:</span>
                <span className="text-white font-mono">#{selectedReport.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-white">
                  {new Date(selectedReport.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Type:</span>
                <span className="text-white uppercase">{selectedReport.type}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-slate-400">Result:</span>
                <span className="text-white">{selectedReport.result}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Risk Score:</span>
                <span className={`font-bold text-lg ${
                  selectedReport.risk_score > 70 ? 'text-cyber-red' : 
                  selectedReport.risk_score > 30 ? 'text-cyber-yellow' : 'text-cyber-green'
                }`}>
                  {Math.round(selectedReport.risk_score)}/100
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedReport(null)}
              className="mt-6 w-full btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskReports;
