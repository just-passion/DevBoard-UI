import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from '../../store/store';
import { createProject } from '../../store/slices/projectSlice';

interface CreateProjectModalProps {
  onClose: () => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  key: string;
  inviteEmails: string;
}

const CreateProjectModal = ({ onClose }: CreateProjectModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProjectFormData>();

  const projectName = watch('name');
  
  // Auto-generate project key from name
  useEffect(() => {
    if (projectName) {
      const generatedKey = projectName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 10);
      // You can set this value if needed
    }
  }, [projectName]);

  const onSubmit = async (data: ProjectFormData) => {
    const projectData = {
      name: data.name,
      description: data.description,
      key: data.key.toUpperCase(),
    };

    const result = await dispatch(createProject(projectData));
    if (result.type === 'projects/createProject/fulfilled') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                {...register('name', { required: 'Project name is required' })}
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Project description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Key
              </label>
              <input
                {...register('key', { 
                  required: 'Project key is required',
                  pattern: {
                    value: /^[A-Z]{2,10}$/,
                    message: 'Key must be 2-10 uppercase letters'
                  }
                })}
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., PROJ"
                maxLength={10}
              />
              {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invite Team Members (Optional)
              </label>
              <input
                {...register('inviteEmails')}
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email addresses separated by commas"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;