import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProjects } from '../../store/slices/projectSlice';
import Header from '../../components/Layout/Header';
import CreateProjectModal from '../../components/Modals/CreateProjectModal';
import { Project } from '../../types';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading } = useSelector((state: RootState) => state.projects);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      planning: 'bg-orange-500',
      'on-hold': 'bg-yellow-500',
      completed: 'bg-blue-500',
      archived: 'bg-gray-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            + New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No projects yet</div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}/kanban`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-gray-600 text-sm">{project.key}</p>
                  </div>
                  <span className={`${getStatusColor(project.status)} text-white px-2 py-1 rounded-full text-xs capitalize`}>
                    {project.status}
                  </span>
                </div>

                <div className="flex items-center mb-4 space-x-2">
                  {project.members.slice(0, 3).map((member, index) => (
                    <div
                      key={member.user._id}
                      className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    >
                      {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div>• {project.taskCounts.total} total tasks</div>
                  <div>• {project.taskCounts.inProgress} in progress</div>
                  <div>• Last updated {formatDate(project.updatedAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default DashboardPage;