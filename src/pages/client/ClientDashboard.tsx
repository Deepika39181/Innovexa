import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, Bid, Contract } from '../../types';
import { 
  Plus, Search, Filter, Calendar, DollarSign, Clock, FileText, CheckCircle, 
  ChevronRight, AlertCircle, Gavel, FileCheck, ArrowUpRight, ArrowDownLeft, Shield, UserCheck
} from 'lucide-react';
import { ClientTalentPool } from './ClientTalentPool';
import { ClientAnalytics } from './ClientAnalytics';

export const ClientDashboard: React.FC = () => {
  const { 
    projects, bids, contracts, activeTab, addProject, updateBidStatus, 
    releaseEscrow, disputeMilestone, showToast, showConfirm, transactions
  } = useApp();

  // Search/Filters
  const [projectFilter, setProjectFilter] = useState<'All' | 'Open' | 'In Progress' | 'Completed' | 'Reviewing Bids'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Post Project State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Software Dev');
  const [newBudget, setNewBudget] = useState('');
  const [newType, setNewType] = useState<'Fixed' | 'Hourly'>('Fixed');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  // Dispute States
  const [disputeModal, setDisputeModal] = useState<{ contractId: string; milestoneId: string } | null>(null);
  const [clientStatement, setClientStatement] = useState('');

  // Filters projects
  const clientProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (projectFilter === 'All') return matchesSearch;
    return p.status === projectFilter && matchesSearch;
  });

  // Calculate client dashboard stats
  const totalActiveProj = projects.filter(p => p.status === 'In Progress').length;
  const totalBids = bids.filter(b => b.status === 'Pending').length;
  const escrowSum = contracts.filter(c => c.status === 'Active').reduce((sum, c) => {
    return sum + c.milestones.filter(m => (m.status as string) === 'In Progress' || (m.status as string) === 'Submitted').reduce((s, m) => s + m.budget, 0);
  }, 0);

  const handlePostProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBudget || !newDescription) {
      showToast('Please fill out the title, budget, and description fields.', 'error');
      return;
    }

    addProject({
      title: newTitle,
      category: newCategory,
      budget: parseFloat(newBudget),
      type: newType,
      deadline: newDeadline || 'Due in 30 days',
      description: newDescription,
      status: 'Open',
      tags: newTags ? newTags.split(',').map(t => t.trim()) : ['React', 'TypeScript']
    });

    // Reset post form
    setNewTitle('');
    setNewBudget('');
    setNewDescription('');
    setNewTags('');
  };

  const handleReleaseEscrow = (contractId: string, milestoneId: string, milestoneTitle: string) => {
    showConfirm(
      'Approve Milestone Delivery?',
      `Are you sure you want to approve the delivery for "${milestoneTitle}" and release the funds from Escrow? This action cannot be undone.`,
      () => releaseEscrow(contractId, milestoneId)
    );
  };

  const handleDisputeSubmit = () => {
    if (!disputeModal) return;
    if (!clientStatement) {
      showToast('Please state your reason for filing a dispute.', 'error');
      return;
    }

    disputeMilestone(
      disputeModal.contractId,
      disputeModal.milestoneId,
      clientStatement,
      'The deliverables match the parameters specified. I require release of my escrow funding.'
    );

    setDisputeModal(null);
    setClientStatement('');
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 1. OVERVIEW DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sarah Chen</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Enterprise Client &bull; Global InnoTech Solutions</p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-900/10">
                <Shield className="w-4 h-4" />
                Verified Employer
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Projects</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalActiveProj}</p>
                <p className="text-[10px] text-[#FF7A00] mt-2 font-semibold">Collaborating with elite teams</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Held in Escrow</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">₹{escrowSum.toLocaleString() || '0'}</p>
                <p className="text-[10px] text-emerald-600 mt-2 font-bold inline-flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Secure Escrow Active
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-[#2563EB] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Review</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalBids}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Bids received on pending briefs</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
                <Gavel className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Active Contract Milestones Progression */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-6">Milestone Escalations & Escrow Tracker</h3>
            <div className="space-y-6">
              {contracts.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">No active contracts found.</div>
              ) : (
                contracts.map(cont => (
                  <div key={cont.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-none last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cont.projectTitle}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Freelancer: <strong className="text-slate-600 dark:text-slate-300">{cont.freelancerName}</strong> &bull; Value: ₹{cont.totalValue.toLocaleString()}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50/50 dark:bg-blue-950/30 text-[#2563EB] text-[10px] font-bold border border-blue-100 dark:border-blue-900/10">Active Contract</span>
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
                              <p className="text-[10px] text-slate-400 font-medium">Budget</p>
                              <p className="text-xs font-extrabold text-slate-900 dark:text-white">₹{mile.budget.toLocaleString()}</p>
                            </div>

                            {/* Release action if In Progress/Submitted */}
                            {mile.status === 'In Progress' && (
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => setDisputeModal({ contractId: cont.id, milestoneId: mile.id })}
                                  className="px-2 py-1 text-[10px] font-bold rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-100 dark:border-rose-900/10 transition-colors"
                                >
                                  Dispute
                                </button>
                                <button
                                  onClick={() => handleReleaseEscrow(cont.id, mile.id, mile.title)}
                                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-sm transition-colors"
                                >
                                  Release
                                </button>
                              </div>
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

      {/* 2. POST / MANAGE PROJECTS TAB */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Post Project Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-6">Create New Project Brief</h3>
            <form onSubmit={handlePostProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Project Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. React Native Mobile Rebranding"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                  >
                    <option>Software Dev</option>
                    <option>Design & Creative</option>
                    <option>Marketing</option>
                    <option>Content Development</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Budget (INR)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 150000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Budget Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType('Fixed')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors
                        ${newType === 'Fixed' 
                          ? 'bg-[#2563EB] border-[#2563EB] text-white' 
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                    >
                      Fixed
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType('Hourly')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors
                        ${newType === 'Hourly' 
                          ? 'bg-[#2563EB] border-[#2563EB] text-white' 
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                    >
                      Hourly
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Timeline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Due in 14 days"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Required Skills (Comma separated)</label>
                <input 
                  type="text" 
                  placeholder="React, TypeScript, Tailwind"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description Brief</label>
                <textarea 
                  rows={4}
                  placeholder="Outline core deliverables, latency KPIs, and tech requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider transition-opacity shadow-md shadow-orange-600/5"
              >
                Launch Project Listing
              </button>
            </form>
          </div>

          {/* List of Posted Projects */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Registry Overview</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value as any)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium focus:outline-none"
                  >
                    <option>All</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {clientProjects.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs font-semibold">No active listings matching selection.</div>
                ) : (
                  clientProjects.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{p.category}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase
                          ${p.status === 'Open' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : ''}
                          ${p.status === 'In Progress' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600' : ''}
                          ${p.status === 'Completed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : ''}
                          ${p.status === 'Reviewing Bids' ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600' : ''}
                          ${p.status === 'Contracting' ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' : ''}
                          ${p.status === 'Reported' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' : ''}
                        `}>
                          {p.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">{p.description}</p>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-850">
                        <div className="flex gap-1">
                          {p.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-bold text-slate-500">{tag}</span>
                          ))}
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          ₹{p.budget.toLocaleString()} {p.type === 'Hourly' ? '/ hr' : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BID MANAGEMENT TAB */}
      {activeTab === 'bids' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bid Evaluation Desk</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">Evaluate pricing and contract timelines from shortlisted independent specialists.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Active Bidding Projects List */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Projects Receiving Bids</h3>
              <div className="space-y-2">
                {projects.filter(p => p.status === 'Reviewing Bids' || p.status === 'Open').map(proj => (
                  <div 
                    key={proj.id} 
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer text-left"
                  >
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{proj.title}</h4>
                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-[10px] text-[#FF7A00] font-bold uppercase">{proj.bidsCount} Proposal Bids</span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">₹{proj.budget.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bids Review stream */}
            <div className="lg:col-span-8 space-y-4">
              {bids.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-100 text-slate-400 text-sm">No bids received yet.</div>
              ) : (
                bids.map(bid => (
                  <div key={bid.id} className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between gap-6">
                    {/* Freelancer details & proposal */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <img src={bid.freelancerAvatar} alt={bid.freelancerName} className="h-12 w-12 rounded-xl object-cover ring-2 ring-[#FF7A00]" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{bid.freelancerName}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{bid.freelancerTitle}</p>
                          <div className="flex items-center gap-1 text-[10px] text-[#FF7A00] font-bold mt-1">
                            <CheckCircle className="w-3 h-3 fill-[#FF7A00]" />
                            {bid.freelancerRating} &bull; {bid.freelancerReviews} Reviews
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">"{bid.proposalText}"</p>

                      <div className="flex gap-1.5 flex-wrap pt-1">
                        {bid.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-850 rounded-md text-[9px] font-bold text-slate-500">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Proposal parameters and accept controls */}
                    <div className="w-full md:w-56 shrink-0 md:border-l md:border-slate-100 dark:md:border-slate-800 md:pl-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Proposed Rate</span>
                          <span className="text-md font-extrabold text-slate-900 dark:text-white">₹{bid.bidAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Delivery</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{bid.deliveryTime} business days</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <button
                          onClick={() => updateBidStatus(bid.id, 'Rejected')}
                          className="flex-1 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            showConfirm(
                              'Award Project Contract?',
                              `Do you want to accept the bid of ₹${bid.bidAmount.toLocaleString()} from ${bid.freelancerName}? This will lock the budget in Innovexa Escrow and create an active contract.`,
                              () => updateBidStatus(bid.id, 'Accepted')
                            );
                          }}
                          className="flex-1 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-95 shadow-md shadow-blue-500/5 transition-opacity"
                        >
                          Accept Bid
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. WALLET / ESCROW CONTROL TAB */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Escrow balance summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-[#FF7A00]/20 to-[#2563EB]/20 rounded-full blur-2xl" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Escrow Reserve</p>
              <h3 className="text-3xl font-extrabold mt-1">₹{escrowSum.toLocaleString()}</h3>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Capital held securely under SLA guidelines</p>

              <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Invoices Paid</p>
                  <p className="text-sm font-extrabold mt-0.5">₹42,500</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Disputed Holds</p>
                  <p className="text-sm font-extrabold mt-0.5">₹0</p>
                </div>
              </div>
            </div>

            {/* Financial Guidelines banner */}
            <div className="p-5 rounded-2xl bg-orange-50/20 border border-orange-100 dark:border-orange-950/20">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">InnovexaEscrow™ Protected</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Under the platform's standard terms, funds remain safely in escrow. If there is a breach, you can initiate a standard dispute for administrator review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Ledgers */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-md">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Financial Ledger History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-3 pl-1">TxID</th>
                    <th className="pb-3">Transaction details</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right pr-1">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30">
                      <td className="py-3.5 pl-1 font-mono text-slate-500">{tx.id}</td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{tx.date}</p>
                      </td>
                      <td className={`py-3.5 text-right font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                        {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right pr-1">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold
                          ${tx.status === 'SUCCESS' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : ''}
                          ${tx.status === 'FAILED' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' : ''}
                          ${tx.status === 'REFUNDED' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600' : ''}
                        `}>
                          {tx.status}
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

      {/* 5. TALENT POOL / PROFILES TAB */}
      {activeTab === 'profile' && (
        <ClientTalentPool />
      )}

      {/* 6. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <ClientAnalytics />
      )}

      {/* DISPUTE DESCRIPTION MODAL FORM */}
      {disputeModal && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setDisputeModal(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 p-6 shadow-2xl z-10 text-left">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-500 w-5 h-5" />
              File Milestone Dispute
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your dispute will halt all escrow releases. A platform administrator will evaluate client and freelancer statements to arbitrate the payout.
            </p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Dispute Statement</label>
                <textarea 
                  rows={4}
                  placeholder="Outline which requirements/milestone deliverables were missed or incorrect..."
                  value={clientStatement}
                  onChange={(e) => setClientStatement(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDisputeModal(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisputeSubmit}
                  className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-500/10 transition-colors"
                >
                  File Dispute Lock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
