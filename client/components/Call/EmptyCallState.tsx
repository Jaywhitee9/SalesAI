import React from 'react';
import { Phone, Play, ChevronDown } from 'lucide-react';
import { User } from '../../types';

interface EmptyCallStateProps {
    onStartCall: (phoneNumber?: string) => void;
    selectedLead: User | null;
}

export const EmptyCallState: React.FC<EmptyCallStateProps> = ({ onStartCall, selectedLead }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">

            {/* Central Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 p-12 max-w-lg w-full text-center">

                {/* Icon */}
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-700">
                    <Phone className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    מוכן להתחיל?
                </h2>

                {/* Subtext */}
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed max-w-sm mx-auto">
                    בחר קמפיין כדי להתחיל את החייגן האוטומטי ולדבר עם הליד הבא בתור.
                </p>

                {/* Controls Row */}
                <div className="grid grid-cols-5 gap-4">

                    {/* Campaign Selector (Right - 3 cols) */}
                    <div className="col-span-3 relative">
                        <label className="absolute -top-2.5 right-3 bg-white dark:bg-slate-900 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            קמפיין
                        </label>
                        <button className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-right hover:border-brand-300 dark:hover:border-brand-700 transition-colors group">
                            <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                Q4 Promotion
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>

                    {/* Start Button (Left - 2 cols) */}
                    <button
                        onClick={() => onStartCall(selectedLead?.phone)}
                        className="col-span-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-brand-500/25 transition-all active:scale-95"
                    >
                        <Play className="w-5 h-5 fill-white" />
                        הפעל חייגן
                    </button>
                </div>

            </div>

            {/* Footer Info */}
            <p className="mt-8 text-sm text-slate-400">
                מערכת ה-AI תלווה אותך בזמן אמת במהלך השיחה
            </p>

        </div>
    );
};
