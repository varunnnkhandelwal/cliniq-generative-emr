
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Mic, Bot, Settings, Sparkles, ChevronRight, PanelRightClose, Plus, Zap, Hash, MessageCircle } from 'lucide-react';
import { ChatMessage, ViewMode, ComponentType } from '../types';
import { COMPONENT_LIBRARY } from '../services/geminiService';

interface Props {
  history: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
  onQuickAction: (type: string) => void;
  viewMode: ViewMode;
  specialty: string;
  onAddComponent: (type: ComponentType, title?: string) => void;
  onCollapse: () => void;
}

const SLASH_COMMANDS = [
  { cmd: '/vitals', label: 'Add Vitals' },
  { cmd: '/cardiac_exam', label: 'Cardiac Exam' },
  { cmd: '/medications', label: 'Prescription' },
  { cmd: '/risk_calc', label: 'Risk Calculators' },
  { cmd: '/dental_chart', label: 'Dental Chart' },
  { cmd: '/help', label: 'Show Help' }
];

export const ChatPanel: React.FC<Props> = ({ 
  history, 
  onSendMessage, 
  isTyping, 
  onCollapse,
  onAddComponent,
  specialty,
  viewMode
}) => {
  const [input, setInput] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
    setShowSlashMenu(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    setShowSlashMenu(val.startsWith('/'));
  };

  const selectCommand = (cmd: string) => {
    onSendMessage(`Add ${cmd.replace('/', '')}`);
    setInput('');
    setShowSlashMenu(false);
  };

  // Generate dynamic suggestions based on viewMode, specialty, and chat context
  const suggestions = useMemo(() => {
    const lastMsg = history.length > 0 ? history[history.length - 1].text.toLowerCase() : '';
    
    if (viewMode === 'template_builder') {
      // Builder context suggestions
      const base = [
        "Add a notes block",
        "Add diagnostic checklist",
        "Include clinical summary"
      ];

      if (specialty.includes('Cardio')) {
        if (lastMsg.includes('vitals')) return ["Add cardiac examination", "Include risk calculators", ...base];
        return ["Add cardiac vitals", "Include ECG report block", "Add heart sounds section", ...base];
      }
      
      if (specialty.includes('Dentist')) {
        return ["Add dental charting", "Add periodontal exam", "Include procedure pricing", ...base];
      }

      return ["Add basic vitals", "Include prescription table", "Add family history section", ...base];
    } else {
      // Session context suggestions (Clinical data entry)
      if (lastMsg.includes('bp') || lastMsg.includes('vitals')) return ["Pulse is 72", "Temp is normal", "SPO2 is 98%"];
      return ["BP is 120/80", "Prescribe Amoxicillin", "Patient has mild cough", "Schedule follow-up"];
    }
  }, [viewMode, specialty, history]);

  return (
    <aside className="flex flex-col h-full w-full bg-white relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md ring-2 ring-indigo-50">
                    <Bot size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-xs tracking-tight">AI Assistant</h3>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Sync</span>
                    </div>
                </div>
            </div>
            <button onClick={onCollapse} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <PanelRightClose size={18} />
            </button>
        </div>

        {/* Component Library Pills */}
        <div className="px-4 py-3 border-b border-slate-50 flex items-center gap-3 overflow-x-auto no-scrollbar bg-slate-50/30 shrink-0">
            {COMPONENT_LIBRARY.map((pill) => (
                <button 
                    key={pill.id}
                    onClick={() => onAddComponent(pill.id, pill.label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full whitespace-nowrap text-[10px] font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                >
                    <Plus size={12} /> {pill.label}
                </button>
            ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/20 custom-scrollbar">
            {history.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-40 text-center px-10">
                    <Sparkles size={32} className="mb-4 text-indigo-400" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        {viewMode === 'template_builder' 
                          ? "Design your template by talking to me.\nTry 'Add a dental chart'"
                          : "Document findings by talking to me.\nTry 'BP is 120/80'"}
                    </p>
                </div>
            )}
            {history.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[11px] font-medium leading-relaxed shadow-sm transition-all ${
                        msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 rounded-tl-none border border-gray-100'
                    }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                     <div className="bg-white border border-gray-100 rounded-2xl px-3 py-2 flex items-center gap-1">
                        <span className="w-1 h-1 bg-indigo-300 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-indigo-300 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1 h-1 bg-indigo-300 rounded-full animate-bounce delay-150"></span>
                     </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Suggestions Row */}
        <div className="px-4 pt-2 pb-1 flex items-center gap-2 overflow-x-auto no-scrollbar bg-white shrink-0">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter whitespace-nowrap flex items-center gap-1">
            <MessageCircle size={10} /> {viewMode === 'template_builder' ? 'Build' : 'Try'}
          </span>
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(suggestion)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 rounded-full whitespace-nowrap hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Slash Command Menu */}
        {showSlashMenu && (
            <div className="mx-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2">
                <div className="px-3 py-2 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                    <Hash size={12} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Quick Commands</span>
                </div>
                {SLASH_COMMANDS.map((s) => (
                    <button 
                        key={s.cmd}
                        onClick={() => selectCommand(s.cmd)}
                        className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-between"
                    >
                        {s.cmd}
                        <span className="text-[9px] font-medium opacity-50 uppercase tracking-tight">{s.label}</span>
                    </button>
                ))}
            </div>
        )}

        {/* Input area */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0">
            <form onSubmit={handleSubmit} className="relative rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all bg-white group overflow-hidden">
                <textarea
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                    placeholder={viewMode === 'template_builder' ? "E.g. Add a cardiac block..." : "E.g. BP is 120/80..."}
                    className="w-full bg-transparent border-none focus:ring-0 resize-none p-4 pr-12 text-[11px] text-slate-700 font-medium placeholder-slate-400 min-h-[56px] max-h-32"
                    rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                     <button type="button" className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"><Mic size={18} /></button>
                     <button 
                        type="submit"
                        disabled={!input.trim()}
                        className={`p-2 rounded-xl transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-200'}`}
                     >
                        <Send size={16} />
                     </button>
                </div>
            </form>
        </div>
    </aside>
  );
};
