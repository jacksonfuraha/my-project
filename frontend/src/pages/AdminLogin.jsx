import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in.');
      }

      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminEmail', email);
      try {
        const profileResp = await fetch(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${data.data.token}` },
        });
        if (profileResp.ok) {
          const profileData = await profileResp.json().catch(() => null);
          if (profileData?.data?.name) {
            localStorage.setItem('adminName', profileData.data.name);
          }
          if (profileData?.data?.profileImage) {
            localStorage.setItem('profileImage', profileData.data.profileImage);
          }
          window.dispatchEvent(new Event('authChanged'));
        }
      } catch (e) {
        // ignore profile fetch errors here
      }
      navigate('/admin');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gray-800 border border-gray-700 p-10 shadow-xl">
          <h1 className="text-4xl font-bold mb-3">Admin login</h1>
          <p className="text-gray-400 mb-8">Sign in to manage blog posts and perform create, update, or delete actions.</p>

          {error && <div className="mb-6 rounded-2xl border border-red-500 bg-red-950/40 p-4 text-red-200">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in as admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
