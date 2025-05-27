import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.TEN);
        setRole(decoded.role || '');
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setRole('');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setIsLoggedIn(false);
    setRole('');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? styles['active'] : '';
  };

  return (
    <div className={styles['layout-container']}>
      <header className={styles.header}>
        <div className={styles['header-content']}>
          <Link to="/" className={styles['navbar-brand']}>Spa Booking</Link>

          <button
            className={styles['mobile-toggle']}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span className={styles['menu-icon']}></span>
          </button>

          <nav className={`${styles.navbar} ${mobileMenuOpen ? styles['show-mobile-menu'] : ''}`}>
            <ul className={styles['navbar-nav']}>
              <li className={styles['nav-item']}><Link to="/" className={`${styles['nav-link']} ${isActive('/')}`}>Trang Chủ</Link></li>
              <li className={styles['nav-item']}><Link to="/about" className={`${styles['nav-link']} ${isActive('/about')}`}>Về Spa</Link></li>
              <li className={styles['nav-item']}><Link to="/services" className={`${styles['nav-link']} ${isActive('/services')}`}>Dịch Vụ</Link></li>
              <li className={styles['nav-item']}><Link to="/employees" className={`${styles['nav-link']} ${isActive('/employees')}`}>Nhân Viên</Link></li>
              <li className={styles['nav-item']}><Link to="/booking" className={`${styles['nav-link']} ${isActive('/booking')}`}>Đặt Lịch</Link></li>
              <li className={styles['nav-item']}><Link to="/faq" className={`${styles['nav-link']} ${isActive('/faq')}`}>Q&A</Link></li>
              {role === 'admin' && (
                <li className={styles['nav-item']}><Link to="/admin" className={`${styles['nav-link']} ${isActive('/admin')}`}>Quản lý</Link></li>
              )}
            </ul>

            <div className={styles['auth-section']}>
              {isLoggedIn ? (
                <div className={styles['user-dropdown']}>
                  <button
                    className={styles['user-button']}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <i className="fas fa-user-circle"></i> {username}
                  </button>

                {showDropdown && (
                  <div className={styles['dropdown-menu']}>
                    {role !== 'admin' && (
                      <Link to="/profile" className={styles['dropdown-item']}>Hồ sơ</Link>
                    )}
                    <button onClick={handleLogout} className={styles['dropdown-item']}>Đăng xuất</button>
                  </div>
                )}

                </div>
              ) : (
                <div className={styles['auth-buttons']}>
                  <Link
                    to="/login"
                    className={`${styles['nav-link']} ${styles['login-btn']} ${isActive('/login')}`}
                  >
                    <span className={styles['login-content']}>
                      <i className="fas fa-user"></i>
                      <span>Đăng Nhập</span>
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles['footer-content']}>
          <div className={styles['footer-info']}>
            <h3>Spa Booking</h3>
            <p>Địa chỉ: Số 1, Đường ABC, TP.HCM</p>
            <p>Điện thoại: 0123456789</p>
            <p>Email: info@spabooking.com</p>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Giờ mở cửa</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Thứ 2 - Thứ 6: 8:00 - 20:00</li>
              <li>Thứ 7: 8:00 - 18:00</li>
              <li>Chủ nhật: 8:00 - 16:00</li>
            </ul>
          </div>

          <div className={styles['footer-links']}>
            <h3>Liên Kết Nhanh</h3>
            <ul>
              <li><Link to="/">Trang Chủ</Link></li>
              <li><Link to="/about">Về Spa</Link></li>
              <li><Link to="/services">Dịch Vụ</Link></li>
              <li><Link to="/booking">Đặt Lịch</Link></li>
              <li><Link to="/contact">Liên Hệ</Link></li>
            </ul>
          </div>

          <div className={styles['footer-social']}>
            <h3>Kết Nối Với Chúng Tôi</h3>
            <div className={styles['social-icons']}>
              <a href="https://facebook.com" className={styles.facebook} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" className={styles.instagram} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" className={styles.youtube} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <div className={styles['footer-bottom']}>
          <p>© {new Date().getFullYear()} Spa Booking. Đã đăng ký bản quyền.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
