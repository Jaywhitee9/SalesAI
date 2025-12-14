import React from 'react';
import { Phone, Play, ChevronDown } from 'lucide-react';
import { User } from '../../types';

interface EmptyCallStateProps {
    onStartCall: (phoneNumber?: string) => void;
    selectedLead: User | null;
}

export const EmptyCallState: React.FC<EmptyCallStateProps> = ({ onStartCall, selectedLead }) => {

    const handleBackspace = () => {
        setDialNumber(prev => prev.slice(0, -1));
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 font-sans relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Active Lead Summary Card (Floating Above Dialer) */}
            {selectedLead ? (
                <div className="mb-8 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-4 fade-in duration-300 z-10">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-lg">
                                {selectedLead.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedLead.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <Briefcase className="w-3 h-3" />
                                    {selectedLead.company}
                                </div>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${selectedLead.priority === 'Hot'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                            {selectedLead.score} נק׳
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-slate-600 dark:text-slate-300 text-center">
                            מקור: {selectedLead.source}
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-slate-600 dark:text-slate-300 text-center">
                            סטטוס: {selectedLead.status}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-8 h-32 flex items-center justify-center text-slate-400 text-sm animate-in fade-in">
                    בחר ליד מהרשימה או חייג ידנית
                </div>
            )}

            {/* Refined Dialer Card */}
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 z-10 transition-all">

                {/* Number Display */}
                <div className="mb-8 relative">
                    <div className="h-16 flex items-center justify-center">
                        <span className="text-4xl font-mono font-medium text-slate-900 dark:text-white tracking-widest h-10 truncate px-8">
                            {dialNumber || <span className="text-slate-200 dark:text-slate-800 text-3xl">...</span>}
                        </span>
                    </div>
                    {dialNumber && (
                        <button
                            onClick={handleBackspace}
                            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <Delete className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-x-6 gap-y-6 mb-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                        <button
                            key={key}
                            onClick={() => handleDigit(key.toString())}
                            className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-800/50 flex items-center justify-center transition-all hover:shadow-md hover:scale-105 active:scale-95 text-2xl font-light"
                        >
                            {key}
                        </button>
                    ))}
                </div>

                {/* Call Action */}
                <div className="flex justify-center">
                    <button
                        onClick={() => onStartCall(dialNumber)}
                        disabled={!dialNumber}
                        className={`
                            h-16 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all duration-300
                            ${dialNumber
                                ? 'w-full bg-emerald-500 hover:bg-emerald-600 text-white scale-100 hover:shadow-emerald-500/40'
                                : 'w-16 bg-emerald-100 text-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-800 cursor-not-allowed'}
                        `}
                    >
                        <Phone className={`w-7 h-7 fill-current ${dialNumber ? 'animate-pulse' : ''}`} />
                        {dialNumber && <span className="ml-3 text-lg font-bold">חייג עכשיו</span>}
                    </button>
                </div>
            </div>

            {/* Footer / Meta */}
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-600">
                    מחובר ל-Twinio Voice באמצעות <span className="font-semibold text-brand-500">SalesAI</span>
                </p>
            </div>
        </div>
    );
};
