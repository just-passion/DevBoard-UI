import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { AppDispatch, RootState } from '../store/store';
import { taskService } from '../services/taskService';
import type { Task } from '../types';

// Optional prop 'task' is fine to keep for future edit mode
interface CreateTaskModalProps {
  onClose: () => void;
  projectId: string;
  task?: Task;
}

/** Schema */
const schema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string().optional(),
  status: yup.mixed<'todo' | 'in-progress' | 'review' | 'done'>().required('Status is required'),
  priority: yup.mixed<'low' | 'medium' | 'high' | 'critical'>().required('Priority is required'),
  assigneeId: yup.string().optional(),
  tags: yup.string().optional(),
  dueDate: yup.string().optional(),
  estimatedHours: yup.number().nullable().positive('Must be a positive number').optional(),
});

type FormValues = yup.InferType<typeof schema>;

const CreateTaskModal = ({ onClose, projectId }: CreateTaskModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ❗️Do NOT pass a generic to useForm — let the resolver own the types.
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      status: 'todo',
      priority: 'medium',
      assigneeId: '',
      tags: '',
      dueDate: '',
      estimatedHours: null,
    },
  });

  // Let handleSubmit wrap your typed callback
  const onSubmit = handleSubmit(async (data: FormValues) => {

    console.log({data})
    console.log({user, currentProject})
    if (!user) return;

    console.log({user, currentProject})
    setIsSubmitting(true);
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        project: projectId,
        assignee: data.assigneeId || undefined,
        reporter: user._id,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        dueDate: data.dueDate || undefined,
        estimatedHours: data.estimatedHours ?? undefined,
      };

      await taskService.createTask(taskData);
      window.location.reload();
      onClose();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsSubmitting(false);
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 text-red-700';
      case 'high': return 'border-orange-500 text-orange-700';
      case 'medium': return 'border-yellow-500 text-yellow-700';
      case 'low': return 'border-green-500 text-green-700';
      default: return 'border-gray-500 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'border-gray-500 text-gray-700';
      case 'in-progress': return 'border-blue-500 text-blue-700';
      case 'review': return 'border-purple-500 text-purple-700';
      case 'done': return 'border-green-500 text-green-700';
      default: return 'border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* ✅ Proper form submit wiring */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
              <input
                {...register('title')}
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title..."
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter task description..."
              />
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  {...register('status')}
                  className={`w-full border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(String(watch('status') ?? 'todo'))}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  {...register('priority')}
                  className={`w-full border-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getPriorityColor(String(watch('priority') ?? 'medium'))}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
              <select
                {...register('assigneeId')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Unassigned</option>
                {currentProject?.members.map((m) => (
                  <option key={m.user._id} value={m.user._id}>
                    {m.user.firstName} {m.user.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  {...register('tags')}
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="frontend, backend, urgent (comma separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  {...register('dueDate')}
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
              <input
                {...register('estimatedHours')}
                type="number"
                min="0"
                step="0.5"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 8"
              />
              {errors.estimatedHours && <p className="mt-1 text-sm text-red-600">{errors.estimatedHours.message}</p>}
            </div>

            {/* Project Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Project Details</h3>
              <div className="text-sm text-gray-600">
                <p><strong>Project:</strong> {currentProject?.name}</p>
                <p><strong>Key:</strong> {currentProject?.key}</p>
                <p><strong>Reporter:</strong> {user?.firstName} {user?.lastName}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to purple-600 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
