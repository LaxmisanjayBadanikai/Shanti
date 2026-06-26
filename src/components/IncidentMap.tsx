import React, { useState } from 'react';
import { Incident, Shelter, Location } from '../types';
import { Map, Layers, ShieldAlert, Navigation, Eye, Compass, Plus, ZoomIn, ZoomOut, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface IncidentMapProps {
  incidents: Incident[];
  shelters: Shelter[];
  onSelectIncident?: (incident: Incident) => void;
  selectedIncidentId?: string;
  userLocation?: Location;
  isNgoView?: boolean;
}

export default function IncidentMap({ 
  incidents, 
  shelters, 
  onSelectIncident, 
  selectedIncidentId,
  userLocation = { lat: 18.5204, lng: 73.8567, address: 'Pune' },
  isNgoView = false
}: IncidentMapProps) {
  // Navigation Routing States
  const [activeRoute, setActiveRoute] = useState<{from: string, to: string, path: string} | null>(null);
  
  // Map parameters
  const [mapMode, setMapMode] = useState<'standard' | 'satellite' | 'heatmap'>('standard');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showShelters, setShowShelters] = useState<boolean>(true);
  
  // Zoom & Pan simulations
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map limits
  const minZoom = 0.8;
  const maxZoom = 2.5;

  // Handlers for simulated drag & pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Convert real Pune lat-lng coordinates (roughly) to SVG pixels
  // Center of Pune roughly around lat 18.5204, lng 73.8567
  const convertCoordToSvg = (lat: number, lng: number) => {
    const mapCenterX = 400;
    const mapCenterY = 300;
    const scaleX = 14000; // coordinate scaling
    const scaleY = 14000;
    
    const dx = (lng - 73.8567) * scaleX;
    const dy = (18.5204 - lat) * scaleY; // Flip Y because SVG 0 is at top
    
    return {
      x: mapCenterX + dx,
      y: mapCenterY + dy
    };
  };

  // Get filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity !== 'All' && inc.severity !== filterSeverity) return false;
    if (filterCategory !== 'All' && inc.category !== filterCategory) return false;
    return true;
  });

  const handleTriggerRoute = (inc: Incident) => {
    const incPos = convertCoordToSvg(inc.location.lat, inc.location.lng);
    const userPos = convertCoordToSvg(userLocation.lat, userLocation.lng);
    
    // Create an elegant SVG multi-point path string
    const pathStr = `M ${userPos.x} ${userPos.y} Q ${(userPos.x + incPos.x) / 2 + 30} ${(userPos.y + incPos.y) / 2 - 30}, ${incPos.x} ${incPos.y}`;
    setActiveRoute({
      from: 'My Current Location',
      to: inc.title,
      path: pathStr
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
      
      {/* Map Control Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-blue-600" />
          <h3 className="font-sans font-bold text-slate-800 dark:text-white text-sm">Live Incident Map</h3>
          <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> LIVE COHESION
          </span>
        </div>

        {/* Map Layers & Filter selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Mode Buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
            <button 
              onClick={() => setMapMode('standard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${mapMode === 'standard' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Standard
            </button>
            <button 
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all ${mapMode === 'satellite' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Satellite
            </button>
            <button 
              onClick={() => setMapMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${mapMode === 'heatmap' ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-semibold shadow-sm border border-amber-200/50 dark:border-amber-900/50' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> AI Heatmap
            </button>
          </div>

          {/* Quick Filters */}
          <select 
            value={filterSeverity} 
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 px-2.5 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <label className="text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 px-2.5 rounded-xl cursor-pointer">
            <input 
              type="checkbox" 
              checked={showShelters} 
              onChange={() => setShowShelters(!showShelters)}
              className="rounded text-blue-600 focus:ring-0 border-slate-300"
            />
            Shelters
          </label>
        </div>
      </div>

      {/* Interactive Map Area */}
      <div 
        className="flex-1 relative overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#e4edf5] dark:bg-[#0f172a]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="absolute origin-center transition-transform duration-75"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            width: '800px',
            height: '600px'
          }}
        >
          {/* SATELLITE MODE OVERLAY BACKGROUND */}
          {mapMode === 'satellite' ? (
            <svg width="800" height="600" className="absolute inset-0 bg-[#090d16]">
              {/* Dark textured terrain circles */}
              <rect width="800" height="600" fill="#0c111d" />
              <circle cx="350" cy="250" r="220" fill="#111827" opacity="0.6" />
              <circle cx="500" cy="400" r="300" fill="#131e35" opacity="0.4" />
              {/* Forest areas */}
              <rect x="50" y="80" width="160" height="180" rx="30" fill="#142618" opacity="0.5" />
              <rect x="600" y="320" width="150" height="200" rx="40" fill="#152b1a" opacity="0.4" />
            </svg>
          ) : (
            /* STANDARD MODE BACKGROUND */
            <svg width="800" height="600" className="absolute inset-0 bg-[#edf2f7] dark:bg-[#1e293b]">
              <rect width="800" height="600" fill="#f1f5f9" dark-fill="#1e293b" />
              {/* Forest & Park grounds */}
              <rect x="50" y="80" width="160" height="180" rx="30" fill="#dcfce7" className="dark:fill-[#14532d]/20" />
              <text x="130" y="170" fill="#15803d" className="dark:fill-emerald-400 text-[10px] font-mono opacity-60 text-center" textAnchor="middle">SHANTI RESERVE FOREST</text>

              <rect x="600" y="320" width="150" height="200" rx="40" fill="#dcfce7" className="dark:fill-[#14532d]/20" />
              <text x="675" y="420" fill="#15803d" className="dark:fill-emerald-400 text-[10px] font-mono opacity-60 text-center" textAnchor="middle">CENTRAL BOTANICAL PARK</text>
            </svg>
          )}

          {/* SVG Map Graphics - Shared Lines (Roads, Rivers) */}
          <svg width="800" height="600" className="absolute inset-0 pointer-events-none">
            {/* River Blue Path */}
            <path 
              d="M 0 520 Q 250 480, 480 320 T 800 240" 
              fill="none" 
              stroke={mapMode === 'satellite' ? '#1d4ed8' : '#bfdbfe'} 
              strokeWidth="28" 
              opacity={mapMode === 'satellite' ? '0.4' : '0.8'}
            />
            <path 
              d="M 0 520 Q 250 480, 480 320 T 800 240" 
              fill="none" 
              stroke={mapMode === 'satellite' ? '#2563eb' : '#93c5fd'} 
              strokeWidth="10" 
              opacity="0.9"
            />
            <text x="310" y="430" fill="#2563eb" className="dark:fill-blue-400 text-[9px] font-mono italic opacity-60" transform="rotate(-18 310 430)">SHANTI RIVERBED</text>

            {/* Roads & Highways grids */}
            {/* National Ring Bypass */}
            <path 
              d="M 40 40 L 760 40 L 760 560 L 40 560 Z" 
              fill="none" 
              stroke={mapMode === 'satellite' ? '#374151' : '#cbd5e1'} 
              strokeWidth="16" 
              opacity="0.8"
            />
            <path 
              d="M 40 40 L 760 40 L 760 560 L 40 560 Z" 
              fill="none" 
              stroke={mapMode === 'satellite' ? '#4b5563' : '#f8fafc'} 
              strokeWidth="8" 
              opacity="1"
            />
            {/* Grid Intersecting Roads */}
            {/* Road A - Harmony Parade Route */}
            <path 
              d="M 400 40 L 400 560" 
              fill="none" 
              stroke={mapMode === 'satellite' ? '#4b5563' : '#e2e8f0'} 
              strokeWidth="12" 
            />
            <path 
              d="M 400 40 L 400 560" 
              fill="none" 
              stroke={mapMode === 'satellite' ? '#fbbf24' : '#fff'} 
              strokeWidth="6" 
              strokeDasharray="4 4"
            />
            {/* Road B - Hospital Junction Road */}
            <path 
              d="M 40 250 L 760 250" 
              fill="none" 
              stroke={mapMode === 'satellite' ? '#4b5563' : '#e2e8f0'} 
              strokeWidth="12" 
            />
            <path 
              d="M 40 250 L 760 250" 
              fill="none" 
              stroke="#fff" 
              strokeWidth="6" 
            />
            
            {/* Road C - Station Road */}
            <path d="M 120 40 L 120 560" fill="none" stroke={mapMode === 'satellite' ? '#374151' : '#e2e8f0'} strokeWidth="8" />
            {/* Road D - East Zone Lane */}
            <path d="M 680 40 L 680 560" fill="none" stroke={mapMode === 'satellite' ? '#374151' : '#e2e8f0'} strokeWidth="8" />

            {/* Major Landmark Zones Text */}
            <text x="400" y="70" fill={mapMode === 'satellite' ? '#9ca3af' : '#475569'} className="text-[10px] font-sans font-bold" textAnchor="middle">SHANTI PARADE ROUTE</text>
            <text x="600" y="240" fill={mapMode === 'satellite' ? '#9ca3af' : '#475569'} className="text-[10px] font-sans font-bold" textAnchor="middle">HOSPITAL CORRIDOR</text>
          </svg>

          {/* AI HEATMAP LAYER (CROWD DENSITIES OVERLAY) */}
          {mapMode === 'heatmap' && (
            <svg width="800" height="600" className="absolute inset-0 pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-65">
              {/* Critical area crowd density heatmap (Mosque Subway exit) */}
              <circle cx="410" cy="220" r="90" fill="url(#heat-critical)" />
              <circle cx="400" cy="250" r="140" fill="url(#heat-high)" />
              {/* Shanti festival ground congestion heatmap */}
              <circle cx="360" cy="110" r="100" fill="url(#heat-medium)" />
              {/* Hospital junction heatmap */}
              <circle cx="500" cy="250" r="80" fill="url(#heat-medium)" />
              
              <defs>
                <radialGradient id="heat-critical">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                  <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat-high">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#eab308" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heat-medium">
                  <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#84cc16" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          )}

          {/* ACTIVE ROUTING LINE */}
          {activeRoute && (
            <svg width="800" height="600" className="absolute inset-0 pointer-events-none z-10">
              {/* Route line */}
              <path 
                d={activeRoute.path} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="6" 
                strokeLinecap="round"
                className="animate-[dash_2s_linear_infinite]"
                strokeDasharray="12 6"
              />
              <path 
                d={activeRoute.path} 
                fill="none" 
                stroke="#60a5fa" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* LANDMARK PINS */}
          <div className="absolute inset-0 pointer-events-none">
            {/* City General Hospital */}
            <div 
              style={{ left: '560px', top: '190px' }} 
              className="absolute flex flex-col items-center pointer-events-auto cursor-help"
              title="City General Hospital (Beds Active)"
            >
              <div className="bg-red-600 border-2 border-white text-white p-1 rounded-full shadow-md">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold bg-white/90 text-slate-800 px-1 rounded shadow-sm border border-slate-200 mt-0.5">CITY HOSPITAL</span>
            </div>

            {/* Shanti Central Railway Station */}
            <div 
              style={{ left: '160px', top: '230px' }} 
              className="absolute flex flex-col items-center pointer-events-auto cursor-help"
              title="Central Junction Railway Station"
            >
              <div className="bg-slate-700 border-2 border-white text-white p-1 rounded-md shadow-md">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold bg-white/90 text-slate-800 px-1 rounded shadow-sm border border-slate-200 mt-0.5">CENTRAL RAILWAY</span>
            </div>
          </div>

          {/* SHELTERS RENDERING */}
          {showShelters && shelters.map(shelter => {
            const pos = convertCoordToSvg(shelter.location.lat, shelter.location.lng);
            return (
              <div 
                key={shelter.id}
                style={{ left: `${pos.x - 12}px`, top: `${pos.y - 12}px` }}
                className="absolute pointer-events-auto cursor-pointer flex flex-col items-center z-10 group"
                title={`${shelter.name} (${shelter.occupied}/${shelter.capacity} occupied)`}
              >
                <div className="bg-emerald-600 hover:bg-emerald-700 border-2 border-white text-white p-1.5 rounded-full shadow-lg transition-transform hover:scale-110">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                {/* Popover label on hover */}
                <span className="text-[8px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded shadow border border-emerald-200 mt-1 hidden group-hover:block absolute top-6 whitespace-nowrap z-30">
                  🏠 {shelter.name}
                </span>
              </div>
            );
          })}

          {/* USER LOCATION PIN */}
          <div 
            style={{ 
              left: `${convertCoordToSvg(userLocation.lat, userLocation.lng).x - 12}px`, 
              top: `${convertCoordToSvg(userLocation.lat, userLocation.lng).y - 12}px` 
            }} 
            className="absolute flex flex-col items-center pointer-events-auto z-20"
          >
            <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center animate-ping absolute" />
            <div className="bg-blue-600 border-2 border-white text-white p-1.5 rounded-full shadow-md flex items-center justify-center relative">
              <Navigation className="w-3 h-3 fill-white text-white rotate-45" />
            </div>
            <span className="text-[8px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded shadow mt-1">MY POSITION</span>
          </div>

          {/* INCIDENT INTERACTIVE PINS */}
          {filteredIncidents.map(inc => {
            const pos = convertCoordToSvg(inc.location.lat, inc.location.lng);
            const isSelected = selectedIncidentId === inc.id;
            
            // Set colors based on severity
            let colorClass = 'bg-blue-600 border-blue-200';
            let pinStyle = 'bg-blue-600';
            if (inc.severity === 'Low') {
              colorClass = 'bg-blue-500 border-blue-100 text-white';
              pinStyle = 'bg-blue-500';
            } else if (inc.severity === 'Medium') {
              colorClass = 'bg-amber-500 border-amber-100 text-white';
              pinStyle = 'bg-amber-500';
            } else if (inc.severity === 'High') {
              colorClass = 'bg-orange-500 border-orange-100 text-white animate-pulse';
              pinStyle = 'bg-orange-500';
            } else if (inc.severity === 'Critical') {
              colorClass = 'bg-red-600 border-red-200 text-white animate-bounce';
              pinStyle = 'bg-red-600';
            }

            return (
              <div 
                key={inc.id}
                style={{ left: `${pos.x - 14}px`, top: `${pos.y - 14}px` }}
                onClick={() => onSelectIncident && onSelectIncident(inc)}
                className={`absolute pointer-events-auto cursor-pointer p-1.5 rounded-full border-2 shadow-lg transition-transform z-20 ${colorClass} ${
                  isSelected ? 'scale-130 ring-4 ring-blue-400 dark:ring-blue-700' : 'hover:scale-115'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                
                {/* Visual Label for Critical Incidents */}
                {inc.severity === 'Critical' && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] bg-red-600 text-white px-1 font-extrabold rounded shadow whitespace-nowrap animate-pulse">
                    CRITICAL
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Control Utilities (Zoom & Reset) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <button 
          onClick={() => setZoom(prev => Math.min(prev + 0.2, maxZoom))}
          className="w-10 h-10 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl shadow-lg flex items-center justify-center border border-slate-100 dark:border-slate-700 font-bold"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setZoom(prev => Math.max(prev - 0.2, minZoom))}
          className="w-10 h-10 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl shadow-lg flex items-center justify-center border border-slate-100 dark:border-slate-700 font-bold"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button 
          onClick={() => { setZoom(1); setPanX(0); setPanY(0); setActiveRoute(null); }}
          className="w-10 h-10 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl shadow-lg flex items-center justify-center border border-slate-100 dark:border-slate-700 font-bold"
          title="Reset Map View"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* Mini Details Panel of Selected Incident */}
      {selectedIncidentId && (
        (() => {
          const selectedInc = incidents.find(i => i.id === selectedIncidentId);
          if (!selectedInc) return null;
          return (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 z-10 shadow-inner"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    selectedInc.severity === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' :
                    selectedInc.severity === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400' :
                    selectedInc.severity === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                  }`}>
                    {selectedInc.severity}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">#{selectedInc.id}</span>
                </div>
                <h4 className="font-sans font-bold text-slate-800 dark:text-white text-sm truncate">{selectedInc.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">📍 {selectedInc.location.address}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => handleTriggerRoute(selectedInc)}
                  className="px-3.5 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/50 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl font-semibold text-xs transition-all flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" /> Route
                </button>
                {onSelectIncident && (
                  <button 
                    onClick={() => onSelectIncident(selectedInc)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                )}
              </div>
            </motion.div>
          );
        })()
      )}
    </div>
  );
}
