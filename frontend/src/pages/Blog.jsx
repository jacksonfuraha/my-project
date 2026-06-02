import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../config/api';

export default function Blog() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const isAdmin = Boolean(localStorage.getItem('adminToken'));

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`${API_URL}/api/blogs`);
        if (!response.ok) {
          throw new Error('Unable to load blog posts.');
        }

        const data = await response.json();
        setPosts(data.data || []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    if (!id) {
      setActivePost(null);
      return;
    }

    async function fetchPostById() {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error('Unable to load the requested blog post.');
        }

        const data = await response.json();
        setActivePost(data.data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPostById();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-2">Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold">Insights, updates, and technical stories.</h1>
          <p className="mt-4 text-gray-300 max-w-2xl">
            Read the latest posts about backend architecture, APIs, developer tooling, and project-focused engineering.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={isAdmin ? '/admin' : '/admin/login'}
              className="inline-flex items-center gap-2 rounded-3xl bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600"
            >
              {isAdmin ? 'Create new blog' : 'Admin login'}
            </Link>
          </div>
        </div>

        {loading && <p className="text-gray-300">Loading blog posts...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !activePost && (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.length === 0 ? (
              <div className="rounded-3xl bg-gray-800 p-8 border border-gray-700">
                <h2 className="text-2xl font-semibold mb-3">No posts available yet.</h2>
                <p className="text-gray-400">Check back later or ask the site admin to create a new blog.</p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post._id} className="rounded-3xl bg-gray-800 p-8 border border-gray-700 hover:border-blue-400 transition">
                  <div className="text-xs uppercase tracking-[0.35em] text-blue-400 mb-3">{new Date(post.createdAt).toLocaleDateString()}</div>
                  <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
                  <p className="text-gray-400 mb-6">{post.summary || post.content.slice(0, 180) + '...'}</p>
                  <Link to={`/blog/${post._id}`} className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition">
                    Read full post
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))
            )}
          </div>
        )}

        {!loading && activePost && (
          <div className="space-y-6">
            <Link to="/blog" className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition">
              ← Back to all posts
            </Link>
            <article className="rounded-3xl bg-gray-800 p-10 border border-gray-700 shadow-xl">
              <div className="text-xs uppercase tracking-[0.35em] text-blue-400 mb-4">{new Date(activePost.createdAt).toLocaleDateString()}</div>
              <h2 className="text-4xl font-bold mb-4">{activePost.title}</h2>
              {activePost.summary && <p className="text-gray-300 mb-6">{activePost.summary}</p>}
              <div className="prose prose-invert max-w-none text-gray-100 whitespace-pre-line">{activePost.content}</div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}
