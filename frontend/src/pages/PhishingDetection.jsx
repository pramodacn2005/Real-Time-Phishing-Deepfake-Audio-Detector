import React, { useState } from 'react';
import { ShieldAlert, Search, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { analyzeText, createReport, createAlert } from '../services/api';

const PhishingDetection = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      // Small artificial delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await analyzeText(text);
      setResult(response);
      
      // Save report
      await createReport({
        type: 'text',
        result: response.label,
        risk_score: response.risk_score
      });

      // Create alert if phishing
      if (response.label === 'Phishing') {
        await createAlert({
          message: `Phishing attempt detected with Risk Score: ${response.risk_score}`,
          risk_level: 'High'
        });
      }

    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze text. Please check backend connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (score) => {
    if (score <= 30) return 'text-cyber-green bg-cyber-green';
    if (score <= 70) return 'text-cyber-yellow bg-cyber-yellow';
    return 'text-cyber-red bg-cyber-red';
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ShieldAlert className="text-cyber-blue" /> Phishing Detection
        </h1>
        <p className="text-slate-400">Analyze text messages, emails, or URLs to detect potential phishing attacks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="glass-panel p-8 flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Input Data</h3>
          
          <div className="flex-1 flex flex-col">
            <textarea 
              className="input-field flex-1 resize-none min-h-[200px] mb-6" 
              placeholder="Paste suspicious text message, email body, or URL here... (e.g. 'Urgent! Click here to verify your bank account')"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            
            <button 
              className={`btn-primary py-3 flex justify-center items-center gap-2 ${(!text.trim() || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAnalyze}
              disabled={!text.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Patterns...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Scan for Threats
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="glass-panel p-8 relative overflow-hidden">
          <h3 className="text-lg font-semibold text-white mb-6">Threat Analysis</h3>
          
          {!result && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] text-slate-500">
              <ShieldCheck size={48} className="mb-4 opacity-30" />
              <p>Awaiting input for NLP processing.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)]">
              <div className="grid grid-cols-3 gap-2 mb-4 opacity-70">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-cyber-blue rounded-sm animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                ))}
              </div>
              <p className="text-cyber-blue animate-pulse font-medium">Extracting NLP Features & Tokens...</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  result.label === 'Phishing' 
                    ? 'bg-cyber-red/20 text-cyber-red shadow-cyber-red/20' 
                    : 'bg-cyber-green/20 text-cyber-green shadow-cyber-green/20'
                }`}>
                  {result.label === 'Phishing' ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${result.label === 'Phishing' ? 'text-cyber-red' : 'text-cyber-green'}`}>
                    {result.label === 'Phishing' ? 'Threat Detected' : 'No Threat Found'}
                  </h2>
                  <p className="text-slate-400">
                    {result.label === 'Phishing' ? 'This text contains known phishing patterns.' : 'This text appears to be safe.'}
                  </p>
                </div>
              </div>

              <div className="bg-dark-900 rounded-xl p-6 border border-slate-700 mt-auto">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <span className="text-sm font-medium text-slate-400 block mb-1">Calculated Risk Score</span>
                    <span className="text-3xl font-bold text-white">{result.risk_score}</span>
                    <span className="text-slate-500 text-sm"> / 100</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    result.risk_score > 70 ? 'bg-cyber-red/20 text-cyber-red' : 
                    result.risk_score > 30 ? 'bg-cyber-yellow/20 text-cyber-yellow' : 
                    'bg-cyber-green/20 text-cyber-green'
                  }`}>
                    {result.risk_score > 70 ? 'High Risk' : result.risk_score > 30 ? 'Medium Risk' : 'Low Risk'}
                  </span>
                </div>
                
                <div className="w-full bg-dark-800 rounded-full h-3 overflow-hidden relative">
                  {/* Background scale markers */}
                  <div className="absolute inset-0 flex justify-between px-1">
                    <div className="w-[1px] h-full bg-slate-600/50"></div>
                    <div className="w-[1px] h-full bg-slate-600/50"></div>
                    <div className="w-[1px] h-full bg-slate-600/50"></div>
                  </div>
                  
                  {/* Active bar */}
                  <div className={`h-full transition-all duration-1000 ease-out ${getRiskColor(result.risk_score).split(' ')[1]}`} style={{ width: `${result.risk_score}%` }}>
                    <div className="w-full h-full bg-white/20"></div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Analysis Details</h4>
                  <ul className="text-xs text-slate-500 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue"></div>
                      Analyzed via Logistic Regression NLP Model
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue"></div>
                      TF-IDF Tokenization Applied
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue"></div>
                      {result.label === 'Phishing' ? 'Suspicious keywords ("urgent", "bank", etc.) detected' : 'No malicious keywords found'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhishingDetection;
