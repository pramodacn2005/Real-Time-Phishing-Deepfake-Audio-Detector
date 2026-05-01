import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Key, Bell, Save } from 'lucide-react';
import { getCurrentUser } from '../services/api';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Loading...',
    email: 'loading...',
    role: 'Operative',
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setProfile({
          name: user.name,
          email: user.email,
          role: 'Operative',
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUser();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <User className="text-cyber-blue" /> User Profile
        </h1>
        <p className="text-slate-400">Manage your account settings and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-dark-900 border-2 border-cyber-blue flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <User size={40} className="text-cyber-blue" />
            </div>
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <p className="text-sm text-cyber-green font-medium mb-1">{profile.role}</p>
            <p className="text-xs text-slate-400 mb-6">{profile.email}</p>
            
            <button className="btn-secondary w-full text-sm">Upload Avatar</button>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} className="text-cyber-blue" />
              Security Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">2FA Authentication</span>
                <span className="text-cyber-green font-medium">Enabled</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Last Login</span>
                <span className="text-white">Today, 09:41 AM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Active Sessions</span>
                <span className="text-white">2 Devices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Settings Form */}
        <div className="md:col-span-2">
          <div className="glass-panel p-8">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-4">Account Settings</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      className="input-field pl-10" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input 
                      type="email" 
                      className="input-field pl-10" 
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-10 h-5 bg-dark-900 border border-slate-600 rounded-full peer peer-checked:bg-cyber-blue peer-checked:border-cyber-blue transition-colors"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-slate-400 rounded-full peer-checked:bg-white peer-checked:translate-x-5 transition-transform"></div>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Email alerts for High Risk detections</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-10 h-5 bg-dark-900 border border-slate-600 rounded-full peer peer-checked:bg-cyber-blue peer-checked:border-cyber-blue transition-colors"></div>
                      <div className="absolute left-1 top-1 w-3 h-3 bg-slate-400 rounded-full peer-checked:bg-white peer-checked:translate-x-5 transition-transform"></div>
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Weekly summary reports</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <button type="button" className="text-cyber-red text-sm font-medium hover:underline">
                  Change Password
                </button>
                
                <div className="flex items-center gap-4">
                  {isSaved && <span className="text-cyber-green text-sm flex items-center gap-1"><Save size={14}/> Saved</span>}
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
