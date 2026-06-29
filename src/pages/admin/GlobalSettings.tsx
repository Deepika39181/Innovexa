import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, Paintbrush, DollarSign, Shield, Users, CheckSquare, 
  Key, HardDrive, FileSpreadsheet, Globe, Upload, Info, Check, 
  RotateCcw, Save, Search, Plus, Trash2, ArrowUpRight, Play, Eye, EyeOff
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'Active' | 'Inactive';
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  status: 'Active' | 'Revoked';
}

export const GlobalSettings: React.FC = () => {
  const { showToast, showConfirm, closeConfirm } = useApp();

  // Selected sub-tab
  const [activeSubTab, setActiveSubTab] = useState<string>('general');

  // Last Saved State Tracker
  const [lastSaved, setLastSaved] = useState<string>('2 minutes ago');
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // --- GENERAL SETTINGS ---
  const [platformName, setPlatformName] = useState('Innovexa Catalyst');
  const [supportEmail, setSupportEmail] = useState('support@innovexa.com');
  const [defaultCurrency, setDefaultCurrency] = useState('INR - Indian Rupee');
  const [timezone, setTimezone] = useState('(GMT+05:30) Mumbai, Kolkata, New Delhi');

  // --- BRANDING ---
  const [primaryColor, setPrimaryColor] = useState('#AB3500');
  const [secondaryColor, setSecondaryColor] = useState('#24619D');
  const [lightLogo, setLightLogo] = useState<string | null>(null);
  const [darkLogo, setDarkLogo] = useState<string | null>(null);

  // --- PAYMENTS & REVENUE MODEL ---
  const [stripeConnect, setStripeConnect] = useState(true);
  const [paypal, setPaypal] = useState(false);
  const [commission, setCommission] = useState(10);
  const [minWithdrawal, setMinWithdrawal] = useState(1000);
  const [escrowDuration, setEscrowDuration] = useState(14);
  const [paymentEngineStatus, setPaymentEngineStatus] = useState<'Live' | 'Maintenance'>('Live');

  // --- SECURITY ---
  const [twoFactor, setTwoFactor] = useState(true);
  const [strongPassword, setStrongPassword] = useState(true);
  const [inactivityTimeout, setInactivityTimeout] = useState(30);
  const [concurrentLogins, setConcurrentLogins] = useState(false);

  // --- PLATFORM ADMIN: USERS ---
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 'usr-1', name: 'Marcus Thorne', email: 'm.thorne@innovexa.com', role: 'System Administrator', status: 'Active', lastActive: 'Just now' },
    { id: 'usr-2', name: 'Sarah Jenkins', email: 's.jenkins@innovexa.com', role: 'Compliance Officer', status: 'Active', lastActive: '10m ago' },
    { id: 'usr-3', name: 'James Vance', email: 'j.vance@innovexa.com', role: 'Support Representative', status: 'Active', lastActive: '3h ago' },
    { id: 'usr-4', name: 'Elena Vance', email: 'e.vance@innovexa.com', role: 'Platform Moderator', status: 'Inactive', lastActive: '2d ago' },
  ]);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('System Administrator');

  // --- PLATFORM ADMIN: KYC ---
  const [kycRequired, setKycRequired] = useState(true);
  const [autoApproveAadhar, setAutoApproveAadhar] = useState(false);
  const [vettingScoreThreshold, setVettingScoreThreshold] = useState(70);
  const [requireVideoSelfie, setRequireVideoSelfie] = useState(true);

  // --- PLATFORM ADMIN: API & WEBHOOKS ---
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    { id: 'wh-1', url: 'https://api.merchant.com/v1/webhooks', events: ['escrow.funded', 'escrow.released'], status: 'Active' },
    { id: 'wh-2', url: 'https://analytics.innovexa-network.org/receiver', events: ['project.posted', 'user.verified'], status: 'Active' },
  ]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'key-1', name: 'Production Checkout Integrator', prefix: 'ix_live_prod_abc82...', created: 'Oct 14, 2023', status: 'Active' },
    { id: 'key-2', name: 'Staging Environment DevKey', prefix: 'ix_test_dev_942ba...', created: 'Nov 02, 2023', status: 'Active' },
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeyGenerator, setShowKeyGenerator] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // --- PLATFORM ADMIN: CLOUD STORAGE ---
  const [storageProvider, setStorageProvider] = useState<'GCS' | 'AWS' | 'Azure'>('GCS');
  const [bucketName, setBucketName] = useState('innovexa-catalyst-media-prod');
  const [backupSchedule, setBackupSchedule] = useState('Daily (02:00 UTC)');
  const [maxUploadSize, setMaxUploadSize] = useState(25); // MB

  // --- PLATFORM ADMIN: LOGS & ANALYTICS ---
  const [logRetentionDays, setLogRetentionDays] = useState(90);
  const [systemLogLevel, setSystemLogLevel] = useState<'info' | 'warn' | 'error' | 'debug'>('info');
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    '[2026-06-28 12:15:32] INFO - Core Webhook processor resolved events successfully.',
    '[2026-06-28 12:16:11] INFO - Escrow balance verified. Ledger checks passed with no discrepancies.',
    '[2026-06-28 12:18:04] WARNING - Session expiration cleanup found 4 stagnant connections.',
    '[2026-06-28 12:19:40] INFO - System Administrator Marcus Thorne navigated to Global Settings.',
    '[2026-06-28 12:20:01] INFO - Stripe webhook received: charge.succeeded (tx_91248a).',
  ]);

  // --- PLATFORM ADMIN: LOCALIZATION ---
  const [systemLanguage, setSystemLanguage] = useState('English (US)');
  const [fallbackLanguage, setFallbackLanguage] = useState('English (UK)');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');
  const [autoTranslate, setAutoTranslate] = useState(true);

  // Handle Input Changes to trigger dirty state
  const handleInputChange = () => {
    setIsDirty(true);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLastSaved('Just now');
    setIsDirty(false);
    showToast('Platform configurations updated and saved successfully!', 'success');
  };

  const handleDiscard = () => {
    showConfirm(
      'Discard Changes',
      'Are you sure you want to revert all configurations back to the last saved state?',
      () => {
        // Reset General Settings
        setPlatformName('Innovexa Catalyst');
        setSupportEmail('support@innovexa.com');
        setDefaultCurrency('INR - Indian Rupee');
        setTimezone('(GMT+05:30) Mumbai, Kolkata, New Delhi');
        // Reset Branding
        setPrimaryColor('#AB3500');
        setSecondaryColor('#24619D');
        // Reset Payments
        setStripeConnect(true);
        setPaypal(false);
        setCommission(10);
        setMinWithdrawal(1000);
        setEscrowDuration(14);
        setPaymentEngineStatus('Live');
        // Reset Security
        setTwoFactor(true);
        setStrongPassword(true);
        setInactivityTimeout(30);
        setConcurrentLogins(false);

        setIsDirty(false);
        closeConfirm();
        showToast('All changes discarded.', 'info');
      }
    );
  };

  // Simulate file logo upload
  const simulateLogoUpload = (type: 'light' | 'dark') => {
    const mockLogo = type === 'light' 
      ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120'
      : 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120';
    
    if (type === 'light') {
      setLightLogo(mockLogo);
    } else {
      setDarkLogo(mockLogo);
    }
    setIsDirty(true);
    showToast(`Simulated ${type} theme logo upload complete!`, 'success');
  };

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      showToast('Please fill in all user details', 'error');
      return;
    }
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      lastActive: 'Never'
    };
    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserOpen(false);
    showToast(`Operator ${newUserName} added to administrative directory.`, 'success');
  };

  // Toggle user status
  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    showToast('User state updated.', 'info');
  };

  // Add Webhook
  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl) return;
    const newWh: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url: newWebhookUrl,
      events: ['project.posted', 'milestone.submitted'],
      status: 'Active'
    };
    setWebhooks([...webhooks, newWh]);
    setNewWebhookUrl('');
    showToast('New Webhook receiver registered.', 'success');
  };

  // Generate API Key
  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const randomHex = Math.random().toString(16).substring(2, 18);
    const keyString = `ix_live_prod_${randomHex}`;
    const newK: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: `${keyString.substring(0, 15)}...`,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Active'
    };
    setApiKeys([...apiKeys, newK]);
    setGeneratedKey(keyString);
    setNewKeyName('');
    showToast('API access credential created successfully.', 'success');
  };

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'Revoked' as const } : k));
    showToast('API key revoked.', 'info');
  };

  // Submenu configuration mapping
  const menuCategories = [
    {
      title: 'CORE SETTINGS',
      items: [
        { id: 'general', label: 'General Settings', icon: Sliders },
        { id: 'branding', label: 'Branding Layout', icon: Paintbrush },
        { id: 'payments', label: 'Payments Gateways', icon: DollarSign },
        { id: 'security', label: 'Security & Auth', icon: Shield },
      ]
    },
    {
      title: 'PLATFORM ADMIN',
      items: [
        { id: 'users', label: 'Administrative Users', icon: Users },
        { id: 'kyc', label: 'KYC & Compliance', icon: CheckSquare },
        { id: 'api', label: 'API & Webhooks', icon: Key },
        { id: 'storage', label: 'Cloud Storage', icon: HardDrive },
        { id: 'logs', label: 'Logs & Analytics', icon: FileSpreadsheet },
        { id: 'localization', label: 'Localization Config', icon: Globe },
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Page Header & Info Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
            <span>Settings</span>
            <span>&rsaquo;</span>
            <span className="text-[#FF7A00] uppercase tracking-wider">{activeSubTab}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Global Configurations</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Platform wide parameters, payment models, cloud assets, and administrative access controls.</p>
        </div>

        {/* Quick search settings */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search settings..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-900 dark:text-slate-100 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 2. Split Settings Navigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Submenu Navigation Rail */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
          {menuCategories.map((cat, cIdx) => (
            <div key={cat.title} className={cIdx > 0 ? 'pt-2 border-t border-slate-50 dark:border-slate-800/40' : ''}>
              <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] px-2 mb-2 block">
                {cat.title}
              </span>
              <div className="space-y-1">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSubTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubTab(item.id)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-50 dark:bg-blue-950/20 text-[#2563EB] border-l-2 border-[#FF7A00] font-bold' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF7A00]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Settings Form Stage */}
        <div className="lg:col-span-9 space-y-6 pb-20">
          
          {/* GENERAL SUB-TAB (Screenshots match this active view) */}
          {activeSubTab === 'general' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Form Column */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* General Settings Box */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] flex items-center justify-center">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">General Settings</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Core platform identification and localization</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Name</label>
                      <input 
                        type="text" 
                        value={platformName}
                        onChange={(e) => { setPlatformName(e.target.value); handleInputChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support Email</label>
                      <input 
                        type="email" 
                        value={supportEmail}
                        onChange={(e) => { setSupportEmail(e.target.value); handleInputChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Currency</label>
                      <select 
                        value={defaultCurrency}
                        onChange={(e) => { setDefaultCurrency(e.target.value); handleInputChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                      >
                        <option>INR - Indian Rupee</option>
                        <option>USD - United States Dollar</option>
                        <option>EUR - Euro</option>
                        <option>GBP - British Pound</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform Timezone</label>
                      <select 
                        value={timezone}
                        onChange={(e) => { setTimezone(e.target.value); handleInputChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                      >
                        <option>(GMT+05:30) Mumbai, Kolkata, New Delhi</option>
                        <option>(GMT+00:00) London, Western Europe</option>
                        <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                        <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment & Revenue Model Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 text-left">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] flex items-center justify-center">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Payment & Revenue Model</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Define fees, gateways and transaction boundaries</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-[9px] font-bold border border-emerald-100 inline-flex items-center gap-1 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Payment Engine: Live
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Gateway controls */}
                    <div className="space-y-3">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Stripe Connect</span>
                        </div>
                        <button 
                          onClick={() => { setStripeConnect(!stripeConnect); handleInputChange(); }}
                          className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none
                            ${stripeConnect ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300
                            ${stripeConnect ? 'left-4.5' : 'left-0.5'}`} 
                          />
                        </button>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">PayPal Express</span>
                        </div>
                        <button 
                          onClick={() => { setPaypal(!paypal); handleInputChange(); }}
                          className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none
                            ${paypal ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300
                            ${paypal ? 'left-4.5' : 'left-0.5'}`} 
                          />
                        </button>
                      </div>
                    </div>

                    {/* Numeric parameters */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Commission (%)</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={commission}
                              onChange={(e) => { setCommission(Number(e.target.value)); handleInputChange(); }}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-extrabold focus:ring-2 focus:ring-[#FF7A00] outline-none"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">%</span>
                          </div>
                        </div>

                        <div className="space-y-1 col-span-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Min Withdrawal</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">₹</span>
                            <input 
                              type="number" 
                              value={minWithdrawal}
                              onChange={(e) => { setMinWithdrawal(Number(e.target.value)); handleInputChange(); }}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-6 pr-2.5 py-2 text-xs font-extrabold focus:ring-2 focus:ring-[#FF7A00] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Escrow Hold Duration</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={escrowDuration}
                            onChange={(e) => { setEscrowDuration(Number(e.target.value)); handleInputChange(); }}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-extrabold focus:ring-2 focus:ring-[#FF7A00] outline-none"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">Days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Authentication & Authorization protocols */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Authentication & Authorization Protocols</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Platform security boundaries and compliance parameters</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/30 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Two-Factor Authentication (2FA)</p>
                        <p className="text-[10px] text-slate-400 font-medium">Mandatory verification protocols for all administrator & enterprise client roles.</p>
                      </div>
                      <button 
                        onClick={() => { setTwoFactor(!twoFactor); handleInputChange(); }}
                        className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none
                          ${twoFactor ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300
                          ${twoFactor ? 'left-4.5' : 'left-0.5'}`} 
                        />
                      </button>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850/30 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Strong Password Requirement</p>
                        <p className="text-[10px] text-slate-400 font-medium">Enforce mandatory passwords containing at least 12 characters, capitals, symbols.</p>
                      </div>
                      <button 
                        onClick={() => { setStrongPassword(!strongPassword); handleInputChange(); }}
                        className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none
                          ${strongPassword ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300
                          ${strongPassword ? 'left-4.5' : 'left-0.5'}`} 
                        />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Sidebar Column */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Branding Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] flex items-center justify-center">
                      <Paintbrush className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Branding</h3>
                  </div>

                  {/* Logo uploads */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Light Theme Logo</span>
                      <div 
                        onClick={() => simulateLogoUpload('light')}
                        className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#FF7A00] dark:hover:border-[#FF7A00] transition-colors"
                      >
                        {lightLogo ? (
                          <div className="text-center space-y-2">
                            <img src={lightLogo} alt="Light logo preview" className="h-8 mx-auto object-contain" />
                            <span className="text-[9px] text-slate-400 block font-medium">Click to upload another</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-400" />
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Upload Light Logo</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dark Theme Logo</span>
                      <div 
                        onClick={() => simulateLogoUpload('dark')}
                        className="bg-slate-950 border-2 border-dashed border-slate-850 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#2563EB] transition-colors"
                      >
                        {darkLogo ? (
                          <div className="text-center space-y-2">
                            <img src={darkLogo} alt="Dark logo preview" className="h-8 mx-auto object-contain" />
                            <span className="text-[9px] text-slate-500 block font-medium">Click to upload another</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-400">Upload Dark Logo</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Color fields */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Primary Color</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 font-bold">{primaryColor}</span>
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => { setPrimaryColor(e.target.value); handleInputChange(); }}
                          className="w-6 h-6 rounded-lg border-0 cursor-pointer overflow-hidden" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Secondary Color</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 font-bold">{secondaryColor}</span>
                        <input 
                          type="color" 
                          value={secondaryColor} 
                          onChange={(e) => { setSecondaryColor(e.target.value); handleInputChange(); }}
                          className="w-6 h-6 rounded-lg border-0 cursor-pointer overflow-hidden" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session management timeout */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] flex items-center justify-center">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sessions & Timeouts</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Inactivity Timeout</span>
                        <span className="text-[#FF7A00] font-extrabold">{inactivityTimeout} Minutes</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="120" 
                        step="5"
                        value={inactivityTimeout}
                        onChange={(e) => { setInactivityTimeout(Number(e.target.value)); handleInputChange(); }}
                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF7A00]"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Concurrent Logins</p>
                        <p className="text-[10px] text-slate-400 font-medium">Allow same administrator credentials to be active concurrently on multiple terminals.</p>
                      </div>
                      <button 
                        onClick={() => { setConcurrentLogins(!concurrentLogins); handleInputChange(); }}
                        className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none shrink-0
                          ${concurrentLogins ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300
                          ${concurrentLogins ? 'left-4.5' : 'left-0.5'}`} 
                      />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* BRANDING LAYOUT TAB */}
          {activeSubTab === 'branding' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Paintbrush className="w-5 h-5 text-[#FF7A00]" />
                <div>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white">Branding Layout Configurations</h2>
                  <p className="text-xs text-slate-400 font-medium">Control visual system styles, typography themes, and color schemas.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Accents</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {['#AB3500', '#FF7A00', '#2563EB', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#3B82F6'].map(color => (
                      <button 
                        key={color}
                        onClick={() => { setPrimaryColor(color); handleInputChange(); }}
                        className={`h-10 rounded-xl border-2 transition-all relative
                          ${primaryColor === color ? 'border-[#FF7A00] scale-105 shadow-md' : 'border-slate-100 dark:border-slate-800 hover:scale-102'}`}
                        style={{ backgroundColor: color }}
                      >
                        {primaryColor === color && <Check className="w-4 h-4 text-white absolute inset-0 m-auto filter drop-shadow-md" />}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Custom Accent Hex Code</label>
                    <input 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => { setPrimaryColor(e.target.value); handleInputChange(); }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-mono focus:ring-2 focus:ring-[#FF7A00] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live System Preview</h3>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-950">
                    <div className="flex gap-2 items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] text-white" style={{ backgroundColor: primaryColor }}>IX</div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white" style={{ color: primaryColor }}>{platformName}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: primaryColor }} />
                      <div className="h-1.5 w-1/2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                    </div>
                    <button className="px-3 py-1.5 text-[10px] font-bold rounded-lg text-white" style={{ backgroundColor: primaryColor }}>
                      Interactive Button Accent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS GATEWAYS TAB */}
          {activeSubTab === 'payments' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <DollarSign className="w-5 h-5 text-[#FF7A00]" />
                <div>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white">Escrow Payment Gateway Credentials</h2>
                  <p className="text-xs text-slate-400 font-medium">Verify production API keys and configure webhooks with payment processors.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white">Stripe Webhooks & Sandbox Mode</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Production Client Key</span>
                      <input 
                        type="password" 
                        value="••••••••••••••••••••••••••••••••••••••" 
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Platform Settlement Account ID</span>
                      <input 
                        type="text" 
                        value="acct_1NZs94Kld94F" 
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-500 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY & AUTH TAB */}
          {activeSubTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Shield className="w-5 h-5 text-[#FF7A00]" />
                <div>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white">System Security Constraints</h2>
                  <p className="text-xs text-slate-400 font-medium">Enforce cryptographic standards, user lockouts, and compliance guidelines.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credential Rule Sets</h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Enforce Password Expiry</span>
                      <button className="w-9 h-5 rounded-full bg-slate-300 dark:bg-slate-700 relative focus:outline-none">
                        <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Block Pwned Passwords</span>
                      <button className="w-9 h-5 rounded-full bg-[#2563EB] relative focus:outline-none">
                        <span className="absolute left-4.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-xs" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">IP White/Block Listing</h3>
                  <textarea 
                    placeholder="e.g. 192.168.1.1 (Allowed Administrative CIDRs)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none h-24 font-mono resize-none"
                  />
                  <p className="text-[9px] text-slate-400 leading-tight">Restrict administrator logins to secure enterprise office ranges. Leave empty to allow global authorized entries.</p>
                </div>
              </div>
            </div>
          )}

          {/* USERS: ADMINISTRATIVE USERS TAB */}
          {activeSubTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#FF7A00]" />
                  <div>
                    <h2 className="text-md font-bold text-slate-900 dark:text-white">Administrative Operators</h2>
                    <p className="text-xs text-slate-400 font-medium">Configure roles and permissions for system operators, moderators, and support desks.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNewUserOpen(!newUserOpen)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 shadow-sm inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Operator
                </button>
              </div>

              {/* Add Operator Expandable Form */}
              {newUserOpen && (
                <form onSubmit={handleAddUser} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-[#FF7A00] space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">New System Operator Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500">Operator Name</span>
                      <input 
                        type="text" 
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="Marcus Thorne"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF7A00]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500">Email Address</span>
                      <input 
                        type="email" 
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="operator@innovexa.com"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF7A00]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500">Platform Access Role</span>
                      <select 
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF7A00]"
                      >
                        <option>System Administrator</option>
                        <option>Compliance Officer</option>
                        <option>Platform Moderator</option>
                        <option>Support Representative</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setNewUserOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 dark:text-slate-400 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#FF7A00] text-white text-xs font-semibold"
                    >
                      Authorize Access
                    </button>
                  </div>
                </form>
              )}

              {/* Operators table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-3 pl-1">Administrator</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Vetting Status</th>
                      <th className="pb-3">Telemetry Activity</th>
                      <th className="pb-3 text-right pr-1">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20">
                        <td className="py-3.5 pl-1">
                          <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </td>
                        <td className="py-3.5 text-slate-600 dark:text-slate-300 font-semibold">{u.role}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase
                            ${u.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400 font-mono text-[10px]">{u.lastActive}</td>
                        <td className="py-3.5 text-right pr-1">
                          <button 
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all
                              ${u.status === 'Active' 
                                ? 'border-rose-100 dark:border-rose-900/10 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10'
                                : 'border-emerald-100 dark:border-emerald-900/10 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/10'}`}
                          >
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* KYC & COMPLIANCE TAB */}
          {activeSubTab === 'kyc' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <CheckSquare className="w-5 h-5 text-[#FF7A00]" />
                <div>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white">Talent KYC Vetting Policies</h2>
                  <p className="text-xs text-slate-400 font-medium">Verify structural constraints regarding identity verification, document approvals, and platform vetting scores.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mandatory KYC Filters</h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Require KYC on Onboarding</p>
                        <p className="text-[10px] text-slate-400">Lock marketplace bidding until documents are verified.</p>
                      </div>
                      <button 
                        onClick={() => { setKycRequired(!kycRequired); handleInputChange(); }}
                        className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none shrink-0
                          ${kycRequired ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300
                          ${kycRequired ? 'left-4.5' : 'left-0.5'}`} 
                        />
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-900">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Auto-approve Government IDs</p>
                        <p className="text-[10px] text-slate-400">Leverage third-party OCR to automatically parse credentials.</p>
                      </div>
                      <button 
                        onClick={() => { setAutoApproveAadhar(!autoApproveAadhar); handleInputChange(); }}
                        className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none shrink-0
                          ${autoApproveAadhar ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300
                          ${autoApproveAadhar ? 'left-4.5' : 'left-0.5'}`} 
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skill Testing Vetting Cutoff</h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Vetting Score Threshold</span>
                        <span className="text-[#FF7A00] font-extrabold">{vettingScoreThreshold}% Correct</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="95" 
                        step="5"
                        value={vettingScoreThreshold}
                        onChange={(e) => { setVettingScoreThreshold(Number(e.target.value)); handleInputChange(); }}
                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF7A00]"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Specialists must score above this threshold in designated coding challenges before displaying "Verified Talent" status.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API & WEBHOOKS TAB */}
          {activeSubTab === 'api' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Key className="w-5 h-5 text-[#FF7A00]" />
                <div>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white">API Access & Webhook Integrators</h2>
                  <p className="text-xs text-slate-400 font-medium">Generate merchant endpoints and webhook subscription rules.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Webhook endpoints */}
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Webhook Receivers</h3>
                  <div className="space-y-3">
                    {webhooks.map(wh => (
                      <div key={wh.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-400 font-mono truncate max-w-[70%]">{wh.url}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-[8px] font-bold uppercase">{wh.status}</span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {wh.events.map(ev => (
                            <span key={ev} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-850 rounded text-[9px] text-slate-500 font-mono">{ev}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddWebhook} className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="Add receiver URL (https://...)" 
                      value={newWebhookUrl}
                      onChange={(e) => setNewWebhookUrl(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF7A00]"
                    />
                    <button type="submit" className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 rounded-xl">Add URL</button>
                  </form>
                </div>

                {/* Right API keys */}
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active System API Credentials</h3>
                  <div className="space-y-3">
                    {apiKeys.map(key => (
                      <div key={key.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white">{key.name}</p>
                          <p className="text-[9px] font-mono text-slate-400 mt-1">{key.prefix} &bull; Created {key.created}</p>
                        </div>
                        {key.status === 'Active' ? (
                          <button 
                            onClick={() => revokeKey(key.id)}
                            className="px-2 py-1 text-[9px] font-bold text-rose-500 border border-rose-100 dark:border-rose-900/15 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                          >
                            Revoke
                          </button>
                        ) : (
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Revoked</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Generate Key Form */}
                  <form onSubmit={handleGenerateKey} className="flex gap-2 pt-2">
                    <input 
                      type="text" 
                      placeholder="Key Name (e.g. Testbed Client)" 
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#FF7A00]"
                    />
                    <button type="submit" className="px-3.5 py-2 text-xs font-bold text-white bg-[#FF7A00] rounded-xl">Generate Key</button>
                  </form>

                  {/* Generated key modal/alert */}
                  {generatedKey && (
                    <div className="p-3.5 rounded-xl border border-emerald-500 bg-emerald-50/10 text-xs text-emerald-800 dark:text-emerald-400 font-mono space-y-2 animate-in fade-in duration-300">
                      <p className="font-bold">✓ Copy credential secret now (Will not show again):</p>
                      <p className="bg-white dark:bg-slate-900 border border-emerald-500/20 p-2 rounded-lg font-extrabold text-[#FF7A00] break-all">{generatedKey}</p>
                      <button 
                        onClick={() => setGeneratedKey(null)}
                        className="text-slate-400 hover:text-slate-200 block text-[9px] underline font-bold"
                      >
                        Dismiss Secure Window
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* CLOUD STORAGE TAB */}
          {activeSubTab === 'storage' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <HardDrive className="w-5 h-5 text-[#FF7A00]" />
                <div>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white">Media Bucket & Object Cloud Storage</h2>
                  <p className="text-xs text-slate-400 font-medium">Establish asset locations for project documents, images, and deliverables.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cloud Hosting Provider</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['GCS', 'AWS', 'Azure'].map(prov => (
                      <button 
                        key={prov}
                        onClick={() => { setStorageProvider(prov as any); handleInputChange(); }}
                        className={`py-3 rounded-xl border-2 font-bold text-xs transition-all
                          ${storageProvider === prov ? 'border-[#FF7A00] text-[#FF7A00] bg-orange-50/5' : 'border-slate-100 dark:border-slate-800 text-slate-500'}`}
                      >
                        {prov === 'GCS' ? 'Google Cloud' : prov === 'AWS' ? 'Amazon S3' : 'Azure Blob'}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Media Storage Bucket Name</span>
                    <input 
                      type="text" 
                      value={bucketName}
                      onChange={(e) => { setBucketName(e.target.value); handleInputChange(); }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upload Limits & Backups</h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Max Upload File Size</span>
                        <span className="text-[#FF7A00] font-extrabold">{maxUploadSize} Megabytes</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="100" 
                        step="5"
                        value={maxUploadSize}
                        onChange={(e) => { setMaxUploadSize(Number(e.target.value)); handleInputChange(); }}
                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FF7A00]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Storage Backup Schedule</span>
                      <select 
                        value={backupSchedule}
                        onChange={(e) => { setBackupSchedule(e.target.value); handleInputChange(); }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                      >
                        <option>Daily (02:00 UTC)</option>
                        <option>Weekly (Saturdays 01:00 UTC)</option>
                        <option>Monthly (1st Day of Month)</option>
                        <option>Disable Backup Automation</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOGS & ANALYTICS TAB */}
          {activeSubTab === 'logs' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <FileSpreadsheet className="w-5 h-5 text-[#FF7A00]" />
                <div>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white">Platform Activity Audits</h2>
                  <p className="text-xs text-slate-400 font-medium">Verify production audits and debug live logs from key telemetry modules.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Telemetry Event Log</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setTelemetryLogs([]);
                        showToast('Audit logs cleared.', 'info');
                      }}
                      className="px-2.5 py-1 text-[10px] border border-slate-200 text-slate-500 rounded-lg"
                    >
                      Clear Log
                    </button>
                    <button 
                      onClick={() => {
                        const newLog = `[2026-06-28 ${new Date().toLocaleTimeString()}] INFO - Telemetry heartbeat. All system services nominal.`;
                        setTelemetryLogs([...telemetryLogs, newLog]);
                        showToast('Logs parsed.', 'success');
                      }}
                      className="px-2.5 py-1 text-[10px] bg-slate-900 text-white rounded-lg inline-flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-white" /> Trigger Heartbeat
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 h-56 font-mono text-[10px] text-slate-300 overflow-y-auto space-y-1.5 select-text">
                  {telemetryLogs.length === 0 ? (
                    <p className="text-slate-500 text-center py-12">No system activity events recorded.</p>
                  ) : (
                    telemetryLogs.map((log, idx) => (
                      <p key={idx} className="leading-relaxed hover:bg-slate-900/30 px-1 py-0.5 rounded transition-colors">{log}</p>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LOCALIZATION CONFIG TAB */}
          {activeSubTab === 'localization' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-left space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Globe className="w-5 h-5 text-[#FF7A00]" />
                <div>
                  <h2 className="text-md font-bold text-slate-900 dark:text-white">Localization Config</h2>
                  <p className="text-xs text-slate-400 font-medium">Control translations, default display languages, and regional dates.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Language Rules</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Default Display Language</span>
                      <select 
                        value={systemLanguage}
                        onChange={(e) => { setSystemLanguage(e.target.value); handleInputChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                      >
                        <option>English (US)</option>
                        <option>Spanish (ES)</option>
                        <option>Hindi (IN)</option>
                        <option>German (DE)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Fallback Language</span>
                      <select 
                        value={fallbackLanguage}
                        onChange={(e) => { setFallbackLanguage(e.target.value); handleInputChange(); }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                      >
                        <option>English (UK)</option>
                        <option>English (US)</option>
                        <option>Spanish (ES)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Translation Engine</h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Auto-translate UI elements</p>
                        <p className="text-[10px] text-slate-400">Automatically parse listing details based on talent locales.</p>
                      </div>
                      <button 
                        onClick={() => { setAutoTranslate(!autoTranslate); handleInputChange(); }}
                        className={`w-9 h-5 rounded-full transition-all duration-300 relative focus:outline-none shrink-0
                          ${autoTranslate ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all duration-300
                          ${autoTranslate ? 'left-4.5' : 'left-0.5'}`} 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 3. Persistent Action Bar at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto rounded-t-2xl">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium pl-2">
          <Info className="w-4 h-4 text-slate-400" />
          <span>Last saved: {lastSaved}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDiscard}
            disabled={!isDirty}
            className={`px-4.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all
              ${isDirty 
                ? 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:border-slate-800 cursor-pointer' 
                : 'border-slate-100 text-slate-300 dark:border-slate-850 dark:text-slate-600 cursor-not-allowed'}`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Discard Changes
          </button>
          
          <button
            onClick={() => handleSave()}
            className={`px-6 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-all
              ${isDirty 
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 shadow-orange-600/10 cursor-pointer scale-102' 
                : 'bg-slate-300 dark:bg-slate-800 text-slate-100 dark:text-slate-500 cursor-not-allowed'}`}
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

    </div>
  );
};
