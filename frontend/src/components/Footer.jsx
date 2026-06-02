import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                JF
              </div>
              <span className="text-white font-bold">Portfolio</span>
            </div>
            <p className="text-sm">
              Full Stack Backend Developer crafting scalable solutions for the web.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition">About</Link></li>
              <li><Link to="/skills" className="hover:text-blue-400 transition">Skills</Link></li>
              <li><Link to="/projects" className="hover:text-blue-400 transition">Projects</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="hover:text-blue-400 transition">Blog</Link></li>
              <li><Link to="/admin/login" className="hover:text-blue-400 transition">Admin</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition">GitHub</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">LinkedIn</a></li>
              <li><a href={`${API_URL}/api/profile/resume`} className="hover:text-blue-400 transition">Resume</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:furahajackson188@gmail.com" className="hover:text-blue-400 transition">furahajackson188@gmail.com</a></li>
              <li><a href="tel:+250798435301" className="hover:text-blue-400 transition">+250 798 435 301</a></li>
              <li className="text-gray-500">Nyagatare, Rwanda</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © {currentYear} Jackson Furaha. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
