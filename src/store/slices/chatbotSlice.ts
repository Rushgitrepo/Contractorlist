import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
    type?: 'text' | 'image' | 'file';
}

interface ChatbotState {
    isOpen: boolean;
    messages: Message[];
    isTyping: boolean;
    isLoading: boolean;
    error: string | null;
    currentConversationId: string | null;
}

const initialState: ChatbotState = {
    isOpen: false,
    messages: [
        {
            id: '1',
            text: "Hi! I'm your AI construction assistant. How can I help you today?",
            isBot: true,
            timestamp: new Date(),
            type: 'text',
        },
    ],
    isTyping: false,
    isLoading: false,
    error: null,
    currentConversationId: null,
};

// Async thunks
export const sendMessage = createAsyncThunk(
    'chatbot/sendMessage',
    async (message: string, { rejectWithValue }) => {
        try {
            // Simulate API call to AI service
            const response = await fetch('/api/chatbot/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            // For demo purposes, provide fallback responses
            // In production, this should properly reject with error
            console.warn('API not available, using fallback response');
            
            const responses = [
                "Thanks for your question! I'm here to help with construction projects, contractor recommendations, cost estimates, and more.",
                "I can assist you with finding qualified contractors, project planning, cost estimation, and construction best practices.",
                "Let me help you with that! What specific construction service or information are you looking for?",
                "I'm your AI construction expert. I can help with project management, contractor vetting, cost analysis, and technical guidance.",
            ];

            // Return fallback response (for demo mode only)
            return responses[Math.floor(Math.random() * responses.length)];
            
            // In production, uncomment this to properly handle errors:
            // return rejectWithValue(error instanceof Error ? error.message : 'Failed to send message');
        }
    }
);

export const loadConversationHistory = createAsyncThunk(
    'chatbot/loadConversationHistory',
    async (conversationId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/chatbot/conversation/${conversationId}`);

            if (!response.ok) {
                throw new Error('Failed to load conversation');
            }

            const data = await response.json();
            return data.messages;
        } catch (error) {
            return rejectWithValue('Failed to load conversation history');
        }
    }
);

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState,
    reducers: {
        openChatbot: (state) => {
            state.isOpen = true;
        },
        closeChatbot: (state) => {
            state.isOpen = false;
        },
        toggleChatbot: (state) => {
            state.isOpen = !state.isOpen;
        },
        addUserMessage: (state, action: PayloadAction<string>) => {
            const message: Message = {
                id: Date.now().toString(),
                text: action.payload,
                isBot: false,
                timestamp: new Date(),
                type: 'text',
            };
            state.messages.push(message);
        },
        addBotMessage: (state, action: PayloadAction<string>) => {
            const message: Message = {
                id: Date.now().toString(),
                text: action.payload,
                isBot: true,
                timestamp: new Date(),
                type: 'text',
            };
            state.messages.push(message);
        },
        setTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [
                {
                    id: '1',
                    text: "Hi! I'm your AI construction assistant. How can I help you today?",
                    isBot: true,
                    timestamp: new Date(),
                    type: 'text',
                },
            ];
        },
        setConversationId: (state, action: PayloadAction<string>) => {
            state.currentConversationId = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Send message
        builder
            .addCase(sendMessage.pending, (state) => {
                state.isTyping = true;
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isTyping = false;
                state.isLoading = false;
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: action.payload,
                    isBot: true,
                    timestamp: new Date(),
                    type: 'text',
                };
                state.messages.push(botMessage);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isTyping = false;
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Load conversation history
        builder
            .addCase(loadConversationHistory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loadConversationHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.messages = action.payload;
            })
            .addCase(loadConversationHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    openChatbot,
    closeChatbot,
    toggleChatbot,
    addUserMessage,
    addBotMessage,
    setTyping,
    clearMessages,
    setConversationId,
    clearError,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;