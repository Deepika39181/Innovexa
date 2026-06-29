import api from './axios';

export const clientApi = {
  getDashboard: async () => {
    const response = await api.get('/client/dashboard');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/client/analytics');
    return response.data;
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
  },
};

export default clientApi;
