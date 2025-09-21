import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// // src/api/apiClient.ts
// // 🔧 Mock API for your DevBoard UI (TypeScript)
// // Matches your interfaces: User, Project, ProjectMember, Task, TaskAttachment,
// // Comment, Notification, plus simple Auth/Project/Task state flows.

// // -------------------------------------------------------
// // Types (import your own interfaces if you already export them elsewhere)
// // -------------------------------------------------------
// export interface User {
//   _id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   avatar?: { url: string; publicId: string };
//   bio?: string;
//   role: "admin" | "manager" | "developer";
//   fullName: string;
//   isActive: boolean;
// }

// export interface ProjectMember {
//   user: User;
//   role: "owner" | "admin" | "member" | "viewer";
//   joinedAt: string;
// }

// export interface Project {
//   _id: string;
//   name: string;
//   key: string;
//   description?: string;
//   owner: User;
//   members: ProjectMember[];
//   status: "planning" | "active" | "on-hold" | "completed" | "archived";
//   taskCounts: { total: number; todo: number; inProgress: number; review: number; done: number };
//   taskStatusOptions: string[];
//   createdAt: string;
//   updatedAt: string;
//   taskCategory: string[];
// }

// export interface TaskAttachment {
//   _id: string;
//   filename: string;
//   originalName: string;
//   url: string;
//   size: number;
//   mimeType: string;
//   uploadedBy: User;
//   uploadedAt: string;
// }

// export interface Task {
//   _id: string;
//   title: string;
//   description?: string;
//   taskNumber: number;
//   taskId: string;
//   project: string | Project;
//   assignee?: User;
//   reporter: User;
//   status: "todo" | "in-progress" | "review" | "done";
//   priority: "low" | "medium" | "high" | "critical";
//   tags: string[];
//   dueDate?: string;
//   estimatedHours?: number;
//   loggedHours: number;
//   attachments: TaskAttachment[];
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Comment {
//   _id: string;
//   content: string;
//   author: User;
//   task: string; // task id
//   mentions: User[];
//   isEdited: boolean;
//   editedAt?: string;
//   createdAt: string;
// }

// export interface Notification {
//   _id: string;
//   type:
//     | "task_assigned"
//     | "task_mentioned"
//     | "task_status_changed"
//     | "comment_added"
//     | "project_invited";
//   title: string;
//   message: string;
//   relatedTask?: Task;
//   relatedProject?: Project;
//   relatedUser?: User;
//   isRead: boolean;
//   readAt?: string;
//   actionUrl?: string;
//   createdAt: string;
// }

// // -------------------------------------------------------
// // In-memory DB (mock)
// // -------------------------------------------------------
// const now = new Date();
// const iso = (d: Date) => d.toISOString();
// const hoursAgo = (h: number) => iso(new Date(now.getTime() - h * 3600 * 1000));
// const daysAgo = (d: number) => iso(new Date(now.getTime() - d * 24 * 3600 * 1000));

// const me: User = {
//   _id: "u_1",
//   email: "john.doe@example.com",
//   firstName: "John",
//   lastName: "Doe",
//   fullName: "John Doe",
//   role: "manager",
//   isActive: true,
//   avatar: { url: "https://i.pravatar.cc/120?img=12", publicId: "avatar_12" },
//   bio: "Building DevBoard. Coffee + TypeScript ☕",
// };

// const alice: User = {
//   _id: "u_2",
//   email: "alice.miller@example.com",
//   firstName: "Alice",
//   lastName: "Miller",
//   fullName: "Alice Miller",
//   role: "developer",
//   isActive: true,
//   avatar: { url: "https://i.pravatar.cc/120?img=5", publicId: "avatar_5" },
// };

// const sarah: User = {
//   _id: "u_3",
//   email: "sarah.kim@example.com",
//   firstName: "Sarah",
//   lastName: "Kim",
//   fullName: "Sarah Kim",
//   role: "admin",
//   isActive: true,
//   avatar: { url: "https://i.pravatar.cc/120?img=7", publicId: "avatar_7" },
// };

// const projects: Project[] = [
//   {
//     _id: "p_101",
//     name: "E-commerce Platform",
//     key: "ECOM-2024",
//     description: "Modern e-commerce platform (MERN).",
//     owner: me,
//     members: [
//       { user: me, role: "owner", joinedAt: daysAgo(90) },
//       { user: alice, role: "member", joinedAt: daysAgo(60) },
//       { user: sarah, role: "admin", joinedAt: daysAgo(75) },
//     ],
//     status: "active",
//     taskCounts: { total: 11, todo: 3, inProgress: 2, review: 1, done: 5 },
//     taskStatusOptions: ["todo", "in-progress", "review", "done"],
//     createdAt: daysAgo(120),
//     updatedAt: hoursAgo(2),
//     taskCategory: ["Backend", "Frontend", "Docs", "Integration", "Database"],
//   },
//   {
//     _id: "p_102",
//     name: "Mobile App Redesign",
//     key: "MOB-2024",
//     description: "Complete redesign for mobile app.",
//     owner: sarah,
//     members: [
//       { user: sarah, role: "owner", joinedAt: daysAgo(110) },
//       { user: me, role: "member", joinedAt: daysAgo(100) },
//     ],
//     status: "planning",
//     taskCounts: { total: 5, todo: 4, inProgress: 1, review: 0, done: 0 },
//     taskStatusOptions: ["todo", "in-progress", "review", "done"],
//     createdAt: daysAgo(115),
//     updatedAt: daysAgo(1),
//     taskCategory: ["Design", "Frontend"],
//   },
// ];

// const tasks: Task[] = [
//   {
//     _id: "t_1",
//     title: "User Authentication",
//     description: "Implement login/signup flow with JWT and OAuth (GitHub).",
//     taskNumber: 1,
//     taskId: "ECOM-2024-AUTH-001",
//     project: "p_101",
//     assignee: me,
//     reporter: sarah,
//     status: "todo",
//     priority: "high",
//     tags: ["Backend", "Security"],
//     dueDate: daysAgo(-5), // in 5 days
//     estimatedHours: 16,
//     loggedHours: 2,
//     attachments: [],
//     createdAt: daysAgo(14),
//     updatedAt: daysAgo(2),
//   },
//   {
//     _id: "t_2",
//     title: "API Documentation",
//     description: "Document REST endpoints for user and product flows.",
//     taskNumber: 2,
//     taskId: "ECOM-2024-DOCS-002",
//     project: "p_101",
//     assignee: sarah,
//     reporter: me,
//     status: "todo",
//     priority: "medium",
//     tags: ["Docs"],
//     loggedHours: 0,
//     attachments: [],
//     createdAt: daysAgo(12),
//     updatedAt: daysAgo(3),
//   },
//   {
//     _id: "t_3",
//     title: "Shopping Cart UI",
//     description: "Build cart interface with responsive design.",
//     taskNumber: 3,
//     taskId: "ECOM-2024-FE-003",
//     project: "p_101",
//     assignee: alice,
//     reporter: me,
//     status: "in-progress",
//     priority: "high",
//     tags: ["Frontend"],
//     estimatedHours: 12,
//     loggedHours: 4,
//     attachments: [],
//     createdAt: daysAgo(10),
//     updatedAt: hoursAgo(5),
//   },
//   {
//     _id: "t_4",
//     title: "Payment Integration",
//     description: "Stripe integration and testing.",
//     taskNumber: 4,
//     taskId: "ECOM-2024-INT-004",
//     project: "p_101",
//     assignee: me,
//     reporter: sarah,
//     status: "review",
//     priority: "critical",
//     tags: ["Integration"],
//     estimatedHours: 10,
//     loggedHours: 10,
//     attachments: [],
//     createdAt: daysAgo(9),
//     updatedAt: hoursAgo(26),
//   },
//   {
//     _id: "t_5",
//     title: "Database Schema",
//     description: "MongoDB collections setup and indexes.",
//     taskNumber: 5,
//     taskId: "ECOM-2024-DB-005",
//     project: "p_101",
//     assignee: sarah,
//     reporter: me,
//     status: "done",
//     priority: "medium",
//     tags: ["Database"],
//     estimatedHours: 8,
//     loggedHours: 8,
//     attachments: [],
//     createdAt: daysAgo(20),
//     updatedAt: daysAgo(7),
//   },
// ];

// const comments: Comment[] = [
//   {
//     _id: "c_1",
//     content: "Should we include social login options beyond GitHub?",
//     author: sarah,
//     task: "t_1",
//     mentions: [],
//     isEdited: false,
//     createdAt: hoursAgo(2),
//   },
//   {
//     _id: "c_2",
//     content: "@SarahKim Good idea! Let's add Google OAuth as well.",
//     author: me,
//     task: "t_1",
//     mentions: [sarah],
//     isEdited: false,
//     createdAt: hoursAgo(1),
//   },
// ];

// const notifications: Notification[] = [
//   {
//     _id: "n_1",
//     type: "task_mentioned",
//     title: "You were mentioned",
//     message: "Sarah Kim mentioned you in User Authentication",
//     relatedTask: tasks[0],
//     relatedProject: projects[0],
//     relatedUser: sarah,
//     isRead: false,
//     actionUrl: "/projects/p_101/kanban",
//     createdAt: hoursAgo(2),
//   },
//   {
//     _id: "n_2",
//     type: "task_assigned",
//     title: "Task assigned",
//     message: "Alice Miller assigned you to Shopping Cart UI",
//     relatedTask: tasks[2],
//     relatedProject: projects[0],
//     relatedUser: alice,
//     isRead: false,
//     createdAt: hoursAgo(4),
//   },
//   {
//     _id: "n_3",
//     type: "task_status_changed",
//     title: "Task moved to Done",
//     message: "Payment Integration was moved to Done",
//     relatedTask: tasks[3],
//     relatedProject: projects[0],
//     isRead: true,
//     readAt: daysAgo(1),
//     createdAt: daysAgo(1),
//   },
// ];

// // Utility: group tasks by status for Kanban
// const kanbanColumns = (projectId: string) => {
//   const projectTasks = tasks.filter((t) => t.project === projectId);
//   return {
//     columns: [
//       {
//         id: "todo",
//         title: "To Do",
//         tasks: projectTasks
//           .filter((t) => t.status === "todo")
//           .map(({ _id, title }) => ({ id: _id, content: title })),
//       },
//       {
//         id: "in-progress",
//         title: "In Progress",
//         tasks: projectTasks
//           .filter((t) => t.status === "in-progress")
//           .map(({ _id, title }) => ({ id: _id, content: title })),
//       },
//       {
//         id: "review",
//         title: "Review",
//         tasks: projectTasks
//           .filter((t) => t.status === "review")
//           .map(({ _id, title }) => ({ id: _id, content: title })),
//       },
//       {
//         id: "done",
//         title: "Done",
//         tasks: projectTasks
//           .filter((t) => t.status === "done")
//           .map(({ _id, title }) => ({ id: _id, content: title })),
//       },
//     ],
//   };
// };

// // Simple token simulation
// let token: string | null = "fake-jwt-token";
// const requireAuth = () => {
//   if (!token) throw new Error("Unauthorized");
// };

// // -------------------------------------------------------
// // Mock API surface (axios-like)
// // -------------------------------------------------------
// type GetReturn<T> = Promise<{ data: T }>;
// type PostReturn<T> = Promise<{ data: T }>;
// type PatchReturn<T> = Promise<{ data: T }>;

// export const api = {
//   // GET endpoints
//   get: async (url: string): GetReturn<any> => {
//     // Simulate latency
//     await new Promise((r) => setTimeout(r, 200));

//     // AUTH-GUARDED endpoints (example)
//     if (url.startsWith("/dashboard")) {
//       requireAuth();
//       const projectTotals = projects.reduce(
//         (acc, p) => {
//           acc.projects += 1;
//           acc.tasks += p.taskCounts.total;
//           return acc;
//         },
//         { projects: 0, tasks: 0 }
//       );
//       return {
//         data: {
//           user: me,
//           stats: {
//             projects: projectTotals.projects,
//             tasks: projectTotals.tasks,
//           },
//         },
//       };
//     }

//     if (url === "/projects") {
//       requireAuth();
//       return { data: projects };
//     }

//     if (/^\/projects\/([^/]+)$/.test(url)) {
//       requireAuth();
//       const id = url.split("/")[2];
//       const proj = projects.find((p) => p._id === id);
//       return { data: proj ?? null };
//     }

//     if (/^\/projects\/([^/]+)\/kanban$/.test(url)) {
//       requireAuth();
//       const id = url.split("/")[2];
//       return { data: kanbanColumns(id) };
//     }

//     if (/^\/tasks(\?project=.+)?$/.test(url)) {
//       requireAuth();
//       const projectId = new URLSearchParams(url.split("?")[1]).get("project");
//       const list = projectId ? tasks.filter((t) => t.project === projectId) : tasks;
//       return { data: list };
//     }

//     if (/^\/tasks\/([^/]+)$/.test(url)) {
//       requireAuth();
//       const id = url.split("/")[2];
//       const task = tasks.find((t) => t._id === id) ?? null;
//       return { data: task };
//     }

//     if (/^\/tasks\/([^/]+)\/comments$/.test(url)) {
//       requireAuth();
//       const id = url.split("/")[2];
//       const list = comments.filter((c) => c.task === id);
//       return { data: list };
//     }

//     // GET /projects/:id/tasks
//     if (/^\/projects\/([^/]+)\/tasks$/.test(url)) {
//       requireAuth();
//       const id = url.split('/')[2];
//       const list = tasks.filter(t => t.project === id);
//       return { data: list };
//     }

//     if (url === "/notifications") {
//       requireAuth();
//       return { data: notifications };
//     }

//     // Public-ish (e.g., for a pre-login health check)
//     if (url === "/health") {
//       return { data: { ok: true, time: iso(new Date()) } };
//     }

//     return { data: {} };
//   },

//   // POST endpoints
//   post: async (url: string, body?: any): PostReturn<any> => {
//     await new Promise((r) => setTimeout(r, 200));

//     if (url === "/auth/login") {
//       // Accept any credentials, return "me"
//       token = "fake-jwt-token";
//       localStorage.setItem("token", token);
//       return { data: { token, user: me } };
//     }

//     if (url === "/auth/register") {
//       // Echo back created user
//       const newUser: User = {
//         _id: "u_" + Math.random().toString(36).slice(2, 8),
//         email: body?.email ?? "new.user@example.com",
//         firstName: body?.firstName ?? "New",
//         lastName: body?.lastName ?? "User",
//         fullName: `${body?.firstName ?? "New"} ${body?.lastName ?? "User"}`,
//         role: "developer",
//         isActive: true,
//         avatar: { url: "https://i.pravatar.cc/120?u=new", publicId: "avatar_new" },
//       };
//       return { data: { message: "Registered (mock)", user: newUser } };
//     }

//     if (url === "/projects") {
//       requireAuth();
//       const owner = me;
//       const id = "p_" + Math.random().toString(36).slice(2, 8);
//       const created: Project = {
//         _id: id,
//         name: body?.name ?? "Untitled Project",
//         key: body?.key ?? "PRJ",
//         description: body?.description ?? "",
//         owner,
//         members: [{ user: owner, role: "owner", joinedAt: iso(new Date()) }],
//         status: "planning",
//         taskCounts: { total: 0, todo: 0, inProgress: 0, review: 0, done: 0 },
//         taskStatusOptions: ["todo", "in-progress", "review", "done"],
//         createdAt: iso(new Date()),
//         updatedAt: iso(new Date()),
//         taskCategory: [],
//       };
//       projects.unshift(created);
//       return { data: created };
//     }

//     if (/^\/tasks$/.test(url)) {
//       requireAuth();
//       const id = "t_" + Math.random().toString(36).slice(2, 8);
//       const projectId: string = body?.project ?? projects[0]._id;
//       const newTask: Task = {
//         _id: id,
//         title: body?.title ?? "New Task",
//         description: body?.description ?? "",
//         taskNumber: tasks.length + 1,
//         taskId: `${projects.find(p => p._id === projectId)?.key ?? "PRJ"}-${tasks.length + 1}`,
//         project: projectId,
//         assignee: body?.assignee ?? me,
//         reporter: me,
//         status: body?.status ?? "todo",
//         priority: body?.priority ?? "medium",
//         tags: body?.tags ?? [],
//         dueDate: body?.dueDate,
//         estimatedHours: body?.estimatedHours,
//         loggedHours: 0,
//         attachments: [],
//         createdAt: iso(new Date()),
//         updatedAt: iso(new Date()),
//       };
//       tasks.unshift(newTask);
//       // update counts
//       const proj = projects.find((p) => p._id === projectId);
//       if (proj) {
//         proj.taskCounts.total += 1;
//         if (newTask.status === "todo") proj.taskCounts.todo += 1;
//         if (newTask.status === "in-progress") proj.taskCounts.inProgress += 1;
//         if (newTask.status === "review") proj.taskCounts.review += 1;
//         if (newTask.status === "done") proj.taskCounts.done += 1;
//         proj.updatedAt = iso(new Date());
//       }
//       return { data: newTask };
//     }

//     if (/^\/tasks\/([^/]+)\/comments$/.test(url)) {
//       requireAuth();
//       const id = url.split("/")[2];
//       const newComment: Comment = {
//         _id: "c_" + Math.random().toString(36).slice(2, 8),
//         content: body?.content ?? "",
//         author: me,
//         task: id,
//         mentions: body?.mentions ?? [],
//         isEdited: false,
//         createdAt: iso(new Date()),
//       };
//       comments.unshift(newComment);
//       return { data: newComment };
//     }

//     return { data: {} };
//   },

//   // PATCH endpoints
//   patch: async (url: string, body?: any): PatchReturn<any> => {
//     await new Promise((r) => setTimeout(r, 200));

//     // Update task status / fields
//     if (/^\/tasks\/([^/]+)$/.test(url)) {
//       requireAuth();
//       const id = url.split("/")[2];
//       const idx = tasks.findIndex((t) => t._id === id);
//       if (idx === -1) return { data: null };

//       const prev = tasks[idx];
//       const next: Task = {
//         ...prev,
//         ...body,
//         updatedAt: iso(new Date()),
//       };

//       // maintain project counts if status changed
//       if (body?.status && body.status !== prev.status) {
//         const proj = projects.find((p) => p._id === prev.project);
//         if (proj) {
//           const dec = (k: keyof Project["taskCounts"]) => (proj.taskCounts[k] = Math.max(0, proj.taskCounts[k] - 1));
//           const inc = (k: keyof Project["taskCounts"]) => (proj.taskCounts[k] += 1);

//           if (prev.status === "todo") dec("todo");
//           if (prev.status === "in-progress") dec("inProgress");
//           if (prev.status === "review") dec("review");
//           if (prev.status === "done") dec("done");

//           if (next.status === "todo") inc("todo");
//           if (next.status === "in-progress") inc("inProgress");
//           if (next.status === "review") inc("review");
//           if (next.status === "done") inc("done");

//           proj.updatedAt = iso(new Date());
//         }
//       }

//       tasks[idx] = next;
//       return { data: next };
//     }

//     // Mark notification read
//     if (/^\/notifications\/([^/]+)$/.test(url)) {
//       requireAuth();
//       const id = url.split("/")[2];
//       const n = notifications.find((n) => n._id === id);
//       if (!n) return { data: null };
//       n.isRead = true;
//       n.readAt = iso(new Date());
//       return { data: n };
//     }

//     return { data: {} };
//   },

//   // Simple interceptor-ish helpers if your code expects them
//   interceptors: {
//     request: { use: (_fn: any) => {} },
//     response: { use: (_fn: any) => {} },
//   },
// };

// // -------------------------------------------------------
// // Helper: enable/disable mock via env if you want later
// // -------------------------------------------------------
// // If you later switch to real axios, you can do:
// //   const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
// // and export axios instance when false. For now this file is fully mock.
