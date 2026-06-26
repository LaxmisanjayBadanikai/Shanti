import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Map, AlertCircle, Bell, User, Sparkles, LogOut, Smartphone, 
  Moon, Sun, HelpCircle, Shield, Globe 
} from 'lucide-react';

// Data and Types
import { Role, UserProfile, Incident, Shelter, AppNotification, BedAvailability, Task } from './types';
import { INITIAL_INCIDENTS, INITIAL_SHELTERS, INITIAL_NOTIFICATIONS, INITIAL_TASKS } from './mockData';

// Modular Components
import Splash from './components/Splash';
import Login from './components/Login';
import IncidentMap from './components/IncidentMap';
import ReportIncident from './components/ReportIncident';
import IncidentDetails from './components/IncidentDetails';
import NotificationsScreen from './components/NotificationsScreen';
import ProfileScreen from './components/ProfileScreen';
import FlutterCodebase from './components/FlutterCodebase';
import { CitizenHome, AdminDashboard, PoliceDashboard, NgoDashboard, HospitalDashboard, VolunteerDashboard } from './components/DashboardViews';

type ActiveTab = 'home' | 'map' | 'report' | 'notifications' | 'profile';

export default function App() {
  // Splash & Auth states
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // App navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showFlutterCode, setShowFlutterCode] = useState(false);

  // App Theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Core Database Collections (Simulated/Stateful local store)
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [beds, setBeds] = useState<BedAvailability>({
    available: 18,
    total: 50,
    icuAvailable: 3,
    icuTotal: 10,
    ambulancesActive: 4,
    ambulancesTotal: 6
  });

  // Local storage caching or syncing (optional)
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auth logout handler
  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    setSelectedIncident(null);
  };

  // Switch roles instantly in the Profile simulation
  const handleUpdateRole = (newRole: Role) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  // Switch preferred language
  const handleUpdateLanguage = (newLang: string) => {
    if (user) {
      setUser({ ...user, language: newLang });
    }
  };

  // Add notification broadcast helper
  const handleAddNotification = (newNotif: AppNotification) => {
    setNotifications([newNotif, ...notifications]);
  };

  // Mark all alerts as read
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Emergency SOS trigger (Citizen home action)
  const handleTriggerSos = () => {
    if (!user) return;

    // Build the emergency incident
    const sosIncident: Incident = {
      id: `sos-${Math.random().toString(36).substr(2, 5)}`,
      title: `CRITICAL: SOS Distress Beacon triggered by ${user.name}`,
      description: `GPS alert indicates emergency aid required at citizen location immediately. User details: Name: ${user.name}, Contact: ${user.phone}.`,
      category: 'Medical Emergency',
      severity: 'Critical',
      status: 'Reported',
      location: {
        lat: 18.5204 + (Math.random() - 0.5) * 0.01,
        lng: 73.8567 + (Math.random() - 0.5) * 0.01,
        address: 'Citizen Real-time Cohesion Coordinates'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reportedByName: user.name,
      reportedBy: user.uid,
      timeline: [
        {
          id: `tl-sos-1`,
          title: 'SOS Beacon Activated',
          description: 'Automatic GPS transmission received by Emergency Dispatch.',
          timestamp: new Date().toISOString(),
          type: 'report',
          userName: user.name,
          userRole: user.role
        }
      ],
      comments: [],
      mediaUrls: [],
      priorityScore: 98
    };

    setIncidents([sosIncident, ...incidents]);

    // Send push broadcast warning
    const sosNotif: AppNotification = {
      id: `notif-sos-${Math.random().toString(36).substr(2, 5)}`,
      title: '🚨 CRITICAL LIFE SAFETY SOS',
      body: `Immediate distress beacon received from ${user.name} near Central Ward. First responders deployed.`,
      type: 'emergency',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    handleAddNotification(sosNotif);

    // Swap to map instantly to show pin
    setActiveTab('map');
    setSelectedIncident(sosIncident);
  };

  // Submit report handler (Report Page action)
  const handleReportSubmit = (partialInc: Partial<Incident>) => {
    if (!user) return;

    const newIncident: Incident = {
      id: `inc-${Math.random().toString(36).substr(2, 9)}`,
      title: partialInc.title || 'Untitled Incident',
      description: partialInc.description || '',
      category: partialInc.category || 'Safety Hazard',
      severity: partialInc.severity || 'Medium',
      status: 'Reported',
      location: partialInc.location || { lat: 18.5204, lng: 73.8567, address: 'Unknown location' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reportedByName: user.name,
      reportedBy: user.uid,
      timeline: [
        {
          id: `tl-${Math.random().toString(36).substr(2, 5)}`,
          title: 'Incident Submitted',
          description: `Report filed by ${user.name} via mobile portal. AI assessment executed.`,
          timestamp: new Date().toISOString(),
          type: 'report',
          userName: user.name,
          userRole: user.role
        }
      ],
      comments: [],
      mediaUrls: partialInc.mediaUrls || [],
      aiSummary: partialInc.aiSummary,
      priorityScore: partialInc.priorityScore || 45
    };

    setIncidents([newIncident, ...incidents]);

    // Add normal road/announcement alert
    const newAlert: AppNotification = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      title: `⚠️ Alert: ${newIncident.category}`,
      body: `New update posted: "${newIncident.title}" at ${newIncident.location.address}. Checking safe routes.`,
      type: 'road',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    handleAddNotification(newAlert);

    // Swap to home/timeline to let them track it
    setActiveTab('home');
    setSelectedIncident(newIncident);
  };

  // Add Comment handler (Incident Details action)
  const handleAddComment = (incidentId: string, comment: any) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          comments: [...inc.comments, comment]
        };
      }
      return inc;
    }));
  };

  // Add Timeline Event handler (Incident Details action)
  const handleAddTimeline = (incidentId: string, event: any) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          timeline: [...inc.timeline, event]
        };
      }
      return inc;
    }));
  };

  // Update Status handler
  const handleUpdateStatus = (incidentId: string, status: any, team?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status,
          assignedTeam: team || inc.assignedTeam
        };
      }
      return inc;
    }));
  };

  // Tasks updates (Volunteer screen actions)
  const handleAcceptTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Accepted' } : t));
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
  };

  // Splash timeout
  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  // Auth Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Login onLoginSuccess={(u) => setUser(u)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center font-sans">
      
      {/* Top Banner & Developer control bar */}
      <header className="w-full bg-[#1E3A8A] dark:bg-slate-900 border-b border-blue-900/20 dark:border-slate-800 py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-40 max-w-7xl mx-auto rounded-b-[2rem]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-[#1E3A8A] dark:text-blue-400" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              PeaceOS <span className="text-blue-300 font-normal text-xs uppercase tracking-wider hidden sm:inline">Cohesion</span>
            </h1>
            <p className="text-[10px] text-blue-200 dark:text-slate-400 font-mono">Central Pune District Ward</p>
          </div>
        </div>

        {/* Global Toolbar Options */}
        <div className="flex items-center gap-3">
          {/* Active status indicator badge styled exactly like the bento design */}
          <span className="hidden md:flex bg-white/10 dark:bg-slate-800/80 px-3 py-1.5 rounded-full text-white dark:text-slate-200 text-xs items-center gap-2 font-medium border border-white/5 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live: {user.role}
          </span>

          <button
            onClick={() => setShowFlutterCode(!showFlutterCode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border ${
              showFlutterCode 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white/10 dark:bg-slate-800 hover:bg-white/20 dark:hover:bg-slate-700 text-white dark:text-slate-300 border-white/10 dark:border-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {showFlutterCode ? 'Web View' : 'Flutter Source'}
          </button>

          {/* Theme switcher */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 bg-white/10 hover:bg-white/20 dark:bg-slate-800 text-white dark:text-slate-300 rounded-xl transition-all border border-white/5 dark:border-slate-700"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Connected User HUD */}
          <div className="flex items-center gap-2 bg-white/10 dark:bg-slate-800 pl-3 pr-1 py-1 rounded-xl border border-[#ffffff15] dark:border-slate-700">
            <span className="text-[10.5px] font-bold text-white dark:text-slate-300">
              {user.name}
            </span>
            <button 
              onClick={handleLogout}
              className="p-1 bg-white hover:bg-red-50 dark:bg-slate-700 text-red-500 hover:text-red-700 rounded-lg shadow-sm transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="w-full max-w-6xl px-4 py-6 flex-1 flex flex-col justify-between">
        
        {showFlutterCode ? (
          /* FLUTTER EXPLORER TAB COVER */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 flex-1"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Requested Flutter Source</h2>
            </div>
            <FlutterCodebase />
          </motion.div>
        ) : (
          /* CHOSEN WEB MOCK VIEW */
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {selectedIncident ? (
                /* DETAILED INCIDENT PAGE COVER OVERLAY */
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <button 
                    onClick={() => setSelectedIncident(null)}
                    className="mb-2 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                  >
                    ← Back to Dashboard Queue
                  </button>

                  <IncidentDetails
                    incident={selectedIncident}
                    currentUserRole={user.role}
                    currentUserName={user.name}
                    onAddComment={handleAddComment}
                    onAddTimeline={handleAddTimeline}
                    onUpdateStatus={handleUpdateStatus}
                  />
                </motion.div>
              ) : (
                /* TAB NAVIGATION CONTENT */
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {activeTab === 'home' && (
                    (() => {
                      // Render distinct dashboards based on Role
                      switch (user.role) {
                        case Role.DISTRICT_ADMIN:
                          return (
                            <AdminDashboard 
                              incidents={incidents} 
                              shelters={shelters} 
                              beds={beds}
                              onSelectIncident={(inc) => setSelectedIncident(inc)}
                              onUpdateBeds={(b) => setBeds(b)}
                            />
                          );
                        case Role.POLICE:
                          return (
                            <PoliceDashboard 
                              incidents={incidents} 
                              onSelectIncident={(inc) => setSelectedIncident(inc)}
                              onUpdateStatus={handleUpdateStatus}
                            />
                          );
                        case Role.NGO:
                          return (
                            <NgoDashboard 
                              shelters={shelters} 
                              tasks={tasks}
                              onSelectIncident={(inc) => setSelectedIncident(inc)}
                              incidents={incidents}
                            />
                          );
                        case Role.HOSPITAL:
                          return (
                            <HospitalDashboard 
                              beds={beds} 
                              onUpdateBeds={(b) => setBeds(b)}
                              incidents={incidents}
                              onSelectIncident={(inc) => setSelectedIncident(inc)}
                            />
                          );
                        case Role.VOLUNTEER:
                          return (
                            <VolunteerDashboard 
                              tasks={tasks} 
                              onAcceptTask={handleAcceptTask}
                              onCompleteTask={handleCompleteTask}
                            />
                          );
                        case Role.CITIZEN:
                        default:
                          return (
                            <CitizenHome
                              incidents={incidents}
                              notifications={notifications}
                              onTriggerSos={handleTriggerSos}
                              onNavigateScreen={(screen) => setActiveTab(screen)}
                              onSelectIncident={(inc) => setSelectedIncident(inc)}
                            />
                          );
                      }
                    })()
                  )}

                  {activeTab === 'map' && (
                    <div className="h-[550px]">
                      <IncidentMap
                        incidents={incidents}
                        shelters={shelters}
                        onSelectIncident={(inc) => setSelectedIncident(inc)}
                        selectedIncidentId={selectedIncident?.id}
                      />
                    </div>
                  )}

                  {activeTab === 'report' && (
                    <ReportIncident
                      onReportSubmit={handleReportSubmit}
                      existingIncidents={incidents}
                      reporterName={user.name}
                      reporterUid={user.uid}
                    />
                  )}

                  {activeTab === 'notifications' && (
                    <NotificationsScreen
                      notifications={notifications}
                      currentUserRole={user.role}
                      incidents={incidents}
                      onAddNotification={handleAddNotification}
                      onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                    />
                  )}

                  {activeTab === 'profile' && (
                    <ProfileScreen
                      user={user}
                      onLogout={handleLogout}
                      onUpdateRole={handleUpdateRole}
                      onUpdateLanguage={handleUpdateLanguage}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </main>

      {/* Global Bottom Navigation (Simulation of mobile-first bottom app bar) */}
      <nav id="bottom-navigation" className="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 py-3.5 px-8 flex justify-between items-center shadow-xl sticky bottom-4 z-40 rounded-full mt-6 transition-all duration-200">
        <button
          onClick={() => { setActiveTab('home'); setSelectedIncident(null); }}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'home' && !selectedIncident ? 'text-[#1E3A8A] dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Home</span>
        </button>

        <button
          onClick={() => { setActiveTab('map'); setSelectedIncident(null); }}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'map' && !selectedIncident ? 'text-[#1E3A8A] dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Map</span>
        </button>

        <button
          onClick={() => { setActiveTab('report'); setSelectedIncident(null); }}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'report' && !selectedIncident ? 'text-[#1E3A8A] dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Report</span>
        </button>

        <button
          onClick={() => { setActiveTab('notifications'); setSelectedIncident(null); }}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            activeTab === 'notifications' && !selectedIncident ? 'text-[#1E3A8A] dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Bell className="w-5 h-5" />
          {notifications.some(n => !n.isRead) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
          )}
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Notif</span>
        </button>

        <button
          onClick={() => { setActiveTab('profile'); setSelectedIncident(null); }}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'profile' && !selectedIncident ? 'text-[#1E3A8A] dark:text-blue-400 scale-110' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-extrabold">Profile</span>
        </button>
      </nav>

    </div>
  );
}
