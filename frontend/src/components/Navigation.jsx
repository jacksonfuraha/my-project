import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem('adminEmail') || '');

  useEffect(() => {
    const onAuthChanged = () => {
      setAdminToken(localStorage.getItem('adminToken'));
      setAdminEmail(localStorage.getItem('adminEmail') || '');
    };

    window.addEventListener('authChanged', onAuthChanged);
    window.addEventListener('storage', onAuthChanged);
    return () => {
      window.removeEventListener('authChanged', onAuthChanged);
      window.removeEventListener('storage', onAuthChanged);
    };
  }, []);

  const initialsFromEmail = (email) => {
    if (!email) return '';
    return email.trim().charAt(0).toUpperCase();
  };


  return (
    <nav className="fixed top-0 w-full bg-gray-900 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
              JF
            </div>
            <span className="text-xl font-bold">Portfolio</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="hover:text-blue-400 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-400 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/skills"
              className="hover:text-blue-400 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Skills
            </Link>
            <Link
              to="/projects"
              className="hover:text-blue-400 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/blog"
              className="hover:text-blue-400 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-400 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>

          {/* show initials next to logo when logged in (no nav profile picture) */}
          <div className="hidden md:flex items-center space-x-3">
            {adminToken && adminEmail && (
              <Link
                to="/admin"
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-white hover:bg-blue-600 transition"
                aria-label="Go to admin dashboard"
              >
                {initialsFromEmail(adminEmail)}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/skills"
              className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Skills
            </Link>
            <Link
              to="/projects"
              className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/blog"
              className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
