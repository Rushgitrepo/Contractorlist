import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import chatbotReducer from './slices/chatbotSlice';
import contractorReducer from './slices/contractorSlice';
import { errorMiddleware } from './middleware/errorMiddleware';
import { apiMiddleware } from './middleware/apiMiddleware';

// Persist configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    // Only persist auth state (user session)
    whitelist: ['auth'],
};

// Combine reducers
const rootReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    chatbot: chatbotReducer,
    contractor: contractorReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
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
    
    // Enable Redux DevTools in development with enhanced options
    devTools: process.env.NODE_ENV !== 'production' && {
        name: 'ContractorList App',
        trace: true,
        traceLimit: 25,
    },
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;