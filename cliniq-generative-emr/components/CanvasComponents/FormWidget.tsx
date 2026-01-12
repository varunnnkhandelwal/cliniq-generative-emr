
import React, { useState, useEffect } from 'react';
import { FileInput, Calendar, Type, Hash, List, CheckSquare, Trash2, Plus, GripVertical, Settings } from 'lucide-react';
import { CanvasComponentData, FormField } from '../../types';

interface Props {
  component: CanvasComponentData;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
  isBuilderMode?: boolean;
}

export const FormWidget: React.FC<Props> = ({ component, onRemove, onUpdate, isBuilderMode }) => {
  const [fields, setFields] = useState<FormField[]>(component.data?.fields || []);

  useEffect(() => {
    if (component.data?.fields) {
      setFields(component.data.fields);
    }
  }, [component.data]);

  const updateField = (id: string, key: keyof FormField, value: any) => {
    const updatedFields = fields.map(f => f.id === id ? { ...f, [key]: value } : f);
    setFields(updatedFields);
    onUpdate(component.id, { fields: updatedFields });
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
      width: 'half',
      value: ''
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onUpdate(component.id, { fields: updatedFields });
  };

  const removeField = (id: string) => {
    const updatedFields = fields.filter(f => f.id !== id);
    setFields(updatedFields);
    onUpdate(component.id, { fields: updatedFields });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4 relative group hover:border-teal-300 transition-all">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
             <FileInput size={18} />
          </div>
          {component.title || 'Dynamic Form'}
        </h3>
        <div className="flex items-center gap-2">
            {isBuilderMode && (
                <button 
                    onClick={addField}
                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
                >
                    <Plus size={14} /> Add Field
                </button>
            )}
            <button onClick={() => onRemove(component.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      <div className="flex flex-wrap -mx-2">
        {fields.length === 0 && (
            <div className="w-full text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-100 rounded-lg mx-2">
                No fields defined. {isBuilderMode ? "Add fields above." : "Template is empty."}
            </div>
        )}
        
        {fields.map((field) => (
          <div 
            key={field.id} 
            className={`px-2 mb-4 relative group/field ${
              field.width === 'full' ? 'w-full' : 
              field.width === 'third' ? 'w-1/3' : 
              field.width === 'quarter' ? 'w-1/4' : 'w-1/2'
            }`}
          >
            <div className="flex justify-between items-center mb-1.5">
                {isBuilderMode ? (
                    <input 
                        value={field.label}
                        onChange={(e) => updateField(field.id, 'label', e.target.value)}
                        className="text-xs font-semibold text-gray-700 uppercase tracking-wide bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none transition-colors w-full"
                    />
                ) : (
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {field.label}
                    </label>
                )}
                
                {isBuilderMode && (
                    <div className="opacity-0 group-hover/field:opacity-100 absolute right-2 top-0 flex items-center bg-white shadow-sm border rounded-md overflow-hidden z-10">
                        <button onClick={() => removeField(field.id)} className="p-1 hover:bg-red-50 hover:text-red-500 text-gray-400"><Trash2 size={12}/></button>
                    </div>
                )}
            </div>
            
            <div className="relative">
                {field.type === 'textarea' ? (
                    <textarea 
                        value={field.value}
                        onChange={(e) => updateField(field.id, 'value', e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all min-h-[80px] resize-y"
                        placeholder={field.placeholder || "Enter text..."}
                    />
                ) : field.type === 'select' ? (
                    <div className="relative">
                         <select 
                            value={field.value}
                            onChange={(e) => updateField(field.id, 'value', e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all appearance-none"
                        >
                            <option value="">Select option...</option>
                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <List size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    </div>
                ) : field.type === 'checkbox' ? (
                    <label className="flex items-center gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <input 
                            type="checkbox"
                            checked={field.value === true}
                            onChange={(e) => updateField(field.id, 'value', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{field.placeholder || "Yes/No"}</span>
                    </label>
                ) : (
                    <div className="relative">
                        <input 
                            type={field.type}
                            value={field.value}
                            onChange={(e) => updateField(field.id, 'value', e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                            placeholder={field.placeholder || "..."}
                        />
                        {field.type === 'date' && <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>}
                    </div>
                )}
            </div>
            
            {/* Builder Mode: Field Type Switcher */}
            {isBuilderMode && (
                <div className="mt-1 flex gap-1 justify-end opacity-0 group-hover/field:opacity-100 transition-opacity">
                    {(['text', 'number', 'date', 'select', 'textarea', 'checkbox'] as const).map(t => (
                        <button 
                            key={t}
                            onClick={() => updateField(field.id, 'type', t)}
                            className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${field.type === t ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        >
                            {t.slice(0,3)}
                        </button>
                    ))}
                     <button 
                            onClick={() => updateField(field.id, 'width', field.width === 'full' ? 'half' : 'full')}
                            className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 ml-1"
                        >
                            {field.width === 'full' ? '100%' : '50%'}
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
