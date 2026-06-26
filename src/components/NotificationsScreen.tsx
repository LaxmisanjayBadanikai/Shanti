import React, { useState } from 'react';
import { AppNotification, Role, Incident } from '../types';
import { Bell, AlertTriangle, CloudRain, ShieldAlert, Navigation, Sparkles, Send, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  currentUserRole: Role;
  incidents: Incident[];
  onAddNotification: (notification: AppNotification) => void;
  onMarkAllAsRead: () => void;
}

export default function NotificationsScreen({
  notifications,
  currentUserRole,
  incidents,
  onAddNotification,
  onMarkAllAsRead
}: NotificationsScreenProps) {
  const [aiSuggestions, setAiSuggestions] = useState<Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAISuggestedBroadcasting = async () => {
    setLoadingAI(true);
    setAiSuggestions([]);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/gemini/notification-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidents })
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch (e) {
      console.error('Failed fetching notification suggestions:', e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleBroadcastSuggestion = (sug: typeof aiSuggestions[0]) => {
    const newNotif: AppNotification = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      title: sug.title,
      body: sug.body,
      type: sug.type as any,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    onAddNotification(newNotif);
    
    // Remove from suggestions array
    setAiSuggestions(prev => prev.filter(s => s.title !== sug.title));
    setSuccessMsg(`"${sug.title}" broadcasted successfully to all devices!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Notifications Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-slate-800 dark:text-white text-base">District Broadcast Channel</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Official emergency warnings, route detours, and multi-faith unity updates.</p>
          </div>
        </div>

        <button 
          onClick={onMarkAllAsRead}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* ADMIN AI BROADCAST SUGGESTIONS PANEL */}
      {currentUserRole === Role.DISTRICT_ADMIN && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 p-6 rounded-[2rem] border border-blue-200 dark:border-blue-950 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">AI Broadcast Suggestions (Gemini)</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Generate public advisories automatically based on active safety incidents.</p>
              </div>
            </div>

            <button
              onClick={fetchAISuggestedBroadcasting}
              disabled={loadingAI}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-500/10"
            >
              {loadingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              {aiSuggestions.length > 0 ? 'Regenerate Ideas' : 'Generate Suggestions'}
            </button>
          </div>

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-[11px] font-bold border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> {successMsg}
            </div>
          )}

          {aiSuggestions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {aiSuggestions.map((sug, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex flex-col justify-between gap-3 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                  <div className="space-y-1">
                    <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      sug.type === 'emergency' ? 'bg-red-100 text-red-700 dark:bg-red-950/30' :
                      sug.type === 'road' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30' :
                      sug.type === 'weather' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30'
                    }`}>
                      {sug.type}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{sug.title}</h5>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-sans">{sug.body}</p>
                  </div>

                  <button
                    onClick={() => handleBroadcastSuggestion(sug)}
                    className="w-full py-1.5 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Broadcast Alert
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Broadcasts List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400 italic">No broadcast notifications published today.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            // Pick Icon & Color based on type
            let iconElement = <Bell className="w-4.5 h-4.5 text-blue-600" />;
            let wrapperClass = 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30';
            
            if (notif.type === 'emergency') {
              iconElement = <ShieldAlert className="w-4.5 h-4.5 text-red-600" />;
              wrapperClass = 'bg-red-50/50 dark:bg-red-950/20 border-red-100/50 dark:border-red-900/30';
            } else if (notif.type === 'road') {
              iconElement = <Navigation className="w-4.5 h-4.5 text-orange-600" />;
              wrapperClass = 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-100/50 dark:border-orange-900/30';
            } else if (notif.type === 'weather') {
              iconElement = <CloudRain className="w-4.5 h-4.5 text-amber-600" />;
              wrapperClass = 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100/50 dark:border-amber-900/30';
            }

            return (
              <div 
                key={notif.id}
                className={`p-4 rounded-2xl border flex gap-3 transition-all relative overflow-hidden ${wrapperClass} ${
                  !notif.isRead ? 'ring-1 ring-blue-500/20' : 'opacity-85'
                }`}
              >
                {/* Unread blue dot */}
                {!notif.isRead && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
                )}

                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm shrink-0 self-start">
                  {iconElement}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-tight">{notif.title}</h4>
                    <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0">
                      {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{notif.body}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
