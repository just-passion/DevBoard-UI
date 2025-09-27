import { api } from './apiClient';

export const taskService = {
  getTasksByProject: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response;
  },
  
  getTask: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response;
  },
  
  createTask: async (taskData: any) => {
    const response = await api.post('/tasks', taskData);
    return response;
  },
  
  updateTask: async (taskId: string, taskData: any) => {
    const response = await api.patch(`/tasks/${taskId}`, taskData);
    return response;
  },
  
  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response;
  },

  updateTaskStatus: async (taskId: string, status: string) => {
    const response = await api.patch(`/tasks/${taskId}`, { status });
    return response;
  },

  getTaskComments: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response;
  },

  addTaskComment: async (taskId: string, content: string) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response;
  },

  uploadTaskAttachment: async (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  deleteTaskAttachment: async (taskId: string, attachmentId: string) => {
    const response = await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return response;
  },

  logTime: async (taskId: string, hours: number, description?: string) => {
    const response = await api.post(`/tasks/${taskId}/time-log`, { 
      hours, 
      description,
      date: new Date().toISOString() 
    });
    return response;
  },

  getTaskTimeLog: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/time-log`);
    return response;
  },
};