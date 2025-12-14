import React from 'react';
import { Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export const InsightsPanelPlaceholder: React.FC = () => {
    return (
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    תובנות בזמן אמת
                </h2>
            </div>

            {/* Empty State Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-2">ממתין לשיחה...</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    ברגע שתתחיל שיחה, הקואצ'ר יציג כאן תובנות, התנגדויות והמלצות בזמן אמת.
                </p>

                <div className="mt-8 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4 w-full">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <AlertCircle className="w-3 h-3" />
                        דוגמא לתובנה:
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                        "הלקוח מגלה עניין במחיר. זה הזמן להציג את ה-ROI."
                    </div>
                </div>
            </div>
        </div>
    );
};
