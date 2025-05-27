import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { TEN, MAKH, role }

  useEffect(() => {
    // Khởi động đọc token từ localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          TEN: decoded.TEN,
          MAKH: decoded.MAKH,
          role: decoded.role || '',
        });
      } catch {
        setUser(null);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Hàm đăng nhập cập nhật user và lưu token
  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({
      TEN: decoded.TEN,
      MAKH: decoded.MAKH,
      role: decoded.role || '',
    });
  };

  // Hàm đăng xuất xóa user và token
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
