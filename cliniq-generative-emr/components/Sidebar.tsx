
import React from 'react';
import { 
  Home, 
  Users, 
  Stethoscope, 
  Pill, 
  FolderOpen, 
  Syringe, 
  Eye,
  Plus,
  Settings,
  Grid
} from 'lucide-react';
import { ViewMode, ComponentType } from '../types';

interface SidebarProps {
  viewMode: ViewMode;
  onAddComponent: (type: ComponentType, title?: string, index?: number, initialData?: any) => void;
  specialty: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ viewMode, onAddComponent, specialty }) => {
  const isBuilder = viewMode === 'template_builder';

  const navItems = [
    { icon: Home, label: 'Home', type: 'home' },
    { icon: Users, label: 'Patients', type: 'patients', active: !isBuilder },
    { icon: Stethoscope, label: 'Consultations', type: 'consult' },
    { icon: Pill, label: 'Pharmacy', type: 'pharmacy' },
    { icon: FolderOpen, label: 'Files', type: 'files' },
    { icon: Syringe, label: 'Procedures', type: 'procedures' },
    { icon: Eye, label: 'Examinations', type: 'exams' },
  ];

  return (
    <div className="w-16 bg-[#3f4cb1] h-screen flex flex-col items-center py-6 shrink-0 shadow-xl z-50">
      {/* Brand Header */}
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-10 cursor-pointer hover:bg-white/30 transition-all">
        Q
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={`p-3 rounded-xl transition-all relative group ${
              item.active 
                ? 'bg-white text-[#3f4cb1] shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <item.icon size={22} />
            {item.active && (
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-l-full shadow-sm"></div>
            )}
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 uppercase tracking-widest font-bold">
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-4 mt-auto">
        <button className="p-3 text-white/60 hover:text-white transition-colors">
            <Settings size={22} />
        </button>
        <button 
          onClick={() => onAddComponent(ComponentType.NOTES)}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/20 transition-all mb-4"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};