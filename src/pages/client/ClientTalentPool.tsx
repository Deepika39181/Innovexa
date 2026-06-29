import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, Search, Filter, Star, ShieldCheck, Award, Zap, 
  MessageSquare, Send, ArrowUpRight, CheckCircle2, 
  TrendingUp, BarChart3, Calendar, Shield, BadgeCheck, Clock, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TalentMetricDetail {
  value: string;
  badge: string;
  badgeType: 'success' | 'warning' | 'info';
  sparklinePoints: number[];
  color: string;
}

interface VettingScores {
  architecture: number;
  devsecops: number;
  slaOnTime: number;
  clientNps: number;
}

interface FunnelStep {
  label: string;
  value: number;
  color: string;
}

interface TalentProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  successRate: string;
  hourlyRate: string;
  category: 'Full-Stack' | 'Cloud & DevOps' | 'AI & ML' | 'Security';
  skills: string[];
  bio: string;
  metrics: {
    earnings: TalentMetricDetail;
    views: TalentMetricDetail;
    bids: TalentMetricDetail;
  };
  vettingScores: VettingScores;
  funnel: FunnelStep[];
}

const TALENT_POOL_DATA: TalentProfile[] = [
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    title: 'Senior Full-Stack Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.95,
    reviewsCount: 89,
    successRate: '98%',
    hourlyRate: '₹8,500/hr',
    category: 'Full-Stack',
    skills: ['React', 'Kubernetes', 'AWS', 'Go', 'PyTorch', 'TypeScript', 'Node.js'],
    bio: 'DevOps specialist and full-stack software engineer with 8+ years of experience constructing latency-critical analytics applications. Expert in Kubernetes, Docker, React architectures, AWS resource clusters, and secure SOC2-compliant configurations.',
    metrics: {
      earnings: { value: '₹2,45,800', badge: '+12.5%', badgeType: 'success', sparklinePoints: [20, 25, 18, 35, 30, 50, 45, 65, 55, 75, 70, 95], color: '#10B981' },
      views: { value: '1,248', badge: '+14%', badgeType: 'info', sparklinePoints: [20, 28, 42, 38, 55, 62, 58, 72, 70, 88, 82, 98], color: '#3B82F6' },
      bids: { value: '68%', badge: '+4.2%', badgeType: 'success', sparklinePoints: [60, 62, 58, 65, 63, 67, 65, 68, 66, 70, 67, 68], color: '#F59E0B' }
    },
    vettingScores: {
      architecture: 96,
      devsecops: 94,
      slaOnTime: 100,
      clientNps: 98
    },
    funnel: [
      { label: 'Profile Views', value: 1248, color: '#3B82F6' },
      { label: 'Bids Placed', value: 45, color: '#F59E0B' },
      { label: 'Shortlisted', value: 22, color: '#EF4444' },
      { label: 'Contracts Won', value: 15, color: '#10B981' }
    ]
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    title: 'DevOps & Site Reliability Architect',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    rating: 5.0,
    reviewsCount: 124,
    successRate: '100%',
    hourlyRate: '₹9,200/hr',
    category: 'Cloud & DevOps',
    skills: ['Terraform', 'GCP', 'Kubernetes', 'CI/CD Pipelines', 'Ansible', 'Python', 'Linux Core'],
    bio: 'Highly specialized site reliability engineer focused on automated cloud provisioning, automated failsafes, and enterprise redundancy configurations. Expert in containerized load orchestration and Zero-Trust private network architectures.',
    metrics: {
      earnings: { value: '₹3,12,000', badge: '+18.1%', badgeType: 'success', sparklinePoints: [35, 42, 38, 55, 62, 58, 72, 70, 88, 82, 98, 100], color: '#10B981' },
      views: { value: '980', badge: '+22%', badgeType: 'info', sparklinePoints: [15, 25, 30, 28, 40, 52, 48, 62, 60, 75, 72, 85], color: '#3B82F6' },
      bids: { value: '75%', badge: '+6.5%', badgeType: 'success', sparklinePoints: [50, 52, 55, 58, 56, 62, 65, 68, 66, 70, 72, 75], color: '#F59E0B' }
    },
    vettingScores: {
      architecture: 98,
      devsecops: 100,
      slaOnTime: 100,
      clientNps: 99
    },
    funnel: [
      { label: 'Profile Views', value: 980, color: '#3B82F6' },
      { label: 'Bids Placed', value: 28, color: '#F59E0B' },
      { label: 'Shortlisted', value: 19, color: '#EF4444' },
      { label: 'Contracts Won', value: 14, color: '#10B981' }
    ]
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    title: 'AI & ML Platform Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.9,
    reviewsCount: 56,
    successRate: '94%',
    hourlyRate: '₹7,800/hr',
    category: 'AI & ML',
    skills: ['PyTorch', 'Docker', 'CUDA Acceleration', 'AWS SageMaker', 'Ray Clusters', 'Python', 'C++'],
    bio: 'Platform scientist constructng robust distributed compute architecture for deep neural networks. Passionate about maximizing hardware throughput, configuring GPU clusters, and optimizing model pipeline latency.',
    metrics: {
      earnings: { value: '₹1,85,000', badge: '+9.4%', badgeType: 'success', sparklinePoints: [15, 20, 18, 25, 32, 28, 42, 38, 50, 45, 55, 60], color: '#10B981' },
      views: { value: '1,450', badge: '+8%', badgeType: 'info', sparklinePoints: [40, 45, 55, 52, 65, 78, 74, 90, 85, 110, 105, 120], color: '#3B82F6' },
      bids: { value: '62%', badge: '-1.5%', badgeType: 'warning', sparklinePoints: [70, 68, 65, 62, 63, 60, 58, 61, 59, 64, 61, 62], color: '#F59E0B' }
    },
    vettingScores: {
      architecture: 92,
      devsecops: 91,
      slaOnTime: 96,
      clientNps: 95
    },
    funnel: [
      { label: 'Profile Views', value: 1450, color: '#3B82F6' },
      { label: 'Bids Placed', value: 62, color: '#F59E0B' },
      { label: 'Shortlisted', value: 30, color: '#EF4444' },
      { label: 'Contracts Won', value: 18, color: '#10B981' }
    ]
  },
  {
    id: 'david-miller',
    name: 'David Miller',
    title: 'Senior Systems Integrator & SecOps',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.82,
    reviewsCount: 110,
    successRate: '95%',
    hourlyRate: '₹8,000/hr',
    category: 'Security',
    skills: ['Penetration Testing', 'SOC2 Auditing', 'Ansible', 'Bash Scripting', 'OSSEC', 'Docker'],
    bio: 'Security architect specialzng in infrastructure hardening, intrusion detection metrics, and penetration auditing. Delivers custom automated SecOps tooling to monitor networks and achieve enterprise SOC2 validation protocols.',
    metrics: {
      earnings: { value: '₹1,94,000', badge: '+11.2%', badgeType: 'success', sparklinePoints: [10, 18, 15, 22, 28, 25, 35, 32, 42, 40, 48, 50], color: '#10B981' },
      views: { value: '820', badge: '+5%', badgeType: 'info', sparklinePoints: [10, 14, 22, 20, 28, 35, 32, 40, 38, 48, 44, 52], color: '#3B82F6' },
      bids: { value: '58%', badge: '+3.1%', badgeType: 'success', sparklinePoints: [50, 52, 48, 54, 52, 55, 53, 58, 56, 60, 57, 58], color: '#F59E0B' }
    },
    vettingScores: {
      architecture: 94,
      devsecops: 98,
      slaOnTime: 98,
      clientNps: 96
    },
    funnel: [
      { label: 'Profile Views', value: 820, color: '#3B82F6' },
      { label: 'Bids Placed', value: 32, color: '#F59E0B' },
      { label: 'Shortlisted', value: 15, color: '#EF4444' },
      { label: 'Contracts Won', value: 10, color: '#10B981' }
    ]
  }
];

export const ClientTalentPool: React.FC = () => {
  const { showToast, projects, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile>(TALENT_POOL_DATA[0]);
  const [activeChartTab, setActiveChartTab] = useState<'earnings' | 'views' | 'bids'>('earnings');
  const [inviteProject, setInviteProject] = useState<string>('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [hoveredDataIdx, setHoveredDataIdx] = useState<number | null>(null);
  const [contractHours, setContractHours] = useState<number>(40);

  // Available open projects of the client
  const clientOpenProjects = projects.filter(p => p.status === 'Open' || p.status === 'Reviewing Bids');

  // Filter candidates
  const filteredTalent = TALENT_POOL_DATA.filter((talent) => {
    const matchesSearch = talent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          talent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          talent.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === 'All') return matchesSearch;
    return talent.category === selectedCategory && matchesSearch;
  });

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteProject) {
      showToast('Please select a project to invite the candidate to.', 'error');
      return;
    }

    const projectObj = projects.find(p => p.id === inviteProject);
    if (!projectObj) return;

    setIsSendingInvite(true);
    showToast(`Encrypting secure brief credentials and routing invitation to ${selectedTalent.name}...`, 'info');

    setTimeout(() => {
      setIsSendingInvite(false);
      showToast(`Success! Invitation sent to ${selectedTalent.name} for project "${projectObj.title}".`, 'success');
      setInviteProject('');
    }, 2000);
  };

  const handleStartChat = () => {
    showToast(`Redirecting to secure message terminal with ${selectedTalent.name}...`, 'info');
    setActiveTab('messages');
  };

  // Detailed graph values representing monthly trajectory of selected candidate
  const progressionData: Record<'earnings' | 'views' | 'bids', { label: string; value: number }[]> = {
    earnings: [
      { label: 'Jan', value: 25000 }, { label: 'Feb', value: 58000 },
      { label: 'Mar', value: 92000 }, { label: 'Apr', value: 145000 },
      { label: 'May', value: 198000 }, { label: 'Jun', value: 245800 }
    ],
    views: [
      { label: 'Jan', value: 180 }, { label: 'Feb', value: 340 },
      { label: 'Mar', value: 580 }, { label: 'Apr', value: 850 },
      { label: 'May', value: 1040 }, { label: 'Jun', value: 1248 }
    ],
    bids: [
      { label: 'Jan', value: 58 }, { label: 'Feb', value: 62 },
      { label: 'Mar', value: 65 }, { label: 'Apr', value: 63 },
      { label: 'May', value: 67 }, { label: 'Jun', value: 68 }
    ]
  };

  // Adjust detailed trajectory data scaling depending on selected freelancer
  const getDynamicProgressData = () => {
    const baseData = progressionData[activeChartTab];
    const multiplier = selectedTalent.id === 'elena-rodriguez' ? 1.25 : 
                       selectedTalent.id === 'marcus-chen' ? 0.8 :
                       selectedTalent.id === 'david-miller' ? 0.75 : 1.0;
    
    return baseData.map(d => ({
      label: d.label,
      value: Math.round(d.value * multiplier)
    }));
  };

  const activeDetailedChart = getDynamicProgressData();

  // SVG parameters for trajectory graph
  const paddingX = 40;
  const paddingY = 30;
  const chartHeight = 200;
  const chartWidth = 500;

  const maxVal = Math.max(...activeDetailedChart.map(d => d.value), 10) * 1.1;
  const minVal = 0;

  const pointsString = activeDetailedChart.map((d, index) => {
    const x = paddingX + (index / (activeDetailedChart.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((d.value - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPointsString = `${paddingX},${chartHeight - paddingY} ${pointsString} ${chartWidth - paddingX},${chartHeight - paddingY}`;

  const getThemeColor = () => {
    switch (activeChartTab) {
      case 'earnings': return '#10B981';
      case 'views': return '#3B82F6';
      case 'bids': return '#FF7A00';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Talent Pool & Deep Vetting Dossier</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Browse and recruit top-tier freelancers with audited cognitive capabilities and secure SLA track records.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Full-Stack', 'Cloud & DevOps', 'AI & ML', 'Security'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200
                ${selectedCategory === cat 
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-850 dark:border-slate-800' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Curated Talent Stream list */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search bar inside list card */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, title, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-800 dark:text-slate-100 transition-all font-medium"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-1 uppercase tracking-wider">
              <span>Candidate List</span>
              <span>{filteredTalent.length} Specialist{filteredTalent.length !== 1 ? 's' : ''} Found</span>
            </div>
          </div>

          {/* List items */}
          <div className="space-y-3 overflow-y-auto max-h-[640px] pr-1">
            {filteredTalent.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 p-6 text-slate-400 text-xs font-semibold">
                No specialists found matching filters.
              </div>
            ) : (
              filteredTalent.map((talent) => {
                const isSelected = selectedTalent.id === talent.id;
                return (
                  <div
                    key={talent.id}
                    onClick={() => {
                      setSelectedTalent(talent);
                      setActiveChartTab('earnings');
                    }}
                    className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 cursor-pointer text-left relative flex flex-col justify-between hover:shadow-md
                      ${isSelected 
                        ? 'border-[#FF7A00] ring-2 ring-orange-500/10 shadow-sm' 
                        : 'border-slate-100 dark:border-slate-850'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <img 
                          src={talent.avatar} 
                          alt={talent.name} 
                          className="h-11 w-11 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-white p-0.5 shadow-sm">
                          <Award className="w-2.5 h-2.5" />
                        </span>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-baseline gap-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{talent.name}</h4>
                          <span className="text-[10px] font-extrabold text-slate-900 dark:text-white shrink-0">{talent.hourlyRate}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{talent.title}</p>
                        
                        <div className="flex items-center gap-1.5 mt-2 text-[9px] font-extrabold text-[#FF7A00]">
                          <span className="flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-[#FF7A00]" />
                            {talent.rating.toFixed(2)}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-emerald-600 dark:text-emerald-400">{talent.successRate} Job Success</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick sparkline inside candidates cards */}
                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1 max-w-[65%]">
                        {talent.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-850 border border-slate-100/50 dark:border-slate-800 rounded text-[8px] font-bold text-slate-500">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Mini Sparkline preview */}
                      <div className="w-16 h-6 overflow-hidden">
                        <svg viewBox="0 0 60 20" className="w-full h-full" preserveAspectRatio="none">
                          <path
                            d={`M 0 20 L ${talent.metrics.earnings.sparklinePoints.map((p, i) => `${(i / (talent.metrics.earnings.sparklinePoints.length - 1)) * 60} ${20 - p * 0.18}`).join(' L ')} L 60 20 Z`}
                            fill="url(#sparkGradient)"
                            className="opacity-20 fill-emerald-500"
                          />
                          <polyline
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="1.5"
                            points={talent.metrics.earnings.sparklinePoints.map((p, i) => `${(i / (talent.metrics.earnings.sparklinePoints.length - 1)) * 60},${20 - p * 0.18}`).join(' ')}
                          />
                          <defs>
                            <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4"/>
                              <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Vetting Dossier (Fully detailed metrics, progress charts and conversion funnel) */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Vetted Candidate Bio Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm relative overflow-hidden">
            {/* Ambient background blur */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-[#FF7A00]/5 to-[#2563EB]/5 rounded-full blur-3xl" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-50 dark:border-slate-850">
              <div className="flex items-start gap-4">
                <img 
                  src={selectedTalent.avatar} 
                  alt={selectedTalent.name} 
                  className="h-16 w-16 rounded-2xl object-cover ring-4 ring-orange-500/10 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{selectedTalent.name}</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-[#FF7A00] text-[9px] font-bold border border-orange-100/10">
                      <Award className="w-3 h-3" />
                      Cognitive Vetted
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">{selectedTalent.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] font-extrabold text-slate-500 font-mono">
                    <span className="flex items-center gap-1 text-[#FF7A00]">
                      <Star className="w-3.5 h-3.5 fill-[#FF7A00]" />
                      {selectedTalent.rating.toFixed(2)} ({selectedTalent.reviewsCount} reviews)
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-sans">{selectedTalent.successRate} Job Success</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-blue-600 dark:text-blue-400 font-sans">{selectedTalent.hourlyRate} Rate</span>
                  </div>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={handleStartChat}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 text-xs font-bold transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Secure Chat</span>
                </button>
              </div>
            </div>

            {/* Resume/Statement */}
            <div className="mt-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Expert Synopsis</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{selectedTalent.bio}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Core Tech Competencies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTalent.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Vetting Competency Scoreboard & Funnel (Matching design completely) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Scoreboard */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-5 text-left">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#FF7A00]" />
                  Cognitive Vetting Scores
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Audited capability benchmarks under SLA test conditions</p>
              </div>

              <div className="space-y-4">
                {/* Technical Architecture */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Technical Architecture</span>
                    <span className="text-[#2563EB] font-bold">{selectedTalent.vettingScores.architecture} / 100</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#FF7A00] to-[#2563EB] h-full rounded-full transition-all duration-500" style={{ width: `${selectedTalent.vettingScores.architecture}%` }} />
                  </div>
                </div>

                {/* DevSecOps Compliance */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">DevSecOps Compliance</span>
                    <span className="text-[#2563EB] font-bold">{selectedTalent.vettingScores.devsecops} / 100</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#FF7A00] to-[#2563EB] h-full rounded-full transition-all duration-500" style={{ width: `${selectedTalent.vettingScores.devsecops}%` }} />
                  </div>
                </div>

                {/* SLA Execution Speed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">SLA Deliveries On Time</span>
                    <span className="text-[#2563EB] font-bold">{selectedTalent.vettingScores.slaOnTime}%</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#FF7A00] to-[#2563EB] h-full rounded-full transition-all duration-500" style={{ width: `${selectedTalent.vettingScores.slaOnTime}%` }} />
                  </div>
                </div>

                {/* Client Review Consensus */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Client Net Promoter Score</span>
                    <span className="text-[#2563EB] font-bold">{selectedTalent.vettingScores.clientNps} / 100</span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#FF7A00] to-[#2563EB] h-full rounded-full transition-all duration-500" style={{ width: `${selectedTalent.vettingScores.clientNps}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline conversion funnel */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs text-left space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Pipeline Conversion Funnel
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ratio of profile engagement into successful contracts</p>
              </div>

              <div className="space-y-2.5 pt-1 font-mono text-xs">
                {selectedTalent.funnel.map((step, idx) => (
                  <div 
                    key={step.label} 
                    className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center"
                    style={{ marginLeft: `${idx * 8}px` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: step.color }} />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{idx + 1}. {step.label}</span>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{step.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Conversion rate badge */}
              <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/10 flex justify-between items-center text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Proposal-to-Win Ratio</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">
                  {((selectedTalent.funnel[3].value / selectedTalent.funnel[1].value) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Trajectory Progression Plot */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Interactive Progression Plot</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Audited tracking matrix over consecutive billing periods</p>
              </div>

              {/* Toggle tabs */}
              <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-850">
                <button
                  onClick={() => setActiveChartTab('earnings')}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all
                    ${activeChartTab === 'earnings' 
                      ? 'bg-emerald-500 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  Earnings
                </button>
                <button
                  onClick={() => setActiveChartTab('views')}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all
                    ${activeChartTab === 'views' 
                      ? 'bg-blue-500 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  Profile Views
                </button>
                <button
                  onClick={() => setActiveChartTab('bids')}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-lg transition-all
                    ${activeChartTab === 'bids' 
                      ? 'bg-orange-500 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  Bid Success %
                </button>
              </div>
            </div>

            {/* Graph display */}
            <div className="relative w-full overflow-hidden select-none">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-auto text-slate-400 dark:text-slate-700 font-mono"
              >
                <defs>
                  <linearGradient id="talentDossierGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={getThemeColor()} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={getThemeColor()} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.15" />
                <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.15" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="currentColor" strokeOpacity="0.15" />

                {/* Grid Labels Left (Y) */}
                <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" className="text-[8px] font-bold fill-slate-400">
                  {activeChartTab === 'earnings' ? `₹${Math.round(maxVal / 1.1).toLocaleString()}` : activeChartTab === 'bids' ? '100%' : Math.round(maxVal / 1.1)}
                </text>
                <text x={paddingX - 10} y={chartHeight / 2 + 4} textAnchor="end" className="text-[8px] font-bold fill-slate-400">
                  {activeChartTab === 'earnings' ? `₹${Math.round(maxVal / 2.2).toLocaleString()}` : activeChartTab === 'bids' ? '50%' : Math.round(maxVal / 2.2)}
                </text>
                <text x={paddingX - 10} y={chartHeight - paddingY + 4} textAnchor="end" className="text-[8px] font-bold fill-slate-400">0</text>

                {/* Area path for shading */}
                <polygon
                  points={areaPointsString}
                  fill="url(#talentDossierGradient)"
                  className="transition-all duration-300"
                />

                {/* Main Line path */}
                <polyline
                  fill="none"
                  stroke={getThemeColor()}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                  className="transition-all duration-300"
                />

                {/* Interactive circles */}
                {activeDetailedChart.map((d, idx) => {
                  const x = paddingX + (idx / (activeDetailedChart.length - 1)) * (chartWidth - paddingX * 2);
                  const y = chartHeight - paddingY - ((d.value - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
                  return (
                    <g 
                      key={idx}
                      onMouseEnter={() => setHoveredDataIdx(idx)}
                      onMouseLeave={() => setHoveredDataIdx(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={hoveredDataIdx === idx ? "6.5" : "4"}
                        fill="#FFFFFF"
                        stroke={getThemeColor()}
                        strokeWidth={hoveredDataIdx === idx ? "3.5" : "2.5"}
                        className="transition-all duration-150"
                      />
                      <circle cx={x} cy={y} r="15" fill="transparent" />
                    </g>
                  );
                })}

                {/* Bottom Labels (X) */}
                {activeDetailedChart.map((d, idx) => {
                  const x = paddingX + (idx / (activeDetailedChart.length - 1)) * (chartWidth - paddingX * 2);
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      className="text-[8px] font-bold fill-slate-400"
                    >
                      {d.label}
                    </text>
                  );
                })}
              </svg>

              {/* Dynamic floating tooltip on hover */}
              <AnimatePresence>
                {hoveredDataIdx !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute p-2.5 bg-slate-900/95 backdrop-blur-md rounded-xl text-white text-[11px] border border-slate-800 shadow-xl space-y-1 z-20 pointer-events-none"
                    style={{
                      left: `${Math.max(10, Math.min(80, (hoveredDataIdx / (activeDetailedChart.length - 1)) * 100))}%`,
                      top: '12%'
                    }}
                  >
                    <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">
                      {activeDetailedChart[hoveredDataIdx].label} Ledger
                    </p>
                    <p className="text-xs font-extrabold font-mono">
                      {activeChartTab === 'earnings' && <span className="text-emerald-400">+₹{activeDetailedChart[hoveredDataIdx].value.toLocaleString()}</span>}
                      {activeChartTab === 'views' && <span className="text-blue-400">{activeDetailedChart[hoveredDataIdx].value} Views</span>}
                      {activeChartTab === 'bids' && <span className="text-orange-400">{activeDetailedChart[hoveredDataIdx].value}% Success</span>}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Secure Bid Invitation Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs text-left space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Send className="w-4 h-4 text-blue-500" />
                Direct SLA Bidding Invitation
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 font-medium">Invite {selectedTalent.name} to offer proposals for your open projects.</p>
            </div>

            {clientOpenProjects.length === 0 ? (
              <div className="p-4 bg-amber-50/30 border border-amber-100/10 rounded-xl flex items-center gap-2 text-xs text-amber-700 font-medium">
                <Shield className="w-4 h-4" />
                <span>You do not have any open projects at this time. Go to the "My Projects" tab to post a new brief.</span>
              </div>
            ) : (
              <form onSubmit={handleSendInvitation} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <select
                    value={inviteProject}
                    onChange={(e) => setInviteProject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  >
                    <option value="">Select an active project listing...</option>
                    {clientOpenProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.title} (₹{p.budget.toLocaleString()})</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSendingInvite}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 shrink-0"
                >
                  {isSendingInvite ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isSendingInvite ? 'Sending...' : 'Invite to Bid'}</span>
                </button>
              </form>
            )}
          </div>

          {/* SLA Cost & Escrow Protection Estimator Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs text-left space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                SLA Cost & Escrow Protection Estimator
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Calculate real-time contract budgets, protect funds via automated Escrow, and simulate billing hours</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-400">Estimated Project Hours</span>
                  <span className="font-mono font-extrabold text-[#FF7A00] text-sm">{contractHours} hours</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={contractHours}
                  onChange={(e) => setContractHours(parseInt(e.target.value))}
                  className="w-full accent-orange-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>5h</span>
                  <span>40h (Standard week)</span>
                  <span>100h</span>
                  <span>200h</span>
                </div>
              </div>

              {/* Calculations Block */}
              <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-500 font-sans">
                  <span>Hourly Rate:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedTalent.hourlyRate}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-sans">
                  <span>Gross Budget:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{(contractHours * (parseInt(selectedTalent.hourlyRate.replace(/[^0-9]/g, ''), 10) || 8000)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-sans">
                  <span>Platform Fee:</span>
                  <span className="text-emerald-600 font-bold">₹0 Free</span>
                </div>
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 flex justify-between font-extrabold text-[#FF7A00] text-sm">
                  <span>Total Escrow:</span>
                  <span className="font-mono">₹{(contractHours * (parseInt(selectedTalent.hourlyRate.replace(/[^0-9]/g, ''), 10) || 8000)).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Escrow Disclaimer badge */}
            <div className="p-3 bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/10 rounded-xl flex items-center gap-2 text-[11px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
              <span>
                Funds are held in a secure multi-signature Escrow account and only released when you sign off on milestone SLA deliverables. Backed by Catalyst dispute mediation.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
