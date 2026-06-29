import api from "./axios";

export interface FundEscrowPayload {
  contractId: string;
  amount: number;
  paymentMethod?: string;
}

export interface WithdrawPayload {
  amount: number;
  details?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
  };
}

const paymentApi = {
  // Client
  fundEscrow: async (payload: FundEscrowPayload) => {
    const response = await api.post("/payments/fund", payload);
    return response.data;
  },

  // Client
  releaseEscrow: async (paymentId: string) => {
    const response = await api.post("/payments/release", {
      paymentId,
    });

    return response.data;
  },

  // Freelancer
  withdraw: async (payload: WithdrawPayload) => {
    const response = await api.post("/payments/withdraw", payload);

    return response.data;
  },

  // Client/Freelancer/Admin
  getHistory: async () => {
    const response = await api.get("/payments/history");

    return response.data;
  },

  // Freelancer
  getEarnings: async () => {
    const response = await api.get("/payments/earnings");

    return response.data;
  },

  // Invoice
  getInvoice: async (id: string) => {
    const response = await api.get(`/payments/invoice/${id}`);

    return response.data;
  },
};

export default paymentApi;