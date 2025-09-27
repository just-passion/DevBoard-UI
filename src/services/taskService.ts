import { api } from './apiClient';

export const taskService = {
  getTasksByProject: async (projectId: string) => {
    const res = await api.get(`/projects/${projectId}/tasks`);
    return res.data;
  },

  getTask: async (taskId: string) => {
    const res = await api.get(`/tasks/${taskId}`);
    return res.data;
  },

  createTask: async (taskData: any) => {
    const res = await api.post('/tasks', taskData);
    return res.data;
  },

  updateTask: async (taskId: string, taskData: any) => {
    const res = await api.put(`/tasks/${taskId}`, taskData);
    return res.data;
  },

  deleteTask: async (taskId: string) => {
    const res = await api.delete(`/tasks/${taskId}`);
    return res.data;
  },

  updateTaskStatus: async (taskId: string, status: string) => {
    const res = await api.patch(`/tasks/${taskId}/status`, { status });
    return res.data;
  },

  addComment: async (taskId: string, comment: { content: string }) => {
    const res = await api.post(`/tasks/${taskId}/comments`, comment);
    return res.data;
  },

  uploadAttachment: async (taskId: string, formData: FormData) => {
    const res = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  logTime: async (taskId: string, hours: number, description?: string) => {
    const res = await api.post(`/tasks/${taskId}/time-log`, {
      hours,
      description,
      date: new Date().toISOString(),
    });
    return res.data;
  },

  getTaskTimeLog: async (taskId: string) => {
    const res = await api.get(`/tasks/${taskId}/time-log`);
    return res.data;
  },
};
