import api from './axios';

export const talentApi = {
  getFreelancers: async (params?: any) => {
    // If there is an endpoint to list users/freelancers, otherwise fallback to mock/local list
    try {
      const response = await api.get('/users', { params: { ...params, role: 'FREELANCER' } });
      return response.data;
    } catch {
      return { status: 'success', data: [] };
    }
  },

  getSavedFreelancers: async () => {
    const response = await api.get('/client/saved-freelancers');
    return response.data;
  },

  saveFreelancer: async (id: string) => {
    const response = await api.post(`/client/save-freelancer/${id}`);
    return response.data;
  },

  unsaveFreelancer: async (id: string) => {
    const response = await api.delete(`/client/save-freelancer/${id}`);
    return response.data;
  }
};

export default talentApi;
