import api from "./axios";

export interface ConversationPayload {
  recipientId: string;
  projectId?: string;
  contractId?: string;
}

export interface SendMessagePayload {
  content: string;
  attachment?: string;
}

export const messageApi = {
  // Conversation List
  getConversations: async () => {
    const { data } = await api.get("/conversations");
    return data;
  },

  // Create/Open Conversation
  createConversation: async (payload: ConversationPayload) => {
    const { data } = await api.post("/conversations", payload);
    return data;
  },

  // Load Messages
  getMessages: async (conversationId: string) => {
    const { data } = await api.get(
      `/conversations/${conversationId}/messages`
    );
    return data;
  },

  // Send Message
  sendMessage: async (
    conversationId: string,
    payload: SendMessagePayload
  ) => {
    const { data } = await api.post(
      `/conversations/${conversationId}/messages`,
      payload
    );
    return data;
  },

  // Mark Read
  markAsRead: async (messageId: string) => {
    const { data } = await api.put(`/conversations/${messageId}/read`);
    return data;
  },
};

export default messageApi;