import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const RealTimeContext = createContext();

export const RealTimeProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token && user) {
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to Real-Time server');
        newSocket.emit('join_room', user.userId);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [token, user]);

  return (
    <RealTimeContext.Provider value={socket}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useSocket = () => useContext(RealTimeContext);
