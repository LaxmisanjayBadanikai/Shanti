import React, { useState } from 'react';
import { Role, Incident, Shelter, AppNotification, BedAvailability, Task, IncidentStatus, Severity } from '../types';
import { 
  ShieldAlert, Sparkles, Navigation, Plus, Flame, Heart, Info, ArrowRight, MapPin, 
  CheckCircle, PlusCircle, Users, Activity, FileText, Loader2, Bed, AlertOctagon, HelpCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

// ==========================================
// 1. CITIZEN HOME VIEW
// ==========================================
interface CitizenHomeProps {
  incidents: Incident[];
  notifications: AppNotification[];
  onTriggerSos: () => void;
  onNavigateScreen: (screen: 'home' | 'map' | 'report' | 'notifications' | 'profile') => void;
  onSelectIncident: (inc: Incident) => void;
}

export function CitizenHome({ 
  incidents, 
  notifications, 
  onTriggerSos, 
  onNavigateScreen,
  onSelectIncident 
}: CitizenHomeProps) {
  const activeAlerts = notifications.filter(n => n.type === 'emergency');
  const criticalIncidents = incidents.filter(i => i.severity === 'Critical' || i.severity === 'High');

  return (
    <div className="space-y-6">
      
      {/* Bento Grid Structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Dynamic Emergency SOS Bento Card (Spans 8 cols on desktop) */}
        <div className="md:col-span-8 bg-gradient-to-br from-red-600 to-rose-700 text-white p-6 rounded-[2rem] shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldAlert className="w-48 h-48 -mr-12 -mt-12" />
          </div>
          
          <div className="space-y-2 z-10">
            <span className="inline-block text-[9px] font-extrabold bg-red-900/40 text-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
              🚨 Life Safety SOS Active
            </span>
            <h3 className="font-sans font-black text-2xl tracking-tight leading-tight">Need Immediate Emergency Aid?</h3>
            <p className="text-xs text-red-100 max-w-md leading-relaxed">
              Triggering the SOS automatically broadcasts your exact coordinates to the police dispatcher, nearest hospital, and safety volunteers in Central Pune Zone.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between z-10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-red-200">Broadcast Ward System Ready</span>
            <button
              onClick={onTriggerSos}
              className="w-16 h-16 bg-white hover:bg-red-50 text-red-600 rounded-full font-sans font-black text-xs tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center shrink-0 border-2 border-red-200 relative group"
            >
              <span className="absolute -inset-1 border border-dashed border-white rounded-full animate-ping group-hover:animate-none" />
              SOS
            </button>
          </div>
        </div>

        {/* Quick Safety Actions Bento Cards (Spans 4 cols on desktop) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <button 
            onClick={() => onNavigateScreen('report')}
            className="flex-1 p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-left transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-400 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white tracking-tight">Report Incident</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">File waterlogging, roadblocks, medical requests</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigateScreen('map')}
            className="flex-1 p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-left transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <Navigation className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white tracking-tight">Find Safe Route</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Check AI congestion layers & road closures</p>
            </div>
          </button>
        </div>

        {/* Active Broadcast warnings (Spans 12) */}
        {activeAlerts.length > 0 && (
          <div className="col-span-12 space-y-2">
            <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 uppercase tracking-widest px-2">
              <AlertOctagon className="w-4 h-4 animate-bounce" /> HIGH CRITICAL BROADCASTS
            </h4>
            <div className="space-y-2">
              {activeAlerts.slice(0, 1).map(alert => (
                <div key={alert.id} className="p-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-[2rem] flex gap-4 text-red-800 dark:text-red-400 shadow-sm">
                  <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5 text-red-600" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-black uppercase tracking-wider">{alert.title}</h5>
                    <p className="text-xs leading-relaxed font-sans">{alert.body}</p>
                    <span className="text-[9px] text-red-500/80 uppercase font-mono block pt-1">Time posted: Just Now</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Active Incidents Bento Card (Spans 12) */}
        <div className="col-span-12 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Nearby Safety Hazard Triage</h4>
            <span className="text-[10px] text-slate-400 font-mono">Live Sync: Active</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalIncidents.map(inc => (
              <div 
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-[1.75rem] hover:shadow-md transition-all cursor-pointer flex justify-between items-center gap-4 group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      inc.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">#{inc.id}</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-800 dark:text-white truncate group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors">{inc.title}</h5>
                  <p className="text-[10.5px] text-slate-500 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {inc.location.address}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#1E3A8A] group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

// ==========================================
// 2. DISTRICT ADMINISTRATION DASHBOARD
// ==========================================
interface AdminDashboardProps {
  incidents: Incident[];
  shelters: Shelter[];
  beds: BedAvailability;
  onSelectIncident: (inc: Incident) => void;
  onUpdateBeds: (beds: BedAvailability) => void;
}

export function AdminDashboard({ 
  incidents, 
  shelters, 
  beds,
  onSelectIncident,
  onUpdateBeds
}: AdminDashboardProps) {
  const [loadingSitrep, setLoadingSitrep] = useState(false);
  const [sitrep, setSitrep] = useState<{
    title: string;
    overview: string;
    criticalAlerts: string[];
    resourceStatus: string;
    peaceIndex: number;
    recommendations: string[];
  } | null>(null);

  const handleGenerateSitrep = async () => {
    setLoadingSitrep(true);
    setSitrep(null);
    try {
      const res = await fetch('/api/gemini/situation-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidents, shelters, beds })
      });
      const data = await res.json();
      setSitrep(data);
    } catch (e) {
      console.error('Failed fetching sitrep:', e);
    } finally {
      setLoadingSitrep(false);
    }
  };

  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;
  const totalCount = incidents.length;

  return (
    <div className="space-y-6">
      
      {/* High-level Bento stats summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px]">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Incidents</span>
          <div className="text-4xl font-black text-[#1E3A8A] dark:text-blue-400">{totalCount}</div>
          <span className="text-[10px] text-slate-400 font-mono">All active districts</span>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px]">
          <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">Critical Threats</span>
          <div className="text-4xl font-black text-red-600">{criticalCount}</div>
          <span className="text-[10px] text-red-400 font-mono">Requires Dispatch</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px]">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Shelter Beds</span>
          <div className="text-3xl font-black text-[#1E3A8A] dark:text-blue-400">
            {shelters.reduce((acc, s) => acc + s.occupied, 0)}<span className="text-slate-400 font-medium text-xs">/{shelters.reduce((acc, s) => acc + s.capacity, 0)}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">2 District Halls</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[140px]">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">On-Field Squads</span>
          <div className="text-4xl font-black text-emerald-600">
            {beds.ambulancesActive}<span className="text-slate-400 font-medium text-xs">/{beds.ambulancesTotal}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">GPS tracking live</span>
        </div>
      </div>

      {/* AI SITREP GENERATOR PANEL (Stunning Blue Bento block) */}
      <div className="bg-[#1E3A8A] text-white p-6 rounded-[2rem] shadow-lg flex flex-col justify-between min-h-[200px] space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">AI Situation Report</span>
            <h3 className="font-sans font-black text-xl leading-tight flex items-center gap-1.5 text-white">
              <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" /> District Feeds Analyzer
            </h3>
            <p className="text-xs text-blue-200 max-w-xl">
              Consolidates multi-agency police reports, volunteer assignments, and medical ward logs into a real-time District Cohesion Report.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider">Gemini Pro</div>
            <button
              onClick={handleGenerateSitrep}
              disabled={loadingSitrep}
              className="px-4 py-2 bg-white hover:bg-blue-50 text-[#1E3A8A] rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-md"
            >
              {loadingSitrep ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <FileText className="w-4 h-4 text-[#1E3A8A]" />}
              Compile Sitrep
            </button>
          </div>
        </div>

        {/* Render Generated SITREP */}
        {sitrep && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 p-5 rounded-2xl space-y-4 text-xs backdrop-blur-sm border border-white/10"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-extrabold text-blue-100 text-sm">{sitrep.title}</h4>
              <span className="font-mono bg-emerald-500 text-white font-extrabold px-2.5 py-1 rounded text-[10px] shadow-sm">
                PEACE INDEX: {sitrep.peaceIndex}%
              </span>
            </div>

            <p className="text-[11.5px] text-slate-100 leading-relaxed font-sans">{sitrep.overview}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/15">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Critical Safety Targets</span>
                <ul className="space-y-1 list-disc pl-4 text-slate-100 text-[11px] leading-relaxed">
                  {sitrep.criticalAlerts.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">District Recommendations</span>
                <ul className="space-y-1 list-disc pl-4 text-slate-100 text-[11px] leading-relaxed">
                  {sitrep.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Incident Triage List Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-2">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Incident Triage Dispatch Queue</h4>
          <span className="text-xs text-slate-400 font-mono font-bold">Total Queue: {incidents.length}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incidents.slice(0, 4).map(inc => (
            <div 
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    inc.severity === 'Critical' ? 'bg-red-100 text-red-700' : 
                    inc.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {inc.severity}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Score: {inc.priorityScore}/100</span>
                </div>
                <h5 className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors line-clamp-1">{inc.title}</h5>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{inc.description}</p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/60 pt-3 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">📍 {inc.location.address}</span>
                <span className="text-blue-600 font-bold group-hover:underline">Manage ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 3. POLICE DISPATCH DASHBOARD
// ==========================================
interface PoliceDashboardProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
}

export function PoliceDashboard({ 
  incidents, 
  onSelectIncident,
  onUpdateStatus 
}: PoliceDashboardProps) {
  const policeIncidents = incidents.filter(i => i.category.includes('Traffic') || i.category.includes('Safety') || i.severity === 'Critical');

  return (
    <div className="space-y-6">
      
      {/* Dispatch Overview Bento Block */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-sans font-black text-slate-800 dark:text-white text-lg tracking-tight">Traffic & Crowd Control Dispatch</h3>
        <p className="text-xs text-slate-500 mt-1">Review active parade bypass green-lanes, report road closures, and dispatch officers to crowd bottlenecks.</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-2">My Dispatches & Critical Hotspots</h4>
        <div className="space-y-4">
          {policeIncidents.map(inc => (
            <div 
              key={inc.id}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col md:flex-row justify-between gap-5 shadow-sm"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8.5px] font-extrabold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full uppercase">Case: #{inc.id}</span>
                  <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">{inc.severity} Severity</span>
                </div>
                <h4 className="font-black text-sm text-slate-800 dark:text-white">{inc.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">{inc.description}</p>
                <div className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1">📍 {inc.location.address}</div>
              </div>

              <div className="flex flex-col justify-between gap-3 shrink-0 self-start md:self-stretch border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-5">
                <span className="text-xs font-black text-slate-400 md:text-right uppercase tracking-wider block">Status: {inc.status}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectIncident(inc)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
                  >
                    View Timeline
                  </button>
                  <button
                    onClick={() => onUpdateStatus(inc.id, 'Resolved')}
                    className="px-3.5 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Close Case
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. NGO DASHBOARD
// ==========================================
interface NgoDashboardProps {
  shelters: Shelter[];
  tasks: Task[];
  onSelectIncident: (inc: Incident) => void;
  incidents: Incident[];
}

export function NgoDashboard({ 
  shelters, 
  tasks,
  onSelectIncident,
  incidents
}: NgoDashboardProps) {
  const ngoIncidents = incidents.filter(i => i.category.includes('Civic') || i.category.includes('Medical'));

  return (
    <div className="space-y-6">
      
      {/* Shelter Grid Capacity tracking */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-2">Active Relief Shelters Grid</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shelters.map(shelter => {
            const percent = (shelter.occupied / shelter.capacity) * 100;
            return (
              <div key={shelter.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-800 dark:text-white">{shelter.name}</h5>
                    <p className="text-[10px] text-slate-400">📍 {shelter.location.address}</p>
                  </div>
                  <span className="text-xs font-black text-[#1E3A8A] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">{shelter.occupied} / {shelter.capacity} Beds</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1E3A8A] h-full rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>CAPACITY</span>
                    <span>{percent.toFixed(0)}% OCCUPIED</span>
                  </div>
                </div>

                {/* Resource checkmarks */}
                <div className="flex gap-4 text-[10.5px] font-bold text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <span className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${shelter.foodAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} /> Meals</span>
                  <span className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${shelter.waterAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} /> Water</span>
                  <span className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${shelter.medicalAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} /> Paramedics</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource & Support requests queue */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-2">NGO Civic & Support Requests Queue</h4>
        <div className="space-y-3">
          {ngoIncidents.slice(0, 3).map(inc => (
            <div 
              key={inc.id}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex justify-between items-center gap-4 cursor-pointer hover:border-blue-300 shadow-sm group"
              onClick={() => onSelectIncident(inc)}
            >
              <div className="space-y-1 min-w-0">
                <span className="text-[8.5px] font-extrabold text-blue-600 uppercase tracking-widest block">{inc.category}</span>
                <h5 className="font-extrabold text-xs text-slate-800 dark:text-white truncate group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors">{inc.title}</h5>
                <p className="text-[11px] text-slate-500 truncate leading-relaxed">{inc.description}</p>
              </div>
              <button className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] font-bold text-[10px] uppercase tracking-wider rounded-xl shrink-0 transition-all border border-blue-100">
                Coordinate Aid
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 5. HOSPITAL DASHBOARD
// ==========================================
interface HospitalDashboardProps {
  beds: BedAvailability;
  onUpdateBeds: (beds: BedAvailability) => void;
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

export function HospitalDashboard({
  beds,
  onUpdateBeds,
  incidents,
  onSelectIncident
}: HospitalDashboardProps) {
  const medicalEmergencies = incidents.filter(i => i.category.includes('Medical') || i.severity === 'Critical');

  const adjustBed = (field: 'available' | 'icuAvailable', increment: boolean) => {
    const updated = { ...beds };
    if (field === 'available') {
      updated.available = increment ? Math.min(updated.available + 1, beds.total) : Math.max(updated.available - 1, 0);
    } else {
      updated.icuAvailable = increment ? Math.min(updated.icuAvailable + 1, beds.icuTotal) : Math.max(updated.icuAvailable - 1, 0);
    }
    onUpdateBeds(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Live Hospital Beds Counters (2 Bento Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard Ward Beds */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Standard Ward Beds Vacant</span>
            <div className="text-4xl font-black text-[#1E3A8A] dark:text-blue-400">{beds.available} <span className="text-sm font-normal text-slate-400">/ {beds.total} Total</span></div>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => adjustBed('available', false)}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center transition-all text-sm border border-slate-200 dark:border-slate-700"
            >
              -
            </button>
            <button 
              onClick={() => adjustBed('available', true)}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl flex items-center justify-center transition-all text-sm border border-slate-200 dark:border-slate-700"
            >
              +
            </button>
          </div>
        </div>

        {/* ICU Beds */}
        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-[2rem] border border-red-200 dark:border-red-900/30 flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">ICU Beds Vacant</span>
            <div className="text-4xl font-black text-red-600">{beds.icuAvailable} <span className="text-sm font-normal text-red-400">/ {beds.icuTotal} Total</span></div>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => adjustBed('icuAvailable', false)}
              className="w-10 h-10 bg-red-100 hover:bg-red-200 dark:bg-red-900 text-red-700 font-bold rounded-xl flex items-center justify-center transition-all text-sm border border-red-200"
            >
              -
            </button>
            <button 
              onClick={() => adjustBed('icuAvailable', true)}
              className="w-10 h-10 bg-red-100 hover:bg-red-200 dark:bg-red-900 text-red-700 font-bold rounded-xl flex items-center justify-center transition-all text-sm border border-red-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Ambulance Dispatch & Triage */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-2">Incoming Medical Emergencies Triage Queue</h4>
        <div className="space-y-4">
          {medicalEmergencies.map(inc => (
            <div 
              key={inc.id}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full uppercase">EMERGENCY DISPATCH</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">Case: #{inc.id}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{inc.title}</h4>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">{inc.description}</p>
                <div className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1">📍 Destination Ward Route: {inc.location.address}</div>
              </div>

              <div className="flex flex-col justify-end gap-2 shrink-0">
                <button
                  onClick={() => onSelectIncident(inc)}
                  className="px-4 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Coordinate Triage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ==========================================
// 6. VOLUNTEER DASHBOARD
// ==========================================
interface VolunteerDashboardProps {
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
  onAcceptTask: (taskId: string) => void;
}

export function VolunteerDashboard({
  tasks,
  onCompleteTask,
  onAcceptTask
}: VolunteerDashboardProps) {
  return (
    <div className="space-y-6">
      
      {/* Community Volunteer overview bento block */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-sans font-black text-slate-800 dark:text-white text-lg tracking-tight">Community Volunteer Portal</h3>
        <p className="text-xs text-slate-500 mt-1">Review neighborhood tasks requested by district admins to aid food distribution, medical drops, and local road guidance.</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-2">Assigned Community Tasks</h4>
        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'Accepted' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {task.status}
                  </span>
                  <h4 className="font-black text-sm text-slate-800 dark:text-white">{task.title}</h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">TASK: #{task.id}</span>
              </div>

              <p className="text-xs text-slate-500 font-sans leading-relaxed">{task.description}</p>

              <div className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1">📍 TARGET ADDRESS: {task.location.address}</div>

              {/* Action buttons based on status */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end gap-2">
                {task.status === 'Pending' && (
                  <button
                    onClick={() => onAcceptTask(task.id)}
                    className="px-4 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Check-In & Accept
                  </button>
                )}
                {task.status === 'Accepted' && (
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Mark Task Completed ✓
                  </button>
                )}
                {task.status === 'Completed' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 py-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Task Successfully Resolved
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
