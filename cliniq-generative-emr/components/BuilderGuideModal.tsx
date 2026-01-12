
import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Layout, 
  MousePointer2, 
  Sparkles, 
  Zap,
  CheckCircle2,
  Library,
  MessageSquare
} from 'lucide-react';

interface Props {
  onClose: () => void;
  specialty: string;
}

export const BuilderGuideModal: React.FC<Props> = ({ onClose, specialty }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to your Workspace",
      description: `We've prepared a custom design environment for your ${specialty} practice. This is where you'll build your perfect clinical workflow.`,
      icon: <Sparkles className="text-amber-500" size={32} />,
      visual: (
        <div className="relative w-full h-40 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-teal-500/10"></div>
            <div className="flex gap-2">
                <div className="w-12 h-20 bg-white rounded-lg shadow-sm animate-pulse"></div>
                <div className="w-32 h-20 bg-white rounded-lg shadow-md flex flex-col p-2 gap-1">
                    <div className="w-full h-2 bg-slate-100 rounded"></div>
                    <div className="w-2/3 h-2 bg-slate-100 rounded"></div>
                </div>
                <div className="w-12 h-20 bg-white rounded-lg shadow-sm animate-pulse"></div>
            </div>
        </div>
      )
    },
    {
      title: "The Component Library",
      description: "On the far left, you'll find specialized blocks like Vitals, Prescriptions, and custom Forms. Simply drag them onto your canvas.",
      icon: <Library className="text-indigo-500" size={32} />,
      visual: (
        <div className="w-full h-40 bg-slate-50 rounded-2xl p-4 flex gap-4">
            <div className="w-20 h-full bg-white border border-indigo-100 rounded-xl p-2 flex flex-col gap-2 relative">
                <div className="w-full h-3 bg-indigo-50 rounded"></div>
                <div className="w-full h-8 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 flex items-center justify-center">
                    <MousePointer2 size={12} className="text-white" />
                </div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-indigo-500">
                    <ChevronRight size={16} className="animate-bounce-x" />
                </div>
            </div>
            <div className="flex-1 h-full border-2 border-dashed border-slate-200 rounded-xl"></div>
        </div>
      )
    },
    {
      title: "Your Dynamic Canvas",
      description: "The middle area is your live EMR. Arrange blocks in the order you naturally consult. Hover over blocks to reorder or remove them.",
      icon: <Layout className="text-teal-500" size={32} />,
      visual: (
        <div className="w-full h-40 bg-slate-50 rounded-2xl p-4 flex flex-col gap-3">
            <div className="w-full h-10 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center px-3 justify-between">
                <div className="w-20 h-2 bg-slate-100 rounded"></div>
                <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full bg-slate-50"></div>
                    <div className="w-4 h-4 rounded-full bg-slate-50"></div>
                </div>
            </div>
            <div className="w-full h-16 bg-white border-2 border-indigo-400 rounded-xl shadow-lg flex items-center px-4 gap-3 ring-4 ring-indigo-50">
                <div className="w-6 h-6 rounded bg-indigo-100"></div>
                <div className="flex-1 space-y-2">
                    <div className="w-1/2 h-2 bg-slate-100 rounded"></div>
                    <div className="w-3/4 h-2 bg-slate-100 rounded"></div>
                </div>
            </div>
        </div>
      )
    },
    {
      title: "AI Clinical Assistant",
      description: "Too busy to drag and drop? Just tell the AI what you need. Type 'Add a pediatric growth chart' and watch the canvas update instantly.",
      icon: <MessageSquare className="text-fuchsia-500" size={32} />,
      visual: (
        <div className="w-full h-40 bg-slate-950 rounded-2xl p-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/10 to-transparent"></div>
             <div className="space-y-3">
                <div className="flex justify-end">
                    <div className="bg-white/10 rounded-lg p-2 text-[8px] text-white/60">"Add a dental chart"</div>
                </div>
                <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded bg-fuchsia-600 flex items-center justify-center text-white"><Zap size={10} /></div>
                    <div className="bg-white/5 rounded-lg p-2 text-[8px] text-white/80 w-2/3 border border-white/10">Adding dental chart to your workspace...</div>
                </div>
             </div>
        </div>
      )
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Progress Bar */}
        <div className="flex h-1.5 w-full bg-slate-100">
            {steps.map((_, i) => (
                <div 
                    key={i} 
                    className={`flex-1 transition-all duration-500 ${i <= step ? 'bg-indigo-600' : ''}`}
                ></div>
            ))}
        </div>

        <div className="p-10 flex-1 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-8 shadow-inner">
                {current.icon}
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-4">
                {current.title}
            </h2>
            
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 px-4">
                {current.description}
            </p>

            {current.visual}
        </div>

        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button 
                onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
                className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-slate-600 transition-colors"
            >
                {step === 0 ? "Skip Guide" : <><ChevronLeft size={16} /> Back</>}
            </button>

            <button 
                onClick={step === steps.length - 1 ? onClose : () => setStep(s => s + 1)}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95"
            >
                {step === steps.length - 1 ? (
                    <>Start Building <CheckCircle2 size={16} /></>
                ) : (
                    <>Next Step <ChevronRight size={16} /></>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};
