export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  bio?: string;
  role: 'admin' | 'manager' | 'developer';
  fullName: string;
  isActive: boolean;
}

export interface Project {
  _id: string;
  name: string;
  key: string;
  description?: string;
  owner: User;
  members: ProjectMember[];
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
  taskCounts: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
  };
  taskStatusOptions: string[];
  createdAt: string;
  updatedAt: string;
  taskCategory: string[];
}

export interface ProjectMember {
  user: User;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  taskNumber: number;
  taskId: string;
  project: string | Project;
  assignee?: User;
  reporter: User;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  dueDate?: string;
  estimatedHours?: number;
  loggedHours: number;
  attachments: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskAttachment {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: User;
  uploadedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  task: string;
  mentions: User[];
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  type: 'task_assigned' | 'task_mentioned' | 'task_status_changed' | 'comment_added' | 'project_invited';
  title: string;
  message: string;
  relatedTask?: Task;
  relatedProject?: Project;
  relatedUser?: User;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
}