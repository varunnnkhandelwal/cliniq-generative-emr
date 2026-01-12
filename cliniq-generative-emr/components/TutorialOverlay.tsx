
import React from 'react';
import { X, ChevronRight, Layout, Zap, CheckCircle2, MessageSquare, Pill } from 'lucide-react';

interface Props {
  step: number;
  onNext: () => void;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Step 1: Clinical Workspace",
    description: "Your workspace is split 70/30. The EMR form on the left expands when you need more focus.",
    icon: <Layout className="text-indigo-600" />,
    target: "nav-tabs"
  },
  {
    title: "Step 2: Smart Tag Entry",
    description: "Quickly add symptoms or findings using specialty-specific tags. Click to document instantly.",
    icon: <CheckCircle2 className="text-teal-500" />,
    target: "chief-complaints"
  },
  {
    title: "Step 3: Chat-to-Form Sync",
    description: "Try typing 'BP is 120/80'. Watch clinical data flow from the chat directly into your form.",
    icon: <Zap className="text-amber-500" />,
    target: "ai-assistant"
  },
  {
    title: "Step 4: AI Assistant",
    description: "Ask your assistant to add specialized forms or risk calculators using natural language.",
    icon: <MessageSquare className="text-fuchsia-500" />,
    target: "ai-assistant"
  },
  {
    title: "Step 5: Finalize Session",
    description: "Ready to wrap up? Use 'End Consultation' to save your work and generate the prescription.",
    icon: <Pill className="text-indigo-600" />,
    target: "finish-button"
  }
];

export const TutorialOverlay: React.FC<Props> = ({ step, onNext, onClose }) => {
  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 pointer-events-auto animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors">
            <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-[24px] bg-slate-50 flex items-center justify-center mb-8 shadow-inner ring-4 ring-slate-100/50">
                {current.icon}
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-4">
                {current.title}
            </h2>
            <p className="text-slate-500 text-[13px] font-medium leading-relaxed mb-10 px-4">
                {current.description}
            </p>

            <div className="w-full flex items-center justify-between">
                <div className="flex gap-2">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-600 shadow-lg shadow-indigo-100' : 'w-1.5 bg-slate-100'}`} />
                    ))}
                </div>
                <button 
                    onClick={onNext}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
                >
                    {step === 4 ? "Get Started" : "Next Step"} <ChevronRight size={16} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
