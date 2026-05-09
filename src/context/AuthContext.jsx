import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load from sessionStorage just to keep it during reloads while testing
  useEffect(() => {
    const saved = sessionStorage.getItem('currentUser');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const login = (email, password, role) => {
    // Mock login
    const user = { id: Date.now().toString(), name: 'Test User', email, role };
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  };

  const register = (name, email, phone, password) => {
    // Mock register, defaults to student
    const user = { id: Date.now().toString(), name, email, phone, role: 'student' };
    setCurrentUser(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
