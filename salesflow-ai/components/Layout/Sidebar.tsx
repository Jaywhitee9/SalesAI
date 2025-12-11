import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  Command,
  PieChart,
  Target,
  MessageSquare,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activePage: 'dashboard' | 'calls' | 'settings' | 'leads' | 'pipeline' | 'tasks' | 'targets' | 'chat';
  onNavigate: (page: 'dashboard' | 'calls' | 'settings' | 'leads' | 'pipeline' | 'tasks' | 'targets' | 'chat') => void;
  userRole: 'rep' | 'manager';
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, userRole }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'לוח בקרה', page: 'dashboard' as const },
    { id: 'pipeline', icon: PieChart, label: 'פאנל', page: 'pipeline' as const },
    { id: 'leads', icon: Users, label: 'לידים', page: 'leads' as const },
    { id: 'calls', icon: Phone, label: 'שיחות', page: 'calls' as const },
    { id: 'tasks', icon: CheckSquare, label: 'משימות', page: 'tasks' as const },
    { id: 'chat', icon: MessageSquare, label: 'צ\'אט', page: 'chat' as const },
    ...(userRole === 'manager' ? [{ id: 'targets', icon: Target, label: 'יעדים', page: 'targets' as const }] : []),
    { id: 'reports', icon: BarChart2, label: 'דוחות', page: 'dashboard' as const },
  ];

  return (
    <div className="flex flex-col w-20 bg-[#0B1120] border-e border-white/5 items-center py-6 flex-shrink-0 z-50 shadow-xl relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-brand-500/10 to-transparent pointer-events-none"></div>

      {/* Logo */}
      <div 
        className="mb-8 p-3 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl shadow-lg shadow-brand-500/20 cursor-pointer hover:scale-105 transition-transform duration-200 group relative" 
        onClick={() => onNavigate('dashboard')}
      >
        <Command className="w-6 h-6 text-white relative z-10" />
        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-3 w-full px-3 relative z-10">
        {navItems.map((item) => {
          const isActive = activePage === item.page && (item.page !== 'dashboard' || item.id === 'dashboard');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.page)}
              className={`
                flex flex-col items-center justify-center w-full aspect-square rounded-2xl transition-all duration-300 group relative
                ${isActive
                  ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
              `}
              title={item.label}
            >
              {/* Icon Container */}
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Tooltip Label (Desktop) - or minimal text */}
              <span className={`text-[9px] mt-1.5 font-medium transition-opacity duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.label}
              </span>
              
              {/* Active Glow Indicator */}
              {isActive && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-400 rounded-r-full shadow-[0_0_12px_rgba(129,140,248,0.5)]"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-3 w-full flex flex-col gap-3">
        <button 
          onClick={() => onNavigate('settings')}
          className={`
            flex flex-col items-center justify-center w-full aspect-square rounded-2xl transition-all
            ${activePage === 'settings' 
              ? 'bg-white/10 text-white border border-white/5' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
          `}
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="w-8 h-px bg-white/10 mx-auto my-1"></div>
        
        {/* User Avatar Placeholder */}
        <div className="w-full flex justify-center">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};