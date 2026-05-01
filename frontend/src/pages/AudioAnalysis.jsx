import React, { useState, useRef } from 'react';
import { Upload, Mic, Play, FileAudio, AlertCircle, CheckCircle } from 'lucide-react';
import { analyzeAudio, createReport, createAlert } from '../services/api';

const AudioAnalysis = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.wav') || selectedFile.name.endsWith('.mp3'))) {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Please select a valid .wav or .mp3 file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.wav') || droppedFile.name.endsWith('.mp3'))) {
      setFile(droppedFile);
      setResult(null);
    } else {
      alert('Please drop a valid .wav or .mp3 file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      // Small artificial delay for effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await analyzeAudio(file);
      setResult(response);
      
      // Save report
      await createReport({
        type: 'audio',
        result: response.result,
        risk_score: response.confidence
      });

      // Create alert if deepfake
      if (response.result === 'Deepfake') {
        await createAlert({
          message: `Deepfake audio detected with ${response.confidence}% confidence`,
          risk_level: 'High'
        });
      }

    } catch (error) {
      console.error("Analysis failed", error);
      alert("Failed to analyze audio. Please check backend connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Mic className="text-cyber-blue" /> Audio Analysis
        </h1>
        <p className="text-slate-400">Upload voice recordings or audio files to detect AI-generated deepfakes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="glass-panel p-8">
          <h3 className="text-lg font-semibold text-white mb-4">Upload Audio</h3>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging ? 'border-cyber-blue bg-cyber-blue/10' : 'border-slate-600 hover:border-slate-500 hover:bg-dark-700/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept=".wav,.mp3"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <FileAudio size={48} className="text-cyber-blue" />
                <p className="text-slate-200 font-medium">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  className="mt-4 text-sm text-slate-400 hover:text-white"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-dark-900 flex items-center justify-center mb-2 shadow-inner">
                  <Upload size={28} className="text-slate-400" />
                </div>
                <p className="text-slate-200 font-medium">Click to upload or drag & drop</p>
                <p className="text-sm text-slate-500">WAV or MP3 (Max 10MB)</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              className={`btn-primary w-full flex justify-center items-center gap-2 ${!file || isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Play size={18} />
                  Run Detection
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="glass-panel p-8 relative overflow-hidden">
          {/* Decorative background pulse if analyzing */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-cyber-blue/5 animate-pulse rounded-xl"></div>
          )}

          <h3 className="text-lg font-semibold text-white mb-6">Analysis Results</h3>
          
          {!result && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <Mic size={40} className="mb-3 opacity-50" />
              <p>Upload and analyze an audio file to view results.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="flex items-center justify-center gap-1 mb-4">
                <div className="w-2 h-8 bg-cyber-blue rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                <div className="w-2 h-12 bg-cyber-blue rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                <div className="w-2 h-6 bg-cyber-blue rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                <div className="w-2 h-10 bg-cyber-blue rounded-full animate-[bounce_1s_infinite_600ms]"></div>
                <div className="w-2 h-12 bg-cyber-blue rounded-full animate-[bounce_1s_infinite_800ms]"></div>
                <div className="w-2 h-6 bg-cyber-blue rounded-full animate-[bounce_1s_infinite_1000ms]"></div>
              </div>
              <p className="text-cyber-blue animate-pulse font-medium">Extracting MFCC Features...</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-xl ${
                result.result === 'Deepfake' 
                  ? 'bg-cyber-red/20 text-cyber-red shadow-cyber-red/20' 
                  : 'bg-cyber-green/20 text-cyber-green shadow-cyber-green/20'
              }`}>
                {result.result === 'Deepfake' ? <AlertCircle size={64} /> : <CheckCircle size={64} />}
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">{result.result}</h2>
              <p className="text-slate-400 mb-8">Classification Outcome</p>
              
              <div className="w-full bg-dark-900 rounded-lg p-5 border border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Confidence Score</span>
                  <span className={`text-sm font-bold ${
                    result.result === 'Deepfake' ? 'text-cyber-red' : 'text-cyber-green'
                  }`}>{result.confidence}%</span>
                </div>
                <div className="w-full bg-dark-800 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all duration-1000 ${
                    result.result === 'Deepfake' ? 'bg-cyber-red' : 'bg-cyber-green'
                  }`} style={{ width: `${result.confidence}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">
                  Model analyzed spectrogram patterns to determine authenticity.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioAnalysis;
