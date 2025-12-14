import React, { useState, useEffect, useRef } from 'react';
import { Message, CoachSuggestion } from '../../types';
import {
    PhoneOff,
    Sparkles,
    Bot,
    Download,
    FileText,
    BrainCircuit,
    CheckCircle2,
    AlertTriangle,
    Flag,
    Activity,
    Play
} from 'lucide-react';
import { Button } from '../Common/Button';

// Mock Stages based on CALL_STAGES
const STAGES = [
    { id: 'opening', label: 'פתיחה', color: 'bg-emerald-500' },
    { id: 'discovery', label: 'בירור צרכים', color: 'bg-brand-500' },
    { id: 'value', label: 'הצעת ערך', color: 'bg-slate-300' }, // Future
    { id: 'objections', label: 'התנגדויות', color: 'bg-slate-300' },
    { id: 'closing', label: 'סגירה', color: 'bg-slate-300' }
];

interface ActiveCallPanelProps {
    transcript: Message[];
    coachSuggestions: CoachSuggestion[];
    onHangup?: () => void;
    status?: string;
    duration?: string;
}

export const ActiveCallPanel: React.FC<ActiveCallPanelProps> = ({ transcript, coachSuggestions, onHangup, status = 'מקליט...', duration = '00:00' }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'transcript' | 'summary'>('transcript');

    // Auto-scroll logic
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript, activeTab]);

    return (
        <div className="flex flex-col flex-1 bg-white dark:bg-slate-950 min-w-0 h-full relative overflow-hidden">

            {/* 1. TOP BANNER: Active Call Status */}
            <div className="h-14 bg-white dark:bg-slate-900 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between px-6 shadow-sm z-20">
                {/* End Call Button (Left) */}
                <Button
                    variant="danger"
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white border-0 shadow-lg shadow-rose-500/20 px-6"
                    onClick={onHangup}
                >
                    <PhoneOff className="w-4 h-4 ml-2" />
                    סיים שיחה
                </Button>

                {/* Status Indicator (Right) */}
                <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 pb-1.5 rounded-full border border-rose-100 dark:border-rose-900/30">
                    <div className="relative flex h-2.5 w-2.5 mt-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </div>
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400 tabular-nums tracking-wide">
                        שיחה פעילה ({duration})
                    </span>
                </div>
            </div>

            {/* 2. SPLIT VIEW CONTENT */}
            <div className="flex-1 flex min-h-0 bg-slate-50 dark:bg-slate-950">

                {/* A) LEFT SUB-COLUMN: AI COACH */}
                <div className="w-[45%] lg:w-[40%] flex flex-col border-e border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto">

                    {/* Header */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <h2 className="text-lg font-bold text-brand-600 dark:text-brand-400">Sales Coach AI</h2>
                        <BrainCircuit className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>

                    {/* Stepper */}
                    <div className="mb-8 relative">
                        {/* Progress Line */}
                        <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>

                        <div className="flex justify-between items-start">
                            {STAGES.map((stage, idx) => {
                                const isCurrent = idx === 1; // MOCK: "Discovery"
                                const isCompleted = idx < 1;
                                return (
                                    <div key={stage.id} className="flex flex-col items-center gap-2">
                                        <div className={`
                                            w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all
                                            ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                isCurrent ? 'bg-white dark:bg-slate-900 border-brand-500 text-brand-600 ring-4 ring-brand-100 dark:ring-brand-900/30' :
                                                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-300'}
                                         `}>
                                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : (idx + 1)}
                                        </div>
                                        <span className={`text-[10px] font-medium ${isCurrent ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                                            {stage.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Recommendation Card */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800/50 shadow-sm relative overflow-hidden mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                                המלצה לזמן אמת
                            </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-sm font-medium leading-relaxed relative z-10">
                            "הלקוח הזכיר 'חוסר יעילות', שאל אותו: 'כמה זמן ביום מבזבז נציג ממוצע על אדמיניסטרציה?'"
                        </p>
                        {/* Decorative background blob */}
                        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-indigo-200/30 rounded-full blur-2xl"></div>
                    </div>

                    {/* Detected Signals / Tags */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">תובנות זוהו</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold">
                                <AlertTriangle className="w-3 h-3" />
                                כאב: תיעוד
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                                <Activity className="w-3 h-3" />
                                עניין גבוה
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium">
                                <Flag className="w-3 h-3" />
                                תקציב: לא ידוע
                            </span>
                        </div>
                    </div>

                </div>

                {/* B) RIGHT SUB-COLUMN: TRANSCRIPT & SUMMARY */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">

                    {/* Tabs Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('transcript')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'transcript' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                תמלול
                            </button>
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'summary' ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                סיכום AI
                            </button>
                        </div>
                        <button className="text-slate-400 hover:text-brand-600 transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden relative flex flex-col">

                        {activeTab === 'transcript' ? (
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-6"
                            >
                                {transcript.length === 0 && (
                                    <div className="text-center py-10 opacity-50">
                                        <Bot className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                        <p className="text-sm text-slate-400">התמלול יופיע כאן בזמן אמת</p>
                                    </div>
                                )}

                                {transcript.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.speaker === 'agent' ? 'items-end' : 'items-start'} w-full`}
                                    >
                                        <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative
                                            ${msg.speaker === 'agent'
                                                ? 'bg-blue-50 border border-blue-100 text-slate-800 rounded-tl-none dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-100'
                                                : 'bg-white border border-slate-200 text-slate-700 rounded-tr-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}
                                         `}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">{msg.timestamp}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                <div className="text-center">
                                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">סיכום השיחה יווצר בסיום</p>
                                </div>
                            </div>
                        )}

                        {/* Player / Scrubber Placeholder (Keep from original if needed, or simple visual) */}
                        <div className="h-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 gap-3">
                            <span className="text-[10px] font-mono text-slate-400 tabular-nums">{duration} / 00:32</span>
                            <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-brand-500 rounded-full"></div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
                                <Play className="w-3 h-3 fill-current" />
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};
