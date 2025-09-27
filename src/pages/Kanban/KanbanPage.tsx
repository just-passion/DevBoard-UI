import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchTasks, updateTaskStatus } from '../../store/slices/taskSlice';
import { setCurrentProject } from '../../store/slices/projectSlice';
import { projectService } from '../../services/projectService';
import Header from '../../components/Layout/Header';
import type { Task } from '../../types';
import TaskModal from '../../Modals/CreateTaskModal';
import CreateTaskModal from '../../Modals/CreateTaskModal';

const KanbanPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks(projectId));
      
      // Load current project if not already loaded
      if (!currentProject || currentProject._id !== projectId) {
        projectService.getProject(projectId).then(response => {
          dispatch(setCurrentProject(response.data));
        });
      }
    }
  }, [dispatch, projectId, currentProject]);

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 'review', title: 'Review', status: 'review', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { id: 'done', title: 'Done', status: 'done', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  ];

const getTasksByStatus = (status: string) => {
  return Array.isArray(tasks) ? tasks.filter((task: Task) => task.status === status) : [];
};

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const task = tasks.find((t: Task) => t._id === draggableId);
    
    if (task && destination.droppableId !== task.status) {
      dispatch(updateTaskStatus({ 
        taskId: draggableId, 
        status: destination.droppableId 
      }));
    }
  };

  const getTagColor = (tag: string) => {
    const colors = {
      frontend: 'bg-orange-500',
      backend: 'bg-blue-500',
      database: 'bg-teal-500',
      integration: 'bg-purple-500',
      docs: 'bg-green-500',
      urgent: 'bg-red-500',
      bug: 'bg-red-600',
      feature: 'bg-indigo-500',
      improvement: 'bg-yellow-500',
    };
    return colors[tag.toLowerCase() as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-600';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentProject?.name}</h1>
            <p className="text-gray-600">{currentProject?.key}</p>
            <p className="text-sm text-gray-500 mt-1">
              {tasks.length} tasks • {getTasksByStatus('done').length} completed
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {currentProject?.members.slice(0, 4).map((member, index) => (
                <div
                  key={member.user._id}
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white shadow-sm"
                  title={`${member.user.firstName} ${member.user.lastName}`}
                >
                  {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                </div>
              ))}
              {currentProject?.members && currentProject.members.length > 4 && (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium border-2 border-white shadow-sm">
                  +{currentProject.members.length - 4}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Task
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.status);
              
              return (
                <div key={column.id} className={`${column.bgColor} ${column.borderColor} border-2 rounded-xl p-4`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">{column.title}</h3>
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600 shadow-sm">
                      {columnTasks.length}
                    </span>
                  </div>

                  <Droppable droppableId={column.status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[400px] ${
                          snapshot.isDraggingOver ? 'bg-white bg-opacity-50 rounded-lg' : ''
                        } p-2`}
                      >
                        {columnTasks.map((task: Task, index: number) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTask(task)}
                                className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${getPriorityColor(task.priority)} cursor-pointer hover:shadow-md transition-all ${
                                  snapshot.isDragging ? 'rotate-2 shadow-lg scale-105' : ''
                                }`}
                              >
                                {/* Task Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 pr-2">
                                    {task.title}
                                  </h4>
                                  <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                    {task.taskId.split('-').slice(-1)[0]}
                                  </span>
                                </div>

                                {/* Description */}
                                {task.description && (
                                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}

                                {/* Tags */}
                                {task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {task.tags.slice(0, 3).map((tag) => (
                                      <span
                                        key={tag}
                                        className={`${getTagColor(tag)} text-white px-2 py-1 rounded text-xs font-medium`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {task.tags.length > 3 && (
                                      <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs">
                                        +{task.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Due Date */}
                                {task.dueDate && (
                                  <div className={`text-xs mb-2 ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Due {formatDate(task.dueDate)}
                                    {isOverdue(task.dueDate) && ' (Overdue)'}
                                  </div>
                                )}

                                {/* Time Tracking */}
                                {task.estimatedHours && (
                                  <div className="text-xs text-gray-500 mb-2">
                                    <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {task.loggedHours}h / {task.estimatedHours}h
                                  </div>
                                )}

                                {/* Footer */}
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    {/* Priority Badge */}
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </span>
                                  </div>

                                  {/* Assignee Avatar */}
                                  {task.assignee && (
                                    <div 
                                      className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                      title={`${task.assignee.firstName} ${task.assignee.lastName}`}
                                    >
                                      {task.assignee.firstName.charAt(0)}{task.assignee.lastName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {/* Empty State */}
                        {columnTasks.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <p className="text-sm">No tasks yet</p>
                            {column.status === 'todo' && (
                              <button 
                                onClick={() => setShowCreateModal(true)}
                                className="text-blue-600 hover:underline text-sm mt-1"
                              >
                                Create your first task
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && projectId && (
        <CreateTaskModal projectId={projectId} onClose={() => setSelectedTask(null)} />
      )}

      {/* Create Task Modal */}
      {showCreateModal && projectId && (
        <CreateTaskModal 
          onClose={() => setShowCreateModal(false)} 
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default KanbanPage;