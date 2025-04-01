'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/userContext';
import Image from 'next/image';
import image1 from '../../public/images (2).png';

const Header = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({ userId: null, username: null, email: null, isAuthenticated: false, role: null });
    router.push('/login');
  };

  // Control header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    <header
      className={`fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo or Brand Name */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-orange-400 transition-colors">
          MyBrand
        </Link>

        {/* Hamburger Menu Icon (Mobile) */}
        <div
          className="lg:hidden flex flex-col space-y-1.5 cursor-pointer p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          ref={menuRef}
        >
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>

        {/* Navigation Menu */}
        <nav
          className={`lg:flex lg:items-center lg:space-x-8 absolute lg:static bg-gray-900 lg:bg-transparent w-full lg:w-auto left-0 top-16 lg:top-0 transition-all duration-300 ${
            menuOpen ? 'block' : 'hidden'
          }`}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
            <li className="nav-item">
              <Link
                href="/"
                className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/about"
                className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/contact"
                className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/ecommerce"
                className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                Ecommerce
              </Link>
            </li>

            {user.isAuthenticated ? (
              <>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link
                      href="/adminDashboard"
                      className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {/* Profile Dropdown */}
                <li className="relative" ref={dropdownRef}>
                  <Image
                    src={image1}
                    alt="Profile"
                    height={40}
                    width={40}
                    className="rounded-full cursor-pointer hover:scale-110 transition-transform duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  />
                  {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
                      <li>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/accountSettings"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/help"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Help
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          Log out
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  href="/login"
                  className="block py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;