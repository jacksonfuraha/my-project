import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const defaultProfileImage = "/you're_almost_done_202604211133.png";

export default function Home() {
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [imageError, setImageError] = useState(false);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
  const [adminName, setAdminName] = useState(() => localStorage.getItem('adminName') || '');
  const [typedText, setTypedText] = useState('');
  const fullText = 'Full Stack Backend Developer';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getResumeUrl = (url) => {
    if (!url) return '';
    return new URL(url, apiUrl).href;
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
    const onAuthChanged = () => {
      setAdminToken(localStorage.getItem('adminToken'));
      setAdminName(localStorage.getItem('adminName') || '');
    };
    window.addEventListener('authChanged', onAuthChanged);
    window.addEventListener('storage', onAuthChanged);
    return () => {
      window.removeEventListener('authChanged', onAuthChanged);
      window.removeEventListener('storage', onAuthChanged);
    };
  }, []);

  const initialsFromName = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDownloadCV = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/profile/resume`);
      if (!response.ok) {
        alert('Resume URL not found. Please add one first.');
        return;
      }
      
      const data = await response.json();
      if (data.success && data.data.resumeUrl) {
        window.open(getResumeUrl(data.data.resumeUrl), '_blank');
      } else {
        alert('Resume URL not available');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load resume');
    }
  };

  return (
    <div>
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center justify-center gap-4 order-last md:order-last">
              <div className="relative w-full max-w-xs h-64 rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-700 hover:border-blue-400 transition duration-300 bg-gray-800 group">
                {!imageError ? (
                  <img
                    src={profileImage}
                    alt="Jackson Furaha"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center space-y-4 px-4">
                      <div className="text-6xl">📸</div>
                      <p className="text-white font-semibold">Image Failed</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-center">
                {adminToken ? (
                  <Link to="/admin" className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold">Admin Dashboard</Link>
                ) : (
                  <Link to="/admin/login" className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold">Login</Link>
                )}
              </div>
            </div>

            <div className="space-y-6 md:order-first">
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold">
                  Hi, I'm <span className="text-blue-400">Jackson Furaha</span>
                </h1>
                <p className="text-2xl text-gray-300">
                  {typedText}<span className="animate-pulse">|</span>
                </p>
              </div>

              <p className="text-lg text-gray-400 leading-relaxed">
                I build robust, scalable backend systems and APIs that power modern applications.
                With expertise in cloud architecture, microservices, and database optimization,
                I create solutions that perform at scale.
              </p>

              <div className="flex flex-wrap gap-4 pt-6">
                <Link
                  to="/projects"
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105 inline-block"
                >
                  View My Work
                </Link>
                <button
                  onClick={handleDownloadCV}
                  className="px-8 py-3 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 rounded-lg font-semibold transition duration-300 inline-block"
                >
                  Download CV
                </button>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/blog"
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition duration-300 transform hover:scale-105 inline-block"
                >
                  Read Blogs
                </Link>
                <Link
                  to="/admin/login"
                  className="px-8 py-3 border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900 rounded-lg font-semibold transition duration-300 inline-block"
                >
                  Admin Login
                </Link>
              </div>

              <div className="flex gap-6 pt-8 flex-wrap">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.834 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a4.5 4.5 0 00-4.5-4.5z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
