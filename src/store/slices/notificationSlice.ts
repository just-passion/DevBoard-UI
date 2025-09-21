import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService.ts';
import type { Notification } from '../../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const updated = await notificationService.markAsRead(notificationId);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
extraReducers: (builder) => {
  builder
    .addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchNotifications.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      const list = Array.isArray(payload) ? payload : [];         
      state.notifications = list;
      state.unreadCount = list.reduce((c, n) => c + (n?.isRead ? 0 : 1), 0);
    })
    .addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) ?? 'Failed to fetch notifications';
    })
    .addCase(markAsRead.fulfilled, (state, { payload }) => {
      const idx = state.notifications.findIndex(n => n._id === payload);
      if (idx !== -1) {
        const prev = state.notifications[idx];
        const next = { ...prev, isRead: true, readAt: new Date().toISOString() };
        state.notifications[idx] = next;
        if (!prev.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });
}
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;