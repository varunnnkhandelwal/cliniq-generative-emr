
import React, { useState, useEffect } from 'react';
import { CheckSquare, Trash2, Plus, GripVertical } from 'lucide-react';
import { CanvasComponentData, ChecklistItem } from '../../types';

interface Props {
  component: CanvasComponentData;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
  isBuilderMode?: boolean;
}

export const ChecklistWidget: React.FC<Props> = ({ component, onRemove, onUpdate, isBuilderMode }) => {
  const [items, setItems] = useState<ChecklistItem[]>(component.data?.items || []);

  useEffect(() => {
    if (component.data?.items) {
      setItems(component.data.items);
    }
  }, [component.data]);

  const toggleItem = (id: string) => {
    const updatedItems = items.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    setItems(updatedItems);
    onUpdate(component.id, { items: updatedItems });
  };

  const updateLabel = (id: string, label: string) => {
    const updatedItems = items.map(i => i.id === id ? { ...i, label } : i);
    setItems(updatedItems);
    onUpdate(component.id, { items: updatedItems });
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      label: 'New Item',
      checked: false
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onUpdate(component.id, { items: updatedItems });
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(i => i.id !== id);
    setItems(updatedItems);
    onUpdate(component.id, { items: updatedItems });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4 relative group hover:border-teal-300 transition-all">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
          <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
             <CheckSquare size={18} />
          </div>
          {component.title || 'Checklist'}
        </h3>
        <div className="flex items-center gap-2">
            {isBuilderMode && (
                <button 
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-md transition-colors"
                >
                    <Plus size={14} /> Add Item
                </button>
            )}
            <button onClick={() => onRemove(component.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group/item">
            <button 
                onClick={() => toggleItem(item.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    item.checked ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-transparent hover:border-green-400'
                }`}
            >
                <CheckSquare size={12} fill="currentColor" />
            </button>
            
            {isBuilderMode ? (
                <input 
                    value={item.label}
                    onChange={(e) => updateLabel(item.id, e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none border-b border-transparent focus:border-gray-300 hover:border-gray-200"
                />
            ) : (
                <span className={`flex-1 text-sm ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {item.label}
                </span>
            )}

            {isBuilderMode && (
                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100">
                    <Trash2 size={14} />
                </button>
            )}
          </div>
        ))}
        {items.length === 0 && (
            <div className="col-span-2 text-center text-sm text-gray-400 italic py-2">
                Empty list.
            </div>
        )}
      </div>
    </div>
  );
};
