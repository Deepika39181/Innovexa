import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, Bid } from '../../types';
import { 
  DollarSign, Briefcase, Star, Clock, CheckCircle2, Search, Filter, 
  MapPin, Shield, BookOpen, AlertCircle, Sparkles, Send, Award
} from 'lucide-react';
import { FreelancerAnalytics } from './FreelancerAnalytics';

export const FreelancerDashboard: React.FC = () => {
  const { 
    projects, bids, contracts, activeTab, addBid, transactions, showToast 
  } = useApp();

  // Search/Filters for Browse Projects
  const [marketFilter, setMarketFilter] = useState<'All' | 'Software Dev' | 'Design & Creative' | 'Marketing' | 'Content Development'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Place Bid Modal State
  const [bidModalProject, setBidModalProject] = useState<Project | null>(null);
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalDuration, setProposalDuration] = useState('');
  const [proposalCoverText, setProposalCoverText] = useState('');

  // Filter projects available in marketplace
  const marketProjects = projects.filter(p => {
    const isAvailable = p.status === 'Open' || p.status === 'Reviewing Bids';
    const matchesCategory = marketFilter === 'All' || p.category === marketFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return isAvailable && matchesCategory && matchesSearch;
  });

  // Calculate freelancer stats
  const earningsSum = transactions.filter(t => t.type === 'release' && t.status === 'SUCCESS').reduce((sum, t) => sum + t.amount, 0);
  const activeContractsCount = contracts.filter(c => c.status === 'Active').length;
  const pendingBidsCount = bids.filter(b => b.status === 'Pending').length;

  const handleOpenBidModal = (p: Project) => {
    setBidModalProject(p);
    setProposalAmount(p.budget.toString());
    setProposalDuration('10');
    setProposalCoverText('I have carefully reviewed your project parameters and can deliver a pixel-perfect, highly secure implementation matching all KPIs.');
  };

  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidModalProject) return;
    if (!proposalAmount || !proposalDuration || !proposalCoverText) {
      showToast('Please fill out all bid details before submitting.', 'error');
      return;
    }

    addBid({
      projectId: bidModalProject.id,
      freelancerName: 'Alex Rivera',
      freelancerTitle: 'Senior Full-Stack Architect',
      freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      freelancerRating: 5.0,
      freelancerReviews: 89,
      bidAmount: parseFloat(proposalAmount),
      deliveryTime: parseInt(proposalDuration),
      proposalText: proposalCoverText,
      tags: ['React.js', 'TypeScript', 'Next.js']
    });

    setBidModalProject(null);
  };

  const handleMilestoneSubmit = (mTitle: string) => {
    showToast(`Work submission for "${mTitle}" submitted to Client Sarah Chen for review.`, 'success');
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 1. OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alex Rivera</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Senior Full-Stack Architect &bull; DevOps Expert</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-900/10 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Vetted Expert Specialist
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings (INR)</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹{(42500 + earningsSum).toLocaleString()}</p>
                <p className="text-[10px] text-[#FF7A00] mt-2 font-semibold">Payouts safely released to account</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Contracts</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{activeContractsCount}</p>
                <p className="text-[10px] text-emerald-600 mt-2 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% SLA Record
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-[#2563EB] flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bids submitted</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{pendingBidsCount}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Bids awaiting corporate review</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Active Contract Milestones progression */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-6">Active Project Board</h3>
            <div className="space-y-6">
              {contracts.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">No active project assignments.</div>
              ) : (
                contracts.map(cont => (
                  <div key={cont.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-none last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cont.projectTitle}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Employer: <strong className="text-slate-600 dark:text-slate-300">{cont.clientName}</strong> &bull; Total Value: ₹{cont.totalValue.toLocaleString()}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50/50 dark:bg-blue-950/30 text-[#2563EB] text-[10px] font-bold border border-blue-100 dark:border-blue-900/10">Active Assignment</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                      {cont.milestones.map((mile, mIdx) => (
                        <div 
                           key={mile.id} 
                           className={`p-4 rounded-xl border text-left flex flex-col justify-between h-38 relative overflow-hidden transition-all duration-300
                            ${mile.status === 'Completed' ? 'bg-slate-50 dark:bg-slate-850/30 border-slate-100 dark:border-slate-800 shadow-xs' : ''}
                            ${mile.status === 'In Progress' ? 'bg-white dark:bg-slate-900 border-[#FF7A00] shadow-sm' : ''}
                            ${mile.status === 'Locked' ? 'bg-slate-50/20 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800 opacity-60' : ''}
                          `}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">M{mIdx + 1}</span>
                              <span className={`text-[10px] font-bold rounded-lg px-2 py-0.5
                                ${mile.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : ''}
                                ${mile.status === 'In Progress' ? 'bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00]' : ''}
                                ${mile.status === 'Locked' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : ''}
                              `}>
                                {mile.status}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">{mile.title}</h5>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{mile.dueDate}</p>
                          </div>

                          <div className="flex justify-between items-end mt-4">
                            <div>
                              <p className="text-[10px] text-slate-400 font-medium">Milestone Budget</p>
                              <p className="text-xs font-extrabold text-slate-900 dark:text-white">₹{mile.budget.toLocaleString()}</p>
                            </div>

                            {/* Submit action for freelancer if In Progress */}
                            {mile.status === 'In Progress' && (
                              <button
                                onClick={() => handleMilestoneSubmit(mile.title)}
                                className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 text-white shadow-sm transition-opacity shrink-0"
                              >
                                Submit Work
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. BROWSE PROJECTS / MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Opportunities Marketplace</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">Browse verified active briefs backed by secure milestone holds.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Search and Category sidebar */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search React, Docker..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ecosystem Category</label>
                <div className="space-y-1">
                  {['All', 'Software Dev', 'Design & Creative', 'Marketing', 'Content Development'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMarketFilter(cat as any)}
                      className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors
                        ${marketFilter === cat 
                          ? 'bg-blue-50 dark:bg-blue-950/20 text-[#2563EB]' 
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Opportunities Stream */}
            <div className="lg:col-span-9 space-y-4">
              {marketProjects.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-100 text-slate-400 text-sm">No matches found in marketplace registry.</div>
              ) : (
                marketProjects.map(proj => (
                  <div key={proj.id} className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between gap-6 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] text-[10px] font-bold border border-orange-100 dark:border-orange-900/10">
                          {proj.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Released today</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{proj.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{proj.description}</p>
                      
                      <div className="flex gap-1.5 flex-wrap pt-1">
                        {proj.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-850 rounded-md text-[9px] font-bold text-slate-500">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="w-full sm:w-48 shrink-0 sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Budget Offer</p>
                          <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">₹{proj.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Proposal Activity</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{proj.bidsCount} Bids placed</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenBidModal(proj)}
                        className="w-full py-2.5 mt-6 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 shadow-md shadow-blue-500/5 transition-opacity uppercase tracking-wider text-center"
                      >
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE PROPOSAL BIDS TAB */}
      {activeTab === 'bids' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Proposal Tracker</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Review and track the real-time status of your marketplace proposals.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 pl-1">Project Brief</th>
                    <th className="pb-3">Budget bid</th>
                    <th className="pb-3">Estimated Delivery</th>
                    <th className="pb-3">Review Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Default Alex Rivera bids */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                    <td className="py-4 pl-1">
                      <p className="font-bold text-slate-900 dark:text-white">Enterprise AI Dashboard Redesign</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Figma, React UI integration</p>
                    </td>
                    <td className="py-4 font-bold text-slate-900 dark:text-white">₹4,500</td>
                    <td className="py-4 font-medium text-slate-600 dark:text-slate-300">14 business days</td>
                    <td className="py-4">
                      <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-100 dark:border-amber-900/10">Under Review</span>
                    </td>
                  </tr>

                  {/* Reactive placed bids */}
                  {bids.map(bid => {
                    const proj = projects.find(p => p.id === bid.projectId);
                    return (
                      <tr key={bid.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                        <td className="py-4 pl-1">
                          <p className="font-bold text-slate-900 dark:text-white">{proj?.title || 'System Project Proposal'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{proj?.category}</p>
                        </td>
                        <td className="py-4 font-bold text-slate-900 dark:text-white">₹{bid.bidAmount.toLocaleString()}</td>
                        <td className="py-4 font-medium text-slate-600 dark:text-slate-300">{bid.deliveryTime} business days</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold
                            ${bid.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-100' : ''}
                            ${bid.status === 'Shortlisted' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 border border-blue-100' : ''}
                            ${bid.status === 'Accepted' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100' : ''}
                            ${bid.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100' : ''}
                          `}>
                            {bid.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. WALLET / EARNINGS TAB */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Earnings summary card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-orange-600/10 rounded-full blur-2xl" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Funds Disbursed</p>
              <h3 className="text-3xl font-extrabold mt-1">₹{(42500 + earningsSum).toLocaleString()}</h3>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Deposited securely into verified bank ledger</p>

              <button
                onClick={() => showToast('Withdrawal request of ₹10,000 processed to bank.', 'success')}
                className="w-full py-2.5 mt-6 text-xs font-bold rounded-xl text-slate-900 bg-white hover:bg-slate-100 transition-colors uppercase tracking-wider shadow-md"
              >
                Request Bank Payout
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/20 border border-blue-100 dark:border-blue-950/20">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Escrow Protection Guarantee</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Under the platform's SLA, clients lock milestone funding prior to start. Completed work released from escrow reaches your dashboard in under 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Earnings Financial Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 pl-1">ID</th>
                    <th className="pb-3">Transfer parameters</th>
                    <th className="pb-3 text-right">Earning Payout</th>
                    <th className="pb-3 text-right pr-1">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                    <td className="py-3.5 pl-1 font-mono text-slate-500">#TX-94812</td>
                    <td className="py-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">API Core Blueprint Discovery Release</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Client: Sarah Chen</p>
                    </td>
                    <td className="py-3.5 text-right font-bold text-emerald-600">+₹2,500</td>
                    <td className="py-3.5 text-right pr-1">
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-[9px] font-bold rounded-md">SUCCESS</span>
                    </td>
                  </tr>

                  {transactions.filter(t => t.type === 'release').map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                      <td className="py-3.5 pl-1 font-mono text-slate-500">{tx.id}</td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{tx.date}</p>
                      </td>
                      <td className="py-3.5 text-right font-bold text-emerald-600">+₹{tx.amount.toLocaleString()}</td>
                      <td className="py-3.5 text-right pr-1">
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-[9px] font-bold rounded-md">SUCCESS</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4.5 ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <FreelancerAnalytics />
      )}

      {/* 5. MY PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main profile identity card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-md space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                alt="Alex Rivera" 
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-orange-500/10"
              />
              <div className="space-y-4 text-center sm:text-left flex-1">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Alex Rivera</h2>
                    <span className="self-center sm:self-auto px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-[10px] font-bold border border-emerald-100">Vetted Expert Developer</span>
                  </div>
                  <p className="text-xs text-orange-600 font-semibold mt-1">Senior Full-Stack Architect & DevOps</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 justify-center sm:justify-start mt-2 font-medium">
                    <MapPin className="w-3.5 h-3.5" /> Bangalore, India &bull; Local time 11:58 AM
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Hourly Rate</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">$125/hr</p>
                  </div>
                  <div className="w-px bg-slate-100 dark:bg-slate-800 h-8 self-center" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Success Ratio</p>
                    <p className="text-sm font-extrabold text-emerald-600 mt-0.5">100% SLA</p>
                  </div>
                  <div className="w-px bg-slate-100 dark:bg-slate-800 h-8 self-center" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Reviews</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">89 Vetted Reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About text brief */}
            <div className="space-y-2 text-left">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" /> Professional Portfolio Brief
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                I am a DevOps specialist and full-stack software engineer with 8+ years of experience constructing latency-critical analytics applications. Expert in Kubernetes, Docker, React architectures, AWS resource clusters, and secure SOC2-compliant system configurations.
              </p>
            </div>

            {/* Specialized skills checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Validated Competency Domains</h3>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'AWS', 'Docker', 'GraphQL', 'Kubernetes', 'CI/CD Pipelines'].map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Side stats widgets */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-md space-y-6 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ecosystem Telemetry</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Identity Vetting</span>
                <span className="text-emerald-600 inline-flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Approved KYC</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Response Rate</span>
                <span className="text-slate-900 dark:text-white">&lt; 2 hours</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Availability</span>
                <span className="text-slate-900 dark:text-white">15 hrs/week</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BID PLACEMENT MODAL */}
      {bidModalProject && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setBidModalProject(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 p-6 shadow-2xl z-10 text-left">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-blue-500 w-5 h-5" />
              Apply for Project Contract
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Submit your delivery time and quote. This proposal will be locked on Sarah Chen's bid evaluation board.
            </p>
            <form onSubmit={handlePlaceBidSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Your Quote (INR)</label>
                  <input 
                    type="number" 
                    value={proposalAmount}
                    onChange={(e) => setProposalAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Duration (Days)</label>
                  <input 
                    type="number" 
                    value={proposalDuration}
                    onChange={(e) => setProposalDuration(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Proposal Cover Statement</label>
                <textarea 
                  rows={4}
                  value={proposalCoverText}
                  onChange={(e) => setProposalCoverText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBidModalProject(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/10 transition-colors"
                >
                  Submit Proposal Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
