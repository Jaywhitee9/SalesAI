import React, { useEffect, useState } from 'react';
import { Clock, Search, Filter } from 'lucide-react';
import { Lead } from '../../types';

interface LeadsListSidebarProps {
    onSelectLead: (lead: Lead) => void;
    selectedLeadId?: string;
    className?: string;
}

export const LeadsListSidebar: React.FC<LeadsListSidebarProps> = ({ onSelectLead, selectedLeadId, className }) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/leads')
            .then(res => res.json())
            .then(data => {
                setLeads(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch leads:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={`w-80 flex items-center justify-center bg-slate-50 dark:bg-slate-900 ${className}`}>
                <span className="text-slate-400 text-xs">טוען לידים...</span>
            </div>
        );
    }

    return (
        <div className={`w-80 flex flex-col border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <h2 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">
                    לידים לטיפול
                </h2>
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="חיפוש..."
                        className="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        הכל
                    </button>
                    <button className="flex-1 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-md">
                        חמים 🔥
                    </button>
                    <button className="flex-1 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        חדשים
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {leads.map(lead => (
                    <div
                        key={lead.id}
                        onClick={() => onSelectLead(lead)}
                        className={`
                        p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md group relative
                        ${selectedLeadId === lead.id
                                ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500/20'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-slate-600'
                            }
                    `}
                    >
                        {/* Status Line */}
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-brand-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex justify-between items-start mb-1.5">
                            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                {lead.name}
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${lead.priority === 'Hot'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}>
                                {lead.score}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>{lead.company}</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lead.lastActivity}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
