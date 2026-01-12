
import React, { useState, useEffect } from 'react';
import { Pill, Plus, Trash2, Search } from 'lucide-react';
import { CanvasComponentData, Medication } from '../../types';

interface Props {
  component: CanvasComponentData;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}

export const PrescriptionTable: React.FC<Props> = ({ component, onRemove, onUpdate }) => {
  // Use explicit typing to ensure initial state matches Medication[] and matches interface requirements
  const [meds, setMeds] = useState<Medication[]>(component.data?.medications || [
      { id: '1', name: '', quantity: '', frequency: '', duration: '', timing: '', instruction: '' } as Medication
  ]);

  useEffect(() => {
     if (component.data?.medications) setMeds(component.data.medications);
  }, [component.data]);

  const addRow = () => {
    // Explicitly typing the new row as Medication to ensure type safety
    const newMed: Medication = { 
      id: Date.now().toString(), 
      name: '', 
      quantity: '', 
      frequency: '', 
      duration: '', 
      timing: '', 
      instruction: '' 
    };
    const updatedMeds = [...meds, newMed];
    setMeds(updatedMeds);
    onUpdate(component.id, { medications: updatedMeds });
  };

  const updateRow = (id: string, field: string, value: string) => {
    const updatedMeds = meds.map(m => m.id === id ? { ...m, [field]: value } : m);
    setMeds(updatedMeds);
    onUpdate(component.id, { medications: updatedMeds });
  };

  const removeRow = (id: string) => {
    const updatedMeds = meds.filter(m => m.id !== id);
    setMeds(updatedMeds);
    onUpdate(component.id, { medications: updatedMeds });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-white group relative">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-700 text-sm">Medication</h3>
        <button onClick={() => onRemove(component.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={16} />
        </button>
      </div>

      <div className="overflow-hidden border border-gray-100 rounded-xl">
        <table className="w-full text-[11px] text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-gray-400 font-bold uppercase tracking-widest">
              <th className="px-4 py-3 w-1/4">Prescribed Medicine</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Frequency</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Timing</th>
              <th className="px-4 py-3">Instruction</th>
              <th className="px-1 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {meds.map((med) => (
              <tr key={med.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                <td className="px-3 py-2">
                    <input 
                        value={med.name} 
                        onChange={(e) => updateRow(med.id, 'name', e.target.value)}
                        placeholder="Add Medicine" 
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-indigo-200 font-medium"
                    />
                </td>
                <td className="px-3 py-2">
                    <input 
                        value={med.quantity || ''} 
                        onChange={(e) => updateRow(med.id, 'quantity', e.target.value)}
                        placeholder="ml" 
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-indigo-200"
                    />
                </td>
                <td className="px-3 py-2">
                    <input 
                        value={med.frequency || ''} 
                        onChange={(e) => updateRow(med.id, 'frequency', e.target.value)}
                        placeholder="Eg. 1-0-1" 
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-indigo-200"
                    />
                </td>
                <td className="px-3 py-2">
                    <input 
                        value={med.duration || ''} 
                        onChange={(e) => updateRow(med.id, 'duration', e.target.value)}
                        placeholder="Eg. 15 days" 
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-indigo-200"
                    />
                </td>
                <td className="px-3 py-2">
                    <input 
                        value={med.timing || ''} 
                        onChange={(e) => updateRow(med.id, 'timing', e.target.value)}
                        placeholder="Eg. After meal" 
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-indigo-200"
                    />
                </td>
                <td className="px-3 py-2">
                    <input 
                        value={med.instruction || ''} 
                        onChange={(e) => updateRow(med.id, 'instruction', e.target.value)}
                        placeholder="Eg. Daily" 
                        className="w-full bg-gray-50 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-indigo-200"
                    />
                </td>
                <td className="px-1 py-2">
                    <button onClick={() => removeRow(med.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={14} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button 
        onClick={addRow}
        className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#3f4cb1] hover:text-indigo-800 transition-colors uppercase tracking-widest"
      >
        <Plus size={14} /> Add Medicine
      </button>
    </div>
  );
};
