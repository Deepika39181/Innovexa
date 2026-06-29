import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, Users, ShieldAlert, AlertTriangle, Coins, ShieldCheck, 
  Trash2, Check, X, ShieldAlert as DisputeIcon, DollarSign, ArrowUpRight, 
  Compass, Sliders, Calendar, FileText
} from 'lucide-react';
import { GlobalSettings } from './GlobalSettings';

export const AdminDashboard: React.FC = () => {
  const { 
    projects, disputes, verificationQueue, refundRequests, activeTab, 
    resolveDispute, approveRefundRequest, rejectRefundRequest, 
    approveVerification, rejectVerification, deleteFlaggedProject, 
    transactions, showToast 
  } = useApp();

  // Selected Dispute for modal
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [activeDisputeTab, setActiveDisputeTab] = useState<'Active' | 'Resolved'>('Active');

  const currentDispute = disputes.find(d => d.id === selectedDisputeId);

  // Stats
  const totalVolume = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const activeDisputesCount = disputes.filter(d => d.status === 'Active').length;
  const pendingVettingCount = verificationQueue.filter(v => v.status === 'Pending').length;
  const flaggedProjCount = projects.filter(p => p.status === 'Reported').length;

  // Custom Chart Data - Monthly Revenue Growth
  const revenueData = [
    { month: 'Jan', revenue: 145000 },
    { month: 'Feb', revenue: 210000 },
    { month: 'Mar', revenue: 185000 },
    { month: 'Apr', revenue: 290000 },
    { month: 'May', revenue: 340000 },
    { month: 'Jun', revenue: 420000 },
    { month: 'Jul', revenue: 390000 },
    { month: 'Aug', revenue: 480000 },
    { month: 'Sep', revenue: 520000 },
    { month: 'Oct', revenue: 640000 },
    { month: 'Nov', revenue: 590000 },
    { month: 'Dec', revenue: 720000 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  const handleResolveDispute = (id: string, decision: 'release' | 'refund') => {
    resolveDispute(id, decision);
    setSelectedDisputeId(null);
  };

  const handleDismissFlag = (title: string) => {
    showToast(`Flag on "${title}" dismissed. No policy violations detected.`, 'success');
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 1. ANALYTICS & DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Marcus Thorne</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Global System Administrator &bull; Core Security Officer</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-xs font-semibold border border-orange-100 dark:border-orange-900/10">
                <ShieldCheck className="w-4 h-4" />
                Root Authority Secured
              </span>
            </div>
          </div>

          {/* Core Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Volume Processed</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">₹{totalVolume.toLocaleString()}</p>
                <p className="text-[10px] text-emerald-600 mt-2 font-bold inline-flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% Growth
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Disputes</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{activeDisputesCount}</p>
                <p className="text-[10px] text-rose-500 mt-2 font-semibold">Requires mediation review</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center">
                <DisputeIcon className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Backlog</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{pendingVettingCount}</p>
                <p className="text-[10px] text-[#2563EB] mt-2 font-semibold">Pending identity check</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-[#2563EB] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged Briefs</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{flaggedProjCount}</p>
                <p className="text-[10px] text-amber-500 mt-2 font-semibold">Reported for policy breaches</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Interactive Custom SVG Revenue Chart */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Platform Revenue Growth</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Fiscal Year-Over-Year Platform Volume Processing Fee (5% Cut)</p>
              </div>
              <span className="px-3 py-1 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">2026 Fiscal</span>
            </div>

            {/* Custom SVG Column Bar Chart */}
            <div className="w-full h-64 flex flex-col justify-between">
              {/* Grid with columns */}
              <div className="flex-1 flex items-end gap-3 md:gap-5 px-2 select-none relative pt-4">
                {/* Y-axis gridlines */}
                <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-5">
                  <div className="border-t border-slate-900 dark:border-white w-full" />
                  <div className="border-t border-slate-900 dark:border-white w-full" />
                  <div className="border-t border-slate-900 dark:border-white w-full" />
                  <div className="border-t border-slate-900 dark:border-white w-full" />
                </div>

                {revenueData.map((d, index) => {
                  const heightPercent = (d.revenue / maxRevenue) * 100;
                  return (
                    <div key={d.month} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 bg-slate-950 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
                        ₹{(d.revenue * 0.05).toLocaleString()} (Fee)
                      </div>
                      
                      {/* Bar with gradient */}
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#2563EB] to-[#FF7A00] group-hover:opacity-85 transition-opacity"
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-axis Month labels */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 px-2 mt-2">
                {revenueData.map(d => (
                  <span key={d.month} className="flex-1 text-center">{d.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SYSTEM OVERSIGHT (Financial Ledger) */}
      {activeTab === 'oversight' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Secure Oversight Ledger</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Real-time telemetry auditing of all escrow transactions, deposits, and releases.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 pl-1">TxID</th>
                    <th className="pb-3">Action type</th>
                    <th className="pb-3">Transfer parameters</th>
                    <th className="pb-3 text-right">Volume</th>
                    <th className="pb-3 text-right pr-1">Approval status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                      <td className="py-4 pl-1 font-mono text-slate-500">{tx.id}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase
                          ${tx.type === 'release' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : ''}
                          ${tx.type === 'escrow' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' : ''}
                          ${tx.type === 'refund' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600' : ''}
                          ${tx.type === 'deposit' ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600' : ''}
                        `}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{tx.date}</p>
                      </td>
                      <td className="py-4 text-right font-extrabold text-slate-900 dark:text-white">
                        ₹{Math.abs(tx.amount).toLocaleString()}
                      </td>
                      <td className="py-4 text-right pr-1">
                        <span className="text-emerald-600 inline-flex items-center gap-1 font-bold text-[10px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> SECURED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. VERIFICATION QUEUE TAB */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Identity Vetting Desk</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Review and approve independent talent portfolios prior to marketplace access.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verificationQueue.map(vet => (
              <div key={vet.id} className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-56 hover:shadow-md transition-all duration-300">
                <div className="flex gap-4">
                  <img src={vet.avatar} alt={vet.name} className="h-14 w-14 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{vet.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{vet.title}</p>
                    <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase
                      ${vet.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-100' : ''}
                      ${vet.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100' : ''}
                      ${vet.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100' : ''}
                    `}>
                      {vet.status}
                    </span>
                  </div>
                </div>

                {vet.status === 'Pending' && (
                  <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => rejectVerification(vet.id)}
                      className="flex-1 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => approveVerification(vet.id)}
                      className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 shadow-md shadow-blue-500/5 transition-opacity inline-flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PROJECT APPROVALS / FLAGGED BRIEFINGS TAB */}
      {activeTab === 'flagged' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">SLA Moderation Board</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Moderate reported briefings or potential copyright and terms of service breaches.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 dark:bg-slate-850/20 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reported Listings Registry</h3>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects.filter(p => p.status === 'Reported').length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">No flagged projects currently listed. All briefings compliant.</div>
              ) : (
                projects.filter(p => p.status === 'Reported').map(proj => (
                  <div key={proj.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-3 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/10 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Policy Infraction
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">Flag Reason: <strong className="text-rose-600">{proj.flagReason}</strong></span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">{proj.description}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Client poster: <strong className="text-slate-600 dark:text-slate-300">{proj.client.name}</strong> &bull; Reported by: <strong className="text-rose-600">{proj.reportedBy}</strong></p>
                    </div>

                    <div className="flex gap-2.5 shrink-0 w-full md:w-auto">
                      <button
                        onClick={() => handleDismissFlag(proj.title)}
                        className="flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 border border-slate-100 hover:bg-slate-100 transition-colors"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() => deleteFlaggedProject(proj.id)}
                        className="flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-500/10 transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" /> Remove Project
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. DISPUTES MEDIATION TAB */}
      {activeTab === 'disputes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List of active lockouts */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Disputes Queue</h3>
              <div className="flex gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg">
                <button
                  onClick={() => setActiveDisputeTab('Active')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors
                    ${activeDisputeTab === 'Active' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveDisputeTab('Resolved')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors
                    ${activeDisputeTab === 'Resolved' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400'}`}
                >
                  Resolved
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {disputes.filter(d => activeDisputeTab === 'Active' ? d.status === 'Active' : d.status !== 'Active').length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs font-semibold">No disputes in this queue.</div>
              ) : (
                disputes.filter(d => activeDisputeTab === 'Active' ? d.status === 'Active' : d.status !== 'Active').map(disp => (
                  <div 
                    key={disp.id} 
                    onClick={() => setSelectedDisputeId(disp.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all
                      ${selectedDisputeId === disp.id 
                        ? 'border-orange-500 bg-orange-50/10 shadow-md' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/20 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{disp.id}</span>
                      <span className="text-xs font-extrabold text-slate-950 dark:text-white">₹{disp.amount.toLocaleString()}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{disp.projectTitle}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">{disp.milestoneTitle}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dispute Arbitration Board Panel */}
          <div className="lg:col-span-7">
            {currentDispute ? (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 text-left">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 text-[9px] font-bold border border-rose-100 inline-flex items-center gap-1 uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" /> Escrow Locked
                      </span>
                      <h3 className="text-md font-bold text-slate-900 dark:text-white mt-2.5">{currentDispute.projectTitle}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Milestone: <strong className="text-slate-600 dark:text-slate-300">{currentDispute.milestoneTitle}</strong> &bull; Amount: <strong className="text-slate-900 dark:text-white">₹{currentDispute.amount.toLocaleString()}</strong></p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Statement */}
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Employer Statement &bull; {currentDispute.clientName}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">"{currentDispute.clientStatement}"</p>
                  </div>

                  {/* Freelancer Statement */}
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Specialist Statement &bull; {currentDispute.freelancerName}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">"{currentDispute.freelancerStatement}"</p>
                  </div>
                </div>

                {/* Dispute resolution actions */}
                {currentDispute.status === 'Active' && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button
                      onClick={() => handleResolveDispute(currentDispute.id, 'refund')}
                      className="flex-1 py-3 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-100 dark:border-rose-900/10 transition-colors uppercase tracking-wider"
                    >
                      Refund Employer
                    </button>
                    <button
                      onClick={() => handleResolveDispute(currentDispute.id, 'release')}
                      className="flex-1 py-3 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 shadow-md shadow-blue-500/5 transition-opacity uppercase tracking-wider"
                    >
                      Release to Specialist
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-center text-slate-400 text-sm">
                Select a dispute from the queue to moderate statements and arbitrate escrow releases.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. ESCROW CONTROL / GLOBAL REFUNDS TAB */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Escrow Refunds Arbitration</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Evaluate and process refund cancellations initiated under platform SLAs.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-4 bg-slate-50/50 dark:bg-slate-850/20 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Refund Requests Desk</h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {refundRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">No pending refund requests.</div>
              ) : (
                refundRequests.map(ref => (
                  <div key={ref.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-blue-50 dark:bg-blue-950/20 text-blue-600 border border-blue-100 dark:border-blue-900/10">
                          Refund Pending
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">Request amount: <strong className="text-slate-900 dark:text-white">₹{ref.amount.toLocaleString()}</strong></span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ref.projectName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">"{ref.reason}"</p>
                      <p className="text-[10px] text-slate-400 font-medium">Claimant client: <strong className="text-slate-600 dark:text-slate-300">{ref.clientName}</strong></p>
                    </div>

                    {ref.status === 'Pending' ? (
                      <div className="flex gap-2.5 shrink-0 w-full md:w-auto">
                        <button
                          onClick={() => rejectRefundRequest(ref.id)}
                          className="flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 transition-colors inline-flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Deny Refund
                        </button>
                        <button
                          onClick={() => approveRefundRequest(ref.id)}
                          className="flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 shadow-md shadow-blue-500/5 transition-opacity inline-flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Refund
                        </button>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase
                        ${ref.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        {ref.status}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. GLOBAL SETTINGS TAB */}
      {activeTab === 'settings' && (
        <GlobalSettings />
      )}
    </div>
  );
};
