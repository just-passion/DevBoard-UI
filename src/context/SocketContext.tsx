import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import type { RootState, AppDispatch } from '../store/store';
import { addNotification } from '../store/slices/notificationSlice';
import { updateTaskInList } from '../store/slices/taskSlice';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user && token) {
      const socketInstance = io(import.meta.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
        auth: { token },
      });

      socketInstance.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to server');
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from server');
      });

      // Handle real-time notifications
      socketInstance.on('notification', (notification) => {
        dispatch(addNotification(notification));
      });

      // Handle real-time task updates
      socketInstance.on('taskUpdated', (task) => {
        dispatch(updateTaskInList(task));
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [user, token, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};