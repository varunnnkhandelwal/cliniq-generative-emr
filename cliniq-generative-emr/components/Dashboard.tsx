
import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  UserPlus, 
  Calendar, 
  Activity, 
  Pill, 
  Clipboard, 
  ExternalLink,
  Plus,
  Mic,
  Layout,
  ChevronDown,
  X,
  Clock,
  LayoutTemplate
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MedicalTemplate } from '../types';

interface Props {
  specialty: string;
  onEditTemplate: (templateId?: string) => void;
  onStartSession: () => void;
  savedTemplates: MedicalTemplate[];
}

export const Dashboard: React.FC<Props> = ({ specialty, onEditTemplate, onStartSession, savedTemplates }) => {
  const [input, setInput] = useState('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const widgets = [
    { label: 'New Patient', icon: UserPlus, color: 'text-blue-500' },
    { label: 'Schedule', icon: Calendar, color: 'text-indigo-500' },
    { label: 'Vitals', icon: Activity, color: 'text-teal-500' },
    { label: 'Prescription', icon: Pill, color: 'text-indigo-600' },
    { label: 'Lab Order', icon: Clipboard, color: 'text-slate-500' },
    { label: 'Referral', icon: ExternalLink, color: 'text-blue-400' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden relative">
      {/* Dashboard Sidebar */}
      <aside className="w-[240px] bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
        <div className="p-6 flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#009688] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            Q
          </div>
          <span className="font-extrabold text-[#1e293b] text-xl tracking-tight">CliniQ</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { label: 'Generic Chat', icon: Layout, active: true },
            { label: 'Patient List', icon: UserPlus },
            { label: 'Calendar', icon: Calendar },
            { label: 'Payment Ledger', icon: Clipboard },
            { label: 'Analytics', icon: Activity },
            { label: 'Chat History', icon: Settings },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                item.active 
                  ? 'bg-[#f1fcf9] text-[#009688]' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <div className="bg-[#00796b] rounded-2xl p-4 text-white shadow-lg shadow-teal-100 relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Today</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">8 Appointments</span>
                  <ChevronDown size={14} />
                </div>
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform">
                <Calendar size={60} />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Specialty Context</span>
              <span className="text-[13px] font-bold text-[#009688] mt-1">{specialty}</span>
            </div>
            <div className="relative w-[500px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search patients, EMRs, appointments..." 
                className="w-full bg-[#f1f5f9]/50 border border-slate-100 rounded-xl py-2 pl-10 pr-12 text-[12px] focus:ring-2 focus:ring-teal-50 focus:border-teal-200 outline-none transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 border border-slate-100 px-1.5 py-0.5 rounded-md bg-white text-[9px] text-slate-400 font-bold uppercase tracking-widest shadow-sm">
                ⌘K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Settings size={14} />
              Edit Template Settings
            </button>
            <div className="h-6 w-px bg-slate-100"></div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><Settings size={20} /></button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><HelpCircle size={20} /></button>
            <div className="w-10 h-10 rounded-full bg-[#f1fcf9] text-[#009688] flex items-center justify-center font-bold text-[12px] border border-teal-50 cursor-pointer">DR</div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-[64px] font-medium text-slate-200 tracking-tight leading-none mb-12">Welcome</h1>
            
            <div className="mb-12">
               <h2 className="text-2xl font-bold text-slate-800 mb-2">Chat</h2>
               <p className="text-sm text-slate-400">Use <span className="text-[#009688] font-bold">/</span> in order to access quick actions</p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16">
              {widgets.map((w) => (
                <button 
                  key={w.label}
                  onClick={w.label === 'Vitals' || w.label === 'Prescription' ? onStartSession : undefined}
                  className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 group hover:border-[#009688] hover:bg-[#f1fcf9]/30 transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center ${w.color} group-hover:bg-white transition-colors`}>
                    <w.icon size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{w.label}</span>
                </button>
              ))}
            </div>

            <button className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5 hover:text-[#009688] transition-colors">
              <Settings size={12} /> Edit Widgets
            </button>
          </div>

          {/* Bottom Command Bar */}
          <div className="absolute bottom-12 left-0 right-0 px-12 flex flex-col items-center gap-4">
             <div className="w-full max-w-4xl relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Plus size={20} />
                </div>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message or use / for commands..."
                  className="w-full bg-white border border-slate-100 shadow-xl shadow-slate-100/50 rounded-2xl py-6 pl-14 pr-16 text-[14px] text-slate-700 focus:ring-0 outline-none placeholder:text-slate-400 transition-all focus:border-[#009688]/30"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-300 hover:text-[#009688] transition-colors">
                   <Mic size={22} />
                </button>
             </div>
             <p className="text-[10px] text-slate-300 font-medium">AI can make mistakes. Verify clinical information.</p>
          </div>
        </main>
      </div>

      {/* Template Settings Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Template Settings</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Manage and customize your EMR workflows</p>
                    </div>
                    <button 
                        onClick={() => setIsTemplateModalOpen(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Create New Card */}
                        <button 
                            onClick={() => {
                                setIsTemplateModalOpen(false);
                                onEditTemplate();
                            }}
                            className="group h-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-[#009688] hover:bg-[#f1fcf9]/30 transition-all"
                        >
                            <div className="w-12 h-12 bg-[#f1fcf9] text-[#009688] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-teal-50">
                                <Plus size={24} />
                            </div>
                            <div className="text-center">
                                <span className="block text-sm font-bold text-slate-700">Create New Template</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Start from scratch</span>
                            </div>
                        </button>

                        {/* Existing Templates */}
                        {savedTemplates.map((template) => (
                            <div 
                                key={template.id}
                                className="group relative border border-slate-100 rounded-2xl p-6 bg-white hover:border-[#009688] hover:shadow-xl hover:shadow-teal-100/20 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm border border-indigo-50">
                                        <LayoutTemplate size={20} />
                                    </div>
                                    <span className="text-[9px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg uppercase tracking-tighter">
                                        {template.components.length} Blocks
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 mb-1">{template.name}</h3>
                                <p className="text-[10px] text-[#009688] font-bold uppercase tracking-widest mb-4">{template.specialty}</p>
                                
                                <div className="flex items-center gap-2 text-slate-400 mb-6">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-medium">Modified {new Date(template.lastModified).toLocaleDateString()}</span>
                                </div>

                                <button 
                                    onClick={() => {
                                        setIsTemplateModalOpen(false);
                                        onEditTemplate(template.id);
                                    }}
                                    className="w-full py-2.5 bg-slate-50 group-hover:bg-[#009688] group-hover:text-white text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-teal-100"
                                >
                                    Edit Template
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Showing {savedTemplates.length + 1} templates</p>
                    <button className="text-[10px] text-[#009688] font-bold uppercase tracking-widest hover:underline">Explore Community Library</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
