import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducer from './features/userSlice';
import trainerReducer from './features/trainerSlice';
import adminReducer from './features/adminSlice';

// Combine reducers before applying persistence
const rootReducer = combineReducers({
    user: userReducer,
    trainer: trainerReducer,
    admin: adminReducer
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'admin', 'trainer'] // These slices will be persisted
};

// Apply persistence to the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })
});

// Persistor
export const persistor = persistStore(store);
