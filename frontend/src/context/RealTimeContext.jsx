import { createContext, useContext, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_URL } from '../config';

const RealTimeContext = createContext();

export const RealTimeProvider = ({ children }) => {
  const { token, user } = useAuth();
  const socket = useMemo(() => {
    if (!token || !user) return null;

    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to Real-Time server');
      newSocket.emit('join_room', user.userId);
    });

    return newSocket;
  }, [token, user]);

  useEffect(() => {
    return () => {
      if (socket) socket.close();
    };
  }, [socket]);

  return (
    <RealTimeContext.Provider value={socket}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useSocket = () => useContext(RealTimeContext);
