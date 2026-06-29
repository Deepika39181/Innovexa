import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Bid, Contract, Milestone, Message, Notification, Transaction, RefundRequest, Dispute, UserRole } from '../types';
import { getSocket, connectSocket, disconnectSocket } from '../lib/socket';

interface AppContextType {
  // Navigation & Role State
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  
  // Auth state
  authStep: 'login' | 'register' | 'forgot' | 'role_select' | 'authenticated';
  setAuthStep: (step: 'login' | 'register' | 'forgot' | 'role_select' | 'authenticated') => void;
  selectedRegisterRole: 'client' | 'freelancer' | null;
  setSelectedRegisterRole: (role: 'client' | 'freelancer' | null) => void;
  
  // Real Database Authenticated State
  user: any | null;
  setUser: (user: any | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (userData: any) => Promise<boolean>;
  logoutUser: () => void;
  
  // App Data
  projects: Project[];
  bids: Bid[];
  contracts: Contract[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  notifications: Notification[];
  transactions: Transaction[];
  refundRequests: RefundRequest[];
  disputes: Dispute[];
  verificationQueue: { id: string; name: string; title: string; avatar: string; status: 'Pending' | 'Approved' | 'Rejected' }[];
  
  // Selected Objects
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedBidId: string | null;
  setSelectedBidId: (id: string | null) => void;
  selectedContractId: string | null;
  setSelectedContractId: (id: string | null) => void;
  
  // Actions
  addProject: (p: Omit<Project, 'id' | 'bidsCount' | 'viewsCount' | 'client'>) => void;
  addBid: (b: Omit<Bid, 'id' | 'status'>) => void;
  updateBidStatus: (bidId: string, status: 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected') => void;
  addMessage: (text: string, codeSnippet?: string, attachmentName?: string) => void;
  addNotification: (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  markNotificationsRead: () => void;
  releaseEscrow: (contractId: string, milestoneId: string) => void;
  disputeMilestone: (contractId: string, milestoneId: string, clientStatement: string, freelancerStatement: string) => void;
  resolveDispute: (disputeId: string, decision: 'release' | 'refund') => void;
  approveRefundRequest: (id: string) => void;
  rejectRefundRequest: (id: string) => void;
  approveVerification: (id: string) => void;
  rejectVerification: (id: string) => void;
  deleteFlaggedProject: (projectId: string) => void;
  
  // Modals & Toasts
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  confirmModal: { title: string; message: string; onConfirm: () => void; isOpen: boolean } | null;
  showConfirm: (title: string, msg: string, onConfirm: () => void) => void;
  closeConfirm: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role State
  const [role, setRole] = useState<UserRole>('public');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<'login' | 'register' | 'forgot' | 'role_select' | 'authenticated'>('login');
  const [selectedRegisterRole, setSelectedRegisterRole] = useState<'client' | 'freelancer' | null>(null);

  // Real Database Authenticated State
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Socket.io Real-Time connection management
  useEffect(() => {
    if (user && user.id) {
      connectSocket(user.id);
      const socket = getSocket();

      // General fallback room for instant messaging in demo mode
      socket.emit('join_conversation', 'general_chat');

      // Listen for incoming messages in real-time
      socket.on('receive_message', (msg: any) => {
        setMessages(prev => {
          // Check if message already exists (idempotency)
          if (prev.some(m => m.id === msg.id)) return prev;

          const mappedMessage: Message = {
            id: msg.id,
            senderId: msg.senderId || 'sender-id',
            senderName: msg.senderName || 'Anonymous',
            senderAvatar: msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            senderRole: msg.senderRole || (msg.senderId?.includes('client') ? 'client' : 'freelancer'),
            text: msg.content || msg.text,
            timestamp: 'Today ' + new Date(msg.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            codeSnippet: msg.codeSnippet,
            attachmentName: msg.attachmentName
          };
          return [...prev, mappedMessage];
        });
      });

      // Listen for real-time notification alerts
      socket.on('receive_notification', (notif: any) => {
        setNotifications(prev => {
          // Check if notification already exists (idempotency)
          if (prev.some(n => n.id === notif.id)) return prev;

          const mappedNotif: Notification = {
            id: notif.id,
            title: notif.title,
            description: notif.message,
            time: 'Just now',
            type: notif.type?.toLowerCase() === 'message' ? 'info' : notif.type?.toLowerCase() === 'payment' ? 'success' : 'info',
            read: notif.isRead || false
          };
          return [mappedNotif, ...prev];
        });
        showToast(`🔔 Alert: ${notif.title} - ${notif.message}`, 'info');
      });

      return () => {
        socket.off('receive_message');
        socket.off('receive_notification');
        disconnectSocket();
      };
    } else {
      disconnectSocket();
    }
  }, [user]);

  // Selected Objects
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Modals & Toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void; isOpen: boolean } | null>(null);

  // High-fidelity Dummy Projects matching screen specifications
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      title: 'AI Model Training Pipeline',
      description: 'Infrastructure setup for large-scale data ingestion and model training using PyTorch. Seeking an expert DevOps specialist to configure cluster resources, logging, and metrics pipelines.',
      budget: 12500,
      type: 'Fixed',
      category: 'Software Dev',
      client: { name: 'Sarah Chen', company: 'Enterprise Client', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
      status: 'In Progress',
      tags: ['AI/ML', 'Docker', 'AWS', 'Python'],
      deadline: 'Due in 4 days',
      bidsCount: 14,
      viewsCount: 420
    },
    {
      id: 'proj-2',
      title: 'Brand Evolution Strategy',
      description: 'Complete redesign of corporate identity across all products and marketing channels. Deliverable includes brand guidelines, asset packages, and full digital design specifications.',
      budget: 8200,
      type: 'Fixed',
      category: 'Design & Creative',
      client: { name: 'Sarah Chen', company: 'Enterprise Client', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
      status: 'Reviewing Bids',
      tags: ['Branding', 'UI/UX Design', 'Figma'],
      deadline: 'Expiring Today',
      bidsCount: 8,
      viewsCount: 420
    },
    {
      id: 'proj-3',
      title: 'Security Audit & Compliance',
      description: 'Annual penetration testing and SOC2 compliance audit preparation. Requires highly specialized cybersecurity engineers with proven enterprise audit experience.',
      budget: 15000,
      type: 'Fixed',
      category: 'Software Dev',
      client: { name: 'Sarah Chen', company: 'Enterprise Client', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
      status: 'Contracting',
      tags: ['Security', 'SOC2', 'Compliance'],
      deadline: 'Contract Signed',
      bidsCount: 3,
      viewsCount: 89
    },
    {
      id: 'proj-4',
      title: 'Enterprise AI Dashboard Redesign',
      description: 'Looking for an expert UI/UX designer with experience in complex data visualization. Redesigning a high-traffic trading and data monitoring platform with real-time analytics integrations.',
      budget: 4500,
      type: 'Fixed',
      category: 'Design & Creative',
      client: { name: 'Sarah Jenkins', company: 'CloudCore Corp', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
      status: 'Open',
      tags: ['Figma', 'Atomic Design', 'Fintech'],
      deadline: 'Due in 14 days',
      bidsCount: 12,
      viewsCount: 156
    },
    {
      id: 'proj-5',
      title: 'Cloud Infrastructure Audit',
      description: 'Need a senior cloud architect to review our current AWS setup for security, scalability, and cost optimization. Comprehensive report with actionable recommendations required.',
      budget: 95,
      type: 'Hourly',
      rate: '$95/hr',
      category: 'Software Dev',
      client: { name: 'Orbit Tech Inc', company: 'Orbit Tech', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150' },
      status: 'Open',
      tags: ['AWS', 'Terraform', 'Security Compliance'],
      deadline: 'Ongoing',
      bidsCount: 5,
      viewsCount: 94
    },
    {
      id: 'proj-6',
      title: 'React Native E-commerce App',
      description: 'Fintech startup looking to launch their first mobile application. High emphasis on pixel-perfect UI, seamless payment gateway integrations, and fluid micro-animations.',
      budget: 12000,
      type: 'Fixed',
      category: 'Software Dev',
      client: { name: 'Vector Dynamics', company: 'Vector Dynamics', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
      status: 'Open',
      tags: ['React Native', 'Mobile', 'Tailwind'],
      deadline: 'Due in 30 days',
      bidsCount: 19,
      viewsCount: 312
    },
    // Flagged projects for admin
    {
      id: 'proj-flagged-1',
      title: 'AI Content Engine',
      description: 'Bypassing subscription limitations to scrape content from news portals. Highly automated crawler built using Python and Selenium.',
      budget: 2000,
      type: 'Fixed',
      category: 'Software Dev',
      client: { name: 'Suspect User', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' },
      status: 'Reported',
      tags: ['Python', 'Scraping'],
      deadline: 'Flagged',
      bidsCount: 2,
      viewsCount: 15,
      flagReason: 'Copyright Violation',
      reportedBy: 'TechNexus Inc.'
    },
    {
      id: 'proj-flagged-2',
      title: 'Blockchain Ledger Wrapper',
      description: 'Masking payments and mixing transaction inputs for complete anonymity. Specialized smart contracts deploying on mainnets.',
      budget: 18000,
      type: 'Fixed',
      category: 'Software Dev',
      client: { name: 'Anon Client', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
      status: 'Reported',
      tags: ['Solidity', 'Blockchain'],
      deadline: 'Flagged',
      bidsCount: 1,
      viewsCount: 42,
      flagReason: 'Payment Fraud',
      reportedBy: 'System Audit'
    },
    {
      id: 'proj-flagged-3',
      title: 'UX Design Audit',
      description: 'Scraping competitor website layouts and creating direct mirrors. High fidelity reproduction of full customer flows.',
      budget: 3500,
      type: 'Fixed',
      category: 'Design & Creative',
      client: { name: 'Mirror Works', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      status: 'Reported',
      tags: ['Figma', 'UI/UX'],
      deadline: 'Flagged',
      bidsCount: 0,
      viewsCount: 12,
      flagReason: 'Policy Breach',
      reportedBy: 'Sarah Jenkins'
    }
  ]);

  // High-fidelity Dummy Bids
  const [bids, setBids] = useState<Bid[]>([
    {
      id: 'bid-1',
      projectId: 'proj-2',
      freelancerName: 'Marcus Chen',
      freelancerTitle: 'Cloud Infrastructure Specialist',
      freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      freelancerRating: 4.9,
      freelancerReviews: 124,
      bidAmount: 3800,
      deliveryTime: 12,
      proposalText: 'I’ve successfully migrated 40+ legacy systems to AWS and Azure environments. My approach focuses on zero-downtime deployment and cost optimization using infrastructure-as-code (Terraform). I will provide clean, thoroughly documented cloud setups.',
      status: 'Pending',
      tags: ['AWS Expert', 'Terraform', 'Security Compliance']
    },
    {
      id: 'bid-2',
      projectId: 'proj-2',
      freelancerName: 'Elena Rodriguez',
      freelancerTitle: 'DevOps Architect',
      freelancerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      freelancerRating: 5.0,
      freelancerReviews: 89,
      bidAmount: 4500,
      deliveryTime: 10,
      proposalText: 'Efficiency is my primary metric. I will automate your entire migration pipeline using custom CI/CD workflows, reducing the transition timeline by at least 30% compared to traditional methods.',
      status: 'Shortlisted',
      tags: ['Docker', 'Kubernetes', 'CI/CD Expert']
    },
    {
      id: 'bid-3',
      projectId: 'proj-2',
      freelancerName: 'David Miller',
      freelancerTitle: 'Senior Systems Integrator',
      freelancerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      freelancerRating: 4.7,
      freelancerReviews: 210,
      bidAmount: 3200,
      deliveryTime: 18,
      proposalText: 'My focus is on reliability and exhaustive documentation. I provide a complete hand-off package including disaster recovery protocols and staff training sessions.',
      status: 'Pending',
      tags: ['Legacy Systems', 'Documentation', 'Hybrid Cloud']
    }
  ]);

  // High-fidelity Contracts & Milestones matching screens
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 'cont-1',
      projectId: 'proj-1',
      projectTitle: 'Enterprise AI Integration Architecture',
      clientName: 'Global InnoTech Solutions',
      freelancerName: 'Alex Rivera',
      freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      totalValue: 12500,
      startDate: 'Oct 12, 2023',
      endDate: 'Jan 20, 2024',
      status: 'Active',
      progress: 45,
      milestones: [
        {
          id: 'm-1',
          title: 'Initial Discovery & Requirements',
          budget: 2500,
          status: 'Completed',
          dueDate: 'Completed Oct 15',
          percentage: 20,
          invoiceNumber: '#8812',
          completedDate: 'Oct 15, 2023'
        },
        {
          id: 'm-2',
          title: 'API Core Development',
          budget: 5000,
          status: 'In Progress',
          dueDate: 'Due Nov 30',
          percentage: 45
        },
        {
          id: 'm-3',
          title: 'Frontend Dashboard Integration',
          budget: 3000,
          status: 'Locked',
          dueDate: 'Awaiting prior milestone',
          percentage: 25
        },
        {
          id: 'm-4',
          title: 'Deployment & QA',
          budget: 2000,
          status: 'Locked',
          dueDate: 'Final testing phase',
          percentage: 10
        }
      ]
    }
  ]);

  // Messages matching screens
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      senderId: 'client-sarah',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      senderRole: 'client',
      text: 'Hi there! I’ve just uploaded the project brief for the Innovexa rebranding. Could you take a look at the core requirements?',
      timestamp: 'Yesterday 4:12 PM',
      attachmentName: 'Project_Brief_V2.pdf'
    },
    {
      id: 'm-2',
      senderId: 'freelancer-alex',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      senderRole: 'freelancer',
      text: 'Reviewing it right now. The scope looks well-defined. I particularly like the focus on the "Modern Corporate" aesthetic.',
      timestamp: 'Yesterday 4:15 PM'
    },
    {
      id: 'm-3',
      senderId: 'client-sarah',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      senderRole: 'client',
      text: 'Great! Exactly, I’ll prioritize the font hierarchies as discussed. Here’s a quick code snippet for the layout skeleton I’m proposing:',
      timestamp: 'Yesterday 4:20 PM',
      codeSnippet: `<div class="grid grid-cols-12 gap-8">\n  <aside class="col-span-3 h-full">...</aside>\n  <main class="col-span-9">...</main>\n</div>`
    }
  ]);

  // Notifications matching system state
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n-1',
      title: 'New Bid Received',
      description: 'Marcus Chen submitted a bid of $3,800 on "Brand Evolution Strategy".',
      time: '12m ago',
      type: 'info',
      read: false
    },
    {
      id: 'n-2',
      title: 'Milestone Submitted',
      description: 'Alex Rivera submitted work for "API Core Development". Review needed.',
      time: '2h ago',
      type: 'warning',
      read: false
    },
    {
      id: 'n-3',
      title: 'Payment Released',
      description: '$2,500 successfully released from escrow to Alex Rivera.',
      time: '1d ago',
      type: 'success',
      read: true
    }
  ]);

  // Transactions matching dashboard screen (Wallet)
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '#TX-94821',
      description: 'Web App Architecture - Milestone 2 Release',
      user: 'Alex Smith',
      date: 'Oct 24, 2023',
      amount: 4500,
      status: 'SUCCESS',
      type: 'release'
    },
    {
      id: '#TX-94819',
      description: 'Brand Identity Suite - Escrow Hold',
      user: 'Jane Doe',
      date: 'Oct 24, 2023',
      amount: -12400,
      status: 'FAILED',
      type: 'escrow'
    },
    {
      id: '#TX-94815',
      description: 'UI Design Polish - Project Cancellation',
      user: 'Ryan K.',
      date: 'Oct 23, 2023',
      amount: 850,
      status: 'REFUNDED',
      type: 'refund'
    },
    {
      id: '#TX-94812',
      description: 'Bank Transfer - Fund Addition',
      user: 'Maria Lopez',
      date: 'Oct 23, 2023',
      amount: 10000,
      status: 'SUCCESS',
      type: 'deposit'
    }
  ]);

  // Refund requests for Admin
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: 'ref-1',
      clientName: 'Sarah Jenkins',
      projectName: 'Brand Evolution Strategy',
      amount: 1200,
      reason: 'Deliverables did not meet the agreed-upon technical requirements and milestones were missed.',
      status: 'Pending'
    },
    {
      id: 'ref-2',
      clientName: 'Orbit Tech Inc.',
      projectName: 'Security Audit & Compliance',
      amount: 450,
      reason: 'Duplicate payment occurred due to system lag during checkout processing.',
      status: 'Pending'
    },
    {
      id: 'ref-3',
      clientName: 'Vector Dynamics',
      projectName: 'React Native E-commerce App',
      amount: 5500,
      reason: 'Freelancer missed the final delivery milestone without prior notification or approval.',
      status: 'Pending'
    }
  ]);

  // Disputes matching admin dispute center screen
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 'disp-1',
      projectId: 'proj-1',
      projectTitle: 'AI-Driven Analytics Portal',
      clientName: 'GlobalTech Corp',
      freelancerName: 'Alex Chen',
      milestoneTitle: 'Milestone #4 Hold',
      amount: 1200,
      clientStatement: 'Deliverables do not match the initial scope of work defined in Milestone 2. Multiple screens are missing key database integrations.',
      freelancerStatement: 'The client requested 3 additional revisions not included in the original agreement, extending work beyond the agreed-upon scope.',
      status: 'Active'
    },
    {
      id: 'disp-2',
      projectId: 'proj-3',
      projectTitle: 'Contract Breach Review',
      clientName: 'NexusLab',
      freelancerName: 'Sarah Jenkins',
      milestoneTitle: 'Final Launch Delivery',
      amount: 4500,
      clientStatement: 'The freelancer missed critical API latency benchmarks specified in the performance SLAs.',
      freelancerStatement: 'AWS server outages on the client credentials side blocked completion testing for three continuous business days.',
      status: 'Active'
    }
  ]);

  // Freelancers awaiting approval for Admin Screen
  const [verificationQueue, setVerificationQueue] = useState([
    {
      id: 'ver-1',
      name: 'Elena Vance',
      title: 'Senior Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status: 'Pending' as const
    },
    {
      id: 'ver-2',
      name: 'David Sterling',
      title: 'Security Consultant',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'Pending' as const
    },
    {
      id: 'ver-3',
      name: 'Maya Rodriguez',
      title: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      status: 'Pending' as const
    }
  ]);

  // Trigger HTML class for Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load actual active projects and database data
  const loadAllUserData = async (currentToken?: string) => {
    const actToken = currentToken || token || localStorage.getItem('token');
    try {
      // 1. Fetch Projects (Publicly accessible)
      const res = await fetch('/api/projects');
      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'success' && json.data && json.data.projects) {
          const apiProjects = json.data.projects.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            budget: p.budget,
            type: p.budget > 500 ? 'Fixed' : 'Hourly',
            rate: p.budget > 500 ? undefined : `$${p.budget}/hr`,
            category: p.category || 'Software Dev',
            client: {
              name: p.client?.name || 'Sarah Chen',
              company: p.client?.companyName || 'Enterprise Client',
              avatar: p.client?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
            },
            status: p.status === 'OPEN' ? 'Open' : p.status === 'IN_PROGRESS' ? 'In Progress' : 'Open',
            tags: p.skills || [],
            deadline: p.deadline ? `Due in ${Math.ceil((new Date(p.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days` : 'Ongoing',
            bidsCount: p._count?.bids || 0,
            viewsCount: 42
          }));
          
          if (apiProjects.length > 0) {
            setProjects(prev => {
              const apiIds = new Set(apiProjects.map((ap: any) => ap.id));
              const filteredPrev = prev.filter(p => !apiIds.has(p.id));
              return [...apiProjects, ...filteredPrev];
            });
          }
        }
      }

      if (!actToken) return;

      // 2. Fetch Bids based on role
      const storedRole = role || (user?.role?.toLowerCase() as UserRole);
      if (storedRole === 'freelancer') {
        const bidsRes = await fetch('/api/bids/my-bids', {
          headers: { 'Authorization': `Bearer ${actToken}` }
        });
        if (bidsRes.ok) {
          const json = await bidsRes.json();
          if (json && json.status === 'success' && json.data?.bids) {
            const apiBids = json.data.bids.map((b: any) => ({
              id: b.id,
              projectId: b.projectId,
              freelancerName: b.freelancer?.name || 'Alex Rivera',
              freelancerTitle: 'Senior Dev',
              freelancerAvatar: b.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              freelancerRating: 4.9,
              freelancerReviews: 12,
              bidAmount: b.amount,
              deliveryTime: b.deliveryDays,
              proposalText: b.proposal,
              status: (b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase()) as any,
              tags: b.freelancer?.skills || []
            }));
            setBids(apiBids);
          }
        }
      } else if (storedRole === 'client') {
        const myProjRes = await fetch('/api/projects/client/my-projects', {
          headers: { 'Authorization': `Bearer ${actToken}` }
        });
        if (myProjRes.ok) {
          const json = await myProjRes.json();
          if (json && json.status === 'success') {
            const rawProjects = Array.isArray(json.data) ? json.data : (json.data?.projects || []);
            const myProjIds = rawProjects.map((p: any) => p.id);
            const allBids: any[] = [];
            for (const pId of myProjIds) {
              const bidRes = await fetch(`/api/bids/project/${pId}/bids`, {
                headers: { 'Authorization': `Bearer ${actToken}` }
              });
              if (bidRes.ok) {
                const bJson = await bidRes.json();
                if (bJson && bJson.status === 'success') {
                  const rawBids = Array.isArray(bJson.data) ? bJson.data : (bJson.data?.bids || []);
                  rawBids.forEach((b: any) => {
                    allBids.push({
                      id: b.id,
                      projectId: b.projectId,
                      freelancerName: b.freelancer?.name || 'Independent Partner',
                      freelancerTitle: b.freelancer?.title || 'Senior Dev',
                      freelancerAvatar: b.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                      freelancerRating: b.freelancer?.rating || 4.9,
                      freelancerReviews: b.freelancer?.reviewsCount || 10,
                      bidAmount: b.amount,
                      deliveryTime: b.deliveryDays,
                      proposalText: b.proposal,
                      status: b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase(),
                      tags: b.freelancer?.skills || []
                    });
                  });
                }
              }
            }
            setBids(allBids);
          }
        }
      }

      // 3. Fetch Contracts
      const contractsRes = await fetch('/api/contracts', {
        headers: { 'Authorization': `Bearer ${actToken}` }
      });
      if (contractsRes.ok) {
        const json = await contractsRes.json();
        if (json && json.status === 'success' && json.data?.contracts) {
          const apiContracts = json.data.contracts.map((c: any) => ({
            id: c.id,
            projectId: c.projectId,
            projectTitle: c.project?.title || 'Contracted Project',
            clientName: c.client?.name || 'Sarah Chen',
            freelancerName: c.freelancer?.name || 'Alex Rivera',
            freelancerAvatar: c.freelancer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            totalValue: c.totalValue,
            startDate: new Date(c.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            endDate: new Date(c.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: c.status.charAt(0).toUpperCase() + c.status.slice(1).toLowerCase(),
            progress: c.progress || 0,
            milestones: (c.milestones || []).map((m: any) => ({
              id: m.id,
              title: m.title,
              budget: m.budget,
              status: m.status === 'APPROVED' ? 'Completed' : m.status === 'IN_PROGRESS' ? 'In Progress' : 'Locked',
              dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'TBD',
              percentage: m.percentage || 30
            }))
          }));
          setContracts(apiContracts);
        }
      }

      // 4. Fetch Notifications
      const notifRes = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${actToken}` }
      });
      if (notifRes.ok) {
        const json = await notifRes.json();
        if (json && json.status === 'success' && json.data?.notifications) {
          const apiNotifs = json.data.notifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            description: n.description,
            time: 'Just now',
            type: n.type.toLowerCase() === 'message' ? 'info' : n.type.toLowerCase() === 'payment' ? 'success' : 'info',
            read: n.read
          }));
          setNotifications(apiNotifs);
        }
      }

      // 5. Fetch Disputes
      const disputeRes = await fetch('/api/disputes', {
        headers: { 'Authorization': `Bearer ${actToken}` }
      });
      if (disputeRes.ok) {
        const json = await disputeRes.json();
        if (json && json.status === 'success' && json.data?.disputes) {
          const apiDisputes = json.data.disputes.map((d: any) => ({
            id: d.id,
            projectId: d.projectId,
            projectTitle: d.project?.title || 'Dispute',
            clientName: d.client?.name || 'Client',
            freelancerName: d.freelancer?.name || 'Freelancer',
            milestoneTitle: 'Milestone Hold',
            amount: d.amount,
            clientStatement: d.clientStatement || d.description || '',
            freelancerStatement: d.freelancerStatement || '',
            status: d.status === 'OPEN' ? 'Active' : d.status === 'RESOLVED' ? 'Resolved_Released' : 'Active'
          }));
          setDisputes(apiDisputes);
        }
      }

      // 6. Fetch Conversations & Messages
      const convRes = await fetch('/api/conversations', {
        headers: { 'Authorization': `Bearer ${actToken}` }
      });
      if (convRes.ok) {
        const json = await convRes.json();
        if (json && json.status === 'success' && json.data && json.data.length > 0) {
          const firstConv = json.data[0];
          setActiveConversationId(firstConv.id);
          
          // Join socket room
          const socket = getSocket();
          if (socket && socket.connected) {
            socket.emit('join_conversation', firstConv.id);
          }

          const msgRes = await fetch(`/api/conversations/${firstConv.id}/messages`, {
            headers: { 'Authorization': `Bearer ${actToken}` }
          });
          if (msgRes.ok) {
            const msgJson = await msgRes.json();
            if (msgJson && msgJson.status === 'success' && msgJson.data) {
              const apiMessages = msgJson.data.map((m: any) => ({
                id: m.id,
                senderId: m.senderId,
                senderName: m.sender?.name || 'User',
                senderAvatar: m.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                senderRole: m.senderId === user?.id ? (role === 'client' ? 'client' : 'freelancer') : (role === 'client' ? 'freelancer' : 'client'),
                text: m.content,
                timestamp: 'Today ' + new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                attachmentName: m.attachment || undefined
              }));
              setMessages(apiMessages);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch database synced records:', err);
    }
  };

  // Restore Session and load active projects from API on mount
  useEffect(() => {
    const restoreSessionAndLoad = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          const json = await res.json();
          if (res.ok && json.status === 'success' && json.data?.user) {
            setUser(json.data.user);
            setToken(storedToken);
            setRole(json.data.user.role.toLowerCase() as UserRole);
            setAuthStep('authenticated');
            setActiveTab('dashboard');
            await loadAllUserData(storedToken);
            return;
          } else {
            // Token expired or invalid
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.warn('Could not restore session from server, using offline state.', err);
        }
      }
      await loadAllUserData();
    };
    restoreSessionAndLoad();
  }, []);

  // Sync when token/role changes
  useEffect(() => {
    if (token) {
      loadAllUserData();
    }
  }, [token, role]);

  // Auth Operations
  const loginUser = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        const data = json.data;
        localStorage.setItem('token', data.accessToken);
        setToken(data.accessToken);
        setUser(data.user);
        
        const userRole = data.user.role.toLowerCase() as UserRole;
        setRole(userRole);
        setAuthStep('authenticated');
        setActiveTab('dashboard');
        
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return true;
      } else {
        showToast(json.message || 'Login failed. Please check your credentials.', 'error');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast('Connection to server failed.', 'error');
      return false;
    }
  };

  const registerUser = async (userData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        const data = json.data;
        localStorage.setItem('token', data.accessToken);
        setToken(data.accessToken);
        setUser(data.user);
        
        const userRole = data.user.role.toLowerCase() as UserRole;
        setRole(userRole);
        setAuthStep('authenticated');
        setActiveTab('dashboard');
        
        showToast(`Account created! Welcome, ${data.user.name}.`, 'success');
        return true;
      } else {
        showToast(json.message || 'Registration failed.', 'error');
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      showToast('Connection to server failed.', 'error');
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setRole('public');
    setAuthStep('login');
    setActiveTab('home');
    showToast('Logged out successfully.', 'info');
  };

  // Toast Timer helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Confirmation Modal helper
  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ title, message, onConfirm, isOpen: true });
  };

  const closeConfirm = () => {
    if (confirmModal) {
      setConfirmModal({ ...confirmModal, isOpen: false });
    }
  };

  // Action: Add Project (Post Project Form) - Fully Connected to Backend API
  const addProject = async (p: Omit<Project, 'id' | 'bidsCount' | 'viewsCount' | 'client'>) => {
    const newProject: Project = {
      ...p,
      id: `proj-${Date.now()}`,
      bidsCount: 0,
      viewsCount: 1,
      client: {
        name: user?.name || 'Sarah Chen',
        company: 'Enterprise Client',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
      }
    };
    setProjects([newProject, ...projects]);
    showToast('Project posted successfully!', 'success');

    try {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({
            title: p.title,
            description: p.description,
            budget: p.budget,
            category: p.category,
            skills: p.tags || [],
            remote: true
          })
        });
        loadAllUserData(currentToken);
      }
    } catch (err) {
      console.warn('Could not sync new project to the backend database API:', err);
    }
  };

  // Action: Add Bid (Place Bid) - Fully Connected to Backend API
  const addBid = async (b: Omit<Bid, 'id' | 'status'>) => {
    const newBid: Bid = {
      ...b,
      id: `bid-${Date.now()}`,
      status: 'Pending'
    };
    setBids([newBid, ...bids]);
    // increment project bids count
    setProjects(projects.map(proj => {
      if (proj.id === b.projectId) {
        return { ...proj, bidsCount: proj.bidsCount + 1 };
      }
      return proj;
    }));
    showToast('Proposal submitted successfully!', 'success');

    try {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        await fetch(`/api/bids/project/${b.projectId}/bids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({
            amount: b.bidAmount,
            proposal: b.proposalText,
            deliveryDays: b.deliveryTime
          })
        });
        loadAllUserData(currentToken);
      }
    } catch (err) {
      console.warn('Could not sync new bid to the backend database API:', err);
    }
  };

  // Action: Accept / Reject Bids
  const updateBidStatus = (bidId: string, status: 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected') => {
    setBids(bids.map(bid => {
      if (bid.id === bidId) {
        if (status === 'Accepted') {
          // If accepted, let's create a Contract for this project
          const proj = projects.find(p => p.id === bid.projectId);
          if (proj) {
            const newContract: Contract = {
              id: `cont-${Date.now()}`,
              projectId: proj.id,
              projectTitle: proj.title,
              clientName: proj.client.name,
              freelancerName: bid.freelancerName,
              freelancerAvatar: bid.freelancerAvatar,
              totalValue: bid.bidAmount,
              startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              endDate: '30 days from now',
              status: 'Active',
              progress: 10,
              milestones: [
                { id: 'm-new-1', title: 'Phase 1 Core Blueprint', budget: Math.round(bid.bidAmount * 0.3), status: 'In Progress', dueDate: 'In 10 days', percentage: 30 },
                { id: 'm-new-2', title: 'Phase 2 Custom Core Features', budget: Math.round(bid.bidAmount * 0.4), status: 'Locked', dueDate: 'In 20 days', percentage: 40 },
                { id: 'm-new-3', title: 'Phase 3 Deliver & Review', budget: Math.round(bid.bidAmount * 0.3), status: 'Locked', dueDate: 'In 30 days', percentage: 30 }
              ]
            };
            setContracts([newContract, ...contracts]);
            // Update project status to In Progress
            setProjects(projects.map(p => p.id === proj.id ? { ...p, status: 'In Progress' } : p));
          }
        }
        return { ...bid, status };
      }
      return bid;
    }));
    showToast(`Proposal status updated to ${status}.`, 'info');

    // Sync to Backend
    try {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        const backendStatus = status.toUpperCase();
        fetch(`/api/bids/${bidId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({ status: backendStatus })
        }).then(() => loadAllUserData(currentToken));
      }
    } catch (err) {
      console.warn('Could not sync updated bid status to the backend database:', err);
    }
  };

  // Action: Send Message
  const addMessage = (text: string, codeSnippet?: string, attachmentName?: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || (role === 'client' ? 'client-sarah' : 'freelancer-alex'),
      senderName: user?.name || (role === 'client' ? 'Sarah Jenkins' : 'Alex Rivera'),
      senderAvatar: user?.avatar || (role === 'client' ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
      senderRole: role === 'client' ? 'client' : 'freelancer',
      text,
      timestamp: 'Today ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      codeSnippet,
      attachmentName
    };
    setMessages(prev => [...prev, newMessage]);

    // Emit live WebSocket message for other players/users if connected
    try {
      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit('send_message', {
          conversationId: activeConversationId || 'general_chat',
          id: newMessage.id,
          senderId: newMessage.senderId,
          senderName: newMessage.senderName,
          senderAvatar: newMessage.senderAvatar,
          senderRole: newMessage.senderRole,
          text: newMessage.text,
          codeSnippet,
          attachmentName,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Socket emit warning inside addMessage:', err);
    }

    // Sync to Database
    if (activeConversationId && token) {
      fetch(`/api/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: text + (codeSnippet ? `\n\nCode snippet:\n${codeSnippet}` : ''),
          attachment: attachmentName || null
        })
      }).catch(err => console.warn('Could not sync message to backend db:', err));
    }
  };

  const addNotification = (title: string, desc: string, type: 'info' | 'success' | 'warning' | 'error') => {
    setNotifications([
      {
        id: `n-${Date.now()}`,
        title,
        description: desc,
        time: 'Just now',
        type,
        read: false
      },
      ...notifications
    ]);
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Action: Escrow Releases (For Client approving milestone)
  const releaseEscrow = (contractId: string, milestoneId: string) => {
    setContracts(contracts.map(cont => {
      if (cont.id === contractId) {
        let updatedMilestones = cont.milestones.map(mile => {
          if (mile.id === milestoneId) {
            // Log transaction
            const newTx: Transaction = {
              id: `#TX-${Math.floor(10000 + Math.random() * 90000)}`,
              description: `${cont.projectTitle} - ${mile.title} Released`,
              user: cont.freelancerName,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              amount: mile.budget,
              status: 'SUCCESS',
              type: 'release'
            };
            setTransactions([newTx, ...transactions]);
            return { ...mile, status: 'Completed' as const, completedDate: new Date().toLocaleDateString() };
          }
          return mile;
        });
        
        // Unlock next locked milestone if exists
        const completedIndex = updatedMilestones.findIndex(m => m.id === milestoneId);
        if (completedIndex !== -1 && completedIndex + 1 < updatedMilestones.length) {
          if (updatedMilestones[completedIndex + 1].status === 'Locked') {
            updatedMilestones[completedIndex + 1].status = 'In Progress';
          }
        }

        // recalculate overall progress
        const completedBudget = updatedMilestones.filter(m => m.status === 'Completed').reduce((sum, m) => sum + m.budget, 0);
        const progressPercent = Math.round((completedBudget / cont.totalValue) * 100);

        return {
          ...cont,
          progress: progressPercent,
          milestones: updatedMilestones,
          status: progressPercent === 100 ? ('Completed' as const) : cont.status
        };
      }
      return cont;
    }));
    showToast('Milestone approved & funds released from escrow!', 'success');

    // Sync to Backend Milestone approval
    try {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        fetch(`/api/milestones/${milestoneId}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          }
        }).then(() => loadAllUserData(currentToken));
      }
    } catch (err) {
      console.warn('Could not sync milestone approval to backend database:', err);
    }
  };

  // Action: Dispute a Milestone
  const disputeMilestone = (contractId: string, milestoneId: string, clientStatement: string, freelancerStatement: string) => {
    setContracts(contracts.map(cont => {
      if (cont.id === contractId) {
        return {
          ...cont,
          status: 'Disputed' as const
        };
      }
      return cont;
    }));

    const contract = contracts.find(c => c.id === contractId);
    const milestone = contract?.milestones.find(m => m.id === milestoneId);

    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      projectId: contract?.projectId || 'unknown',
      projectTitle: contract?.projectTitle || 'Project Dispute',
      clientName: contract?.clientName || 'Client',
      freelancerName: contract?.freelancerName || 'Freelancer',
      milestoneTitle: milestone?.title || 'Milestone Dispute',
      amount: milestone?.budget || 1000,
      clientStatement,
      freelancerStatement,
      status: 'Active'
    };

    setDisputes([newDispute, ...disputes]);
    showToast('Dispute opened. System Administrators will review this shortly.', 'info');

    // Sync to Backend Disputes API
    try {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        fetch('/api/disputes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({
            reason: 'Milestone Conflict',
            description: clientStatement || freelancerStatement,
            contractId,
            projectId: contract?.projectId
          })
        }).then(() => loadAllUserData(currentToken));
      }
    } catch (err) {
      console.warn('Could not sync dispute creation to backend database:', err);
    }
  };

  // Action: Resolve Dispute (Admin decision)
  const resolveDispute = (disputeId: string, decision: 'release' | 'refund') => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    setDisputes(disputes.map(disp => disp.id === disputeId ? { ...disp, status: (decision === 'release' ? 'Resolved_Released' : 'Resolved_Refunded') as any } : disp));
    
    // Find contract and update
    const contract = contracts.find(c => c.projectId === dispute.projectId);
    if (contract) {
      setContracts(contracts.map(cont => {
        if (cont.id === contract.id) {
          const updatedMilestones = cont.milestones.map(m => {
            if (m.title === dispute.milestoneTitle) {
              return { ...m, status: decision === 'release' ? ('Completed' as const) : ('In Progress' as const) };
            }
            return m;
          });
          return {
            ...cont,
            status: decision === 'release' ? 'Active' : 'Active', // back to active
            milestones: updatedMilestones
          };
        }
        return cont;
      }));
    }

    // Add financial log
    const newTx: Transaction = {
      id: `#TX-${Math.floor(10000 + Math.random() * 90000)}`,
      description: `Dispute Resolution - ${dispute.projectTitle} (${decision.toUpperCase()})`,
      user: decision === 'release' ? dispute.freelancerName : dispute.clientName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: dispute.amount,
      status: 'SUCCESS',
      type: decision === 'release' ? 'release' : 'refund'
    };
    setTransactions([newTx, ...transactions]);

    showToast(`Dispute resolved. Funds ${decision === 'release' ? 'released to freelancer' : 'refunded to client'}.`, 'success');

    // Sync to Backend Admin Resolve Dispute
    try {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        fetch(`/api/disputes/admin/disputes/${disputeId}/resolve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({
            resolution: `Admin resolution: ${decision.toUpperCase()}`,
            triggerRefund: decision === 'refund'
          })
        }).then(() => loadAllUserData(currentToken));
      }
    } catch (err) {
      console.warn('Could not sync dispute resolution to backend database:', err);
    }
  };

  // Action: Approve Refund Request (Admin)
  const approveRefundRequest = (id: string) => {
    const refund = refundRequests.find(r => r.id === id);
    if (!refund) return;

    setRefundRequests(refundRequests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));

    // Log transaction
    const newTx: Transaction = {
      id: `#TX-${Math.floor(10000 + Math.random() * 90000)}`,
      description: `Refund Approved - ${refund.projectName}`,
      user: refund.clientName,
      date: new Date().toLocaleDateString(),
      amount: refund.amount,
      status: 'SUCCESS',
      type: 'refund'
    };
    setTransactions([newTx, ...transactions]);
    showToast('Refund request approved successfully.', 'success');
  };

  // Action: Reject Refund Request (Admin)
  const rejectRefundRequest = (id: string) => {
    setRefundRequests(refundRequests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    showToast('Refund request rejected.', 'info');
  };

  // Action: Verification approvals (Admin)
  const approveVerification = (id: string) => {
    setVerificationQueue(verificationQueue.map(v => v.id === id ? { ...v, status: 'Approved' as any } : v));
    const vName = verificationQueue.find(v => v.id === id)?.name;
    showToast(`Approved identity verification for ${vName}.`, 'success');
  };

  const rejectVerification = (id: string) => {
    setVerificationQueue(verificationQueue.map(v => v.id === id ? { ...v, status: 'Rejected' as any } : v));
    const vName = verificationQueue.find(v => v.id === id)?.name;
    showToast(`Rejected identity verification for ${vName}.`, 'error');
  };

  // Action: Delete/Remove reported project (Admin)
  const deleteFlaggedProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    showToast('Flagged project successfully removed from registry.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        isDarkMode,
        setIsDarkMode,
        authStep,
        setAuthStep,
        selectedRegisterRole,
        setSelectedRegisterRole,
        projects,
        bids,
        contracts,
        messages,
        setMessages,
        notifications,
        transactions,
        refundRequests,
        disputes,
        verificationQueue,
        activeConversationId,
        setActiveConversationId,
        selectedProjectId,
        setSelectedProjectId,
        selectedBidId,
        setSelectedBidId,
        selectedContractId,
        setSelectedContractId,
        addProject,
        addBid,
        updateBidStatus,
        addMessage,
        addNotification,
        markNotificationsRead,
        releaseEscrow,
        disputeMilestone,
        resolveDispute,
        approveRefundRequest,
        rejectRefundRequest,
        approveVerification,
        rejectVerification,
        deleteFlaggedProject,
        toast,
        showToast,
        confirmModal,
        showConfirm,
        closeConfirm,
        user,
        setUser,
        token,
        setToken,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
