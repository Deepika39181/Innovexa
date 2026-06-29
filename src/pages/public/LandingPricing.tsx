import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, Star, Building, ShieldCheck, HelpCircle, ArrowRight, 
  ChevronDown, ChevronUp, Percent, Zap, Wallet, Coins, 
  MessageSquare, PhoneCall, Shield, Lock, Award, Briefcase, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type UserType = 'client' | 'freelancer';
type BillingCycle = 'monthly' | 'yearly';

export const LandingPricing: React.FC = () => {
  const { setRole, setAuthStep, setActiveTab, showToast } = useApp();
  const [userType, setUserType] = useState<UserType>('client');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleAction = (roleChoice: 'client' | 'freelancer', planName: string) => {
    showToast(`Redirecting to registration for ${planName} plan...`, 'info');
    setTimeout(() => {
      setRole(roleChoice);
      setAuthStep('register');
      setActiveTab('dashboard');
    }, 1000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const clientPlans = {
    monthly: [
      {
        name: 'Starter',
        price: '₹0',
        period: '/mo',
        desc: 'Ideal for small or trial projects needing fundamental support.',
        icon: RocketIcon,
        iconBg: 'bg-slate-100 text-slate-600',
        features: [
          'Post 3 projects',
          'Basic search access',
          'Basic chat functionality',
          'Standard email support'
        ],
        buttonText: 'Get Started',
        isPopular: false,
        buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
      },
      {
        name: 'Pro',
        price: '₹999',
        period: '/mo',
        desc: 'Perfect for growing businesses requiring fast turnarounds and elite talent.',
        icon: Star,
        iconBg: 'bg-orange-50 text-orange-600',
        features: [
          'Unlimited project posts',
          'Advanced talent filters',
          'Featured project badge',
          'Priority chat support',
          'Full escrow protection'
        ],
        buttonText: 'Select Pro',
        isPopular: true,
        buttonStyle: 'bg-[#C2410C] hover:bg-[#a1360a] text-white shadow-md shadow-orange-500/10'
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: ' Pricing',
        desc: 'Tailored solutions for large-scale operations and custom workflows.',
        icon: Building,
        iconBg: 'bg-blue-50 text-blue-600',
        features: [
          'Dedicated account manager',
          'Bulk hiring solutions',
          'Custom workflow integration',
          'Team access control'
        ],
        buttonText: 'Contact Sales',
        isPopular: false,
        buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
      }
    ],
    yearly: [
      {
        name: 'Starter',
        price: '₹0',
        period: '/mo',
        desc: 'Ideal for small or trial projects needing fundamental support.',
        icon: RocketIcon,
        iconBg: 'bg-slate-100 text-slate-600',
        features: [
          'Post 3 projects',
          'Basic search access',
          'Basic chat functionality',
          'Standard email support'
        ],
        buttonText: 'Get Started',
        isPopular: false,
        buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
      },
      {
        name: 'Pro',
        price: '₹799',
        period: '/mo',
        desc: 'Perfect for growing businesses requiring fast turnarounds and elite talent.',
        icon: Star,
        iconBg: 'bg-orange-50 text-orange-600',
        features: [
          'Unlimited project posts',
          'Advanced talent filters',
          'Featured project badge',
          'Priority chat support',
          'Full escrow protection'
        ],
        buttonText: 'Select Pro',
        isPopular: true,
        buttonStyle: 'bg-[#C2410C] hover:bg-[#a1360a] text-white shadow-md shadow-orange-500/10'
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: ' Pricing',
        desc: 'Tailored solutions for large-scale operations and custom workflows.',
        icon: Building,
        iconBg: 'bg-blue-50 text-blue-600',
        features: [
          'Dedicated account manager',
          'Bulk hiring solutions',
          'Custom workflow integration',
          'Team access control'
        ],
        buttonText: 'Contact Sales',
        isPopular: false,
        buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
      }
    ]
  };

  const freelancerPlans = {
    monthly: [
      {
        name: 'Starter',
        price: '₹0',
        period: '/mo',
        desc: 'Essential tools to find tasks and build initial client relations.',
        icon: RocketIcon,
        iconBg: 'bg-slate-100 text-slate-600',
        features: [
          'Apply to 15 bids/mo',
          'Standard profile placement',
          'Basic messaging capability',
          'Community support access'
        ],
        buttonText: 'Get Started',
        isPopular: false,
        buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
      },
      {
        name: 'Pro',
        price: '₹499',
        period: '/mo',
        desc: 'Elevate your freelance trajectory with premium tools and visibility.',
        icon: Star,
        iconBg: 'bg-orange-50 text-orange-600',
        features: [
          'Unlimited applications',
          'Highlighted profile badge',
          'Priority administrative support',
          'Early access to enterprise tasks',
          'Reduced 5% service fees'
        ],
        buttonText: 'Select Pro',
        isPopular: true,
        buttonStyle: 'bg-[#C2410C] hover:bg-[#a1360a] text-white shadow-md shadow-orange-500/10'
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: ' Pricing',
        desc: 'Bespoke packages for premium software agencies and studios.',
        icon: Building,
        iconBg: 'bg-blue-50 text-blue-600',
        features: [
          'Shared studio dashboard',
          'Dedicated agency manager',
          'Custom contract workflows',
          'Co-branded workspace interfaces'
        ],
        buttonText: 'Contact Sales',
        isPopular: false,
        buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
      }
    ],
    yearly: [
      {
        name: 'Starter',
        price: '₹0',
        period: '/mo',
        desc: 'Essential tools to find tasks and build initial client relations.',
        icon: RocketIcon,
        iconBg: 'bg-slate-100 text-slate-600',
        features: [
          'Apply to 15 bids/mo',
          'Standard profile placement',
          'Basic messaging capability',
          'Community support access'
        ],
        buttonText: 'Get Started',
        isPopular: false,
        buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
      },
      {
        name: 'Pro',
        price: '₹399',
        period: '/mo',
        desc: 'Elevate your freelance trajectory with premium tools and visibility.',
        icon: Star,
        iconBg: 'bg-orange-50 text-orange-600',
        features: [
          'Unlimited applications',
          'Highlighted profile badge',
          'Priority administrative support',
          'Early access to enterprise tasks',
          'Reduced 5% service fees'
        ],
        buttonText: 'Select Pro',
        isPopular: true,
        buttonStyle: 'bg-[#C2410C] hover:bg-[#a1360a] text-white shadow-md shadow-orange-500/10'
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        period: ' Pricing',
        desc: 'Bespoke packages for premium software agencies and studios.',
        icon: Building,
        iconBg: 'bg-blue-50 text-blue-600',
        features: [
          'Shared studio dashboard',
          'Dedicated agency manager',
          'Custom contract workflows',
          'Co-branded workspace interfaces'
        ],
        buttonText: 'Contact Sales',
        isPopular: false,
        buttonStyle: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200'
      }
    ]
  };

  const activePlans = userType === 'client' 
    ? clientPlans[billingCycle] 
    : freelancerPlans[billingCycle];

  const faqItems = [
    {
      q: 'Is there really a free plan?',
      a: 'Absolutely! Our Starter plan is 100% free with no monthly subscription charges. It allows clients to post up to 3 projects and access standard search capabilities, and freelancers to submit up to 15 bids monthly.'
    },
    {
      q: 'How does the escrow system work?',
      a: 'When a project begins, the client deposits the milestone budget into a secure escrow lock. The freelancer works on the milestone with guaranteed security. Funds are only released to the freelancer once the client reviews and explicitly approves the completed milestone deliverables.'
    },
    {
      q: 'Can I cancel my Pro subscription?',
      a: 'Yes, you can cancel your Pro membership at any time directly through your dashboard settings. You will retain all premium Pro features, badges, and benefits until the end of your current billing cycle.'
    },
    {
      q: 'What happens if there\'s a dispute?',
      a: 'In the rare case of a milestone disagreement, either party can initiate a formal dispute. Our dedicated 24/7 administration center will halt escrow release, review both parties\' contract specifications and uploaded deliverables, and provide a fair, legally compliant resolution within 48 hours.'
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-300 py-12 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Header with subtitlce & Hero title */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="inline-block">
          <span className="px-4 py-1.5 bg-orange-50 dark:bg-orange-950/30 text-[#C2410C] dark:text-orange-400 border border-orange-100 dark:border-orange-900/20 text-xs font-bold rounded-full">
            Flexible pricing for every project
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Simple, Transparent Pricing for <span className="text-[#C2410C]">Clients</span> and <span className="text-[#2563EB]">Freelancers</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your hiring or freelancing journey. No hidden charges, secure payments, and milestone-based escrow protection.
        </p>

        {/* Quick action buttons matching screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => handleAction('client', 'Starter')}
            className="px-6 py-3 bg-[#C2410C] hover:bg-[#a1360a] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/10 transition-all active:scale-95 cursor-pointer"
          >
            Start Hiring
          </button>
          <button 
            onClick={() => handleAction('freelancer', 'Starter')}
            className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-95 cursor-pointer"
          >
            Start Freelancing
          </button>
        </div>
      </div>

      {/* 2. Client vs Freelancer Toggle & Monthly/Yearly switch */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-4 border-b border-slate-100 dark:border-slate-850">
        
        {/* Toggle A: For Clients vs For Freelancers */}
        <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1.5">
          <button
            onClick={() => {
              setUserType('client');
              showToast('Showing pricing packages for enterprise & hiring clients', 'info');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              userType === 'client' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            For Clients
          </button>
          <button
            onClick={() => {
              setUserType('freelancer');
              showToast('Showing pricing packages for independent professionals', 'info');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              userType === 'freelancer' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            For Freelancers
          </button>
        </div>

        {/* Toggle B: Monthly vs Yearly */}
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-12 h-6.5 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors focus:outline-none"
          >
            <div 
              className={`absolute top-1 left-1 w-4.5 h-4.5 rounded-full bg-white transition-transform duration-300 ${
                billingCycle === 'yearly' ? 'transform translate-x-5.5 bg-[#C2410C]' : ''
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
            <span>Yearly</span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400 text-[10px] font-bold rounded-full">
              Save 20%
            </span>
          </span>
        </div>

      </div>

      {/* 3. 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {activePlans.map((plan, idx) => {
          const Icon = plan.icon;
          return (
            <div 
              key={plan.name}
              className={`bg-white dark:bg-slate-900 p-8 rounded-3xl border transition-all hover:shadow-2xl relative flex flex-col justify-between text-left ${
                plan.isPopular 
                  ? 'border-[#C2410C]/50 dark:border-[#C2410C]/50 shadow-xl shadow-orange-500/5 ring-2 ring-[#C2410C]/20' 
                  : 'border-slate-100 dark:border-slate-850'
              }`}
            >
              {/* Popular Tag */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C2410C] text-white text-[10px] font-extrabold tracking-widest uppercase rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${plan.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{plan.name}</h3>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-xs font-semibold text-slate-400">{plan.period}</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {plan.desc}
                </p>

                {/* Features List */}
                <ul className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-850">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${
                        plan.name === 'Enterprise' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' : 'bg-orange-100 text-[#C2410C] dark:bg-orange-950/40 dark:text-orange-400'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => handleAction(userType, plan.name)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer text-center ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 4. Commission & Service Fees section */}
      <div className="space-y-8 pt-6 border-t border-slate-50 dark:border-slate-850">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Commission & Service Fees
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            We keep it simple. Our fees support the infrastructure, security, and dispute resolution systems that keep you safe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card A: Service Fees */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 text-left flex gap-4 items-start shadow-xs">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-[#C2410C] rounded-xl shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">Service Fees</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Fixed 10% service fee on completed contracts. Pro members pay only 5%.
              </p>
            </div>
          </div>

          {/* Card B: Escrow Fees */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 text-left flex gap-4 items-start shadow-xs">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-[#2563EB] rounded-xl shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">Escrow Fees</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                ₹0 escrow protection fees for all clients and freelancers. Safety shouldn't cost extra.
              </p>
            </div>
          </div>

          {/* Card C: Withdrawal */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 text-left flex gap-4 items-start shadow-xs">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">Withdrawal</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Instant withdrawals via UPI or NEFT. Standard bank processing fees apply.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 5. Compare All Features Section */}
      <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-850 text-left">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Compare All Features</h2>
          <p className="text-xs text-slate-400">Examine features across standard, high-tier, and enterprise portfolios.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-extrabold bg-slate-50/50 dark:bg-slate-950/30">
                <th className="py-4 px-6">Features</th>
                <th className="py-4 px-6 text-center">Starter</th>
                <th className="py-4 px-6 text-center text-[#C2410C]">Pro</th>
                <th className="py-4 px-6 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
              
              {/* Row 1 */}
              <tr>
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">Project Posting / Bids</td>
                <td className="py-4 px-6 text-center text-slate-500">Limited</td>
                <td className="py-4 px-6 text-center text-slate-900 dark:text-white font-extrabold">Unlimited / 50+</td>
                <td className="py-4 px-6 text-center text-slate-500">Custom / Unlimited</td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">Real-time Chat</td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#C2410C]" />
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#C2410C]" />
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-blue-600" />
                </td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">Escrow Protection</td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#C2410C]" />
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#C2410C]" />
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-blue-600" />
                </td>
              </tr>

              {/* Row 4 */}
              <tr>
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">Advanced Analytics</td>
                <td className="py-4 px-6 text-center text-slate-300 dark:text-slate-700">&mdash;</td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#C2410C]" />
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-blue-600" />
                </td>
              </tr>

              {/* Row 5 */}
              <tr>
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">Featured Badges</td>
                <td className="py-4 px-6 text-center text-slate-300 dark:text-slate-700">&mdash;</td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#C2410C]" />
                </td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-blue-600" />
                </td>
              </tr>

              {/* Row 6 */}
              <tr>
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">Support Priority</td>
                <td className="py-4 px-6 text-center text-slate-500">Standard</td>
                <td className="py-4 px-6 text-center text-[#C2410C] font-extrabold">Priority</td>
                <td className="py-4 px-6 text-center text-blue-600 font-extrabold">24/7 Dedicated</td>
              </tr>

              {/* Row 7 */}
              <tr>
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">Team Collaboration</td>
                <td className="py-4 px-6 text-center text-slate-300 dark:text-slate-700">&mdash;</td>
                <td className="py-4 px-6 text-center text-slate-300 dark:text-slate-700">&mdash;</td>
                <td className="py-4 px-6 text-center">
                  <Check className="w-4 h-4 mx-auto text-blue-600" />
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Your Trust is Our Priority section */}
      <div className="space-y-8 pt-6 border-t border-slate-50 dark:border-slate-850">
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C2410C]">Safety Measures</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Your Trust is Our Priority</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Trust 1 */}
          <div className="bg-[#FAF5FF]/30 dark:bg-purple-950/5 p-6 rounded-2xl border border-[#FAF5FF] dark:border-purple-950/20 text-left space-y-3 shadow-xs">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl inline-block">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-950 dark:text-white">Secure Escrow</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Funds are held safely until you approve the work.
            </p>
          </div>

          {/* Trust 2 */}
          <div className="bg-[#FFF7ED]/30 dark:bg-orange-950/5 p-6 rounded-2xl border border-[#FFF7ED] dark:border-orange-950/20 text-left space-y-3 shadow-xs">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 text-[#C2410C] rounded-xl inline-block">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-950 dark:text-white">Milestone Release</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Pay only for milestones as they are achieved.
            </p>
          </div>

          {/* Trust 3 */}
          <div className="bg-[#F0FDF4]/30 dark:bg-emerald-950/5 p-6 rounded-2xl border border-[#F0FDF4] dark:border-emerald-950/20 text-left space-y-3 shadow-xs">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-950 dark:text-white">Refund Protection</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Full refund support for unfulfilled project terms.
            </p>
          </div>

          {/* Trust 4 */}
          <div className="bg-[#EFF6FF]/30 dark:bg-blue-950/5 p-6 rounded-2xl border border-[#EFF6FF] dark:border-blue-950/20 text-left space-y-3 shadow-xs">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/40 text-[#2563EB] rounded-xl inline-block">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-950 dark:text-white">Encrypted Core</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Bank-level 256-bit SSL encryption for data.
            </p>
          </div>

        </div>
      </div>

      {/* 7. Frequently Asked Questions Section (Accordions) */}
      <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-850 text-left max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Got questions? We have answers to standard queries on billing and escrow.</p>
        </div>

        <div className="space-y-3.5 pt-4">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl transition-all overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-6 flex justify-between items-center text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-50 dark:border-slate-850/50">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Call to Action Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1E3A8A] to-[#111827] text-white p-8 sm:p-12 text-center shadow-xl">
        <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to build your freelance journey?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
            Join 50,000+ businesses and elite freelancers already on Innovexa Catalyst.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleAction('client', 'Starter')}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#1E3A8A] text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              Sign Up as Client
            </button>
            <button
              onClick={() => handleAction('freelancer', 'Starter')}
              className="px-6 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#a1360a] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              Sign Up as Freelancer
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

// Simple Rocket icon representation since rocket is not standard in lucide-react or let's use a nice custom standard look with Briefcase or Cpu or similar
const RocketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-5 h-5" 
    {...props}
  >
    <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" />
    <path d="M12 2C6 2 2 6 2 12c0 .8.1 1.6.3 2.3 2.1-1.3 4.6-2.3 7.7-2.3 3.1 0 5.6 1 7.7 2.3.2-.7.3-1.5.3-2.3 0-6-4-10-10-10z" />
    <path d="M9 12V9c0-1.7 1.3-3 3-3h0c1.7 0 3 1.3 3 3v3" />
    <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z" />
  </svg>
);
