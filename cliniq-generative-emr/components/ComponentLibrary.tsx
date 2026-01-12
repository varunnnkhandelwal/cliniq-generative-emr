
import React from 'react';
import { 
  Activity, 
  Pill, 
  FileText, 
  LayoutGrid, 
  Stethoscope, 
  Smile, 
  Heart, 
  Baby, 
  Plus,
  Search,
  GripVertical
} from 'lucide-react';
import { ComponentType } from '../types';

interface Props {
  specialty: string;
  onAddComponent: (type: ComponentType, title?: string) => void;
}

const SPECIALTY_COMPONENTS: Record<string, { label: string, type: ComponentType, icon: any }[]> = {
  'General': [
    { label: 'Vitals', type: ComponentType.VITALS, icon: Activity },
    { label: 'Prescription', type: ComponentType.PRESCRIPTION, icon: Pill },
    { label: 'Chief Complaints', type: ComponentType.CHIEF_COMPLAINTS, icon: Stethoscope },
    { label: 'Clinical Notes', type: ComponentType.NOTES, icon: FileText },
    { label: 'Diagnosis', type: ComponentType.DIAGNOSIS, icon: LayoutGrid },
  ],
  'Dentist': [
    { label: 'Dental Chart', type: ComponentType.DENTAL_CHART, icon: Smile },
    { label: 'Procedure Form', type: ComponentType.FORM, icon: LayoutGrid },
    { label: 'Advice', type: ComponentType.NOTES, icon: FileText },
  ],
  'Cardiologist': [
    { label: 'Heart Vitals', type: ComponentType.VITALS, icon: Heart },
    { label: 'Lab Orders', type: ComponentType.LAB_ORDER, icon: Activity },
    { label: 'Medication', type: ComponentType.PRESCRIPTION, icon: Pill },
  ],
  'Pediatrician': [
    { label: 'Growth Tracking', type: ComponentType.FORM, icon: Baby },
    { label: 'Immunization', type: ComponentType.CHECKLIST, icon: Activity },
    { label: 'Child Vitals', type: ComponentType.VITALS, icon: Stethoscope },
  ]
};

export const ComponentLibrary: React.FC<Props> = ({ specialty, onAddComponent }) => {
  const components = SPECIALTY_COMPONENTS[specialty] || SPECIALTY_COMPONENTS['General'];

  const handleDragStart = (e: React.DragEvent, type: ComponentType, label: string) => {
    e.dataTransfer.setData('application/cliniq-component-type', type);
    e.dataTransfer.setData('application/cliniq-component-label', label);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 h-screen flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-100 bg-white">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Workspace Tools</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search components..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">{specialty} Toolkit</h4>
          <div className="grid grid-cols-1 gap-2">
            {components.map((comp) => (
              <button
                key={comp.label}
                draggable
                onDragStart={(e) => handleDragStart(e, comp.type, comp.label)}
                onClick={() => onAddComponent(comp.type, comp.label)}
                className="group flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-400 hover:shadow-sm transition-all text-left cursor-grab active:cursor-grabbing"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <comp.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-700 truncate">{comp.label}</p>
                </div>
                <GripVertical size={14} className="text-gray-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Common Blocks</h4>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Empty Form', type: ComponentType.FORM, icon: LayoutGrid },
              { label: 'Checklist', type: ComponentType.CHECKLIST, icon: Activity },
              { label: 'Text Area', type: ComponentType.NOTES, icon: FileText }
            ].map((comp) => (
              <button
                key={comp.label}
                draggable
                onDragStart={(e) => handleDragStart(e, comp.type, comp.label)}
                onClick={() => onAddComponent(comp.type, comp.label)}
                className="group flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-400 hover:shadow-sm transition-all text-left cursor-grab active:cursor-grabbing"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <comp.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-gray-700 truncate">{comp.label}</p>
                </div>
                <GripVertical size={14} className="text-gray-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="p-4 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1">AI Template Sync</p>
          <p className="text-[9px] opacity-80 leading-relaxed">Your workflow is being learned in real-time.</p>
        </div>
      </div>
    </aside>
  );
};
