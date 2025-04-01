'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/userContext';
import Image from 'next/image';
import image1 from '../../public/images (2).png';

interface HeaderProps {
  isVisible?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isVisible = true }) => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(isVisible);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({
      userId: null,
      username: null,
      email: null,
      isAuthenticated: false,
      role: null,
    });
    router.push('/login');
  };

  // Control header visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 10) {
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo or Brand Name */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-white hover:text-orange-400 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          MyBrand
        </Link>

        {/* Hamburger Menu Icon (Mobile) */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 p-2 space-y-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          ref={menuRef}
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Navigation Menu */}
        <nav
          className={`lg:flex lg:items-center lg:space-x-6 absolute lg:static bg-gray-900 lg:bg-transparent w-full lg:w-auto left-0 top-full lg:top-0 transition-all duration-300 ease-in-out ${
            menuOpen ? 'block' : 'hidden'
          }`}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 divide-y lg:divide-y-0 divide-gray-700">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
              { href: '/ecommerce', label: 'Ecommerce' },
            ].map((item) => (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className="block py-3 lg:py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {user.isAuthenticated ? (
              <>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link
                      href="/adminDashboard"
                      className="block py-3 lg:py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                {/* Profile Dropdown */}
                <li className="relative py-3 lg:py-0" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                    aria-label="User menu"
                  >
                    <Image
                      src={image1}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full hover:scale-110 transition-transform duration-200"
                    />
                  </button>

                  {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                      {[
                        { href: '/profile', label: 'Profile' },
                        { href: '/accountSettings', label: 'Settings' },
                        { href: '/help', label: 'Help' },
                      ].map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => {
                              setDropdownOpen(false);
                              setMenuOpen(false);
                            }}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li className="border-t border-gray-200">
                        <button
                          onClick={() => {
                            handleLogout();
                            setDropdownOpen(false);
                            setMenuOpen(false);
                          }}
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
                  className="block py-3 lg:py-2 px-4 text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
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
