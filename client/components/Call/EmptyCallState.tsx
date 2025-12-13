import React, { useState } from 'react';
import { Phone, Search, Clock, Hash, User, ArrowLeft, Delete } from 'lucide-react';
import { Button } from '../Common/Button';
import { REP_LEAD_QUEUE } from '../../constants';

interface EmptyCallStateProps {
    onStartCall: (number?: string) => void;
}

export const EmptyCallState: React.FC<EmptyCallStateProps> = ({ onStartCall }) => {
    const [dialNumber, setDialNumber] = useState('');

    const handleDigit = (digit: string) => {
        setDialNumber(prev => prev + digit);
    };

    const handleBackspace = () => {
        setDialNumber(prev => prev.slice(0, -1));
    };

    return (
        <div className="flex flex-col lg:flex-row h-full bg-slate-50 dark:bg-slate-950 font-sans overflow-auto lg:overflow-hidden">

            {/* Right Side: Dialer (Main Area) */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-8 lg:border-l border-slate-200 dark:border-slate-800 min-h-[500px]">
                <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-300">

                    {/* Display */}
                    <div className="mb-8 lg:mb-10 w-full relative">
                        <div className="h-16 flex items-center justify-center border-b-2 border-slate-100 dark:border-slate-800 mb-2">
                            <span className="text-4xl font-mono text-slate-900 dark:text-white tracking-widest h-10">
                                {dialNumber || <span className="text-slate-300 dark:text-slate-700 text-3xl">...</span>}
                            </span>
                        </div>
                        {dialNumber && (
                            <button
                                onClick={handleBackspace}
                                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <Delete className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
                            <button
                                key={key}
                                onClick={() => handleDigit(key.toString())}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center transition-all hover:border-brand-300 hover:shadow-md hover:scale-105 active:scale-95 group"
                            >
                                <span className="text-xl sm:text-2xl font-medium text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">{key}</span>
                                {typeof key === 'number' && key > 1 && key < 10 && (
                                    <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold tracking-widest uppercase -mt-1">
                                        {['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'][key - 2]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Call Button */}
                    <div className="flex justify-center items-center gap-6 w-full">
                        <button
                            onClick={() => onStartCall(dialNumber)}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Phone className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Left Side: Suggestions queue (Sidebar) */}
            <div className="w-full lg:w-96 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col lg:h-full">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        שיחות מומלצות
                        <span className="text-xs font-medium bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">{REP_LEAD_QUEUE.length}</span>
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">מבוסס על תור הלידים היומי שלך</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {REP_LEAD_QUEUE.map((lead, index) => (
                        <div
                            key={lead.id}
                            onClick={() => onStartCall(lead.phone)}
                            className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group relative overflow-hidden"
                        >
                            {/* Hover Highlight Line */}
                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                        {lead.name}
                                        {index === 0 && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded">הבא בתור</span>}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{lead.company}</div>
                                </div>
                                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                    {lead.score} ציון
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.lastActivity}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                <span>{lead.source}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${lead.priority === 'Hot'
                                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    }`}>
                                    {lead.priority === 'Hot' ? '🔥 ליד חם' : 'פולואפ שגרתי'}
                                </span>
                                <button className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center justify-center lg:opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    <Phone className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
