import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find((u: User & { password: string }) => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.some((u: User) => u.email === email)) {
      throw new Error('Email already in use');
    }
    const newUser: User & { password: string } = { id: Date.now().toString(), name, email, isAdmin: false, password };
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
  };

  const logout = async () => {
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find((u: User) => u.email === email);
    if (user) {
      console.log(`Password reset link sent to ${email}`);
    } else {
      throw new Error('No account found with this email address');
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update the user in the users array
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = storedUsers.map((u: User & { password: string }) => 
        u.id === user.id ? { ...u, ...updates } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  const updateUserEmail = async (email: string) => {
    if (user) {
      await updateUserProfile({ email });
    }
  };

  const updateUserPassword = async (password: string) => {
    if (user) {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = storedUsers.map((u: User & { password: string }) => 
        u.id === user.id ? { ...u, password } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      console.log(`Password updated for user ${user.email}`);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;