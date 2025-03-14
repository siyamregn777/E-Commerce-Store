'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/userContext';
import Image from 'next/image';
import '../styles/header.css';
import image1 from '../../public/images (2).png';

const Header = ({ isVisible }: { isVisible: boolean }) => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const dropdownRef = useRef<HTMLLIElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
    router.push('/login');
  };

  // Close dropdown and menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`header-container ${isVisible ? 'visible' : ''}`}>
      {/* Hamburger Menu Icon */}
      <div className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)} ref={menuRef}>
        <div className="hamburger-icon"></div>
        <div className="hamburger-icon"></div>
        <div className="hamburger-icon"></div>
      </div>

      {/* Navigation Menu */}
      <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
        <li className="nav-item">
          <Link href="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link href="/about">About</Link>
        </li>
        <li className="nav-item">
          <Link href="/contact">Contact</Link>
        </li>
        <li className="nav-item">
          <Link href="/ecommerce">Ecommerce</Link>
        </li>

        {user.isAuthenticated ? (
          <>
            {user.role === 'admin' && (
              <li className="nav-item">
                <Link href="/adminDashboard">Admin Dashboard</Link>
              </li>
            )}
            {/* Profile Dropdown */}
            <li className="dropdown" ref={dropdownRef}>
              <Image
                src={image1}
                alt="Profile"
                height={50}
                width={50}
                className="profile-image"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li className="nav-item">
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/accountSettings">Settings</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/help">Help</Link>
                  </li>
                  <li className="nav-item">
                    <button onClick={handleLogout} className="logout-button">
                      Log out
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link href="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;