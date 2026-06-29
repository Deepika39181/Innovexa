import api from './axios';

export interface CreateReviewPayload {
  contractId: string;
  rating: number;
  comment: string;
}

export const reviewApi = {
  create: async (payload: CreateReviewPayload) => {
    const response = await api.post('/reviews', payload);
    return response.data;
  },

  getByUser: async (userId: string) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  }
};

export default reviewApi;
