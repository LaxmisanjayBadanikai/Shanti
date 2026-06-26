import React from 'react';
import { UserProfile, Role } from '../types';
import { User, Shield, Phone, Mail, Globe, Settings, LogOut, RefreshCw, Smartphone } from 'lucide-react';

interface ProfileScreenProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdateRole: (role: Role) => void;
  onUpdateLanguage: (lang: string) => void;
}

const ROLES_LIST = [
  { role: Role.CITIZEN, desc: 'View alerts, find safe routes, and report local incidents.' },
  { role: Role.POLICE, desc: 'Manage assigned tasks, route teams, and dispatch officers.' },
  { role: Role.DISTRICT_ADMIN, desc: 'Supervise district-wide resources, generate AI SITREPs, and broadcast notifications.' },
  { role: Role.NGO, desc: 'Manage volunteer task forces, food distributions, and shelter grids.' },
  { role: Role.HOSPITAL, desc: 'Review incoming ambulance runs and coordinate bed availabilities.' },
  { role: Role.VOLUNTEER, desc: 'Accept neighborhood support tasks, check-in, and log accomplishments.' }
];

export default function ProfileScreen({
  user,
  onLogout,
  onUpdateRole,
  onUpdateLanguage
}: ProfileScreenProps) {
  return (
    <div className="space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-sans font-bold text-2xl shadow-md shadow-blue-500/25">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-sans font-bold text-slate-800 dark:text-white text-base">{user.name}</h3>
          <span className="inline-block text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full mt-0.5">
            🛡️ {user.role}
          </span>
          <p className="text-[11px] text-slate-400 font-mono mt-1">ID: {user.uid}</p>
        </div>
      </div>

      {/* Main Profile Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 dark:border-slate-800 pb-2">User Credentials</h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4.5 h-4.5 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">EMAIL</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4.5 h-4.5 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">CONTACT PHONE</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{user.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="w-4.5 h-4.5 text-slate-400" />
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 block font-semibold">LANGUAGE</span>
              <select
                value={user.language}
                onChange={(e) => onUpdateLanguage(e.target.value)}
                className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent border-none p-0 outline-none focus:ring-0"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Urdu">Urdu (اردو)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ROLE SWITCHER FOR SIMULATOR TESTING */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900/50 dark:to-slate-950 p-6 rounded-[2rem] border border-blue-200 dark:border-blue-900/40 space-y-4">
        <div className="flex items-center gap-2 border-b border-blue-200/50 dark:border-blue-900/50 pb-3">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-[spin_6s_linear_infinite]" />
          <div>
            <h4 className="text-xs font-extrabold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Developer Sandbox Testing</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Instantly switch roles to experience each unique responder panel and action interface.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ROLES_LIST.map((item) => {
            const isCurrent = user.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => onUpdateRole(item.role)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                  isCurrent 
                    ? 'bg-white dark:bg-slate-800 border-blue-400 dark:border-blue-700 shadow-md ring-2 ring-blue-500/20' 
                    : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    {isCurrent && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />}
                    {item.role}
                  </span>
                  {isCurrent && <span className="text-[8.5px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">Active</span>}
                </div>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium leading-normal">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl font-bold text-sm border border-red-200/50 dark:border-red-900/50 flex items-center justify-center gap-2 transition-all shadow-sm"
      >
        <LogOut className="w-4 h-4" /> Securely Log Out of PeaceOS
      </button>

    </div>
  );
}
