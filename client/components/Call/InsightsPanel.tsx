import React, { useState } from 'react';
import { Insight } from '../../types';
import { 
  Zap, 
  CheckSquare, 
  CheckCircle2, 
  AlertTriangle,
  Circle,
  Info,
  ChevronLeft,
  ChevronDown,
  LayoutList
} from 'lucide-react';
import { Badge } from '../Common/Badge';

interface InsightsPanelProps {
  insights: Insight[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>('needs'); // Default open one
  
  // Filter insights
  const nextSteps = insights.filter(i => i.type === 'next_step');
  const objections = insights.filter(i => i.type === 'objection');
  
  // Mock Data for Detailed Conversation Map
  const topicDetails = [
    { 
      id: 'needs', 
      label: 'צרכים', 
      status: 'covered', 
      items: [
        { text: 'יציבות מערכת בעומס', type: 'default' },
        { text: 'דוחות מפורטים לנציג', type: 'default' },
        { text: 'חסרה תמיכה במובייל', type: 'gap' } 
      ] 
    },
    { 
      id: 'vision', 
      label: 'חזון / תוצאה', 
      status: 'covered', 
      items: [
        { text: 'חיסכון 5 שעות שבועיות', type: 'default' },
        { text: 'אוטומציה של תהליכים', type: 'bridge' }
      ] 
    },
    { 
      id: 'budget', 
      label: 'תקציב', 
      status: 'pending', 
      items: [
        { text: 'תקציב מוגבל לרבעון', type: 'gap' }
      ] 
    },
    { 
      id: 'summary', 
      label: 'סיכום', 
      status: 'upcoming', 
      items: [
        { text: 'סיכום נקודות מפתח', type: 'default' },
        { text: 'תיאום פגישה הבאה', type: 'default' }
      ] 
    },
  ];

  return (
    <div className="w-80 flex flex-col border-s border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-y-auto hidden xl:flex font-sans">
      
      {/* 1. Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-600" />
          מרכז פעולה
        </h2>
      </div>

      <div className="p-5 space-y-6 flex-1">
        
        {/* 2. Widget: Next Best Action */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
           <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">הצעד הבא המומלץ</h3>
           </div>

           <div className="p-4 space-y-3">
             <div className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
               {nextSteps.length > 0 ? nextSteps[0].title : "התמקד בערך המוסף"}
             </div>

             <div className="space-y-2 pt-2">
               {(nextSteps.slice(1).length > 0 ? nextSteps.slice(1) : [{ id: 'st1', title: 'הצג מקרה בוחן רלוונטי' }]).map((task) => (
                 <label key={task.id} className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors -mx-2">
                    <div className="relative flex items-center mt-0.5">
                      <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:border-brand-500 checked:bg-brand-500 transition-all" />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                        <CheckSquare className="w-3 h-3" />
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-snug pt-0.5">
                      {task.title}
                    </span>
                 </label>
               ))}
             </div>
           </div>
        </div>

        {/* 3. Widget: Conversation Map */}
        <div>
           <div className="flex items-center justify-between mb-3 px-1">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
               <LayoutList className="w-3.5 h-3.5" /> מפת שיחה
             </h3>
           </div>
           
           <div className="space-y-2">
              {topicDetails.map((topic) => {
                const isCovered = topic.status === 'covered';
                const isExpanded = expandedTopic === topic.id;
                
                return (
                  <div key={topic.id} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
                    <button 
                      onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors
                        ${isExpanded ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        {isCovered ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
                             <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : topic.status === 'pending' ? (
                          <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
                             <Circle className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 flex items-center justify-center">
                             <Circle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className={isCovered ? 'text-slate-900 dark:text-white' : 'text-slate-500'}>{topic.label}</span>
                      </div>
                      
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Expanded List */}
                    {isExpanded && (
                       <div className="border-t border-slate-100 dark:border-slate-800 p-2 bg-slate-50/30 dark:bg-slate-800/10">
                           <ul className="space-y-1">
                             {topic.items.length > 0 ? topic.items.map((item, idx) => (
                               <li key={idx} className="flex items-start gap-2 p-2 rounded hover:bg-white dark:hover:bg-slate-800 transition-colors text-xs">
                                 <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${item.type === 'gap' ? 'bg-rose-400' : 'bg-slate-300'}`}></div>
                                 <div className="flex-1">
                                   <span className="text-slate-600 dark:text-slate-300 leading-relaxed block">{item.text}</span>
                                   {item.type === 'gap' && <span className="text-[10px] text-rose-500 font-medium">זוהה פער</span>}
                                 </div>
                               </li>
                             )) : (
                               <li className="p-2 text-xs text-slate-400 text-center">אין מידע זמין עדיין.</li>
                             )}
                           </ul>
                       </div>
                    )}
                  </div>
                );
              })}
           </div>
        </div>

        {/* 4. Widget: Risks */}
        {objections.length > 0 && (
          <div className="bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30 p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h3 className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">סיכונים מזוהים</h3>
             </div>
             
             <div className="space-y-2">
                {objections.map((obj, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/20 shadow-sm flex gap-3">
                     <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{obj.title}</span>
                  </div>
                ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};