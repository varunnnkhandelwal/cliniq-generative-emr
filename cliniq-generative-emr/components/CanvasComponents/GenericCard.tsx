
import React, { useState } from 'react';
import { Trash2, History, Search, Plus } from 'lucide-react';
import { CanvasComponentData, ComponentType } from '../../types';

interface Props {
  component: CanvasComponentData;
  onRemove: (id: string) => void;
}

export const GenericCard: React.FC<Props> = ({ component, onRemove }) => {
  const [value, setValue] = useState(component.data?.text || '');
  const title = component.title || (component.type === ComponentType.DIAGNOSIS ? "Diagnosis" : "Advice");
  
  const isChiefComplaints = component.type === ComponentType.CHIEF_COMPLAINTS || component.title?.includes('Complaints');
  const isInvestigation = component.type === ComponentType.LAB_ORDER || component.title?.includes('Investigation');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-white group relative">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
            <h3 className="font-bold text-gray-700 text-sm tracking-tight">{title}</h3>
            {isChiefComplaints && <History size={16} className="text-[#3f4cb1]" />}
        </div>
        <div className="flex items-center gap-4">
            {isChiefComplaints && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                    <input className="pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] w-48 focus:ring-1 focus:ring-indigo-300 outline-none" placeholder="Search Template" />
                </div>
            )}
            <button onClick={() => onRemove(component.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      {isChiefComplaints ? (
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 focus-within:border-indigo-300 transition-all">
                <Plus size={14} className="text-gray-400" />
                <input className="bg-transparent border-none focus:ring-0 text-xs font-medium text-gray-600 w-full outline-none" placeholder="Add chief complaints" />
             </div>
             <div className="flex flex-wrap gap-2">
                {['Cough', 'Tenderness of gums', 'Fever', 'Tenderness of gums', 'Cold', 'Cough', 'Cold'].map((tag, i) => (
                    <button key={i} className={`px-4 py-2 rounded-full border text-[10px] font-bold flex items-center gap-2 transition-all uppercase tracking-widest ${i < 2 ? 'bg-[#f0f2ff] border-[#c7d2fe] text-[#3f4cb1]' : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-300'}`}>
                    {i < 2 && <History size={12} />} {tag}
                    </button>
                ))}
             </div>
          </div>
      ) : isInvestigation ? (
          <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
             <span className="text-xs font-medium text-gray-400">Test Appears here</span>
             <button className="text-[#3f4cb1] font-bold text-[10px] flex items-center gap-1 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                <Plus size={14} /> Add Instruction
             </button>
          </div>
      ) : (
          <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full min-h-[100px] p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-50 focus:border-indigo-300 outline-none resize-none transition-all placeholder-gray-400 text-xs font-medium text-gray-700 leading-relaxed"
              placeholder={component.data?.placeholder || `Add ${title.toLowerCase()}...`}
          />
      )}
    </div>
  );
};
