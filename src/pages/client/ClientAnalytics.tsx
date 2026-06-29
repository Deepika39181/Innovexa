import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, ArrowUpRight, TrendingUp, Users, Star, ArrowDownRight, 
  Download, Calendar, ShieldCheck, Zap, Award, CheckCircle2, RefreshCw,
  Briefcase, FileText, Wallet, MessageSquare, Plus, Clock, Filter, AlertCircle,
  FileDown, Info, Shield, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TimeRange = 'Last 30 Days' | 'Today' | 'Last 7 Days' | 'Last 6 Months' | 'Last Year';

export const ClientAnalytics: React.FC = () => {
  const { showToast, setActiveTab } = useApp();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('Last 30 Days');
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);
  const [clientTier, setClientTier] = useState<'Starter' | 'Pro'>('Starter');
  const [calcBudget, setCalcBudget] = useState<number>(100000);

  const handleExport = () => {
    setIsExporting(true);
    showToast('Compiling analytical datasets and financial metrics...', 'info');
    setTimeout(() => {
      setIsExporting(false);
      showToast('Export successful! GlobalTech_Solutions_Financial_Report.csv generated.', 'success');
    }, 2000);
  };

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    showToast('Generating highly formatted PDF dashboard audit...', 'info');
    setTimeout(() => {
      setIsDownloadingPdf(false);
      showToast('PDF successfully generated and saved to your device.', 'success');
    }, 2200);
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    showToast('Fetching latest pipeline and escrow metrics...', 'info');
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Analytics cache successfully re-validated.', 'success');
    }, 1200);
  };

  // Spending trend data
  const spendingTrend = [
    { month: 'JAN', budget: 140000, actual: 110000 },
    { month: 'FEB', budget: 210000, actual: 185000 },
    { month: 'MAR', budget: 150000, actual: 150000 },
    { month: 'APR', budget: 260000, actual: 230000 },
    { month: 'MAY', budget: 160000, actual: 120000 },
    { month: 'JUN', budget: 320000, actual: 295000 },
  ];

  const maxBudget = Math.max(...spendingTrend.map(t => t.budget));

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      
      {/* 1. Header Area with Action buttons (matches screenshot 100%) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Client Insights & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Welcome back, <span className="text-slate-900 dark:text-slate-100 font-bold">GlobalTech Solutions</span>. Monitor your project performance and financial health.
          </p>
        </div>

        {/* Action controls matching screenshot */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Dropdown Selection pill */}
          <div className="relative">
            <select
              value={selectedRange}
              onChange={(e) => {
                setSelectedRange(e.target.value as TimeRange);
                showToast(`Viewing data set for ${e.target.value}`, 'info');
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
            >
              <option value="Last 30 Days">📅 Last 30 Days</option>
              <option value="Today">📅 Today</option>
              <option value="Last 7 Days">📅 Last 7 Days</option>
              <option value="Last 6 Months">📅 Last 6 Months</option>
              <option value="Last Year">📅 Last Year</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 cursor-pointer transition-all active:scale-95 shadow-xs"
            title="Refresh database state"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#FF7A00]' : ''}`} />
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 active:scale-95 transition-all text-xs font-bold shadow-xs cursor-pointer"
          >
            <FileDown className={`w-4 h-4 text-slate-500 ${isDownloadingPdf ? 'animate-pulse' : ''}`} />
            <span>{isDownloadingPdf ? 'Downloading...' : 'Download PDF'}</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-white bg-[#C2410C] hover:bg-[#a1360a] active:scale-95 transition-all text-xs font-bold shadow-md shadow-orange-500/10 shrink-0 cursor-pointer"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* 2. First Row: Performance Indicators (Metric Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Projects Posted */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Projects Posted</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">42</h2>
          </div>
          <div className="flex flex-col items-end justify-between h-full min-h-[64px]">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100/10">
              +5%
            </span>
            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 text-[#2563EB] mt-2">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 2: Active Contracts */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Contracts</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">12</h2>
          </div>
          <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 text-[#FF7A00]">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Spending */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Spending</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">₹8,45,000</h2>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {/* Sparkline miniature bars */}
            <div className="flex items-end gap-1 h-8 mt-1">
              <div className="w-1.5 h-3 bg-emerald-300 dark:bg-emerald-600 rounded-t-xs" />
              <div className="w-1.5 h-5 bg-emerald-400 dark:bg-emerald-500 rounded-t-xs" />
              <div className="w-1.5 h-4 bg-emerald-300 dark:bg-emerald-600 rounded-t-xs" />
              <div className="w-1.5 h-7 bg-emerald-500 dark:bg-emerald-400 rounded-t-xs" />
            </div>
            <span className="text-[9px] font-semibold text-slate-400 uppercase">FY24 Spend</span>
          </div>
        </div>

        {/* Card 4: Escrow Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Escrow Balance</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">₹1,20,000</h2>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. Middle Section: Spending Trend & Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Monthly Spending Trend (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Spending Trend</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Financial distribution across 2024</p>
            </div>

            {/* Legend indicators */}
            <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span>Budget</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]" />
                <span>Actual</span>
              </div>
            </div>
          </div>

          {/* High fidelity interactive Spending Trend Bar Chart */}
          <div className="grid grid-cols-6 items-end h-64 pt-6 pb-2 px-4 border-b border-slate-100 dark:border-slate-800 relative">
            
            {/* Background grid lines */}
            <div className="absolute inset-x-0 top-6 border-t border-slate-100 dark:border-slate-850 border-dashed" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-100 dark:border-slate-850 border-dashed" />
            <div className="absolute inset-x-0 bottom-10 border-t border-slate-100 dark:border-slate-850 border-dashed" />

            {spendingTrend.map((data, idx) => {
              const budgetPercent = (data.budget / maxBudget) * 85;
              const actualPercent = (data.actual / maxBudget) * 85;
              const isHovered = hoveredTrendIdx === idx;

              return (
                <div 
                  key={data.month} 
                  className="flex flex-col items-center group relative h-full justify-end cursor-pointer"
                  onMouseEnter={() => setHoveredTrendIdx(idx)}
                  onMouseLeave={() => setHoveredTrendIdx(null)}
                >
                  {/* Floating tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute -top-12 z-30 p-2.5 bg-slate-900/95 dark:bg-slate-950 text-white rounded-xl text-[10px] border border-slate-800 shadow-xl space-y-0.5 whitespace-nowrap text-left"
                      >
                        <p className="font-extrabold text-slate-300 font-mono text-[9px] uppercase">{data.month} Trajectory</p>
                        <p className="font-semibold flex justify-between gap-4">
                          <span>Budget:</span>
                          <span className="font-bold text-blue-400">₹{data.budget.toLocaleString()}</span>
                        </p>
                        <p className="font-semibold flex justify-between gap-4">
                          <span>Actual:</span>
                          <span className="font-bold text-orange-400">₹{data.actual.toLocaleString()}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Dual stacked/layered bar system to replicate screenshot style */}
                  <div className="w-14 sm:w-18 bg-slate-50 dark:bg-slate-950/40 rounded-t-xl h-full flex items-end justify-center pb-1 gap-1 border border-slate-100/50 dark:border-slate-850/50 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 transition-colors">
                    
                    {/* Budget column */}
                    <div 
                      className="w-4 bg-[#2563EB] rounded-t-md hover:brightness-110 transition-all shadow-md shadow-blue-500/10"
                      style={{ height: `${budgetPercent}%` }}
                    />

                    {/* Actual column */}
                    <div 
                      className="w-4 bg-[#C2410C] rounded-t-md hover:brightness-110 transition-all shadow-md shadow-orange-500/10"
                      style={{ height: `${actualPercent}%` }}
                    />

                  </div>

                  {/* Label */}
                  <span className="text-[10px] font-bold text-slate-400 mt-3 font-mono tracking-wider">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Project Status (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex flex-col justify-between h-full min-h-[360px]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Project Status</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Operational summary by pipeline state</p>
          </div>

          {/* Donut Chart SVG */}
          <div className="relative flex items-center justify-center my-6">
            <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
              {/* Draft segment: strokeDasharray="31.4 314" strokeDashoffset="0" (10%) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                stroke="#EF4444"
                strokeWidth="16"
                strokeDasharray="37.68 376.8"
                strokeDashoffset="0"
                strokeLinecap="round"
                className="opacity-90"
              />
              {/* Active segment: strokeDasharray="94.2 314" strokeDashoffset="-37.68" (25%) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                stroke="#2563EB"
                strokeWidth="16"
                strokeDasharray="94.2 376.8"
                strokeDashoffset="-37.68"
                strokeLinecap="round"
                className="opacity-95"
              />
              {/* Completed segment: strokeDasharray="226.08 314" strokeDashoffset="-131.88" (60%) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                stroke="#10B981"
                strokeWidth="16"
                strokeDasharray="226.08 376.8"
                strokeDashoffset="-131.88"
                strokeLinecap="round"
                className="opacity-95"
              />
            </svg>
            
            {/* Center aggregate labels */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">42</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>

          {/* Donut legend parameters */}
          <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-850">
            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-slate-600 dark:text-slate-400">Completed</span>
              </div>
              <span className="text-slate-900 dark:text-white">60%</span>
            </div>

            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                <span className="text-slate-600 dark:text-slate-400">Active</span>
              </div>
              <span className="text-slate-900 dark:text-white">25%</span>
            </div>

            <div className="flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="text-slate-600 dark:text-slate-400">Draft</span>
              </div>
              <span className="text-slate-900 dark:text-white">10%</span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Market & Bid Analytics Block */}
      <div className="space-y-4">
        <h3 className="text-md font-bold text-slate-900 dark:text-white">Market & Bid Analytics</h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Block - 3 stats cards & 3 custom insight prompts (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 3 mini card stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Mini card A */}
              <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bids</span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">156</h4>
                <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">+12% from last week</p>
              </div>

              {/* Mini card B */}
              <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Bid Amount</span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">₹15k</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-1">Industry Avg: ₹18k</p>
              </div>

              {/* Mini card C */}
              <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Response</span>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5">4h 12m</h4>
                <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 mt-1">Top 5% category speed</p>
              </div>

            </div>

            {/* 3 custom interactive suggestion cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Insight 1: AI Rehire Suggestion */}
              <div 
                onClick={() => {
                  setActiveTab('profile');
                  showToast('Redirecting to Alex Rivera in the Vetted Talent Pool...', 'info');
                }}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs text-left cursor-pointer hover:border-[#FF7A00] transition-colors group flex flex-col justify-between h-42"
              >
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold tracking-wider uppercase text-[#2563EB]">
                    <span>AI Suggestion</span>
                    <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-2 group-hover:text-[#FF7A00] transition-colors leading-tight">
                    Rehire Recommendation
                  </h4>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-50 dark:border-slate-850/50">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                    alt="Alex Rivera" 
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold text-slate-800 dark:text-white truncate">Alex Rivera</p>
                    <p className="text-[8px] text-slate-400 font-semibold truncate">Mobile Expert</p>
                  </div>
                </div>
              </div>

              {/* Insight 2: Budget Insight */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs text-left flex flex-col justify-between h-42">
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold tracking-wider uppercase text-orange-600">
                    <span>Budget Insight</span>
                    <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                    Increase AI/ML Budget
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2.5 font-medium leading-relaxed">
                    15% increase suggested to attract the top 1% elite AI talent in the region.
                  </p>
                </div>
              </div>

              {/* Insight 3: Cost Saving */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs text-left flex flex-col justify-between h-42">
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold tracking-wider uppercase text-emerald-600">
                    <span>Cost Saving</span>
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                    Consolidated Billing
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2.5 font-medium leading-relaxed">
                    Enterprise account detected. Switch to consolidated monthly billing to save 2%.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Block - "Top Talent" Showcase (4 Cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                Top Talent
              </h3>
              <button 
                onClick={() => setActiveTab('profile')}
                className="text-[10px] text-[#2563EB] font-bold hover:underline"
              >
                View All
              </button>
            </div>

            {/* Talent rows matching screenshot */}
            <div className="space-y-3.5">
              
              {/* Talent 1: Sarah Jenkins */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" 
                      alt="Sarah Jenkins" 
                      className="h-8.5 w-8.5 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Sarah Jenkins</p>
                    <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="flex items-center text-amber-500"><Star className="w-2.5 h-2.5 fill-amber-500 shrink-0" /> 5.0</span>
                      <span>&bull;</span>
                      <span>12 Projects</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    showToast('Opening secure channel with Sarah Jenkins...', 'info');
                  }}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Talent 2: David Miller */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" 
                      alt="David Miller" 
                      className="h-8.5 w-8.5 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">David Miller</p>
                    <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="flex items-center text-amber-500"><Star className="w-2.5 h-2.5 fill-amber-500 shrink-0" /> 4.9</span>
                      <span>&bull;</span>
                      <span>8 Projects</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    showToast('Opening secure channel with David Miller...', 'info');
                  }}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Talent 3: Ananya Rao */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                      alt="Ananya Rao" 
                      className="h-8.5 w-8.5 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Ananya Rao</p>
                    <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="flex items-center text-amber-500"><Star className="w-2.5 h-2.5 fill-amber-500 shrink-0" /> 5.0</span>
                      <span>&bull;</span>
                      <span>24 Projects</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    showToast('Opening secure channel with Ananya Rao...', 'info');
                  }}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Pro Tip blue banner */}
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/10 rounded-xl space-y-1">
              <span className="text-[9px] font-bold uppercase text-[#2563EB] tracking-wider">Pro Tip</span>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Freelancers with 5.0 ratings on 10+ projects have a 95% higher chance of early delivery.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 5. Bottom Row: Recent Projects & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Block - Recent Projects Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Projects</h3>
            <button 
              onClick={() => {
                setActiveTab('projects');
                showToast('Navigating to full projects ledger...', 'info');
              }}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg"
            >
              <Filter className="w-3 h-3" />
              <span>Filter</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[9px] font-bold">
                  <th className="pb-3 pl-1">Project Name</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Budget</th>
                  <th className="pb-3 pr-1">Hired</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                
                {/* Row 1 */}
                <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20">
                  <td className="py-3.5 pl-1">
                    <p className="font-extrabold text-slate-900 dark:text-white">Cloud Migration Phase 2</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Started Oct 12, 2024</p>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold">
                      IN PROGRESS
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300">₹2,50,000</td>
                  <td className="py-3.5 pr-1">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                        alt="Marco S." 
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="text-[11px] text-slate-700 dark:text-slate-300">Marco S.</span>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20">
                  <td className="py-3.5 pl-1">
                    <p className="font-extrabold text-slate-900 dark:text-white">AI Integration Engine</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Started Oct 05, 2024</p>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                      COMPLETED
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300">₹1,80,000</td>
                  <td className="py-3.5 pr-1">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" 
                        alt="Priya K." 
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="text-[11px] text-slate-700 dark:text-slate-300">Priya K.</span>
                    </div>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20">
                  <td className="py-3.5 pl-1">
                    <p className="font-extrabold text-slate-900 dark:text-white">UX Audit & Redesign</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Started Sep 28, 2024</p>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-[#FF7A00] text-[9px] font-bold">
                      REVIEW
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-700 dark:text-slate-300">₹75,000</td>
                  <td className="py-3.5 pr-1">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" 
                        alt="Julian W." 
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="text-[11px] text-slate-700 dark:text-slate-300">Julian W.</span>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* Right Block - Recent Activity (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recent Activity
          </h3>

          <div className="space-y-4 pt-1">
            
            {/* Activity 1 */}
            <div className="flex gap-3 text-left">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-950/30 text-pink-600 flex items-center justify-center font-bold text-md z-10">
                  +
                </div>
                <div className="w-0.5 bg-slate-100 dark:bg-slate-800 flex-1 my-1" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">Project 'AI Integration' Created</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Just now &bull; Dashboard</p>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="flex gap-3 text-left">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center font-bold text-xs z-10">
                  ✓
                </div>
                <div className="w-0.5 bg-slate-100 dark:bg-slate-800 flex-1 my-1" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">Payment of ₹50,000 Released</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">To Sarah Jenkins &bull; 2h ago</p>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="flex gap-3 text-left">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center font-bold text-xs z-10">
                  ✉
                </div>
                <div className="w-0.5 bg-slate-100 dark:bg-slate-800 flex-1 my-1" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">New Bid Received</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">From David M. &bull; 4h ago</p>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="flex gap-3 text-left">
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center font-bold text-xs z-10">
                  !
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">Deadline Reminder</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Cloud Migration ends in 48h</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 5. Client Membership Plans & SLA Project Cost Estimator */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-6 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#C2410C]" />
              SLA Cost Estimator & Membership Tiers
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Simulate custom project budgets, estimate platform fees, and evaluate corporate Pro advantages</p>
          </div>
          <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-850">
            <button
              onClick={() => { setClientTier('Starter'); showToast('Starter Tier chosen (standard postings)', 'info'); }}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${clientTier === 'Starter' ? 'bg-[#C2410C] text-white shadow-xs' : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Starter Tier
            </button>
            <button
              onClick={() => { setClientTier('Pro'); showToast('Pro Tier chosen (unlimited postings & benefits)', 'info'); }}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${clientTier === 'Pro' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Pro Tier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Block - Estimator Slider */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">Project Target Budget (INR)</span>
                <span className="font-mono font-extrabold text-[#C2410C] text-sm">₹{calcBudget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={calcBudget}
                onChange={(e) => setCalcBudget(parseInt(e.target.value))}
                className="w-full accent-orange-600 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹10,000</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                <p className="text-[10px] text-slate-400 font-semibold mb-1 font-sans">Escrow Locked</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">₹{calcBudget.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                <p className="text-[10px] text-slate-400 font-semibold mb-1 font-sans">Platform Posting Fee</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">{clientTier === 'Starter' ? '₹999 / post' : '₹0 (Unlimited Pro)'}</p>
              </div>
              <div className="p-3 bg-orange-50/20 border border-orange-100/10 rounded-xl">
                <p className="text-[10px] text-[#C2410C] font-semibold mb-1 font-sans">Net Employer Investment</p>
                <p className="text-sm font-extrabold text-[#C2410C]">₹{(calcBudget + (clientTier === 'Starter' ? 999 : 0)).toLocaleString()}</p>
              </div>
            </div>

            {/* Savings & Vetting Protection Disclaimer */}
            <div className="p-3.5 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                SLA Escrow Protection included automatically at ₹0 charge. Guaranteed refund support.
              </span>
              {clientTier === 'Starter' && (
                <button 
                  onClick={() => { setClientTier('Pro'); showToast('Upgraded simulation to Pro Tier!', 'success'); }}
                  className="text-[10px] font-bold text-white bg-orange-600 hover:bg-orange-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Simulate Pro Savings
                </button>
              )}
            </div>
          </div>

          {/* Right Block - Subscription Tier Overview */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                <span>Current Plan: <span className="text-[#C2410C]">Pro Enterprise Pilot</span></span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Active</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                GlobalTech Solutions is on the active **Pro Enterprise** plan. Enjoy zero project posting charges, priority support dispatch, advanced talent list filters, featured tags, and access to cognitive vetted specialists.
              </p>
            </div>
            
            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-850 flex items-center justify-between text-xs font-bold">
              <div>
                <span className="text-slate-400 text-[10px]">RENEWAL PRICE</span>
                <p className="text-slate-950 dark:text-white text-md font-extrabold">₹999<span className="text-[10px] text-slate-400 font-normal">/mo (Billed annually)</span></p>
              </div>
              <button 
                onClick={() => showToast('Enterprise Pro renewal schedule verified.', 'success')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md active:scale-95 text-xs font-bold"
              >
                Manage Plan
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
