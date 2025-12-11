import React from 'react';
import { Sparkles, ArrowRight, User, Users, ShieldCheck } from 'lucide-react';
import { CURRENT_USER, MANAGER_USER } from '../../constants';
import { User as UserType } from '../../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white mb-6 shadow-lg shadow-brand-500/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">SalesFlow AI</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            הפלטפורמה המתקדמת לאימון מכירות בזמן אמת.<br/>
            אנא בחר משתמש לכניסה:
          </p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          <button 
            onClick={() => onLogin(CURRENT_USER)}
            className="w-full group relative flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-white dark:bg-slate-800 hover:shadow-lg hover:shadow-brand-500/5 transition-all text-right duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center ml-4 group-hover:scale-110 transition-transform duration-300">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">כניסה כנציג מכירות</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">דשבורד אישי, משימות, ניהול לידים ושיחות</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors rotate-180" />
          </button>

          <button 
            onClick={() => onLogin(MANAGER_USER)}
            className="w-full group relative flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-white dark:bg-slate-800 hover:shadow-lg hover:shadow-brand-500/5 transition-all text-right duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center ml-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">כניסה כמנהל צוות</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">מבט על, ביצועי צוות, דוחות וניתוח נתונים</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors rotate-180" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure login powered by SalesFlow Identity</span>
        </div>
      </div>
    </div>
  );
};