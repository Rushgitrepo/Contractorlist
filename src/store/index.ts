import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import chatbotReducer from './slices/chatbotSlice.js';
import contractorReducer from './slices/contractorSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        chatbot: chatbotReducer,
        contractor: contractorReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;