
import React from 'react';
import { Video, Phone, ChevronRight, Save, LayoutTemplate, Home, MessageCircle, Settings as SettingsIcon } from 'lucide-react';
import { AppState, ComponentType } from '../types';
import { VitalsWidget } from './CanvasComponents/VitalsWidget';
import { PrescriptionTable } from './CanvasComponents/PrescriptionTable';
import { GenericCard } from './CanvasComponents/GenericCard';
import { FormWidget } from './CanvasComponents/FormWidget';
import { ChecklistWidget } from './CanvasComponents/ChecklistWidget';

interface Props {
  state: AppState;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, data: any) => void;
  addComponent: (type: ComponentType, title?: string, index?: number, initialData?: any) => void;
  reorderComponent: (fromIndex: number, toIndex: number) => void;
  isBuilderMode: boolean;
  onFinishBuilding?: () => void;
}

export const Canvas: React.FC<Props> = ({ 
    state, 
    removeComponent, 
    updateComponent, 
    addComponent,
    isBuilderMode,
    onFinishBuilding
}) => {
  const { patient, activeComponents, templateComponents, tutorialStep } = state;
  const componentsToRender = isBuilderMode ? templateComponents : activeComponents;

  return (
    <main className="flex-1 h-full overflow-hidden flex flex-col bg-[#f0f2f5] relative">
      {/* Top Breadcrumbs */}
      <div className="px-6 py-4 flex items-center gap-4 text-[11px] text-slate-400 font-bold uppercase tracking-wider bg-white border-b border-slate-100 shrink-0">
        <Home size={14} className="text-[#3f4cb1]" id="nav-tabs" /> 
        <ChevronRight size={12} className="text-slate-300" /> 
        <span>WORKSPACE</span> 
        <ChevronRight size={12} className="text-slate-300" /> 
        <span className="text-[#3f4cb1]">{isBuilderMode ? 'TEMPLATE DESIGNER' : 'LIVE CONSULTATION'}</span>
      </div>

      {/* Main Scrollable Area */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-12 ${tutorialStep !== null ? 'pointer-events-none opacity-50' : ''}`}>
        {/* Patient Header */}
        <div className="bg-[#3f4cb1] px-6 py-4 flex items-center justify-between text-white shadow-xl rounded-2xl mb-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <img src={patient.avatar} className="w-12 h-12 rounded-xl border-2 border-white/20 object-cover" alt="patient" />
            <div>
              <h2 className="text-lg font-bold leading-tight">{patient.name}</h2>
              <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest mt-0.5">
                {patient.gender.charAt(0)}/{patient.age} YRS | {patient.id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"><Video size={16} /></button>
             <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"><Phone size={16} /></button>
             <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all"><MessageCircle size={16} /></button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
            {componentsToRender.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed rounded-3xl border-slate-300 bg-white/50">
                    <LayoutTemplate size={32} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Workspace Ready</h3>
                    <p className="text-slate-300 text-[10px] mt-1">Talk to the AI to add clinical blocks</p>
                </div>
            ) : (
                componentsToRender.map((component) => (
                    <div 
                        key={component.id} 
                        id={component.type === ComponentType.CHIEF_COMPLAINTS ? 'chief-complaints' : component.id}
                        className={`transition-all duration-700 ${component.isHighlighted ? 'ring-4 ring-yellow-400/50 scale-[1.01] shadow-2xl z-10' : ''}`}
                    >
                         {(() => {
                            switch (component.type) {
                                case ComponentType.VITALS: return <VitalsWidget component={component} onRemove={removeComponent} onUpdate={updateComponent} />;
                                case ComponentType.PRESCRIPTION: return <PrescriptionTable component={component} onRemove={removeComponent} onUpdate={updateComponent} />;
                                case ComponentType.FORM: return <FormWidget component={component} onRemove={removeComponent} onUpdate={updateComponent} isBuilderMode={isBuilderMode} />;
                                case ComponentType.CHECKLIST: return <ChecklistWidget component={component} onRemove={removeComponent} onUpdate={updateComponent} isBuilderMode={isBuilderMode} />;
                                default: return <GenericCard component={component} onRemove={removeComponent} />;
                            }
                         })()}
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Bottom Sticky Bar (Now constrained to Canvas width) */}
      <div className="bg-white border-t border-slate-100 px-8 py-4 flex justify-between items-center z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] shrink-0">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-[#3f4cb1] text-[10px] font-bold uppercase tracking-widest hover:underline">
            <Save size={14} /> SAVE WORKFLOW
          </button>
          <div className="h-4 w-px bg-slate-100"></div>
          <button className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            HELP CENTER
          </button>
        </div>

        <div className="flex items-center gap-3">
            {isBuilderMode ? (
                <button 
                  onClick={onFinishBuilding}
                  className="px-10 py-3 bg-[#3f4cb1] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                    SAVE & FINISH ONBOARDING
                </button>
            ) : (
                <button 
                  id="finish-button"
                  className="px-10 py-3 bg-[#3f4cb1] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                >
                    END CONSULTATION
                </button>
            )}
        </div>
      </div>
    </main>
  );
};
