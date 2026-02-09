import api from './api';

export const chatService = {
    getConversations: async (limit = 50, offset = 0) => {
        const response = await api.get('/chat/conversations', { params: { limit, offset } });
        return response.data;
    },

    getMessages: async (conversationId: string, limit = 50, cursor?: string) => {
        const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
            params: { limit, cursor }
        });
        return response.data;
    },

    startDirect: async (userId: number) => {
        const response = await api.post('/chat/conversations/direct', { userId });
        return response.data;
    },

    createGroup: async (title: string, participantIds: number[]) => {
        const response = await api.post('/chat/conversations/group', { title, participantIds });
        return response.data;
    },

    ensureProjectConversation: async (projectId: string, participantIds: number[] = []) => {
        const response = await api.post(`/chat/projects/${projectId}/conversation`, { participantIds });
        return response.data;
    },

    sendMessage: async (conversationId: string, payload: { content?: string; attachments?: any[]; messageType?: string }) => {
        const response = await api.post(`/chat/conversations/${conversationId}/messages`, payload);
        return response.data;
    },

    deleteMessage: async (messageId: string) => {
        const response = await api.delete(`/chat/messages/${messageId}`);
        return response.data;
    },

    markRead: async (conversationId: string) => {
        const response = await api.post(`/chat/conversations/${conversationId}/read`);
        return response.data;
    },

    addParticipants: async (conversationId: string, userIds: number[]) => {
        const response = await api.post(`/chat/conversations/${conversationId}/participants`, { userIds });
        return response.data;
    },

    removeParticipant: async (conversationId: string, userId: number) => {
        const response = await api.delete(`/chat/conversations/${conversationId}/participants/${userId}`);
        return response.data;
    },

    getPotentialContacts: async (params?: any) => {
        const response = await api.get('/companies', { params });
        return response.data;
    },

    searchUsers: async (query: string) => {
        const response = await api.get('/chat/users/search', { params: { query } });
        return response.data;
    }
};

