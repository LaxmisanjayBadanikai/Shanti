import React, { useState } from 'react';
import { Incident, Role, Location } from '../types';
import { AlertCircle, Camera, Video, MapPin, Send, HelpCircle, Check, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportIncidentProps {
  onReportSubmit: (newIncident: Partial<Incident>) => void;
  existingIncidents: Incident[];
  reporterName: string;
  reporterUid: string;
}

const CATEGORIES = [
  'Civic Infrastructure',
  'Traffic & Crowd Management',
  'Medical Emergency',
  'Resource Request',
  'Safety Hazard',
  'Inter-faith / Peace Cohesion'
];

export default function ReportIncident({ 
  onReportSubmit, 
  existingIncidents,
  reporterName,
  reporterUid
}: ReportIncidentProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [address, setAddress] = useState('Entrance Gate 2, Shanti Ground');
  const [lat, setLat] = useState(18.5204);
  const [lng, setLng] = useState(73.8567);
  
  // Media states
  const [photo, setPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  
  // AI State & Duplicate warnings
  const [loadingAI, setLoadingAI] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    isDuplicate: boolean;
    duplicateOfId: string | null;
    reason: string;
    confidence: number;
  } | null>(null);

  const [aiReportDetails, setAiReportDetails] = useState<{
    summary: string;
    severity: string;
    priorityScore: number;
    justification: string;
    actionItems: string[];
  } | null>(null);

  const handleSimulateGPS = () => {
    // Generate slight random variation around Pune coordinates
    const deltaLat = (Math.random() - 0.5) * 0.02;
    const deltaLng = (Math.random() - 0.5) * 0.02;
    const randomPuneLat = 18.5204 + deltaLat;
    const randomPuneLng = 73.8567 + deltaLng;
    
    setLat(randomPuneLat);
    setLng(randomPuneLng);
    
    // Choose a realistic random address
    const mockAddresses = [
      'Near Plaza Circle Circle, Ward 4',
      'Mosque Lane near Station Bypass',
      'Harmony Relief Hall Area, North Block',
      'City General Hospital Main Gate',
      'Peace Chowk Crossroads, Sector 9'
    ];
    setAddress(mockAddresses[Math.floor(Math.random() * mockAddresses.length)]);
  };

  const handlePhotoSimulate = () => {
    // Simulated photo attachment
    const samplePhotos = [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1510931149491-d2547b74e64f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400'
    ];
    setPhoto(samplePhotos[Math.floor(Math.random() * samplePhotos.length)]);
  };

  const handleVideoSimulate = () => {
    setVideo('Simulated_Cohesion_Video_Feed.mp4');
  };

  // Perform Gemini AI Duplicate Report and Summary check
  const handleAnalyzeWithAI = async () => {
    if (!title || !description) return;
    
    setLoadingAI(true);
    setDuplicateWarning(null);
    setAiReportDetails(null);

    try {
      // 1. Check for duplicates
      const dupRes = await fetch('/api/gemini/detect-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newIncident: { title, description, location: { address } },
          existingIncidents
        })
      });
      const dupData = await dupRes.json();
      
      // 2. Run summarization and scoring
      const sumRes = await fetch('/api/gemini/summarize-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const sumData = await sumRes.json();

      setAiReportDetails(sumData);
      
      if (dupData.isDuplicate) {
        setDuplicateWarning(dupData);
      }
    } catch (e) {
      console.error("Failed AI optimization call:", e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleFinalSubmit = (ignoreDuplicate = false) => {
    if (!title || !description) return;

    // Use AI results if generated, otherwise fallback
    const severity = aiReportDetails?.severity || 'Medium';
    const priorityScore = aiReportDetails?.priorityScore || 50;
    const aiSummary = aiReportDetails?.summary || `Report on ${title}.`;
    const suggestedCategory = aiReportDetails?.category || category;

    const reportedIncident: Partial<Incident> = {
      title,
      description,
      category: suggestedCategory,
      severity: severity as any,
      status: 'Reported',
      location: {
        lat,
        lng,
        address
      },
      mediaUrls: photo ? [photo] : [],
      aiSummary,
      priorityScore,
      duplicateOf: ignoreDuplicate ? undefined : duplicateWarning?.duplicateOfId || undefined
    };

    onReportSubmit(reportedIncident);
    
    // Clear inputs
    setTitle('');
    setDescription('');
    setPhoto(null);
    setVideo(null);
    setDuplicateWarning(null);
    setAiReportDetails(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
      
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-slate-800 dark:text-white text-base">Report Incident / Request</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Share verified updates to coordinate district responders.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Incident Heading / Title</label>
          <input
            type="text"
            placeholder="e.g., Blocked drainage at ground entrance"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Detailed Description</label>
          <textarea
            placeholder="Provide context. What is happening? Who is impacted? What support is needed immediately?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
          />
        </div>

        {/* Category & Location selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Default Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-3 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none text-slate-800 dark:text-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Incident Street / Landmark Address</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Gate 2, Shanti Ground"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 py-3 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
              />
              <button 
                type="button"
                onClick={handleSimulateGPS}
                className="px-3.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl flex items-center justify-center transition-all border border-blue-200 dark:border-blue-900"
                title="Fetch Simulated GPS Location"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5 pl-1">
              <span>GPS Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Media Attachments Section */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Media attachments (Photos & Video feeds)</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePhotoSimulate}
              className={`flex-1 py-3 border border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                photo 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
              }`}
            >
              <Camera className="w-4 h-4" />
              {photo ? 'Photo Attached ✓' : 'Add Live Camera Photo'}
            </button>
            <button
              type="button"
              onClick={handleVideoSimulate}
              className={`flex-1 py-3 border border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                video 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
              }`}
            >
              <Video className="w-4 h-4" />
              {video ? 'Video Feed Linked ✓' : 'Add Live Video Stream'}
            </button>
          </div>
          {photo && (
            <div className="mt-2 relative inline-block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={photo} alt="Simulated Attachment" className="w-32 h-20 object-cover" referrerPolicy="no-referrer" />
              <button onClick={() => setPhoto(null)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 text-[9px]">✕</button>
            </div>
          )}
        </div>

        {/* AI PREVIEW GENERATOR CALL */}
        {title && description && !aiReportDetails && !loadingAI && (
          <button
            type="button"
            onClick={handleAnalyzeWithAI}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-pulse" /> Check with Gemini AI (Duplicate & Category Optimizer)
          </button>
        )}

        {/* AI LOADING PANEL */}
        {loadingAI && (
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300">PeaceOS AI Triage Agent Analyzing...</h4>
              <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80">Checking duplicate records and estimating priority score on server-side...</p>
            </div>
          </div>
        )}

        {/* AI ANALYSIS RESULTS REPORT */}
        {aiReportDetails && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-emerald-50/55 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Gemini AI Triage Diagnostics
              </div>
              <span className="text-[10px] font-mono font-extrabold bg-emerald-200/50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded">
                SCORE: {aiReportDetails.priorityScore}/100 ({aiReportDetails.severity})
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              <strong>Summary:</strong> "{aiReportDetails.summary}"
            </p>
            
            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-2 border-l-2 border-emerald-400">
              <strong>AI Justification:</strong> {aiReportDetails.justification}
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">Suggested AI Responders Action Items:</span>
              <ul className="text-[10.5px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                {aiReportDetails.actionItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* DUPLICATE WARNING DIALOGUE */}
        {duplicateWarning && duplicateWarning.isDuplicate && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex gap-3 text-amber-800 dark:text-amber-400"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-2 flex-1">
              <h4 className="text-xs font-bold">Similar Incident Already Reported!</h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-400/85 leading-relaxed">
                {duplicateWarning.reason} (Confidence Match: {(duplicateWarning.confidence * 100).toFixed(0)}%)
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(false)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition-all"
                >
                  Link & Submit as Related
                </button>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(true)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-all"
                >
                  Force Submit Separately
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit Buttons */}
        {!duplicateWarning && (
          <button
            type="button"
            onClick={() => handleFinalSubmit(true)}
            className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Report
          </button>
        )}
      </div>
    </div>
  );
}
