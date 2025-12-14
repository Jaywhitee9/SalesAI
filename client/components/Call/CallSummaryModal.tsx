import React from 'react';
import { X, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '../Common/Button';

export interface CallSummaryData {
    score: number;
    is_success: boolean;
    key_points: {
        positive: string[];
        improvements: string[];
    };
    summary: string;
}

interface CallSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: CallSummaryData | null;
}

export const CallSummaryModal: React.FC<CallSummaryModalProps> = ({ isOpen, onClose, summary }) => {
    if (!isOpen || !summary) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex justify-between items-start border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            סיכום שיחה
                            {summary.score >= 80 && <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">מצוין! 🌟</span>}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            עיבוד AI הושלם • נשמר בהיסטוריה
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-8">

                    {/* Score Section */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-slate-100 dark:text-slate-800"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                <path
                                    className={`${summary.score >= 80 ? 'text-emerald-500' : summary.score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}
                                    strokeDasharray={`${summary.score}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className={`text-3xl font-bold ${summary.score >= 80 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                    {summary.score}
                                </span>
                                <span className="text-[10px] uppercase text-slate-400 tracking-wider">ציון</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Text */}
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-brand-500" />
                            תקציר מנהלים
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {summary.summary}
                        </p>
                    </div>

                    {/* Key Points Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Positive */}
                        <div>
                            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                לשימור (נקודות חוזק)
                            </h3>
                            <ul className="space-y-2">
                                {summary.key_points.positive.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Improvements */}
                        <div>
                            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                לשיפור
                            </h3>
                            <ul className="space-y-2">
                                {summary.key_points.improvements.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Button onClick={onClose} className="min-w-[120px]">
                        סגור
                    </Button>
                </div>
            </div>
        </div>
    );
};
