import api from './axios';

export interface CreateProjectPayload {
  title: string;
  description: string;
  budget: number;
  category?: string;
  skills: string[];
  deadline?: string;
  experienceLevel?: string;
  duration?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  remote?: boolean;
  location?: string;
}

export const projectApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (payload: CreateProjectPayload) => {
    const response = await api.post('/projects', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<CreateProjectPayload>) => {
    const response = await api.put(`/projects/${id}`, payload);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  getMyProjects: async () => {
    const response = await api.get('/projects/client/my-projects');
    return response.data;
  },

  getSavedProjects: async () => {
    const response = await api.get('/projects/freelancer/saved');
    return response.data;
  },

  saveProject: async (id: string) => {
    const response = await api.post(`/projects/${id}/save`);
    return response.data;
  },

  unsaveProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}/save`);
    return response.data;
  }
};

export default projectApi;
