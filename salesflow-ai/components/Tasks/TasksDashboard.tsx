
import React, { useState } from 'react';
import { 
  Calendar, 
  Filter, 
  Plus, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  ChevronDown,
  MoreHorizontal,
  X,
  ArrowLeft,
  Sparkles,
  Play,
  User as UserIcon,
  Search,
  Users,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Trash2,
  Edit3,
  AlertTriangle,
  ListTodo
} from 'lucide-react';
import { Button } from '../Common/Button';
import { Badge } from '../Common/Badge';
import { User } from '../../types';
import { TEAM_MEMBERS } from '../../constants';

// --- Types & Mock Data ---

type TaskType = 'call' | 'email' | 'proposal' | 'whatsapp' | 'admin' | 'meeting' | 'file';
type TaskStatus = 'open' | 'completed' | 'overdue';
type TaskPriority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  type: TaskType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  leadName?: string;
  leadId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  aiReason?: string; // For "Next Best Action"
  notes?: string;
  ownerId?: string; // For Manager View
  managerNote?: string; // For Manager View
}

const MOCK_TASKS: Task[] = [
  // Rep's Tasks (Assigned to u1 - Sarah)
  { id: 't1', title: 'שיחת פולואפ על הצעת מחיר', type: 'call', dueDate: '2024-11-09', dueTime: '10:00', leadName: 'מיכאל רוס', status: 'overdue', priority: 'high', aiReason: 'הלקוח פתח את ההצעה 3 פעמים אתמול', ownerId: 'u1' },
  { id: 't2', title: 'אישור חוזה סופי', type: 'admin', dueDate: '2024-11-09', dueTime: '14:00', leadName: 'חברת אלפא', status: 'overdue', priority: 'medium', ownerId: 'u1' },
  { id: 't3', title: 'הכנת מצגת לקראת פגישה', type: 'file', dueDate: '2024-11-10', dueTime: '09:00', leadName: 'דנה שפירא', status: 'completed', priority: 'medium', ownerId: 'u1' },
  { id: 't4', title: 'שיחת היכרות ראשונית', type: 'call', dueDate: '2024-11-10', dueTime: '10:30', leadName: 'רונית אברהם', status: 'open', priority: 'high', aiReason: 'ליד חם חדש שנכנס הבוקר', ownerId: 'u1' },
  { id: 't5', title: 'שליחת סיכום פגישה', type: 'email', dueDate: '2024-11-10', dueTime: '13:00', leadName: 'יוסי ברק', status: 'open', priority: 'medium', ownerId: 'u1' },
  { id: 't6', title: 'בדיקת סטטוס בוואטסאפ', type: 'whatsapp', dueDate: '2024-11-10', dueTime: '14:15', leadName: 'ענת גולן', status: 'open', priority: 'low', ownerId: 'u1' },
  { id: 't7', title: 'עדכון CRM וסגירת יום', type: 'admin', dueDate: '2024-11-10', dueTime: '16:30', status: 'open', priority: 'low', ownerId: 'u1' },
  { id: 't8', title: 'פגישת מו"מ', type: 'meeting', dueDate: '2024-11-11', dueTime: '11:00', leadName: 'גיא פלד', status: 'open', priority: 'high', ownerId: 'u1' },

  // Team Tasks (Assigned to others)
  { id: 't9', title: 'הכנת חוזה לחתימה', type: 'admin', dueDate: '2024-11-09', dueTime: '09:00', leadName: 'טכנולוגיות בע"מ', status: 'overdue', priority: 'high', ownerId: 'u3' }, // Ron
  { id: 't10', title: 'שיחת מכירה ראשונה', type: 'call', dueDate: '2024-11-10', dueTime: '11:00', leadName: 'דוד כהן', status: 'open', priority: 'medium', ownerId: 'u3' },
  { id: 't11', title: 'פולואפ לאחר דמו', type: 'email', dueDate: '2024-11-10', dueTime: '15:00', leadName: 'סטארט אפ ניישן', status: 'open', priority: 'high', ownerId: 'u4' }, // Daniel
  { id: 't12', title: 'שיחת שימור לקוח', type: 'call', dueDate: '2024-11-08', dueTime: '10:00', leadName: 'חברת גמא', status: 'overdue', priority: 'high', ownerId: 'u4' },
  { id: 't13', title: 'הצעת מחיר דחופה', type: 'proposal', dueDate: '2024-11-10', dueTime: '12:00', leadName: 'אבי לוי', status: 'open', priority: 'high', ownerId: 'u5' }, // Noa
  { id: 't14', title: 'עדכון פרטי ליד', type: 'admin', dueDate: '2024-11-10', dueTime: '16:00', status: 'completed', priority: 'low', ownerId: 'u5' },
];

const TaskIcon = ({ type }: { type: TaskType }) => {
  switch (type) {
    case 'call': return <Phone className="w-3.5 h-3.5" />;
    case 'email': return <Mail className="w-3.5 h-3.5" />;
    case 'proposal': return <FileText className="w-3.5 h-3.5" />;
    case 'file': return <FileText className="w-3.5 h-3.5" />;
    case 'whatsapp': return <MessageSquare className="w-3.5 h-3.5" />;
    case 'meeting': return <Briefcase className="w-3.5 h-3.5" />;
    default: return <CheckSquare className="w-3.5 h-3.5" />;
  }
};

const TaskTypeLabel = ({ type }: { type: TaskType }) => {
  switch (type) {
    case 'call': return <span>שיחת טלפון</span>;
    case 'email': return <span>אימייל</span>;
    case 'proposal': return <span>הצעת מחיר</span>;
    case 'whatsapp': return <span>הודעת וואטסאפ</span>;
    case 'meeting': return <span>פגישה</span>;
    case 'file': return <span>קובץ</span>;
    default: return <span>כללי</span>;
  }
};

const TaskRow: React.FC<{ task: Task; onClick: () => void }> = ({ task, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-xl border border-transparent bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-brand-200 dark:hover:border-slate-700 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="flex items-center gap-4 relative z-10">
        {/* Checkbox */}
        <div 
           className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
             task.status === 'completed' 
               ? 'bg-emerald-500 border-emerald-500 text-white' 
               : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-slate-50 dark:bg-slate-800'
           }`}
           onClick={(e) => {
             e.stopPropagation();
             // In a real app, toggle completion here
           }}
        >
           {task.status === 'completed' && <CheckSquare className="w-4 h-4" />}
        </div>

        <div>
           <div className="flex items-center gap-2">
             <p className={`text-sm font-bold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
               {task.title}
             </p>
             {task.priority === 'high' && (
                 <span className="flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-rose-100 dark:ring-rose-900/50" title="עדיפות גבוהה"></span>
             )}
           </div>
           
           <div className="flex items-center gap-3 mt-1">
              <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${
                  task.type === 'call' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                  task.type === 'email' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                <TaskIcon type={task.type} />
                <span className="text-[10px]"><TaskTypeLabel type={task.type} /></span>
              </span>
              
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {task.dueTime}
              </span>

              {task.leadName && (
                <>
                  <span className="text-slate-300 text-[10px]">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{task.leadName}</span>
                </>
              )}
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
         <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-brand-600 transition-colors">
            <Edit3 className="w-4 h-4" />
         </button>
         <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
            <Trash2 className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

// --- View Component: Rep Tasks (Original) ---

const RepTasksView: React.FC<{
  tasks: Task[];
  onSelectTask: (t: Task) => void;
  activeTab: string;
  setActiveTab: (t: 'today' | 'week' | 'all') => void;
}> = ({ tasks, onSelectTask, activeTab, setActiveTab }) => {
    // Derived Data
  const overdueTasks = tasks.filter(t => t.status === 'overdue');
  const todayTasks = tasks.filter(t => t.dueDate === '2024-11-10');
  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  
  // Filter Logic
  let displayedTasks = tasks;
  if (activeTab === 'today') {
    displayedTasks = todayTasks;
  } else if (activeTab === 'week') {
    displayedTasks = tasks.filter(t => t.dueDate >= '2024-11-10' && t.dueDate <= '2024-11-17');
  }

  // Grouping for "Today" View
  const morningTasks = displayedTasks.filter(t => t.dueTime && parseInt(t.dueTime) < 12);
  const noonTasks = displayedTasks.filter(t => t.dueTime && parseInt(t.dueTime) >= 12 && parseInt(t.dueTime) < 15);
  const afternoonTasks = displayedTasks.filter(t => t.dueTime && parseInt(t.dueTime) >= 15);
  // Add overdue to the top of "Today" view if not completed
  const relevantOverdue = activeTab === 'today' ? overdueTasks : [];

  const priorityTasks = tasks.filter(t => t.aiReason && t.status !== 'completed').slice(0, 2);

  return (
      <>
      {/* 2. KPI Cards - Premium Look */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-6">
         {/* Open Tasks */}
         <div className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100 dark:border-slate-800 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
               <span className="text-sm font-medium text-slate-500 dark:text-slate-400">משימות פתוחות</span>
               <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                  <ListTodo className="w-4 h-4" />
               </div>
            </div>
            <div className="mb-3 relative z-10">
               <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">12</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
               <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
         </div>
         
         {/* Overdue */}
         <div className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100 dark:border-slate-800 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
               <span className="text-sm font-medium text-slate-500 dark:text-slate-400">משימות באיחור</span>
               <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-900/20">
                  <AlertCircle className="w-4 h-4" />
               </div>
            </div>
            <div className="mb-3 relative z-10 flex items-end gap-2">
               <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">2</span>
               <Badge variant="danger" className="mb-1 text-[10px]">דחוף</Badge>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
               <div className="h-full bg-rose-500 rounded-full" style={{ width: '20%' }}></div>
            </div>
         </div>

         {/* Today's Progress */}
         <div className="group bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-card hover:shadow-card-hover border border-slate-100 dark:border-slate-800 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
               <span className="text-sm font-medium text-slate-500 dark:text-slate-400">הושלמו היום</span>
               <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">
                  <CheckCircle2 className="w-4 h-4" />
               </div>
            </div>
            <div className="mb-3 relative z-10">
               <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">{completedToday}</span>
                  <span className="text-sm text-slate-400 font-medium">/ {todayTasks.length}</span>
               </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative z-10">
               <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${(completedToday / (todayTasks.length || 1)) * 100}%` }}></div>
            </div>
         </div>
      </div>

      {/* 3. Main Content - Split Layout */}
      <div className="flex-1 overflow-hidden px-6 pb-6 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* RIGHT COLUMN: Task List (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm h-full overflow-hidden backdrop-blur-sm">
             
             {/* Tabs */}
             <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 pt-4 pb-0 bg-white dark:bg-slate-900 rounded-t-2xl">
               <div className="flex gap-6">
                 {[
                   { id: 'today', label: 'היום' },
                   { id: 'week', label: 'השבוע' },
                   { id: 'all', label: 'כל המשימות' }
                 ].map(tab => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`
                       pb-4 text-sm font-medium border-b-2 transition-all
                       ${activeTab === tab.id 
                         ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400' 
                         : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}
                     `}
                   >
                     {tab.label}
                   </button>
                 ))}
               </div>
               <Button variant="ghost" size="sm" className="text-xs mb-2">
                  <Filter className="w-3.5 h-3.5 ml-1.5" /> סינון
               </Button>
             </div>

             {/* Task List Content */}
             <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 dark:bg-slate-950/30">
               
               {/* Overdue Section */}
               {relevantOverdue.length > 0 && (
                 <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2 pl-2 border-l-2 border-rose-500">
                       באיחור ({relevantOverdue.length})
                    </h3>
                    <div className="space-y-3">
                      {relevantOverdue.map(task => (
                        <TaskRow key={task.id} task={task} onClick={() => onSelectTask(task)} />
                      ))}
                    </div>
                 </div>
               )}

               {/* Morning */}
               {morningTasks.length > 0 && (
                 <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                      בוקר (08:00 - 12:00)
                    </h3>
                    <div className="space-y-3">
                      {morningTasks.map(task => (
                        <TaskRow key={task.id} task={task} onClick={() => onSelectTask(task)} />
                      ))}
                    </div>
                 </div>
               )}

               {/* Noon */}
               {noonTasks.length > 0 && (
                 <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                      צהריים (12:00 - 15:00)
                    </h3>
                    <div className="space-y-3">
                      {noonTasks.map(task => (
                        <TaskRow key={task.id} task={task} onClick={() => onSelectTask(task)} />
                      ))}
                    </div>
                 </div>
               )}

               {/* Afternoon */}
               {afternoonTasks.length > 0 && (
                 <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                      אחר הצהריים (15:00 - 18:00)
                    </h3>
                    <div className="space-y-3">
                      {afternoonTasks.map(task => (
                        <TaskRow key={task.id} task={task} onClick={() => onSelectTask(task)} />
                      ))}
                    </div>
                 </div>
               )}

               <div className="pt-4 text-center">
                 <Button variant="ghost" size="sm" className="text-slate-400 hover:text-brand-600">טען עוד משימות</Button>
               </div>
             </div>
          </div>

          {/* LEFT COLUMN: Smart Widgets (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pb-4">
             
             {/* Widget 1: Next Best Action - UPDATED DESIGN */}
             <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-2xl shadow-xl shadow-indigo-900/20 p-6 text-white relative overflow-hidden flex-shrink-0 border border-white/5">
                {/* Abstract Blurs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full -mr-10 -mt-10 blur-3xl mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full -ml-5 -mb-5 blur-3xl mix-blend-overlay"></div>
                
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                        <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300/20" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">הדבר הבא</h3>
                        <p className="text-xs text-indigo-200 opacity-80">משימות בעדיפות עליונה ע"פ ה-AI</p>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                     {priorityTasks.map((task, idx) => (
                       <div key={task.id} className="group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1" onClick={() => onSelectTask(task)}>
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                               <Badge variant="warning" className="text-[10px] bg-amber-500/20 text-amber-100 border-amber-500/30 backdrop-blur-md">עדיפות גבוהה</Badge>
                             </div>
                             <span className="text-xs text-indigo-200 font-mono bg-black/20 px-2 py-0.5 rounded-md">{task.dueTime}</span>
                          </div>
                          <p className="text-sm font-bold mb-1.5 truncate text-white">{task.title}</p>
                          <div className="flex items-start gap-2 mb-4">
                             <div className="w-0.5 h-full bg-indigo-400/50 rounded-full self-stretch"></div>
                             <p className="text-xs text-indigo-100 opacity-80 leading-relaxed">"{task.aiReason}"</p>
                          </div>
                          <button className="w-full py-2 bg-white text-indigo-900 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <Play className="w-3 h-3 fill-current" /> התחל ביצוע
                          </button>
                       </div>
                     ))}
                   </div>
                </div>
             </div>

             {/* Widget 2: Stats by Type - Cleaned up */}
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-5 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-500" />
                  פילוח משימות
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { label: 'שיחות', count: 5, icon: Phone, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
                     { label: 'פולואפ', count: 3, icon: Mail, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
                     { label: 'הצעות מחיר', count: 2, icon: FileText, color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' },
                     { label: 'פגישות', count: 1, icon: Users, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
                   ].map((stat, i) => (
                     <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors group cursor-default">
                        <div className={`p-2.5 rounded-xl mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                           <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{stat.count}</span>
                        <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
      </>
  );
};

// --- View Component: Manager Tasks ---

const ManagerTasksView: React.FC<{
  tasks: Task[];
  onSelectTask: (t: Task) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}> = ({ tasks, onSelectTask, selectedIds, onToggleSelect, onToggleSelectAll }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'overdue'>('all');
  
  // KPI Stats
  const totalOpen = tasks.filter(t => t.status !== 'completed').length;
  const totalOverdue = tasks.filter(t => t.status === 'overdue').length;
  const totalToday = tasks.filter(t => t.dueDate === '2024-11-10').length;

  // Filter Tasks for Table
  let tableTasks = tasks;
  if (activeTab === 'today') tableTasks = tasks.filter(t => t.dueDate === '2024-11-10');
  if (activeTab === 'overdue') tableTasks = tasks.filter(t => t.status === 'overdue');

  // Rep Stats Calculation
  const getRepStats = (userId: string) => {
    const userTasks = tasks.filter(t => t.ownerId === userId);
    const open = userTasks.filter(t => t.status !== 'completed').length;
    const overdue = userTasks.filter(t => t.status === 'overdue').length;
    return { open, overdue, total: userTasks.length };
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-6">
      
      {/* 1. Manager KPIs */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-4 gap-6 flex-shrink-0">
         {[
           { label: 'משימות פתוחות', value: totalOpen, trend: '+4', trendDir: 'up', icon: CheckSquare, color: 'brand' },
           { label: 'משימות באיחור', value: totalOverdue, trend: '+2', trendDir: 'down', icon: AlertCircle, color: 'rose' },
           { label: 'משימות להיום', value: totalToday, trend: '85%', trendDir: 'neutral', icon: Calendar, color: 'blue' },
           { label: 'הושלמו השבוע', value: '45', trend: '+12%', trendDir: 'up', icon: CheckCircle2, color: 'emerald' },
         ].map((kpi, i) => (
           <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card hover:shadow-card-hover relative overflow-hidden transition-all duration-300">
             <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</span>
                <div className={`p-1.5 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600 dark:bg-${kpi.color}-900/20 dark:text-${kpi.color}-400`}>
                   <kpi.icon className="w-4 h-4" />
                </div>
             </div>
             <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{kpi.value}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 flex items-center gap-0.5
                   ${kpi.trendDir === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 
                     kpi.trendDir === 'down' ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : 
                     'text-slate-500 bg-slate-100 dark:bg-slate-800'}
                `}>
                   {kpi.trendDir === 'up' && <ArrowUpRight className="w-2.5 h-2.5" />}
                   {kpi.trendDir === 'down' && <ArrowDownRight className="w-2.5 h-2.5" />}
                   {kpi.trend}
                </span>
             </div>
           </div>
         ))}
      </div>

      {/* 2. Middle Row: Team Overview & Risks */}
      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6 flex-shrink-0">
         
         {/* Left: Tasks by Rep */}
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">סטטוס משימות לפי נציג</h3>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-right text-sm">
                 <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-xs">
                    <tr>
                       <th className="px-4 py-3 rounded-tr-xl">נציג</th>
                       <th className="px-4 py-3">פתוחות</th>
                       <th className="px-4 py-3">באיחור</th>
                       <th className="px-4 py-3 rounded-tl-xl">בריאות</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {TEAM_MEMBERS.map(member => {
                       const stats = getRepStats(member.id);
                       const health = stats.overdue > 2 ? 'critical' : stats.overdue > 0 ? 'warning' : 'good';
                       return (
                         <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
                            <td className="px-4 py-3 flex items-center gap-3">
                               <img src={member.avatar} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" alt="" />
                               <span className="font-medium text-slate-900 dark:text-white">{member.name}</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{stats.open}</td>
                            <td className="px-4 py-3 font-bold text-rose-600 dark:text-rose-400">{stats.overdue}</td>
                            <td className="px-4 py-3">
                               <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  health === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 
                                  health === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                               }`}>
                                  {health === 'critical' ? 'קריטי' : health === 'warning' ? 'בינוני' : 'תקין'}
                               </span>
                            </td>
                         </tr>
                       );
                    })}
                 </tbody>
              </table>
            </div>
         </div>

         {/* Right: At Risk / Overdue Focus */}
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5 text-rose-500" />
                 משימות בסיכון / איחור
               </h3>
               <span className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2.5 py-1 rounded-full font-bold border border-rose-100 dark:border-rose-800">
                 {tasks.filter(t => t.status === 'overdue').length} לטיפול
               </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[240px] pr-2">
               {tasks.filter(t => t.status === 'overdue').map(task => (
                 <div key={task.id} className="flex items-center justify-between p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-900/10 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all group">
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{task.title}</p>
                       <div className="flex items-center gap-3 mt-1">
                          {task.ownerId && (
                             <div className="flex items-center gap-1.5">
                                <img src={TEAM_MEMBERS.find(u => u.id === task.ownerId)?.avatar} className="w-4 h-4 rounded-full" alt="" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">{TEAM_MEMBERS.find(u => u.id === task.ownerId)?.name}</span>
                             </div>
                          )}
                          <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {task.dueDate}
                          </span>
                       </div>
                    </div>
                    <button 
                       onClick={(e) => { e.stopPropagation(); onSelectTask(task); }}
                       className="text-xs font-medium text-brand-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:border-brand-300 dark:hover:border-brand-700 transition-colors shadow-sm"
                    >
                       נהל
                    </button>
                 </div>
               ))}
            </div>
         </div>

      </div>

      {/* 3. Full Team Task List */}
      <div className="flex-1 px-6 pb-6 min-h-0">
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
            
            {/* Table Header Controls */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
               <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {['all', 'today', 'overdue'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                        activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab === 'all' ? 'כל המשימות' : tab === 'today' ? 'היום' : 'באיחור'}
                    </button>
                  ))}
               </div>
               
               <div className="relative w-full sm:w-72">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="חיפוש לפי ליד, נציג או משימה..." className="w-full pr-10 pl-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
               </div>
            </div>
            
            {/* Bulk Actions Bar (Conditional) */}
            {selectedIds.length > 0 && (
               <div className="bg-brand-50 dark:bg-brand-900/20 px-6 py-2 border-b border-brand-100 dark:border-brand-800/50 flex items-center justify-between animate-in slide-in-from-top-2">
                  <span className="text-sm font-medium text-brand-700 dark:text-brand-300">{selectedIds.length} משימות נבחרו</span>
                  <div className="flex items-center gap-2">
                     <Button size="sm" variant="secondary" className="h-8 text-xs bg-white border-brand-200 hover:border-brand-300">
                        <RefreshCw className="w-3.5 h-3.5 ml-1.5" /> הקצה לנציג
                     </Button>
                     <Button size="sm" variant="secondary" className="h-8 text-xs bg-white border-brand-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200">
                        <Trash2 className="w-3.5 h-3.5 ml-1.5" /> מחק
                     </Button>
                  </div>
               </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto">
               <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-xs sticky top-0 z-10 font-semibold">
                     <tr>
                        <th className="px-6 py-4 w-12">
                           <input 
                              type="checkbox" 
                              checked={selectedIds.length === tasks.length && tasks.length > 0}
                              onChange={onToggleSelectAll}
                              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" 
                           />
                        </th>
                        <th className="px-6 py-4">משימה</th>
                        <th className="px-6 py-4">סוג</th>
                        <th className="px-6 py-4">אחראי (Rep)</th>
                        <th className="px-6 py-4">ליד קשור</th>
                        <th className="px-6 py-4">תאריך יעד</th>
                        <th className="px-6 py-4">סטטוס</th>
                        <th className="px-6 py-4">עדיפות</th>
                        <th className="px-6 py-4 w-10"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     {tableTasks.map(task => (
                        <tr key={task.id} onClick={() => onSelectTask(task)} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
                           <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                              <input 
                                 type="checkbox" 
                                 checked={selectedIds.includes(task.id)}
                                 onChange={() => onToggleSelect(task.id)}
                                 className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" 
                              />
                           </td>
                           <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-[240px] truncate">{task.title}</td>
                           <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                 <TaskIcon type={task.type} />
                                 <span className="hidden xl:inline"><TaskTypeLabel type={task.type} /></span>
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              {task.ownerId && (
                                 <div className="flex items-center gap-2">
                                    <img src={TEAM_MEMBERS.find(u => u.id === task.ownerId)?.avatar} className="w-7 h-7 rounded-full border border-white dark:border-slate-700 shadow-sm" alt="" />
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{TEAM_MEMBERS.find(u => u.id === task.ownerId)?.name}</span>
                                 </div>
                              )}
                           </td>
                           <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{task.leadName || '-'}</td>
                           <td className="px-6 py-4">
                              <span className={`text-xs font-mono font-medium ${task.status === 'overdue' ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded' : 'text-slate-600 dark:text-slate-400'}`}>
                                 {task.dueDate}
                                 <span className="opacity-70 mx-1">{task.dueTime}</span>
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <Badge variant={task.status === 'overdue' ? 'danger' : task.status === 'completed' ? 'success' : 'neutral'}>
                                 {task.status === 'overdue' ? 'באיחור' : task.status === 'completed' ? 'הושלם' : 'פתוח'}
                              </Badge>
                           </td>
                           <td className="px-6 py-4">
                              {task.priority === 'high' && <Badge variant="warning">גבוהה</Badge>}
                              {task.priority === 'medium' && <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">רגילה</span>}
                              {task.priority === 'low' && <span className="text-xs text-slate-400">נמוכה</span>}
                           </td>
                           <td className="px-6 py-4">
                              <button className="text-slate-400 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                 <MoreHorizontal className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

    </div>
  );
};

// --- Main Container ---

interface TasksDashboardProps {
  isDarkMode: boolean;
  currentUser?: User;
}

export const TasksDashboard: React.FC<TasksDashboardProps> = ({ isDarkMode, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'all'>('today');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Header State
  const [dateRange, setDateRange] = useState('היום');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);

  // Determine Role
  const isManager = currentUser?.type === 'manager';

  // Toggle selection for bulk actions (Manager)
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === MOCK_TASKS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(MOCK_TASKS.map(l => l.id));
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full bg-transparent relative"> {/* Transparent bg to show global mesh */}
      
      {/* 1. Page Header (Common but varies by role) */}
      <div className="px-6 py-6 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0 animate-slide-up">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
             {isManager ? 'משימות צוות' : 'המשימות שלי'}
           </h1>
           <p className="text-slate-500 dark:text-slate-400 text-base mt-2">
             {isManager ? 'ניהול משימות, פולואפים והתחייבויות של כל צוות המכירות.' : 'תמונה מלאה של כל המשימות שלך להיום ולימים הקרובים.'}
           </p>
        </div>
        <div className="flex items-center gap-3 relative z-20">
           
           {isManager && (
             <div className="relative">
               <Button 
                 variant="secondary" 
                 className="hidden sm:flex bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 min-w-[140px] justify-between items-center"
                 onClick={() => { setIsTeamOpen(!isTeamOpen); setIsTimeOpen(false); }}
               >
                 <div className="flex items-center">
                   <Users className="w-4 h-4 ml-2" />
                   <span className="truncate max-w-[100px] text-sm">
                      {selectedTeam === 'all' ? 'כל הצוות' : TEAM_MEMBERS.find(m => m.id === selectedTeam)?.name}
                   </span>
                 </div>
                 <ChevronDown className={`w-3.5 h-3.5 mr-2 opacity-50 transition-transform duration-200 ${isTeamOpen ? 'rotate-180' : ''}`} />
               </Button>
               
               {isTeamOpen && (
                 <>
                   <div className="fixed inset-0 z-10" onClick={() => setIsTeamOpen(false)}></div>
                   <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                      <button 
                          onClick={() => { setSelectedTeam('all'); setIsTeamOpen(false); }}
                          className={`w-full text-right px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${selectedTeam === 'all' ? 'bg-brand-50/50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-200'}`}
                      >
                          <span className="font-medium">כל הצוות</span>
                          {selectedTeam === 'all' && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                      <div className="max-h-[240px] overflow-y-auto">
                        {TEAM_MEMBERS.map(member => (
                            <button 
                                key={member.id}
                                onClick={() => { setSelectedTeam(member.id); setIsTeamOpen(false); }}
                                className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group ${selectedTeam === member.id ? 'bg-brand-50/50 dark:bg-brand-900/10 text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={member.avatar} className="w-6 h-6 rounded-full border border-slate-100 dark:border-slate-700 object-cover" alt="" />
                                    <span className="truncate">{member.name}</span>
                                </div>
                                {selectedTeam === member.id && <CheckCircle2 className="w-4 h-4" />}
                            </button>
                        ))}
                      </div>
                   </div>
                 </>
               )}
             </div>
           )}
           
           <div className="relative">
             <Button 
               variant="secondary" 
               className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 min-w-[140px] justify-between items-center"
               onClick={() => { setIsTimeOpen(!isTimeOpen); setIsTeamOpen(false); }}
             >
               <div className="flex items-center">
                 <Calendar className="w-4 h-4 ml-2" />
                 <span className="text-sm">{dateRange}</span>
               </div>
               <ChevronDown className={`w-3.5 h-3.5 mr-2 opacity-50 transition-transform duration-200 ${isTimeOpen ? 'rotate-180' : ''}`} />
             </Button>

             {isTimeOpen && (
               <>
                 <div className="fixed inset-0 z-10" onClick={() => setIsTimeOpen(false)}></div>
                 <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-200">
                    {['היום', 'אתמול', '7 ימים אחרונים', '30 ימים אחרונים', 'חודש נוכחי', 'טווח מותאם…'].map(range => (
                        <button 
                            key={range}
                            onClick={() => { setDateRange(range); setIsTimeOpen(false); }}
                            className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between ${dateRange === range ? 'text-brand-600 bg-brand-50/50 dark:bg-brand-900/10 font-medium' : 'text-slate-700 dark:text-slate-200'}`}
                        >
                            <span>{range}</span>
                            {dateRange === range && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                    ))}
                 </div>
               </>
             )}
           </div>
           
           <Button className="shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
             <Plus className="w-4 h-4 ml-2" />
             {isManager ? 'משימה חדשה לצוות' : 'משימה חדשה'}
           </Button>
        </div>
      </div>

      {/* 2. Content View Switch */}
      {isManager ? (
        <ManagerTasksView 
          tasks={MOCK_TASKS} 
          onSelectTask={setSelectedTask} 
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />
      ) : (
        <RepTasksView 
           tasks={MOCK_TASKS.filter(t => t.ownerId === 'u1')} // Filter for Sarah
           onSelectTask={setSelectedTask}
           activeTab={activeTab}
           setActiveTab={setActiveTab}
        />
      )}

      {/* 3. Task Details Drawer (Shared with role-based features) */}
      <TaskDrawer 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
        isManager={isManager} 
      />

    </div>
  );
};

// --- Drawer ---

const TaskDrawer: React.FC<{ 
  task: Task | null; 
  onClose: () => void;
  isManager?: boolean; 
}> = ({ task, onClose, isManager = false }) => {
  if (!task) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300" onClick={onClose} />
      
      <div className="fixed inset-y-0 left-0 z-50 w-full md:w-[500px] bg-white dark:bg-slate-950 shadow-2xl border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col animate-in slide-in-from-left">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
               <Badge variant={task.status === 'overdue' ? 'danger' : 'neutral'}>
                 {task.status === 'overdue' ? 'באיחור' : task.status === 'completed' ? 'הושלם' : 'פתוח'}
               </Badge>
               {task.priority === 'high' && <Badge variant="warning">עדיפות גבוהה</Badge>}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50 dark:bg-slate-950/50">
           
           {/* Manager Actions (Extra) */}
           {isManager && (
             <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-brand-100 dark:border-brand-900/30 shadow-sm space-y-5">
                <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-wider">
                  <UserIcon className="w-3.5 h-3.5" /> ניהול משימה
                </h3>
                
                <div className="grid grid-cols-2 gap-5">
                   <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">הקצאה לנציג</label>
                      <div className="relative">
                        <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm appearance-none outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                           {TEAM_MEMBERS.map(u => (
                              <option key={u.id} selected={u.id === task.ownerId}>{u.name}</option>
                           ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                   </div>
                   <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">עדיפות</label>
                      <div className="relative">
                        <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm appearance-none outline-none focus:ring-2 focus:ring-brand-500 transition-all">
                           <option selected={task.priority === 'high'}>גבוהה</option>
                           <option selected={task.priority === 'medium'}>רגילה</option>
                           <option selected={task.priority === 'low'}>נמוכה</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                   </div>
                </div>

                <div>
                   <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">הערת מנהל / טיפ</label>
                   <textarea 
                     className="w-full h-20 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder-slate-400"
                     placeholder="הוסף הנחייה לנציג..."
                   ></textarea>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <input type="checkbox" id="mandatory" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer" />
                  <label htmlFor="mandatory" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">סמן כמשימת חובה (Must Do)</label>
                </div>
             </div>
           )}

           {/* Standard Actions */}
           <div className="flex gap-4">
              <Button className="flex-1 py-3 justify-center shadow-lg shadow-brand-500/20">
                 <CheckSquare className="w-4 h-4 ml-2" />
                 סמן כהושלמה
              </Button>
              <Button variant="secondary" className="flex-1 py-3 justify-center">
                 <Play className="w-4 h-4 ml-2" />
                 התחל ביצוע
              </Button>
           </div>

           {/* Details */}
           <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> פרטי משימה
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">סוג משימה</label>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                       <TaskIcon type={task.type} />
                       <TaskTypeLabel type={task.type} />
                    </div>
                 </div>
                 <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">תאריך יעד</label>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                       <Calendar className="w-4 h-4" />
                       {task.dueDate} • {task.dueTime}
                    </div>
                 </div>
              </div>

              {task.leadName && (
                <div>
                   <label className="text-xs text-slate-500 mb-2 block">קשורה לליד</label>
                   <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl group cursor-pointer hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                            <UserIcon className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{task.leadName}</p>
                            <p className="text-xs text-slate-500">לחץ לצפייה בכרטיס הליד</p>
                         </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
                   </div>
                </div>
              )}
           </div>

           {/* Notes */}
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-slate-400" /> הערות אישיות
              </h3>
              <textarea 
                className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none placeholder-slate-400"
                placeholder="הוסף הערות למשימה זו..."
                defaultValue={task.notes}
              ></textarea>
           </div>

           {/* AI Tip (Visible to Rep or Manager) */}
           {task.aiReason && (
             <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                   <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                     <Sparkles className="w-4 h-4" />
                   </div>
                   <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">טיפ מהמאמן</h3>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                   "{task.aiReason}. נסה להתמקד בערך המוסף שהפתרון שלנו נותן להם בשלב הזה."
                </p>
             </div>
           )}

        </div>
      </div>
    </>
  );
};
