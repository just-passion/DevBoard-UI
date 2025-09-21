import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import projectReducer from './slices/projectSlice.ts';
import taskReducer from './slices/taskSlice.ts';
import notificationReducer from './slices/notificationSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    notifications: notificationReducer,
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