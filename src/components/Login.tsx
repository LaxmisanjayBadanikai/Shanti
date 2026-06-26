import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Role, UserProfile } from '../types';
import { Shield, Mail, Phone, Lock, Eye, EyeOff, User, Globe, ChevronRight, LogIn } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthTab = 'email' | 'phone' | 'google';

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTab>('email');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.CITIZEN);
  const [language, setLanguage] = useState('English');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Simulate validation
      if (activeTab === 'email' && !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (activeTab === 'phone' && phone.length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (activeTab === 'phone' && otpSent && otp !== '123456') {
        setError('Invalid OTP. Use "123456" for demonstration.');
        return;
      }

      if (activeTab === 'phone' && !otpSent) {
        setOtpSent(true);
        setError('');
        return;
      }

      // Generate successful user profile
      const newUser: UserProfile = {
        uid: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: isSignup ? name || 'Anonymous User' : (email ? email.split('@')[0] : 'Phone User'),
        email: email || `${phone}@shanti.org`,
        phone: phone || '+91 98765 00000',
        role: isSignup ? selectedRole : Role.CITIZEN, // Citizens by default if logging in, custom roles on signup
        language,
        createdAt: new Date().toISOString(),
      };

      onLoginSuccess(newUser);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const googleUser: UserProfile = {
        uid: 'user-google-123',
        name: 'Meera Alvi',
        email: 'meera.alvi@gmail.com',
        phone: '+91 98765 33333',
        role: Role.CITIZEN, // Will let them choose their role right after or prompt
        language: 'English',
        createdAt: new Date().toISOString(),
      };
      // Toggle signup mode to let them select role
      setIsSignup(true);
      setName(googleUser.name);
      setEmail(googleUser.email);
      setPhone(googleUser.phone);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20 mb-4">
          <Shield className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-2xl font-sans font-bold text-slate-800 dark:text-white">
          {isSignup ? 'Create Shanti Account' : 'Welcome to PeaceOS'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
          {isSignup 
            ? 'Select your organization role to register for unified district response.' 
            : 'Multi-agency collaboration portal for secure emergency response and community harmony.'}
        </p>
      </div>

      {/* Tabs */}
      {!isSignup && (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setActiveTab('email'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'email' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          <button
            onClick={() => { setActiveTab('phone'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'phone' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Phone className="w-3.5 h-3.5" /> OTP SMS
          </button>
          <button
            onClick={() => { setActiveTab('google'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'google' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Google
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {activeTab === 'google' && !isSignup ? (
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 text-sm transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>
      ) : (
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {/* Email / Username Fields */}
          {isSignup && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Kabir Das"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g., name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Password</label>
                  {!isSignup && <button type="button" className="text-xs text-blue-600 hover:underline">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'phone' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    disabled={otpSent}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white disabled:opacity-60"
                  />
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enter SMS Verification Code (OTP)</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Use code 123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-xs">
                    <span className="text-emerald-600 font-medium">OTP sent successfully to {phone}</span>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-blue-600 font-semibold hover:underline">Change Number</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Role and Language Selection (Signup Only) */}
          {isSignup && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">District System Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full py-3 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
                >
                  <option value={Role.CITIZEN}>Citizen (Report/View Safe Routes)</option>
                  <option value={Role.POLICE}>Police Officer (Assigned/Dispatch Incidents)</option>
                  <option value={Role.DISTRICT_ADMIN}>District Administration (AI Dashboard/SitReps)</option>
                  <option value={Role.NGO}>NGO (Shelters, Food, Medical Support)</option>
                  <option value={Role.HOSPITAL}>Hospital Authority (Ambulance, Beds)</option>
                  <option value={Role.VOLUNTEER}>Community Volunteer (Local Task Completion)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Preferred Cohesion Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full py-3 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm outline-none transition-all text-slate-800 dark:text-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                  <option value="Urdu">Urdu (اردو)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignup ? 'Register & Enter Platform' : activeTab === 'phone' && !otpSent ? 'Send OTP Code' : 'Secure Login'}
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Switch Form Type */}
      <div className="mt-6 text-center text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          {isSignup ? 'Already registered on PeaceOS? ' : 'First responder or joining the peace network? '}
        </span>
        <button
          onClick={() => {
            setIsSignup(!isSignup);
            setError('');
            setOtpSent(false);
          }}
          className="text-blue-600 font-bold hover:underline"
        >
          {isSignup ? 'Log In Instead' : 'Register / Create Account'}
        </button>
      </div>
    </div>
  );
}
