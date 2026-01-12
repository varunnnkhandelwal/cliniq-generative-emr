
import React, { useState } from 'react';
import { Activity, Trash2, History, ChevronDown } from 'lucide-react';
import { CanvasComponentData } from '../../types';

interface Props {
  component: CanvasComponentData;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}

export const VitalsWidget: React.FC<Props> = ({ component, onRemove, onUpdate }) => {
  const [data, setData] = useState(component.data || { 
    pulse: '220', temp: '100', rr: '100', bp: '120/100', spo2: '100', height: '100', weight: '22' 
  });

  const handleChange = (field: string, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onUpdate(component.id, newData);
  };

  const fields = [
    { key: 'pulse', label: 'Pulse', unit: 'bpm' },
    { key: 'temp', label: 'Temperature', unit: 'F', hasDrop: true },
    { key: 'rr', label: 'Respiratory Rate', unit: 'rpm' },
    { key: 'bp', label: 'Blood Pressure', unit: 'mmHg' },
    { key: 'spo2', label: 'SOP2', unit: '%' },
    { key: 'height', label: 'Height', unit: 'cm', hasDrop: true },
    { key: 'weight', label: 'Weight', unit: 'kg', hasDrop: true },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-white group relative">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-4">
            <h3 className="font-bold text-gray-700 text-sm">Examinations</h3>
            <span className="text-[10px] text-gray-400 font-bold px-2 py-0.5 bg-gray-50 rounded uppercase tracking-wider">Patient BMI:-</span>
        </div>
        <button onClick={() => onRemove(component.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block truncate">{f.label}</label>
            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden h-11 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
              <input 
                value={data[f.key]} 
                onChange={(e) => handleChange(f.key, e.target.value)}
                className="flex-1 bg-transparent border-none text-xs font-bold text-gray-800 px-3 outline-none w-full" 
              />
              <div className="flex items-center gap-1.5 pr-3 pl-1 border-l border-gray-100 bg-white/50 h-full">
                <span className="text-[10px] font-bold text-gray-400">{f.unit}</span>
                {f.hasDrop && <ChevronDown size={12} className="text-gray-400" />}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Examination Notes</label>
        <input 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-medium text-gray-700 focus:ring-2 focus:ring-indigo-50 focus:border-indigo-300 outline-none h-11"
          placeholder="Add clinical observations..."
        />
      </div>
    </div>
  );
};