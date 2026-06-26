import React, { useState } from 'react';
import { Incident, Role, Comment, TimelineEvent, Severity, IncidentStatus } from '../types';
import { Calendar, User, Shield, MessageSquare, Plus, FileText, Send, CheckCircle, ChevronRight, Globe, Loader2, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface IncidentDetailsProps {
  incident: Incident;
  currentUserRole: Role;
  currentUserName: string;
  onAddComment: (incidentId: string, comment: Comment) => void;
  onAddTimeline: (incidentId: string, event: TimelineEvent) => void;
  onUpdateStatus: (incidentId: string, status: IncidentStatus, team?: string) => void;
}

export default function IncidentDetails({
  incident,
  currentUserRole,
  currentUserName,
  onAddComment,
  onAddTimeline,
  onUpdateStatus,
}: IncidentDetailsProps) {
  const [commentText, setCommentText] = useState('');
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');
  
  // Status edit state for Admin/Police
  const [assignedTeam, setAssignedTeam] = useState(incident.assignedTeam || '');
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  // Translation State
  const [translateLang, setTranslateLang] = useState('Hindi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);

  const canModifyStatus = currentUserRole === Role.DISTRICT_ADMIN || currentUserRole === Role.POLICE;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      authorName: currentUserName,
      authorRole: currentUserRole,
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    onAddComment(incident.id, newComment);
    setCommentText('');

    // Also push a timeline event automatically for comments
    const commentEvent: TimelineEvent = {
      id: `tl-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Feedback Addendum',
      description: `${currentUserName} (${currentUserRole}) submitted active feed updates.`,
      timestamp: new Date().toISOString(),
      type: 'comment',
      userName: currentUserName,
      userRole: currentUserRole,
    };
    onAddTimeline(incident.id, commentEvent);
  };

  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineTitle.trim() || !newTimelineDesc.trim()) return;

    const newEvent: TimelineEvent = {
      id: `tl-${Math.random().toString(36).substr(2, 9)}`,
      title: newTimelineTitle,
      description: newTimelineDesc,
      timestamp: new Date().toISOString(),
      type: 'update',
      userName: currentUserName,
      userRole: currentUserRole,
    };

    onAddTimeline(incident.id, newEvent);
    setNewTimelineTitle('');
    setNewTimelineDesc('');
  };

  const handleStatusChange = (status: IncidentStatus) => {
    onUpdateStatus(incident.id, status, assignedTeam || undefined);
    setIsEditingStatus(false);

    // Push timeline log
    const statusEvent: TimelineEvent = {
      id: `tl-${Math.random().toString(36).substr(2, 9)}`,
      title: `Status Transition: ${status}`,
      description: `State changed to ${status}. Assigned Responder: ${assignedTeam || 'None'}.`,
      timestamp: new Date().toISOString(),
      type: status === 'Resolved' ? 'resolve' : status === 'Dispatched' ? 'dispatch' : 'update',
      userName: currentUserName,
      userRole: currentUserRole,
    };
    onAddTimeline(incident.id, statusEvent);
  };

  const handleTranslateDescription = async () => {
    setIsTranslating(true);
    setTranslatedDesc(null);

    try {
      const res = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: incident.description,
          targetLanguage: translateLang
        })
      });
      const data = await res.json();
      setTranslatedDesc(data.translatedText);
    } catch (e) {
      console.error("Translation failed:", e);
      setTranslatedDesc(`[Fallback] Error executing dynamic translation.`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Col 1 & 2: Incident description and Timeline */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Main Incident Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                incident.severity === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                incident.severity === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400' :
                incident.severity === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
              }`}>
                {incident.severity} Severity
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-bold">CASE: #{incident.id}</span>
            </div>

            {/* Current Status Badge */}
            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
              incident.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50' :
              incident.status === 'Resolving' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50' :
              incident.status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50' :
              incident.status === 'Verified' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50' :
              'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}>
              ● {incident.status}
            </span>
          </div>

          <h2 className="text-xl font-sans font-extrabold text-slate-800 dark:text-white leading-tight">
            {incident.title}
          </h2>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {incident.location.address}</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> Reporter: {incident.reportedByName}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {new Date(incident.createdAt).toLocaleTimeString()}</span>
          </div>

          {/* Incident Image attachment */}
          {incident.mediaUrls && incident.mediaUrls.length > 0 && (
            <div className="w-full rounded-2xl overflow-hidden max-h-64 border border-slate-100 dark:border-slate-800">
              <img src={incident.mediaUrls[0]} alt="Incident context" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}

          {/* Description Section */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">INITIAL FIELD REPORT</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {incident.description}
            </p>

            {/* TRANSLATION UTILITY */}
            <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Translate with AI:</span>
                <select 
                  value={translateLang}
                  onChange={(e) => setTranslateLang(e.target.value)}
                  className="text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1 px-1.5 rounded outline-none"
                >
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Urdu">Urdu (اردو)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleTranslateDescription}
                disabled={isTranslating}
                className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1"
              >
                {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Translate
              </button>
            </div>

            {translatedDesc && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200"
              >
                <div className="text-[9.5px] text-blue-600 dark:text-blue-400 font-bold mb-1 font-mono uppercase">AI TRANSLATION ({translateLang}):</div>
                {translatedDesc}
              </motion.div>
            )}
          </div>

          {/* AI Situation Summary */}
          {incident.aiSummary && (
            <div className="p-4 bg-emerald-50/45 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> AI Executive Briefing
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{incident.aiSummary}"
              </p>
            </div>
          )}
        </div>

        {/* FEEDBACK & LOGS TIMELINE */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-sans font-bold text-slate-800 dark:text-white text-sm">Response Operations & Cohesion Timeline</h3>
          
          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 pl-4 space-y-5 ml-2 pt-2">
            {incident.timeline.map((event) => (
              <div key={event.id} className="relative">
                {/* Visual Circle Marker */}
                <span className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                  event.type === 'report' ? 'bg-slate-400' :
                  event.type === 'verify' ? 'bg-purple-500' :
                  event.type === 'dispatch' ? 'bg-blue-500' :
                  event.type === 'resolve' ? 'bg-emerald-500' :
                  'bg-indigo-500'
                }`} />

                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{event.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.description}</p>
                {event.userName && (
                  <span className="inline-block text-[9.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded mt-1">
                    👤 {event.userName} ({event.userRole})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* INCIDENT DISCUSSION STREAM */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="font-sans font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1">
            <MessageSquare className="w-4 h-4 text-blue-600" /> Active Coordination Feed ({incident.comments.length})
          </h3>

          <div className="space-y-4 max-h-72 overflow-y-auto">
            {incident.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No comments or coordination updates yet. Add yours below.</p>
            ) : (
              incident.comments.map(c => (
                <div key={c.id} className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      {c.authorName}
                      <span className="text-[9.5px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                        {c.authorRole}
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{c.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              required
              placeholder={`Contribute advice as ${currentUserRole}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 py-2.5 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-xs outline-none transition-all text-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Col 3: Side actions (Status Management, Timeline Logs injection) */}
      <div className="space-y-6">
        
        {/* Operations Dispatch Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-sans font-bold text-slate-800 dark:text-white text-sm">Action & Dispatch Center</h3>
          </div>

          {canModifyStatus ? (
            <div className="space-y-3">
              <span className="text-[10.5px] font-bold text-slate-500 block">Deploy Responders & Edit State:</span>
              
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400">Assigned Response Team</label>
                <input
                  type="text"
                  placeholder="e.g., Traffic Control Unit 4"
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('Verified')}
                  className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 rounded-xl text-[11px] font-bold border border-purple-200/50 dark:border-purple-900/50 transition-all text-center"
                >
                  Verify Incident
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Dispatched')}
                  className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 rounded-xl text-[11px] font-bold border border-blue-200/50 dark:border-blue-900/50 transition-all text-center"
                >
                  Dispatch Unit
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Resolving')}
                  className="py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 rounded-xl text-[11px] font-bold border border-indigo-200/50 dark:border-indigo-900/50 transition-all text-center"
                >
                  Mark resolving
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Resolved')}
                  className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-[11px] font-bold border border-emerald-200/50 dark:border-emerald-900/50 transition-all text-center"
                >
                  Resolve Case ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Only authenticated authorities (Police & District Administration) can modify assignment coordinates or status triggers.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Assigned Responder:</span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">{incident.assignedTeam || 'Triage Stage (Unassigned)'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Admin/Official Log Injection form */}
        {currentUserRole === Role.DISTRICT_ADMIN && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Plus className="w-5 h-5 text-blue-600" />
              <h3 className="font-sans font-bold text-slate-800 dark:text-white text-sm">Post Official Log Entry</h3>
            </div>

            <form onSubmit={handleTimelineSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400">Log Entry Header / Stage</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Green corridor enabled"
                  value={newTimelineTitle}
                  onChange={(e) => setNewTimelineTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400">Chronological Event Detail</label>
                <textarea
                  required
                  placeholder="Official details to post to the public chronological record..."
                  value={newTimelineDesc}
                  onChange={(e) => setNewTimelineDesc(e.target.value)}
                  rows={3}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5" /> Inject Official Log
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
