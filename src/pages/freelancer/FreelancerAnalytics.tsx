import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, ArrowUpRight, TrendingUp, Users, Star, ArrowDownRight, 
  Download, Calendar, ShieldCheck, Zap, Award, CheckCircle2, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TimeRange = 'Today' | '7D' | '30D' | '6M' | '1Y';

interface MetricDetail {
  value: string;
  badge: string;
  badgeType: 'success' | 'warning' | 'info' | 'neutral';
  sparklinePoints: number[];
  color: string;
}

export const FreelancerAnalytics: React.FC = () => {
  const { showToast } = useApp();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('30D');
  const [activeChartTab, setActiveChartTab] = useState<'earnings' | 'bids' | 'views'>('earnings');
  const [hoveredDataIdx, setHoveredDataIdx] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [calculatorEarnings, setCalculatorEarnings] = useState<number>(50000);
  const [selectedTier, setSelectedTier] = useState<'Starter' | 'Pro'>('Starter');

  // Simulated metrics based on the selected time range
  const metricsData: Record<TimeRange, Record<string, MetricDetail>> = {
    Today: {
      earnings: { value: '$1,250', badge: '+2.4%', badgeType: 'success', sparklinePoints: [10, 40, 25, 50, 40, 90, 80], color: '#10B981' },
      bids: { value: '100%', badge: '1 of 1 Accepted', badgeType: 'success', sparklinePoints: [100, 100, 100, 100, 100, 100, 100], color: '#EF4444' },
      views: { value: '42', badge: '+12%', badgeType: 'info', sparklinePoints: [5, 12, 8, 15, 22, 18, 42], color: '#3B82F6' },
      rating: { value: '5.00', badge: 'Perfect', badgeType: 'success', sparklinePoints: [5, 5, 5, 5, 5, 5, 5], color: '#F59E0B' }
    },
    '7D': {
      earnings: { value: '$8,200', badge: '+8.1%', badgeType: 'success', sparklinePoints: [30, 45, 35, 60, 50, 75, 70], color: '#10B981' },
      bids: { value: '64%', badge: '-2.1%', badgeType: 'warning', sparklinePoints: [75, 70, 68, 65, 62, 60, 64], color: '#EF4444' },
      views: { value: '280', badge: '+140', badgeType: 'info', sparklinePoints: [30, 45, 50, 40, 65, 70, 85], color: '#3B82F6' },
      rating: { value: '4.92', badge: 'Top Rated', badgeType: 'success', sparklinePoints: [4.9, 4.95, 4.92, 4.91, 4.94, 4.93, 4.92], color: '#F59E0B' }
    },
    '30D': { // Exact mockup values
      earnings: { value: '$24,580', badge: '+12.5%', badgeType: 'success', sparklinePoints: [20, 25, 18, 35, 30, 50, 45, 65, 55, 75, 70, 95], color: '#10B981' },
      bids: { value: '68%', badge: '+4.2%', badgeType: 'warning', sparklinePoints: [60, 62, 58, 65, 63, 67, 65, 68, 66, 70, 67, 68], color: '#EF4444' },
      views: { value: '1,248', badge: '+1.2k', badgeType: 'info', sparklinePoints: [20, 28, 42, 38, 55, 62, 58, 72, 70, 88, 82, 98], color: '#3B82F6' },
      rating: { value: '4.95', badge: 'Outstanding', badgeType: 'success', sparklinePoints: [4.88, 4.9, 4.92, 4.91, 4.93, 4.95, 4.94, 4.96, 4.95, 4.97, 4.96, 4.95], color: '#F59E0B' }
    },
    '6M': {
      earnings: { value: '$148,400', badge: '+18.2%', badgeType: 'success', sparklinePoints: [30, 45, 60, 75, 90, 110, 135], color: '#10B981' },
      bids: { value: '72%', badge: '+6.1%', badgeType: 'success', sparklinePoints: [65, 67, 70, 68, 71, 69, 72], color: '#EF4444' },
      views: { value: '7,450', badge: '+4.1k', badgeType: 'info', sparklinePoints: [120, 145, 160, 185, 210, 245, 280], color: '#3B82F6' },
      rating: { value: '4.96', badge: 'Elite tier', badgeType: 'success', sparklinePoints: [4.92, 4.94, 4.95, 4.96, 4.97, 4.95, 4.96], color: '#F59E0B' }
    },
    '1Y': {
      earnings: { value: '$312,000', badge: '+24.1%', badgeType: 'success', sparklinePoints: [40, 75, 110, 145, 180, 215, 250, 285, 320], color: '#10B981' },
      bids: { value: '75%', badge: '+8.3%', badgeType: 'success', sparklinePoints: [62, 65, 68, 71, 70, 73, 72, 74, 75], color: '#EF4444' },
      views: { value: '15,890', badge: '+10.2k', badgeType: 'info', sparklinePoints: [80, 115, 150, 185, 220, 255, 290, 325, 360], color: '#3B82F6' },
      rating: { value: '4.98', badge: 'Flawless', badgeType: 'success', sparklinePoints: [4.94, 4.95, 4.96, 4.97, 4.98, 4.97, 4.98, 4.99, 4.98], color: '#F59E0B' }
    }
  };

  // Main detailed chart values based on time range and tab selection
  const chartData: Record<TimeRange, Record<'earnings' | 'bids' | 'views', { label: string; value: number }[]>> = {
    Today: {
      earnings: [
        { label: '08:00 AM', value: 200 }, { label: '10:00 AM', value: 450 },
        { label: '12:00 PM', value: 850 }, { label: '02:00 PM', value: 920 },
        { label: '04:00 PM', value: 1250 }
      ],
      bids: [
        { label: '08:00 AM', value: 100 }, { label: '12:00 PM', value: 100 },
        { label: '04:00 PM', value: 100 }
      ],
      views: [
        { label: '08:00 AM', value: 8 }, { label: '10:00 AM', value: 15 },
        { label: '12:00 PM', value: 28 }, { label: '02:00 PM', value: 34 },
        { label: '04:00 PM', value: 42 }
      ]
    },
    '7D': {
      earnings: [
        { label: 'Mon', value: 1200 }, { label: 'Tue', value: 2400 },
        { label: 'Wed', value: 3800 }, { label: 'Thu', value: 5100 },
        { label: 'Fri', value: 6800 }, { label: 'Sat', value: 7500 },
        { label: 'Sun', value: 8200 }
      ],
      bids: [
        { label: 'Mon', value: 60 }, { label: 'Tue', value: 64 },
        { label: 'Wed', value: 62 }, { label: 'Thu', value: 65 },
        { label: 'Fri', value: 63 }, { label: 'Sat', value: 61 },
        { label: 'Sun', value: 64 }
      ],
      views: [
        { label: 'Mon', value: 35 }, { label: 'Tue', value: 58 },
        { label: 'Wed', value: 85 }, { label: 'Thu', value: 120 },
        { label: 'Fri', value: 180 }, { label: 'Sat', value: 240 },
        { label: 'Sun', value: 280 }
      ]
    },
    '30D': {
      earnings: [
        { label: 'Week 1', value: 5800 }, { label: 'Week 2', value: 12400 },
        { label: 'Week 3', value: 18900 }, { label: 'Week 4', value: 24580 }
      ],
      bids: [
        { label: 'Week 1', value: 62 }, { label: 'Week 2', value: 65 },
        { label: 'Week 3', value: 67 }, { label: 'Week 4', value: 68 }
      ],
      views: [
        { label: 'Week 1', value: 240 }, { label: 'Week 2', value: 580 },
        { label: 'Week 3', value: 920 }, { label: 'Week 4', value: 1248 }
      ]
    },
    '6M': {
      earnings: [
        { label: 'Jan', value: 22000 }, { label: 'Feb', value: 48000 },
        { label: 'Mar', value: 74000 }, { label: 'Apr', value: 99000 },
        { label: 'May', value: 124000 }, { label: 'Jun', value: 148400 }
      ],
      bids: [
        { label: 'Jan', value: 65 }, { label: 'Feb', value: 68 },
        { label: 'Mar', value: 70 }, { label: 'Apr', value: 68 },
        { label: 'May', value: 71 }, { label: 'Jun', value: 72 }
      ],
      views: [
        { label: 'Jan', value: 1100 }, { label: 'Feb', value: 2400 },
        { label: 'Mar', value: 3800 }, { label: 'Apr', value: 5100 },
        { label: 'May', value: 6300 }, { label: 'Jun', value: 7450 }
      ]
    },
    '1Y': {
      earnings: [
        { label: 'Q1', value: 74000 }, { label: 'Q2', value: 152000 },
        { label: 'Q3', value: 231000 }, { label: 'Q4', value: 312000 }
      ],
      bids: [
        { label: 'Q1', value: 66 }, { label: 'Q2', value: 70 },
        { label: 'Q3', value: 73 }, { label: 'Q4', value: 75 }
      ],
      views: [
        { label: 'Q1', value: 3400 }, { label: 'Q2', value: 7200 },
        { label: 'Q3', value: 11500 }, { label: 'Q4', value: 15890 }
      ]
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    showToast('Compiling analytical datasets and SLA milestones...', 'info');
    setTimeout(() => {
      setIsExporting(false);
      showToast('Export successful! Alex_Rivera_Performance_Report.pdf generated.', 'success');
    }, 2500);
  };

  const activeMetrics = metricsData[selectedRange];
  const activeDetailedChart = chartData[selectedRange][activeChartTab];

  // Compute SVG Polyline points for main interactive chart
  const paddingX = 40;
  const paddingY = 30;
  const chartHeight = 220;
  const chartWidth = 560;

  const maxVal = Math.max(...activeDetailedChart.map(d => d.value), 10) * 1.1;
  const minVal = 0;

  const pointsString = activeDetailedChart.map((d, index) => {
    const x = paddingX + (index / (activeDetailedChart.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((d.value - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return `${x},${y}`;
  }).join(' ');

  // SVG Area path for gradient fill
  const areaPointsString = `${paddingX},${chartHeight - paddingY} ${pointsString} ${chartWidth - paddingX},${chartHeight - paddingY}`;

  // Get current color theme based on tab
  const getTabColor = () => {
    switch (activeChartTab) {
      case 'earnings': return '#10B981';
      case 'bids': return '#FF7A00';
      case 'views': return '#3B82F6';
    }
  };

  const getTabGradientId = () => {
    return `chartGradient-${activeChartTab}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      
      {/* 1. Analytics Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Tracking your growth, performance, and revenue across the Catalyst ecosystem.
          </p>
        </div>

        {/* Filters and Export Button */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Timeframe selector pill container */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200/20">
            {(['Today', '7D', '30D', '6M', '1Y'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setSelectedRange(range);
                  showToast(`Viewing data set for ${range}`, 'info');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200
                  ${selectedRange === range 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export Report Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-white bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-95 transition-all text-xs font-bold shadow-md shadow-blue-500/10 shrink-0"
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

      {/* 2. Key Metrics Row (Matching mockup 100%) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Total Earnings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex flex-col justify-between h-42 relative hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100/10">
                {activeMetrics.earnings.badge}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {activeMetrics.earnings.value}
            </h2>
          </div>
          
          {/* Custom SVG Sparkline for Earnings */}
          <div className="w-full h-12 mt-4 overflow-hidden rounded-b-lg">
            <svg viewBox="0 0 120 40" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="earnSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0 40 L ${activeMetrics.earnings.sparklinePoints.map((p, i) => `${(i / (activeMetrics.earnings.sparklinePoints.length - 1)) * 120} ${40 - p * 0.35}`).join(' L ')} L 120 40 Z`}
                fill="url(#earnSpark)"
              />
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                points={activeMetrics.earnings.sparklinePoints.map((p, i) => `${(i / (activeMetrics.earnings.sparklinePoints.length - 1)) * 120},${40 - p * 0.35}`).join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Metric 2: Bid Acceptance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex flex-col justify-between h-42 relative hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bid Acceptance</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-[#FF7A00] text-[10px] font-bold border border-orange-100/10">
                {activeMetrics.bids.badge}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {activeMetrics.bids.value}
            </h2>
          </div>
          
          {/* Custom SVG Sparkline for Bid Acceptance */}
          <div className="w-full h-12 mt-4 overflow-hidden rounded-b-lg">
            <svg viewBox="0 0 120 40" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bidSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0 40 L ${activeMetrics.bids.sparklinePoints.map((p, i) => `${(i / (activeMetrics.bids.sparklinePoints.length - 1)) * 120} ${40 - p * 0.35}`).join(' L ')} L 120 40 Z`}
                fill="url(#bidSpark)"
              />
              <polyline
                fill="none"
                stroke="#FF7A00"
                strokeWidth="2"
                points={activeMetrics.bids.sparklinePoints.map((p, i) => `${(i / (activeMetrics.bids.sparklinePoints.length - 1)) * 120},${40 - p * 0.35}`).join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Metric 3: Profile Views */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex flex-col justify-between h-42 relative hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Views</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-100/10">
                {activeMetrics.views.badge}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {activeMetrics.views.value}
            </h2>
          </div>
          
          {/* Custom SVG Sparkline for Profile Views */}
          <div className="w-full h-12 mt-4 overflow-hidden rounded-b-lg">
            <svg viewBox="0 0 120 40" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="viewSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M 0 40 L ${activeMetrics.views.sparklinePoints.map((p, i) => `${(i / (activeMetrics.views.sparklinePoints.length - 1)) * 120} ${40 - p * 0.35}`).join(' L ')} L 120 40 Z`}
                fill="url(#viewSpark)"
              />
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                points={activeMetrics.views.sparklinePoints.map((p, i) => `${(i / (activeMetrics.views.sparklinePoints.length - 1)) * 120},${40 - p * 0.35}`).join(' ')}
              />
            </svg>
          </div>
        </div>

        {/* Metric 4: Average Rating (Fully completed & detailed rating interactive card) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs flex flex-col justify-between h-42 relative hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            
            <div className="flex items-baseline gap-2 mt-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {activeMetrics.rating.value}
              </h2>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">/ 5.0</span>
            </div>

            {/* Simulated mini star distribution review line */}
            <div className="mt-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  ))}
                </span>
                <span>89 Vetted Reviews</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: '94%' }} />
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 mt-1 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% authenticated client responses</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Analytical Growth Plot & Rating Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Big Interactive Graph */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Progression Plot</h3>
              <p className="text-[10px] text-slate-400 font-medium">Hover over any coordinate node to track exact performance metrics</p>
            </div>

            {/* Custom chart subtabs selector */}
            <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setActiveChartTab('earnings')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors
                  ${activeChartTab === 'earnings' 
                    ? 'bg-emerald-500 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Earnings
              </button>
              <button
                onClick={() => setActiveChartTab('bids')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors
                  ${activeChartTab === 'bids' 
                    ? 'bg-orange-500 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Bid Success %
              </button>
              <button
                onClick={() => setActiveChartTab('views')}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors
                  ${activeChartTab === 'views' 
                    ? 'bg-blue-500 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                Profile Views
              </button>
            </div>
          </div>

          {/* SVG Interactive Chart Canvas */}
          <div className="relative w-full overflow-hidden select-none">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto text-slate-400 dark:text-slate-700 font-mono"
            >
              <defs>
                <linearGradient id={getTabGradientId()} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getTabColor()} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={getTabColor()} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.2" />
              <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.2" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="currentColor" strokeOpacity="0.2" />

              {/* Grid Labels Left (Y) */}
              <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" className="text-[9px] font-bold fill-slate-400">
                {activeChartTab === 'earnings' ? `$${Math.round(maxVal / 1.1).toLocaleString()}` : activeChartTab === 'bids' ? '100%' : Math.round(maxVal / 1.1)}
              </text>
              <text x={paddingX - 10} y={chartHeight / 2 + 4} textAnchor="end" className="text-[9px] font-bold fill-slate-400">
                {activeChartTab === 'earnings' ? `$${Math.round(maxVal / 2.2).toLocaleString()}` : activeChartTab === 'bids' ? '50%' : Math.round(maxVal / 2.2)}
              </text>
              <text x={paddingX - 10} y={chartHeight - paddingY + 4} textAnchor="end" className="text-[9px] font-bold fill-slate-400">0</text>

              {/* Area path for shading */}
              <polygon
                points={areaPointsString}
                fill={`url(#${getTabGradientId()})`}
                className="transition-all duration-300"
              />

              {/* Main Line path */}
              <polyline
                fill="none"
                stroke={getTabColor()}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
                className="transition-all duration-300"
              />

              {/* Coordinate interactive Hover Circles */}
              {activeDetailedChart.map((d, idx) => {
                const x = paddingX + (idx / (activeDetailedChart.length - 1)) * (chartWidth - paddingX * 2);
                const y = chartHeight - paddingY - ((d.value - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
                return (
                  <g 
                    key={idx}
                    onMouseEnter={() => setHoveredDataIdx(idx)}
                    onMouseLeave={() => setHoveredDataIdx(null)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={hoveredDataIdx === idx ? "7" : "4.5"}
                      fill="#FFFFFF"
                      stroke={getTabColor()}
                      strokeWidth={hoveredDataIdx === idx ? "4" : "2.5"}
                      className="transition-all duration-150"
                    />
                    {/* Tiny invisible circle for larger hover boundary */}
                    <circle cx={x} cy={y} r="18" fill="transparent" />
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
                    className="text-[9px] font-bold fill-slate-400"
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
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute p-3 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md rounded-xl text-white text-xs border border-slate-800 shadow-2xl space-y-1 z-20 pointer-events-none"
                  style={{
                    left: `${Math.max(10, Math.min(85, (hoveredDataIdx / (activeDetailedChart.length - 1)) * 100))}%`,
                    top: '15%'
                  }}
                >
                  <p className="text-[10px] text-slate-400 font-semibold uppercase font-mono tracking-wider">
                    {activeDetailedChart[hoveredDataIdx].label}
                  </p>
                  <p className="text-sm font-extrabold font-mono flex items-center gap-1.5">
                    {activeChartTab === 'earnings' && <span className="text-emerald-400">+${activeDetailedChart[hoveredDataIdx].value.toLocaleString()}</span>}
                    {activeChartTab === 'bids' && <span className="text-orange-400">{activeDetailedChart[hoveredDataIdx].value}% Accept</span>}
                    {activeChartTab === 'views' && <span className="text-blue-400">{activeDetailedChart[hoveredDataIdx].value} Views</span>}
                  </p>
                  <p className="text-[9px] text-slate-500 font-medium">SLA ledger verification confirmed</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column - Rating Breakdown, Vetting Score & Conversions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Vetting Competency Scoreboard (Highlights Alex's Senior profile) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs text-left space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FF7A00]" />
                Cognitive Vetting Scores
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Alex Rivera's verified expert developer metrics</p>
            </div>

            <div className="space-y-4">
              {/* Technical Architecture */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Technical Architecture</span>
                  <span className="text-[#2563EB] font-bold">96 / 100</span>
                </div>
                <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF7A00] to-[#2563EB] h-full rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              {/* DevSecOps Compliance */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">DevSecOps Compliance</span>
                  <span className="text-[#2563EB] font-bold">94 / 100</span>
                </div>
                <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF7A00] to-[#2563EB] h-full rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              {/* SLA Execution Speed */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">SLA Deliveries On Time</span>
                  <span className="text-[#2563EB] font-bold">100%</span>
                </div>
                <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF7A00] to-[#2563EB] h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Client Review Consensus */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Client Net Promoter Score</span>
                  <span className="text-[#2563EB] font-bold">98 / 100</span>
                </div>
                <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FF7A00] to-[#2563EB] h-full rounded-full" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Business Lead Funnel */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Pipeline Conversion Funnel
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Visitor-to-contract engagement ratios</p>
            </div>

            <div className="space-y-2.5 pt-1 font-mono text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">1. Profile Views</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">1,248</span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center ml-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">2. Bids Placed</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">45</span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center ml-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">3. Shortlisted</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">22</span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl flex justify-between items-center ml-9">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">4. Contracts Won</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">15</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-xl border border-emerald-100/10 flex justify-between items-center text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Proposal-to-Win Conversion</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">33.3%</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Service Fee Ledger & Subscription Plans Estimator */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xs space-y-6 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-orange-500" />
              Service Fee Ledger & Plan Calculator
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Calculate your exact service fees, compare plans, and maximize your contract earnings</p>
          </div>
          <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-100 dark:border-slate-850">
            <button
              onClick={() => { setSelectedTier('Starter'); showToast('Starter plan selected (10% standard fee)', 'info'); }}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${selectedTier === 'Starter' ? 'bg-[#FF7A00] text-white shadow-xs' : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Starter (10%)
            </button>
            <button
              onClick={() => { setSelectedTier('Pro'); showToast('Pro plan selected (5% premium fee)', 'info'); }}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${selectedTier === 'Pro' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Pro (5%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Block - Estimator Slider */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">Expected Project Value (INR)</span>
                <span className="font-mono font-extrabold text-[#FF7A00] text-sm">₹{calculatorEarnings.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={calculatorEarnings}
                onChange={(e) => setCalculatorEarnings(parseInt(e.target.value))}
                className="w-full accent-orange-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹5,000</span>
                <span>₹1,00,000</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                <p className="text-[10px] text-slate-400 font-semibold mb-1 font-sans">Gross Earning</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">₹{calculatorEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl">
                <p className="text-[10px] text-slate-400 font-semibold mb-1 font-sans">Service Fee ({selectedTier === 'Starter' ? '10%' : '5%'})</p>
                <p className="text-sm font-extrabold text-red-500">-₹{Math.round(calculatorEarnings * (selectedTier === 'Starter' ? 0.10 : 0.05)).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50/20 border border-emerald-100/10 rounded-xl">
                <p className="text-[10px] text-emerald-600 font-semibold mb-1 font-sans">Net Payout</p>
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">₹{Math.round(calculatorEarnings * (selectedTier === 'Starter' ? 0.90 : 0.95)).toLocaleString()}</p>
              </div>
            </div>

            {/* Savings Badge */}
            {selectedTier === 'Starter' && (
              <div className="p-3.5 bg-blue-50/40 dark:bg-blue-950/10 rounded-xl border border-blue-100/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <span className="text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                  Upgrade to Pro to save ₹{(calculatorEarnings * 0.05).toLocaleString()} on this contract!
                </span>
                <button 
                  onClick={() => { setSelectedTier('Pro'); showToast('Upgraded simulation to Pro membership!', 'success'); }}
                  className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Simulate Pro
                </button>
              </div>
            )}
          </div>

          {/* Right Block - Subscription Tier Toggles */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex flex-col justify-between space-y-4">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                <span>Active Plan: <span className="text-orange-500">Starter Tier</span></span>
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px]">₹0/mo</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                You are currently on our Starter tier. Upgrade your professional profile to <strong className="text-blue-600 dark:text-blue-400">Pro Tier</strong> to unlock 5% service fees (saving 50% compared to Starter), priority dispatch, highlighted vetting badges, and early access to enterprise budget projects.
              </p>
            </div>
            
            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-850 flex items-center justify-between text-xs font-bold">
              <div>
                <span className="text-slate-400 text-[10px]">PRO PRICE</span>
                <p className="text-slate-950 dark:text-white text-md font-extrabold">₹499<span className="text-[10px] text-slate-400 font-normal">/mo</span></p>
              </div>
              <button 
                onClick={() => showToast('Upgraded Alex Rivera to Pro membership tier! Secure payment complete.', 'success')}
                className="px-4 py-2 bg-[#FF7A00] hover:bg-orange-600 text-white rounded-xl transition-all shadow-md active:scale-95 text-xs font-bold"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
