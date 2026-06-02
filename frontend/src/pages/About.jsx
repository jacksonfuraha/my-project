import { useEffect, useState } from 'react';
import { API_URL } from '../config/api';

export default function About() {
  const [resumeAvailable, setResumeAvailable] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [loaded, setLoaded] = useState(false);

  const getResumeUrl = (url) => {
    if (!url) return '';
    return new URL(url, API_URL).href;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/profile`);
        const data = await response.json();
        if (response.ok && data.data?.resumeUrl) {
          setResumeAvailable(true);
          setResumeUrl(data.data.resumeUrl);
        }
      } catch (err) {
        console.error('Unable to load profile:', err);
      } finally {
        setLoaded(true);
      }
    };

    fetchProfile();
  }, []);

  return (
    <section className="pt-32 pb-20 bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left - Stats */}
          <div className="space-y-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              I'm a passionate full-stack backend developer with 5+ years of experience
              building scalable web applications and enterprise solutions. I specialize in
              designing high-performance systems, optimizing databases, and architecting
              microservices that handle millions of requests.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              My journey in tech started with a curiosity about how things work behind the scenes.
              Over the years, I've developed a strong foundation in computer science principles
              and practical expertise in modern backend technologies.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="bg-gray-700 p-6 rounded-lg text-center hover:bg-blue-500 transition duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                <p className="text-gray-300">Projects</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg text-center hover:bg-blue-500 transition duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-2">5+</div>
                <p className="text-gray-300">Years Exp.</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg text-center hover:bg-blue-500 transition duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-2">30+</div>
                <p className="text-gray-300">Clients</p>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-6">
            <div className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold text-blue-400 mb-2">🎯 My Focus</h3>
              <p className="text-gray-300">
                Building maintainable, efficient backend systems using best practices
                and modern technologies.
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold text-blue-400 mb-2">🚀 What I Do</h3>
              <p className="text-gray-300">
                Design APIs, optimize databases, manage cloud infrastructure, and mentor
                junior developers.
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold text-blue-400 mb-2">💡 Philosophy</h3>
              <p className="text-gray-300">
                Clean code, performance matters, and user experience starts from the backend.
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold text-blue-400 mb-2">📄 Resume</h3>
              {loaded ? (
                resumeAvailable ? (
                  <a
                    href={getResumeUrl(resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition"
                  >
                    Download Resume
                  </a>
                ) : (
                  <p className="text-gray-300">Resume is not available yet.</p>
                )
              ) : (
                <p className="text-gray-400">Loading resume status...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
