import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, User, AlertCircle } from 'lucide-react';
import api from '../services/api';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/signup', { name, email, password });
      // After successful signup, log the user in automatically
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-200 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-green/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md p-8 relative z-10 border-t-4 border-t-cyber-green">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-dark-900 rounded-2xl flex items-center justify-center border border-slate-700 shadow-[0_0_15px_rgba(16,185,129,0.3)] mb-4">
            <Shield className="w-8 h-8 text-cyber-green" />
          </div>
          <h2 className="text-2xl font-bold tracking-wider">CYBER<span className="text-cyber-green">SENTINEL</span></h2>
          <p className="text-slate-400 mt-2 text-sm">Operative Registration</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Operative Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                required
                className="input-field pl-10 bg-dark-900/50"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                required
                className="input-field pl-10 bg-dark-900/50"
                placeholder="operative@sentinel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                required
                className="input-field pl-10 bg-dark-900/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 bg-cyber-green hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 active:scale-95 shadow-lg shadow-green-500/20 flex justify-center items-center py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Registering...' : 'REQUEST CLEARANCE'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already an operative?{' '}
          <Link to="/login" className="text-cyber-green hover:text-green-400 font-medium transition-colors">
            Access Portal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
