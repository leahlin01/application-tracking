'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    role: UserRole,
    studentId?: string
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // 检查本地存储的token
    const token = localStorage.getItem('authToken');
    if (token) {
      // 验证token并获取用户信息
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // 这里应该调用API验证token
      // 暂时从localStorage获取用户信息
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  };

  // 从路径中提取语言信息
  const getLocaleFromPath = (path: string): string => {
    const segments = path.split('/').filter(Boolean);
    const supportedLocales = ['en', 'zh'];

    if (segments.length > 0 && supportedLocales.includes(segments[0])) {
      return segments[0];
    }

    // 默认返回英文
    return 'en';
  };

  // 登录成功后重定向到当前语言的主页
  const handleLoginSuccess = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));

    // 重定向到当前语言的主页
    if (typeof window !== 'undefined') {
      const currentLocale = getLocaleFromPath(pathname);
      const currentPath = pathname;

      if (currentPath.includes('/auth')) {
        // 如果在 auth 页面，跳转到当前语言的主页
        window.location.href = `/${currentLocale}`;
      } else {
        // 如果在其他页面，保持当前路径
        window.location.href = currentPath;
      }
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        handleLoginSuccess(data.user, data.token);
        return true;
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    role: UserRole,
    studentId?: string,
    studentIds?: string[]
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role, studentId, studentIds }),
      });

      if (response.ok) {
        const data = await response.json();
        handleLoginSuccess(data.user, data.token);
        return true;
      } else {
        const error = await response.json();
        console.error('Registration failed:', error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
