import api from './axios';

export interface CreateBidPayload {
  amount: number;
  deliveryDays: number;
  proposal: string;
}

export const bidApi = {
  create: async (projectId: string, payload: CreateBidPayload) => {
    const response = await api.post(`/bids/project/${projectId}/bids`, payload);
    return response.data;
  },

  getProjectBids: async (projectId: string) => {
    const response = await api.get(`/bids/project/${projectId}/bids`);
    return response.data;
  },

  getMyBids: async () => {
    const response = await api.get('/bids/my-bids');
    return response.data;
  },

  update: async (id: string, payload: Partial<CreateBidPayload>) => {
    const response = await api.put(`/bids/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: string, status: 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED') => {
    const response = await api.put(`/bids/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/bids/${id}`);
    return response.data;
  }
};

export default bidApi;
