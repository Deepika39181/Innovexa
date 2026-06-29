import api from './axios';

export const analyticsApi = {
  getClientAnalytics: async () => {
    const response = await api.get('/client/analytics');
    return response.data;
  }
};

export default analyticsApi;
