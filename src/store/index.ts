import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import chatbotReducer from './slices/chatbotSlice.js';
import contractorReducer from './slices/contractorSlice.js';
import { errorMiddleware } from './middleware/errorMiddleware';
import { apiMiddleware } from './middleware/apiMiddleware';

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
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                ],
                ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
                ignoredPaths: ['items.dates'],
            },
            // Enable immutability and serializability checks in development
            immutableCheck: {
                warnAfter: 128,
            },
        })
        .concat(errorMiddleware)
        .concat(apiMiddleware),
    
    // Enable Redux DevTools in development
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;