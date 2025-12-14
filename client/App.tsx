
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { TopBar } from './components/Layout/TopBar';
import { CallStatusPanel } from './components/Call/CallStatusPanel';
import { ActiveCallPanel } from './components/Call/ActiveCallPanel';
import { EmptyCallState } from './components/Call/EmptyCallState';
import { InsightsPanel } from './components/Call/InsightsPanel';
import { LeadsListSidebar } from './components/Leads/LeadsListSidebar'; // NEW
import { InsightsPanelPlaceholder } from './components/Call/InsightsPanelPlaceholder'; // NEW
import { KPISidebar } from './components/Call/KPISidebar'; // NEW
import { CallSummaryModal } from './components/Call/CallSummaryModal'; // NEW
import { Dashboard } from './components/Dashboard/Dashboard';
import { ManagerDashboard } from './components/Dashboard/ManagerDashboard';
import { LeadsDashboard } from './components/Leads/LeadsDashboard';
import { PipelineDashboard } from './components/Pipeline/PipelineDashboard';
import { SettingsDashboard } from './components/Settings/SettingsDashboard';
import { TasksDashboard } from './components/Tasks/TasksDashboard';
import { TargetsDashboard } from './components/Targets/TargetsDashboard';
import { TeamChatDashboard } from './components/Chat/TeamChatDashboard';
import { ManagerChatDrawer } from './components/Chat/ManagerChatDrawer';
import { Login } from './components/Auth/Login';
import { Button } from './components/Common/Button';
import { Lock, LayoutDashboard } from 'lucide-react';
import {
  CURRENT_USER,
  CURRENT_LEAD,
  CALL_STAGES,
  MOCK_TRANSCRIPT,
  AI_COACH_MESSAGES,
  INITIAL_INSIGHTS
} from './constants';
import { User } from './types';

import { useCall } from './src/context/CallContext';

type Page = 'dashboard' | 'calls' | 'leads' | 'settings' | 'pipeline' | 'tasks' | 'targets' | 'chat';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  // Call Context
  const {
    initDevice,
    startCall,
    transcripts,
    coachingData,
    callDuration,
    isReady,
    connectionStatus,
    callStatus,
    hangup,
    isOnCall,
    callSummary,  // NEW
    clearSummary  // NEW
  } = useCall();

  // Initialize Device on login/mount
  useEffect(() => {
    console.log("App Version: 1.2 - PRODUCTION SYNC (Localhost Uploaded)");
    if (isAuthenticated && !isReady) {
      initDevice();
    }
  }, [isAuthenticated, isReady]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // State for current user/role (Rep vs Manager)
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);

  // State for selected lead in the Dialer (Pre-call)
  const [selectedPreCallLead, setSelectedPreCallLead] = useState<User | null>(CURRENT_LEAD);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActivePage('dashboard');
  };

  const handleNavigate = (page: Page) => {
    setActivePage(page);
  };

  // Helper for Access Denied View
  const AccessDeniedView = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-lg max-w-md text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">אין לך הרשאה לעמוד זה</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
          מסך יעדים לנציגים זמין רק למנהל/ת המכירות. <br />
          אנא חזור לדשבורד שלך כדי לראות את היעדים האישיים שלך.
        </p>
        <Button onClick={() => setActivePage('dashboard')} className="w-full justify-center">
          <LayoutDashboard className="w-4 h-4 ml-2" />
          חזרה לדשבורד שלי
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>

      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-hidden">

          {/* Left Navigation */}
          <Sidebar activePage={activePage} onNavigate={handleNavigate} userRole={currentUser.type} />

          {/* Main Content Wrapper */}
          <div className="flex flex-1 flex-col min-w-0">

            {/* Top Header */}
            <TopBar
              user={currentUser}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              onOpenChat={() => setIsChatDrawerOpen(true)}
            />

            {/* Workspace Area - Switch based on activePage & Role */}
            <main className="flex flex-1 overflow-hidden relative">

              {activePage === 'dashboard' ? (
                currentUser.type === 'manager' ? (
                  <ManagerDashboard isDarkMode={isDarkMode} />
                ) : (
                  <Dashboard
                    onStartCall={() => {
                      setActivePage('calls');
                      startCall(CURRENT_LEAD.phone).catch(console.error);
                    }}
                    isDarkMode={isDarkMode}
                  />
                )
              ) : activePage === 'leads' ? (
                <LeadsDashboard isDarkMode={isDarkMode} />
              ) : activePage === 'pipeline' ? (
                <PipelineDashboard
                  isDarkMode={isDarkMode}
                  currentUser={currentUser}
                />
              ) : activePage === 'settings' ? (
                <SettingsDashboard
                  isDarkMode={isDarkMode}
                  user={currentUser}
                />
              ) : activePage === 'tasks' ? (
                <TasksDashboard
                  isDarkMode={isDarkMode}
                  currentUser={currentUser}
                />
              ) : activePage === 'targets' ? (
                // Only managers can see the full targets dashboard
                currentUser.type === 'manager' ? (
                  <TargetsDashboard isDarkMode={isDarkMode} />
                ) : (
                  <AccessDeniedView />
                )
              ) : activePage === 'chat' ? (
                <TeamChatDashboard
                  isDarkMode={isDarkMode}
                />
              ) : (
                // ---------------------------------------------------------
                // COCKPIT VIEW (Calls Page) - 3 Column Layout
                // ---------------------------------------------------------
                <div className="flex w-full h-full bg-slate-50 dark:bg-slate-950">

                  {/* LEFT PANEL: Leads List (Persistent) */}
                  <LeadsListSidebar
                    onSelectLead={(lead) => {
                      setSelectedPreCallLead(lead);
                    }}
                    selectedLeadId={selectedPreCallLead?.id}
                  />

                  {/* CENTER PANEL: Dialer / Active Call */}
                  <div className="flex-1 flex flex-col min-w-0 border-x border-slate-200 dark:border-slate-800">
                    {(callStatus === 'dialing' || callStatus === 'connected' || callStatus === 'reconnecting') ? (
                      <ActiveCallPanel
                        transcript={transcripts.length > 0 ? transcripts : MOCK_TRANSCRIPT}
                        coachSuggestions={coachingData.suggestion ? [{
                          id: Date.now().toString(),
                          text: coachingData.suggestion,
                          type: 'tip'
                        }] : AI_COACH_MESSAGES}
                        onHangup={hangup}
                        status={callStatus === 'connected' ? 'connected' : 'מתקשר...'}
                        duration={formatDuration(callDuration)}
                      />
                    ) : (
                      <EmptyCallState
                        onStartCall={(number) => {
                          startCall(number || selectedPreCallLead?.phone).catch(console.error);
                        }}
                        selectedLead={selectedPreCallLead}
                      />
                    )}
                  </div>

                  {/* RIGHT PANEL: KPIs (My Performance) */}
                  <KPISidebar />

                  {/* SUMMARY MODAL (Global for Call Context) */}
                  <CallSummaryModal
                    isOpen={!!callSummary}
                    onClose={clearSummary}
                    onSave={(data) => {
                      console.log("Saving call outcome:", data);
                      clearSummary();
                    }}
                    leadName={selectedPreCallLead?.name || CURRENT_LEAD.name}
                    aiSummary={callSummary}
                  />
                </div>
              )}

            </main>
          </div>
          {/* ... */}

          {/* Rep Chat Drawer Overlay */}
          <ManagerChatDrawer
            currentUser={currentUser}
            isOpen={isChatDrawerOpen}
            onClose={() => setIsChatDrawerOpen(false)}
            activeContext={activePage === 'calls' ? {
              type: 'call',
              id: 'c_active',
              label: 'שיחה פעילה: מיכאל רוס',
              subLabel: '08:42 • ציון איכות 88'
            } : null}
          />

        </div>
      )}
    </div>
  );
}

export default App;
