import { UserRole as PrismaUserRole } from "@prisma/client";

// Frontend UI role values
export type FrontendUserRole = "public" | "client" | "freelancer" | "admin";

// Backend/Prisma role values
export type BackendUserRole = PrismaUserRole;
// CLIENT | FREELANCER | ADMIN

export const frontendToBackendRole = (
  role: FrontendUserRole
): BackendUserRole | null => {
  if (role === "client") return "CLIENT";
  if (role === "freelancer") return "FREELANCER";
  if (role === "admin") return "ADMIN";
  return null;
};

export const backendToFrontendRole = (
  role: BackendUserRole
): FrontendUserRole => {
  if (role === "CLIENT") return "client";
  if (role === "FREELANCER") return "freelancer";
  return "admin";
};

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  type: 'Fixed' | 'Hourly';
  rate?: string;
  category: string;
  client: {
    name: string;
    company?: string;
    avatar: string;
  };
  status: string;
  tags: string[];
  deadline: string;
  bidsCount: number;
  viewsCount: number;
  flagReason?: string;
  reportedBy?: string;
}

export interface Bid {
  id: string;
  projectId: string;
  freelancerName: string;
  freelancerTitle: string;
  freelancerAvatar: string;
  freelancerRating: number;
  freelancerReviews: number;
  bidAmount: number;
  deliveryTime: number;
  proposalText: string;
  status: 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected';
  tags: string[];
}

export interface Milestone {
  id: string;
  title: string;
  budget: number;
  status: 'Completed' | 'In Progress' | 'Locked';
  dueDate: string;
  percentage: number;
  invoiceNumber?: string;
  completedDate?: string;
}

export interface Contract {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  freelancerName: string;
  freelancerAvatar: string;
  totalValue: number;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  milestones: Milestone[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: 'client' | 'freelancer';
  text: string;
  timestamp: string;
  attachmentName?: string;
  codeSnippet?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  user: string;
  date: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  type: 'release' | 'escrow' | 'refund' | 'deposit';
}

export interface RefundRequest {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Dispute {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  freelancerName: string;
  milestoneTitle: string;
  amount: number;
  clientStatement: string;
  freelancerStatement: string;
  status: 'Active' | 'Resolved';
}

// Backend Auth Types
export interface AuthUser {
  id: string;
  email: string;
  role: BackendUserRole;
  isVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
