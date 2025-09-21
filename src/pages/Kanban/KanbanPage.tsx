import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchTasks, updateTaskStatus } from '../../store/slices/taskSlice';
import { setCurrentProject } from '../../store/slices/projectSlice';
import Header from '../../components/Layout/Header';
import type { Task } from '../../types';
import TaskModal from '../../Modals/TaskModal';

const KanbanPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks(projectId));
    }
  }, [dispatch, projectId]);

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'review', title: 'Review', status: 'review' },
    { id: 'done', title: 'Done', status: 'done' },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task: Task) => task.status === status);
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
    };
    return colors[tag.toLowerCase() as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentProject?.name}</h1>
            <p className="text-gray-600">{currentProject?.key}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {currentProject?.members.slice(0, 3).map((member) => (
                <div
                  key={member.user._id}
                  className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
                >
                  {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                </div>
              ))}
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              + New Task
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.status);
              
              return (
                <div key={column.id} className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">{column.title}</h3>
                    <span className="bg-gray-300 text-gray-600 px-2 py-1 rounded-full text-sm">
                      {columnTasks.length}
                    </span>
                  </div>

                  <Droppable droppableId={column.status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[200px] ${
                          snapshot.isDraggingOver ? 'bg-gray-200 bg-opacity-50' : ''
                        } rounded-lg p-2`}
                      >
                        {columnTasks.map((task: Task, index: number) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTask(task)}
                                className={`bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow ${
                                  snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                                }`}
                              >
                                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                                {task.description && (
                                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                                )}
                                
                                <div className="flex justify-between items-center">
                                  <div className="flex space-x-1">
                                    {task.tags.slice(0, 2).map((tag) => (
                                      <span
                                        key={tag}
                                        className={`${getTagColor(tag)} text-white px-2 py-1 rounded text-xs`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  {task.assignee && (
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                                      {task.assignee.firstName.charAt(0)}{task.assignee.lastName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default KanbanPage;