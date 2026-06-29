import api from './axios';

export interface CreateContractPayload {
  projectId: string;
  freelancerId: string;
  bidId?: string;
  agreedBudget: number;
  deadline?: string;
}

export const contractApi = {
  getAll: async () => {
    const response = await api.get('/contracts');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  create: async (payload: CreateContractPayload) => {
    const response = await api.post('/contracts', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<CreateContractPayload>) => {
    const response = await api.put(`/contracts/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: string, status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    const response = await api.put(`/contracts/${id}/status`, { status });
    return response.data;
  }
};

export default contractApi;
