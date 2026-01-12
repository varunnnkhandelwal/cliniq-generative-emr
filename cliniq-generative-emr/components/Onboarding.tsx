
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight, Briefcase, Lock, User, Globe, Activity, Brain, Heart, Sparkles, Smile, Users, Bone, Key, Eye, EyeOff, Stethoscope, Zap } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { EXTENDED_DOCTOR_DATABASE, DoctorProfileExtended } from '../services/aiTemplateGenerator';

interface Props {
  onSelectDoctor: (doctorId: string, profile: DoctorProfileExtended) => void;
}

const PROFILE_STYLES: Record<string, { icon: any, color: string }> = {
  'Cardiologist': { icon: Heart, color: 'bg-red-500' },
  'General Practitioner': { icon: Activity, color: 'bg-teal-500' },
  'Dentist': { icon: Smile, color: 'bg-blue-400' },
  'Pediatrician': { icon: Users, color: 'bg-orange-400' },
  'Internal Medicine': { icon: Brain, color: 'bg-purple-500' },
  'Dermatologist': { icon: Sparkles, color: 'bg-pink-500' },
  'Orthopedic Surgeon': { icon: Bone, color: 'bg-slate-700' },
  'Ophthalmologist': { icon: Eye, color: 'bg-cyan-500' },
  'Physiotherapist': { icon: Zap, color: 'bg-green-500' },
};

export const Onboarding: React.FC<Props> = ({ onSelectDoctor }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string>('');

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      geminiService.setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setApiKeyError('');
    if (value.trim()) {
      localStorage.setItem('gemini_api_key', value.trim());
      geminiService.setApiKey(value.trim());
    }
  };

  const handleLogin = () => {
    if (!selectedDoctorId) return;
    if (!apiKey.trim()) {
      setApiKeyError('Please enter your Gemini API key');
      return;
    }
    setIsLoggingIn(true);
    
    const selectedProfile = EXTENDED_DOCTOR_DATABASE.find(d => d.doctor_id === selectedDoctorId);
    if (selectedProfile) {
      // Small delay to show loading state
      setTimeout(() => {
        onSelectDoctor(selectedDoctorId, selectedProfile);
      }, 800);
    }
  };

  const selectedDoc = EXTENDED_DOCTOR_DATABASE.find(d => d.doctor_id === selectedDoctorId);
  const style = selectedDoc ? (PROFILE_STYLES[selectedDoc.specialty] || PROFILE_STYLES['General Practitioner']) : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#f0f4f8] min-h-screen relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal-100/50 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-lg w-full z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#3f4cb1] rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl shadow-indigo-100 ring-4 ring-white">
            Q
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">CliniQ Clinical OS</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">AI-Native EMR Template Generator</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[32px] shadow-2xl shadow-indigo-100/50 p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"></div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Generate Your EMR Template</h2>
            <p className="text-sm text-slate-400 font-medium">AI will analyze your profile and services to create a custom EMR layout.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <User size={12} className="text-indigo-400" />
                Select Doctor Profile
              </label>
              <div className="relative group">
                <select 
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all cursor-pointer group-hover:bg-slate-100/50"
                >
                  <option value="" disabled>Select from verified staff...</option>
                  {EXTENDED_DOCTOR_DATABASE.map((doc) => (
                    <option key={doc.doctor_id} value={doc.doctor_id}>
                      {doc.name} — {doc.specialty}{doc.sub_specialty ? ` (${doc.sub_specialty})` : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Doctor Profile Card with Services */}
            {selectedDoc && style && (
              <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 ${style.color} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                    <style.icon size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base font-bold text-slate-800 truncate">{selectedDoc.name}</span>
                      <ShieldCheck size={16} className="text-blue-500 shrink-0" />
                    </div>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-tight">
                      {selectedDoc.specialty}
                      {selectedDoc.sub_specialty && <span className="text-purple-500"> • {selectedDoc.sub_specialty}</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{selectedDoc.years_of_experience} years experience</p>
                  </div>
                </div>
                
                {/* Services */}
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Stethoscope size={10} /> Services Offered
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.services.slice(0, 5).map((service, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/80 border border-indigo-100 rounded-full text-[10px] font-semibold text-indigo-700">
                        {service}
                      </span>
                    ))}
                    {selectedDoc.services.length > 5 && (
                      <span className="px-2.5 py-1 bg-indigo-100 rounded-full text-[10px] font-semibold text-indigo-600">
                        +{selectedDoc.services.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Common Diagnoses */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Common Cases</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.common_diagnoses.slice(0, 4).map((diagnosis, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-semibold text-amber-700">
                        {diagnosis}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Generation Note */}
                <div className="mt-4 pt-3 border-t border-indigo-100/50">
                  <p className="text-[10px] text-indigo-600 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    AI will generate custom EMR sections based on this profile
                  </p>
                </div>
              </div>
            )}

            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Key size={12} className="text-amber-500" />
                Gemini API Key
              </label>
              <div className="relative group">
                <input 
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className={`w-full h-14 bg-slate-50 border rounded-2xl px-5 pr-12 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all ${
                    apiKeyError ? 'border-red-300 bg-red-50/50' : 'border-slate-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {apiKeyError && (
                <p className="text-xs text-red-500 font-medium ml-1">{apiKeyError}</p>
              )}
              <p className="text-[10px] text-slate-400 ml-1">
                Get your API key from{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={!selectedDoctorId || !apiKey.trim() || isLoggingIn}
              className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                !selectedDoctorId || !apiKey.trim() || isLoggingIn
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200'
              }`}
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>AI Generating Template...</span>
                </div>
              ) : (
                <>Generate EMR Template <Sparkles size={16} /></>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                <Briefcase size={12} /> AI-Powered
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                <Globe size={12} /> v3.0 AI-Native
             </div>
          </div>
        </div>

        <div className="mt-10 text-center space-y-4">
            <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-teal-500" />
                    HIPAA Secure
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Brain size={14} className="text-purple-500" />
                    Gemini AI
                </div>
            </div>
            <p className="text-[10px] text-slate-300 font-medium px-10 leading-relaxed">
                AI analyzes your specialty, services, and common cases to generate 
                optimized EMR layouts tailored to your clinical workflow.
            </p>
        </div>
      </div>
    </div>
  );
};
