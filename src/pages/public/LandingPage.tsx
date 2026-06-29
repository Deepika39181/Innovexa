import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, ArrowRight, Code, Smartphone, Layout, Megaphone, 
  FileText, BarChart3, Cpu, PenTool, ShieldCheck, Star, Users, Briefcase, Sparkles, CheckCircle2
} from 'lucide-react';
import { LandingPricing } from './LandingPricing';

export const LandingPage: React.FC = () => {
  const { setRole, setAuthStep, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'pricing'>('home');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('freelancer');
    setAuthStep('authenticated');
    setActiveTab('marketplace');
  };

  const handleExplore = () => {
    setRole('freelancer');
    setAuthStep('authenticated');
    setActiveTab('marketplace');
  };

  const handleJoin = (roleChoice: 'client' | 'freelancer') => {
    setRole(roleChoice);
    setAuthStep('authenticated');
    setActiveTab('dashboard');
  };

  const categories = [
    { id: 'web', title: 'Web Dev', count: '2,450+ Active Projects', icon: Code, bg: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600' },
    { id: 'mobile', title: 'Mobile App', count: '1,200+ Active Projects', icon: Smartphone, bg: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600' },
    { id: 'ui', title: 'UI/UX', count: '890+ Active Projects', icon: Layout, bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' },
    { id: 'marketing', title: 'Marketing', count: '1,500+ Active Projects', icon: Megaphone, bg: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600' },
    { id: 'content', title: 'Content', count: '3,100+ Active Projects', icon: FileText, bg: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' },
    { id: 'data', title: 'Data Analytics', count: '650+ Active Projects', icon: BarChart3, bg: 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600' },
    { id: 'ai', title: 'AI/ML', count: '420+ Active Projects', icon: Cpu, bg: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' },
    { id: 'design', title: 'Design', count: '1,800+ Active Projects', icon: PenTool, bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' },
  ];

  const opportunities = [
    {
      id: 'opp-1',
      title: 'E-commerce Mobile App Redesign',
      desc: 'Redesigning a high-traffic trading app with premium visual guidelines. Focus on micro-interactions and atomic design structures.',
      budget: '₹1,50,000',
      bids: 12,
      tags: ['Swift', 'UI Kit', 'Flutter'],
      badge: 'Featured',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    },
    {
      id: 'opp-2',
      title: 'AI Content Generator Plugin',
      desc: 'Build a WordPress/Shopify extension that integrates OpenAI GPT-4 for automated product descriptions and blogging drafts.',
      budget: '₹45,000',
      bids: 8,
      tags: ['Python', 'OpenAI', 'PHP'],
      badge: 'New',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      id: 'opp-3',
      title: 'Brand Identity for Tech Startup',
      desc: 'Full branding design including logo, style guides, asset library, and social media presentation banners for a cloud startup.',
      budget: '₹25,000',
      bids: 24,
      tags: ['Logo Design', 'Branding', 'Figma'],
      badge: 'Urgent',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
    }
  ];

  const experts = [
    { name: 'Sarah J.', role: 'Full-Stack Developer', rating: '4.9 (120+)', rate: '₹2,500/hr', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { name: 'Arjun M.', role: 'UI/UX Designer', rating: '5.0 (95+)', rate: '₹3,200/hr', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Linda K.', role: 'Digital Marketer', rating: '4.8 (210+)', rate: '₹1,800/hr', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { name: 'Rahul S.', role: 'Data Scientist', rating: '4.9 (45+)', rate: '₹4,500/hr', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  ];

  const testimonials = [
    { text: "Finding high-quality React developers used to take weeks. With Innovexa Catalyst, we had a shortlisted team of experts in under 48 hours.", author: "David Chen", role: "CEO, TechFlow", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" },
    { text: "The escrow payment system is a game-changer. I never have to worry about whether a client will release funds for completed work.", author: "Ananya Rao", role: "Freelance Architect", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
    { text: "The talent quality pool is truly elite. Every freelancer we’ve hired through the platform has exceeded our visual and technical KPIs.", author: "Marcus Thorne", role: "VP Marketing, SkyVal", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 font-bold text-white shadow-md">
              IX
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Innovexa Catalyst
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'home' 
                  ? 'text-orange-500 font-bold border-b-2 border-orange-500 pb-0.5' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
              }`}
            >
              Home
            </button>
            <a 
              href="#categories" 
              onClick={() => setCurrentView('home')}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors"
            >
              Find Talent
            </a>
            <a 
              href="#opportunities" 
              onClick={() => setCurrentView('home')}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors"
            >
              Browse Projects
            </a>
            <a 
              href="#escrow" 
              onClick={() => setCurrentView('home')}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors"
            >
              Solutions
            </a>
            <button 
              onClick={() => { setCurrentView('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'pricing' 
                  ? 'text-orange-500 font-bold border-b-2 border-orange-500 pb-0.5' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-orange-500'
              }`}
            >
              Pricing
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              id="login-btn-landing"
              onClick={() => { setRole('client'); setAuthStep('login'); }}
              className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors"
            >
              Log In
            </button>
            <button 
              id="join-btn-landing"
              onClick={() => { setRole('client'); setAuthStep('role_select'); }}
              className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition-opacity shadow-md shadow-orange-500/10"
            >
              Join Now
            </button>
          </div>
        </div>
      </header>

      {currentView === 'pricing' ? (
        <LandingPricing />
      ) : (
        <>
          {/* HERO SECTION */}
          <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900/30 dark:via-slate-950 dark:to-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/20 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Next Generation Freelance Ecosystem
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                    Hire <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Top Freelancers</span> or Find Your Next Project
                  </h1>
                  <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                    Innovexa Catalyst bridges the gap between elite engineering, visual, and marketing talent and visionary enterprise clients. Experience secure, contract-guaranteed work milestones with peace of mind.
                  </p>

                  {/* Search Form */}
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                    <div className="flex-1 flex items-center gap-2 px-3">
                      <Search className="w-5 h-5 text-slate-400 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Search skills, projects, or talent..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none text-sm py-2"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/10"
                    >
                      Search Marketplace
                    </button>
                  </form>

                  {/* Badges/Social Proof */}
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex -space-x-2.5">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="avatar" className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-white dark:ring-slate-950" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="avatar" className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-white dark:ring-slate-950" />
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" alt="avatar" className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-white dark:ring-slate-950" />
                      <div className="h-8.5 w-8.5 rounded-full bg-slate-900 dark:bg-slate-850 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">2k+</div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Joined by <strong className="font-semibold text-slate-900 dark:text-white">over 10,000 top-tier specialists</strong>
                    </div>
                  </div>
                </div>

                {/* Right Card Illustration Mock */}
                <div className="lg:col-span-5 relative hidden lg:block">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-blue-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
                  <div className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
                          <Layout className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">UI/UX Designer Needed</h4>
                          <p className="text-[11px] text-slate-400 font-medium">Budget: ₹80,000 - ₹1,20,000</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-[10px] font-bold border border-emerald-100 dark:border-emerald-900/20">Secure Payments Held</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      We are looking for a senior designer to revamp our fintech dashboard with modern glassmorphism components. Must have an extensive Figma and React Native layout portfolio.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 rounded-lg font-medium">Figma</span>
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 rounded-lg font-medium">Tailwind</span>
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 rounded-lg font-medium">SaaS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STATISTICS COUNTERS */}
          <section className="py-10 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-850">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-orange-600">10K+</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Freelancers</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-600">5K+</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projects Completed</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-orange-600">₹50L+</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Secure Payments</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-blue-600">4.8/5</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Rating</p>
                </div>
              </div>
            </div>
          </section>

          {/* CATEGORIES GRID */}
          <section id="categories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Explore Talent</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Browse by Category</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect immediately with professionals highly proficient across critical modern tech stacks and visual frameworks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div 
                    key={cat.id} 
                    onClick={handleExplore}
                    className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${cat.bg} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-md font-bold text-slate-900 dark:text-white mb-1">{cat.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{cat.count}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* HOW IT OPERATES */}
          <section className="py-20 bg-slate-900 text-white text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              <div className="max-w-xl mx-auto space-y-3">
                <h2 className="text-3xl font-extrabold tracking-tight">How Innovexa Catalyst Operates</h2>
                <p className="text-sm text-slate-400">Seamless collaboration between visionary companies and elite independent experts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                {/* For Clients */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-orange-400 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-orange-400" />
                    For Clients
                  </h3>
                  <ul className="space-y-5">
                    <li className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">1</span>
                      <div>
                        <h5 className="text-sm font-semibold text-white">Post a Project</h5>
                        <p className="text-xs text-slate-400 mt-1">Describe your needs, budget, and timeline. Get bids from verified experts within minutes.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">2</span>
                      <div>
                        <h5 className="text-sm font-semibold text-white">Hire Your Expert</h5>
                        <p className="text-xs text-slate-400 mt-1">Compare portfolios, reviews, and rates. Interview top candidates through our secure portal.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">3</span>
                      <div>
                        <h5 className="text-sm font-semibold text-white">Secure Milestones</h5>
                        <p className="text-xs text-slate-400 mt-1">Funds are held in escrow and released only when you approve the work at each stage.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* For Freelancers */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-blue-400 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    For Freelancers
                  </h3>
                  <ul className="space-y-5">
                    <li className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                      <div>
                        <h5 className="text-sm font-semibold text-white">Build Your Profile</h5>
                        <p className="text-xs text-slate-400 mt-1">Showcase your skills, portfolio, and verify your identity to join our elite pool.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
                      <div>
                        <h5 className="text-sm font-semibold text-white">Bid & Win</h5>
                        <p className="text-xs text-slate-400 mt-1">Apply for projects that match your expertise. Set your own rates and deadlines.</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">3</span>
                      <div>
                        <h5 className="text-sm font-semibold text-white">Get Paid Fast</h5>
                        <p className="text-xs text-slate-400 mt-1">Work with peace of mind. Guaranteed payment for completed milestones, straight to your bank.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* LATEST OPPORTUNITIES */}
          <section id="opportunities" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="space-y-2 text-left">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Active Market</span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Latest Opportunities</h2>
              </div>
              <button 
                onClick={handleExplore}
                className="text-xs font-bold text-blue-600 hover:text-blue-500 inline-flex items-center gap-1 hover:underline"
              >
                Browse All Projects
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {opportunities.map((opp) => (
                <div 
                  key={opp.id} 
                  onClick={handleExplore}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${opp.badgeColor}`}>
                        {opp.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">2h ago</span>
                    </div>
                    <h4 className="text-md font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug">{opp.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{opp.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {opp.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-850 rounded-lg text-[10px] text-slate-600 dark:text-slate-300 font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Est. Budget</p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{opp.budget}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Total Bids</p>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{opp.bids}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TOP RATED EXPERTS */}
          <section className="py-20 bg-slate-100/50 dark:bg-slate-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
              <div className="max-w-xl mx-auto space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Top Rated Experts</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Collaborating with professionals validated in the top 1% of their visual and technical domains.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {experts.map((exp) => (
                  <div 
                    key={exp.name} 
                    onClick={() => handleJoin('freelancer')}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:shadow-xl transition-all cursor-pointer text-center space-y-4"
                  >
                    <img 
                      src={exp.avatar} 
                      alt={exp.name} 
                      className="h-20 w-20 rounded-2xl mx-auto object-cover ring-4 ring-orange-500/10"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{exp.name}</h4>
                      <p className="text-xs text-orange-600 font-medium">{exp.role}</p>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-900 dark:text-white">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {exp.rating}
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-xs font-medium text-slate-500">
                      <span>From {exp.rate}</span>
                      <span className="text-blue-600 hover:underline">View Profile</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECURE ESCROW SECTION */}
          <section id="escrow" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Badge Panel / Left side */}
              <div className="lg:col-span-5 relative">
                <div className="absolute inset-0 bg-orange-500 rounded-3xl blur-2xl opacity-10" />
                <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl text-center space-y-6">
                  <div className="mx-auto h-16 w-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">InnovexaEscrow™</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Your payments are protected at every stage. We release funds only when the pre-agreed milestones are met.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Verified Identities</p>
                      <p className="text-[10px] text-slate-400 mt-1">100% of specialists pass full portfolio & KYC checks</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">256-bit Encryption</p>
                      <p className="text-[10px] text-slate-400 mt-1">SLA contracts bound via cryptographically sealed timestamps</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text panel / Right side */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Safe & Secure</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Work with Absolute Peace of Mind</h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  We’ve built a robust trust layer that ensures every transaction is transparent and every user is vetted. No more payment delays or project scope creep.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Complete identity verification for all independent specialists</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Milestone-based budget escrow holding with transparent releases</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">24/7 dedicated administrative dispute resolution center</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => handleJoin('client')}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-colors shadow-lg shadow-blue-600/10"
                  >
                    Learn About Security
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS / SUCCESS STORIES */}
          <section className="py-20 bg-slate-100/50 dark:bg-slate-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Success Stories</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {testimonials.map((test, index) => (
                  <div 
                    key={index} 
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 flex flex-col justify-between text-left"
                  >
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 italic leading-relaxed">
                      "{test.text}"
                    </p>
                    <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-850">
                      <img src={test.avatar} alt={test.author} className="h-10 w-10 rounded-xl object-cover" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{test.author}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-16 border-t border-slate-900 text-left text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 font-bold text-white shadow-md">
                IX
              </div>
              <span className="text-md font-bold tracking-tight text-white">Innovexa Catalyst</span>
            </div>
            <p className="text-xs leading-relaxed">
              Empowering the next generation of global work through trust, contract transparency, and elite visual and technical specialization.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">For Clients</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Find Talent</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise Solutions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Project Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing Guideline</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">For Freelancers</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Find Work</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Skill Assessments</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Audit</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span>&copy; 2026 Innovexa Catalyst Freelance Marketplace. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
