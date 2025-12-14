import React from 'react';
import { Phone, DollarSign, Users, Clock, CheckCircle2, Target } from 'lucide-react';

export const KPISidebar = () => {
    return (
        <div className="w-80 border-s border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hidden xl:flex h-full">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-slate-800 dark:text-slate-100">הביצועים שלי</h2>
                    <div className="grid grid-cols-2 gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Calls Today */}
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Phone className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">שיחות להיום</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">5</span>
                        <span className="text-sm text-slate-400">/ 3</span>
                    </div>
                </div>

                {/* Closed Deals */}
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">עסקאות סגורות</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">1</span>
                </div>

                {/* New Leads */}
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">לקוחות חדשים</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">8</span>
                </div>

                {/* Hours Answered */}
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">שיחות שנענו</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">27</span>
                        <span className="text-sm text-slate-400">/ 10</span>
                    </div>
                </div>

                {/* Time in Call */}
                <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm text-center">
                    <div className="flex items-center gap-2 justify-center mb-2 text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">זמן בשיחה</span>
                    </div>
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">00:44</span>
                </div>
            </div>

            {/* Monthly Goal Card */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="bg-brand-600 rounded-2xl p-4 text-white shadow-lg shadow-brand-600/20">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">יעד חודשי</h3>
                        <Target className="w-5 h-5 text-brand-200" />
                    </div>
                    <div className="flex items-end justify-between font-mono text-sm mb-2">
                        <span className="opacity-80">₪80,000</span>
                        <span className="font-bold">₪42,000</span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-white w-[52%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-brand-100 text-center">חסרים 38,000 ₪ לעמידה ביעד</p>
                </div>
            </div>
        </div>
    );
};
