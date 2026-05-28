import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const sectionTabs = [
  { value: 'blogs', label: 'Blogs' },
  { value: 'messages', label: 'Messages' },
  { value: 'skills', label: 'Skills' },
  { value: 'projects', label: 'Projects' },
  { value: 'profile', label: 'Profile' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [confirmModal, setConfirmModal] = useState({ visible: false, message: '', actionType: '', targetId: null });
  const [activeTab, setActiveTab] = useState('blogs');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const [counts, setCounts] = useState({ blogs: 0, messages: 0, skills: 0, projects: 0 });

  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSelectedId, setBlogSelectedId] = useState(null);

  const [messages, setMessages] = useState([]);

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Backend');
  const [skillProficiency, setSkillProficiency] = useState('Intermediate');
  const [skillOrder, setSkillOrder] = useState(0);
  const [skillIcon, setSkillIcon] = useState('');
  const [skillSelectedId, setSkillSelectedId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectIcon, setProjectIcon] = useState('💻');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [projectOrder, setProjectOrder] = useState(0);
  const [projectSelectedId, setProjectSelectedId] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    bio: '',
    yearsExperience: 0,
    projectsCompleted: 0,
    clientsServed: 0,
    profileImage: '',
    resumeUrl: '',
  });
  const [profileImageFileName, setProfileImageFileName] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const profileImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    refreshAll();
  }, [navigate, token]);

  useEffect(() => {
    const onAuthChanged = () => {
      setToken(localStorage.getItem('adminToken'));
    };

    window.addEventListener('authChanged', onAuthChanged);
    window.addEventListener('storage', onAuthChanged);
    return () => {
      window.removeEventListener('authChanged', onAuthChanged);
      window.removeEventListener('storage', onAuthChanged);
    };
  }, []);

  const headers = token
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    : {
        'Content-Type': 'application/json',
      };
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const setSectionCount = (section, items) => {
    setCounts((prev) => ({ ...prev, [section]: items.length }));
  };

  const handleFetchError = async (response, fallbackMessage) => {
    const body = await response.json().catch(() => null);
    const message = body?.message || fallbackMessage;
    throw new Error(message);
  };

  const uploadProfileImage = async (file) => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await fetch(`${API_URL}/api/profile/image`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });
      if (!response.ok) return handleFetchError(response, 'Unable to upload profile image.');
      const data = await response.json();
      setProfileData((prev) => ({ ...prev, profileImage: data.data.profileImage || '' }));
      setProfileImageFileName(file.name);
      setStatus('Profile image uploaded successfully.');
      try {
        if (data?.data?.profileImage) {
          localStorage.setItem('profileImage', data.data.profileImage);
          window.dispatchEvent(new Event('authChanged'));
        }
      } catch (e) {
        // ignore localStorage errors
      }
    } catch (uploadError) {
      setErrorAndClearStatus(uploadError.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadResumeFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await fetch(`${API_URL}/api/profile/resume-file`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });
      if (!response.ok) return handleFetchError(response, 'Unable to upload resume file.');
      const data = await response.json();
      setProfileData((prev) => ({ ...prev, resumeUrl: data.data.resumeUrl || '' }));
      setResumeFileName(file.name);
      setStatus('Resume uploaded successfully.');
    } catch (uploadError) {
      setErrorAndClearStatus(uploadError.message);
    } finally {
      setLoading(false);
    }
  };

  async function fetchBlogs() {
    const response = await fetch(`${API_URL}/api/blogs`, { headers });
    if (!response.ok) return handleFetchError(response, 'Unable to load blog posts.');
    const data = await response.json();
    setBlogs(data.data || []);
    setSectionCount('blogs', data.data || []);
  }

  async function fetchMessages() {
    const response = await fetch(`${API_URL}/api/contact`, { headers });
    if (!response.ok) return handleFetchError(response, 'Unable to load messages.');
    const data = await response.json();
    setMessages(data.data || []);
    setSectionCount('messages', data.data || []);
  }

  async function fetchSkills() {
    const response = await fetch(`${API_URL}/api/skills`, { headers });
    if (!response.ok) return handleFetchError(response, 'Unable to load skills.');
    const data = await response.json();
    setSkills(data.data || []);
    setSectionCount('skills', data.data || []);
  }

  async function fetchProjects() {
    const response = await fetch(`${API_URL}/api/projects`, { headers });
    if (!response.ok) return handleFetchError(response, 'Unable to load projects.');
    const data = await response.json();
    setProjects(data.data || []);
    setSectionCount('projects', data.data || []);
  }

  async function fetchProfile() {
    const response = await fetch(`${API_URL}/api/profile`, { headers });
    if (!response.ok) return handleFetchError(response, 'Unable to load profile.');
    const data = await response.json();
    setProfileData({
      name: data.data.name || '',
      title: data.data.title || '',
      bio: data.data.bio || '',
      yearsExperience: data.data.yearsExperience || 0,
      projectsCompleted: data.data.projectsCompleted || 0,
      clientsServed: data.data.clientsServed || 0,
      profileImage: data.data.profileImage || '',
      resumeUrl: data.data.resumeUrl || '',
    });
    try {
      if (data?.data?.name) {
        localStorage.setItem('adminName', data.data.name);
      }
      if (data?.data?.profileImage) {
        localStorage.setItem('profileImage', data.data.profileImage);
      }
      window.dispatchEvent(new Event('authChanged'));
    } catch (e) {
      // ignore localStorage errors
    }
  }

  async function refreshAll() {
    try {
      setError('');
      await Promise.all([fetchBlogs(), fetchMessages(), fetchSkills(), fetchProjects(), fetchProfile()]);
    } catch (fetchError) {
      setError(fetchError.message);
    }
  }

  const clearBlogForm = () => {
    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
    setBlogSelectedId(null);
  };

  const clearSkillForm = () => {
    setSkillName('');
    setSkillCategory('Backend');
    setSkillProficiency('Intermediate');
    setSkillOrder(0);
    setSkillIcon('');
    setSkillSelectedId(null);
  };

  const clearProjectForm = () => {
    setProjectTitle('');
    setProjectDescription('');
    setProjectTech('');
    setProjectIcon('💻');
    setProjectGithub('');
    setProjectDemo('');
    setProjectFeatured(false);
    setProjectOrder(0);
    setProjectSelectedId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    setToken(null);
    window.dispatchEvent(new Event('authChanged'));
    navigate('/admin/login');
  };

  const showConfirm = (message, actionType, targetId) => {
    setConfirmModal({ visible: true, message, actionType, targetId });
  };

  const hideConfirm = () => {
    setConfirmModal({ visible: false, message: '', actionType: '', targetId: null });
  };

  const confirmAction = async () => {
    if (!confirmModal.actionType || !confirmModal.targetId) return;
    const { actionType, targetId } = confirmModal;
    hideConfirm();
    setLoading(true);
    try {
      if (actionType === 'deleteBlog') {
        await handleBlogDelete(targetId);
      } else if (actionType === 'deleteMessage') {
        await handleMessageDelete(targetId);
      } else if (actionType === 'deleteSkill') {
        await handleSkillDelete(targetId);
      } else if (actionType === 'deleteProject') {
        await handleProjectDelete(targetId);
      }
    } catch (err) {
      // action already handles errors
    } finally {
      setLoading(false);
    }
  };

  const setErrorAndClearStatus = (message) => {
    setError(message);
    setStatus('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setStatus('');
  };

  const handleBlogSave = async (event) => {
    event.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      return setErrorAndClearStatus('Blog title and content are required.');
    }

    setLoading(true);
    try {
      const method = blogSelectedId ? 'PUT' : 'POST';
      const url = blogSelectedId ? `${API_URL}/api/blogs/${blogSelectedId}` : `${API_URL}/api/blogs`;
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({ title: blogTitle, summary: blogSummary, content: blogContent }),
      });
      if (!response.ok) return handleFetchError(response, 'Unable to save blog post.');
      setStatus(blogSelectedId ? 'Blog updated successfully.' : 'Blog created successfully.');
      clearBlogForm();
      await fetchBlogs();
    } catch (saveError) {
      setErrorAndClearStatus(saveError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogEdit = (blog) => {
    setBlogSelectedId(blog._id);
    setBlogTitle(blog.title);
    setBlogSummary(blog.summary || '');
    setBlogContent(blog.content);
    setError('');
    setStatus('');
    setActiveTab('blogs');
  };

  const handleBlogDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) return handleFetchError(response, 'Unable to delete blog post.');
      setStatus('Blog deleted successfully.');
      if (blogSelectedId === id) clearBlogForm();
      await fetchBlogs();
    } catch (deleteError) {
      setErrorAndClearStatus(deleteError.message);
    }
  };

  const requestBlogDelete = (id) => {
    showConfirm('Delete this blog post?', 'deleteBlog', id);
  };

  const handleMessageRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/contact/${id}/read`, {
        method: 'PATCH',
        headers,
      });
      if (!response.ok) return handleFetchError(response, 'Unable to mark message read.');
      setStatus('Message marked as read.');
      await fetchMessages();
    } catch (markError) {
      setErrorAndClearStatus(markError.message);
    }
  };

  const handleMessageDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/contact/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) return handleFetchError(response, 'Unable to delete message.');
      setStatus('Message deleted successfully.');
      await fetchMessages();
    } catch (deleteError) {
      setErrorAndClearStatus(deleteError.message);
    }
  };

  const requestMessageDelete = (id) => {
    showConfirm('Delete this message?', 'deleteMessage', id);
  };

  const handleSkillSave = async (event) => {
    event.preventDefault();
    if (!skillName.trim()) return setErrorAndClearStatus('Skill name is required.');

    setLoading(true);
    try {
      const method = skillSelectedId ? 'PUT' : 'POST';
      const url = skillSelectedId ? `${API_URL}/api/skills/${skillSelectedId}` : `${API_URL}/api/skills`;
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          name: skillName,
          category: skillCategory,
          proficiency: skillProficiency,
          order: Number(skillOrder),
          icon: skillIcon || undefined,
        }),
      });
      if (!response.ok) return handleFetchError(response, 'Unable to save skill.');
      setStatus(skillSelectedId ? 'Skill updated successfully.' : 'Skill created successfully.');
      clearSkillForm();
      await fetchSkills();
    } catch (saveError) {
      setErrorAndClearStatus(saveError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillEdit = (skill) => {
    setSkillSelectedId(skill._id);
    setSkillName(skill.name);
    setSkillCategory(skill.category);
    setSkillProficiency(skill.proficiency || 'Intermediate');
    setSkillOrder(skill.order || 0);
    setSkillIcon(skill.icon || '');
    setError('');
    setStatus('');
    setActiveTab('skills');
  };

  const handleSkillDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/skills/${id}`, { method: 'DELETE', headers });
      if (!response.ok) return handleFetchError(response, 'Unable to delete skill.');
      setStatus('Skill deleted successfully.');
      if (skillSelectedId === id) clearSkillForm();
      await fetchSkills();
    } catch (deleteError) {
      setErrorAndClearStatus(deleteError.message);
    }
  };

  const requestSkillDelete = (id) => {
    showConfirm('Delete this skill?', 'deleteSkill', id);
  };

  const handleProjectSave = async (event) => {
    event.preventDefault();
    if (!projectTitle.trim() || !projectDescription.trim() || !projectTech.trim()) {
      return setErrorAndClearStatus('Title, description, and tech stack are required.');
    }

    setLoading(true);
    try {
      const techArray = projectTech.split(',').map((value) => value.trim()).filter(Boolean);
      const method = projectSelectedId ? 'PUT' : 'POST';
      const url = projectSelectedId ? `${API_URL}/api/projects/${projectSelectedId}` : `${API_URL}/api/projects`;
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          tech: techArray,
          icon: projectIcon,
          github: projectGithub || '#',
          demo: projectDemo || '#',
          featured: projectFeatured,
          order: Number(projectOrder),
        }),
      });
      if (!response.ok) return handleFetchError(response, 'Unable to save project.');
      setStatus(projectSelectedId ? 'Project updated successfully.' : 'Project created successfully.');
      clearProjectForm();
      await fetchProjects();
    } catch (saveError) {
      setErrorAndClearStatus(saveError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectEdit = (project) => {
    setProjectSelectedId(project._id);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectTech((project.tech || []).join(', '));
    setProjectIcon(project.icon || '💻');
    setProjectGithub(project.github || '');
    setProjectDemo(project.demo || '');
    setProjectFeatured(Boolean(project.featured));
    setProjectOrder(project.order || 0);
    setError('');
    setStatus('');
    setActiveTab('projects');
  };

  const handleProjectDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE', headers });
      if (!response.ok) return handleFetchError(response, 'Unable to delete project.');
      setStatus('Project deleted successfully.');
      if (projectSelectedId === id) clearProjectForm();
      await fetchProjects();
    } catch (deleteError) {
      setErrorAndClearStatus(deleteError.message);
    }
  };

  const requestProjectDelete = (id) => {
    showConfirm('Delete this project?', 'deleteProject', id);
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...profileData,
          yearsExperience: Number(profileData.yearsExperience),
          projectsCompleted: Number(profileData.projectsCompleted),
          clientsServed: Number(profileData.clientsServed),
        }),
      });
      if (!response.ok) return handleFetchError(response, 'Unable to save profile.');
      setStatus('Profile updated successfully.');
      await fetchProfile();
    } catch (saveError) {
      setErrorAndClearStatus(saveError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-2">Admin dashboard</p>
            <h1 className="text-4xl md:text-5xl font-bold">Manage the portfolio</h1>
            <p className="mt-2 text-gray-400 max-w-2xl">
              Review messages, maintain blog content, update projects, manage skills, and edit profile details from one admin panel.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-3xl bg-red-600 px-6 py-3 text-white font-semibold transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-10">
          {sectionTabs.map((section) => (
            <div key={section.value} className="rounded-3xl border border-gray-700 bg-gray-800 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-400">{section.label}</p>
                <span className="text-xl font-bold text-white">{counts[section.value] ?? 0}</span>
              </div>
              <button
                type="button"
                onClick={() => handleTabChange(section.value)}
                className="mt-5 w-full rounded-3xl border border-blue-500 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
              >
                Open
              </button>
            </div>
          ))}
        </div>

        {error && <div className="mb-6 rounded-3xl border border-red-500 bg-red-950/40 p-4 text-red-200">{error}</div>}
        {status && <div className="mb-6 rounded-3xl border border-green-500 bg-green-950/40 p-4 text-green-200">{status}</div>}

        {confirmModal.visible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-3xl bg-gray-900 border border-gray-700 p-6 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4">Confirm action</h3>
              <p className="text-gray-300 mb-6">{confirmModal.message}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={hideConfirm}
                  className="rounded-3xl border border-gray-700 bg-gray-800 px-5 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAction}
                  className="rounded-3xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-3xl bg-gray-800 border border-gray-700 p-8">
          <div className="mb-6 flex flex-wrap gap-3">
            {sectionTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === tab.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'blogs' && (
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl bg-gray-900 border border-gray-700 p-8">
                <h2 className="text-2xl font-semibold mb-4">Create / Edit Blog</h2>
                <form onSubmit={handleBlogSave} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="blog-title">Title</label>
                    <input
                      id="blog-title"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="blog-summary">Summary</label>
                    <input
                      id="blog-summary"
                      value={blogSummary}
                      onChange={(e) => setBlogSummary(e.target.value)}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="blog-content">Content</label>
                    <textarea
                      id="blog-content"
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      rows={10}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-3xl bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600 disabled:opacity-50"
                    >
                      {blogSelectedId ? 'Update blog' : 'Publish blog'}
                    </button>
                    {blogSelectedId && (
                      <button
                        type="button"
                        onClick={clearBlogForm}
                        className="rounded-3xl border border-gray-700 px-6 py-3 text-gray-200 hover:border-blue-400 hover:text-white transition"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="rounded-3xl bg-gray-900 border border-gray-700 p-8">
                <h2 className="text-2xl font-semibold mb-4">Blog posts</h2>
                {blogs.length === 0 ? (
                  <p className="text-gray-400">No blog posts available.</p>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="rounded-3xl border border-gray-700 bg-gray-800 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{new Date(blog.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                handleBlogEdit(blog);
                              }}
                              className="rounded-3xl bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                requestBlogDelete(blog._id);
                              }}
                              className="rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-gray-900 border border-gray-700 p-8">
                <h2 className="text-2xl font-semibold mb-4">Incoming messages</h2>
                {messages.length === 0 ? (
                  <p className="text-gray-400">No messages yet.</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message._id} className="rounded-3xl border border-gray-700 bg-gray-800 p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className="text-lg font-semibold">{message.subject}</span>
                              <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs uppercase tracking-[0.25em] text-blue-200">
                                {message.read ? 'Read' : 'Unread'}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">From {message.name} • {message.email}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {!message.read && (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleMessageRead(message._id);
                                }}
                                className="rounded-3xl bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-600"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                requestMessageDelete(message._id);
                              }}
                              className="rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="mt-4 text-gray-300 whitespace-pre-line">{message.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl bg-gray-900 border border-gray-700 p-8">
                <h2 className="text-2xl font-semibold mb-4">Create / Edit Skill</h2>
                <form onSubmit={handleSkillSave} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="skill-name">Name</label>
                    <input
                      id="skill-name"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="skill-category">Category</label>
                      <select
                        id="skill-category"
                        value={skillCategory}
                        onChange={(e) => setSkillCategory(e.target.value)}
                        className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                      >
                        <option>Frontend</option>
                        <option>Backend</option>
                        <option>Database</option>
                        <option>DevOps</option>
                        <option>Tools</option>
                        <option>Languages</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="skill-proficiency">Proficiency</label>
                      <select
                        id="skill-proficiency"
                        value={skillProficiency}
                        onChange={(e) => setSkillProficiency(e.target.value)}
                        className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="skill-icon">Icon</label>
                      <input
                        id="skill-icon"
                        value={skillIcon}
                        onChange={(e) => setSkillIcon(e.target.value)}
                        className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="skill-order">Order</label>
                      <input
                        id="skill-order"
                        type="number"
                        value={skillOrder}
                        onChange={(e) => setSkillOrder(Number(e.target.value))}
                        className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-3xl bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600 disabled:opacity-50"
                    >
                      {skillSelectedId ? 'Update skill' : 'Publish skill'}
                    </button>
                    {skillSelectedId && (
                      <button
                        type="button"
                        onClick={clearSkillForm}
                        className="rounded-3xl border border-gray-700 px-6 py-3 text-gray-200 hover:border-blue-400 hover:text-white transition"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="rounded-3xl bg-gray-900 border border-gray-700 p-8">
                <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                {skills.length === 0 ? (
                  <p className="text-gray-400">No skills available.</p>
                ) : (
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill._id} className="rounded-3xl border border-gray-700 bg-gray-800 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{skill.name}</h3>
                            <p className="text-gray-400 text-sm">{skill.category} • {skill.proficiency}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                handleSkillEdit(skill);
                              }}
                              className="rounded-3xl bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                requestSkillDelete(skill._id);
                              }}
                              className="rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl bg-gray-900 border border-gray-700 p-8">
                <h2 className="text-2xl font-semibold mb-4">Create / Edit Project</h2>
                <form onSubmit={handleProjectSave} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="project-title">Title</label>
                    <input
                      id="project-title"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="project-description">Description</label>
                    <textarea
                      id="project-description"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      rows={5}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="project-tech">Tech stack (comma-separated)</label>
                    <input
                      id="project-tech"
                      value={projectTech}
                      onChange={(e) => setProjectTech(e.target.value)}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="project-icon">Icon</label>
                      <input
                        id="project-icon"
                        value={projectIcon}
                        onChange={(e) => setProjectIcon(e.target.value)}
                        className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="project-github">GitHub URL</label>
                      <input
                        id="project-github"
                        value={projectGithub}
                        onChange={(e) => setProjectGithub(e.target.value)}
                        className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="project-demo">Demo URL</label>
                      <input
                        id="project-demo"
                        value={projectDemo}
                        onChange={(e) => setProjectDemo(e.target.value)}
                        className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2" htmlFor="project-order">Order</label>
                      <input
                        id="project-order"
                        type="number"
                        value={projectOrder}
                        onChange={(e) => setProjectOrder(Number(e.target.value))}
                        className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 text-gray-300">
                      <input
                        type="checkbox"
                        checked={projectFeatured}
                        onChange={(e) => setProjectFeatured(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500"
                      />
                      Featured project
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-3xl bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600 disabled:opacity-50"
                    >
                      {projectSelectedId ? 'Update project' : 'Publish project'}
                    </button>
                    {projectSelectedId && (
                      <button
                        type="button"
                        onClick={clearProjectForm}
                        className="rounded-3xl border border-gray-700 px-6 py-3 text-gray-200 hover:border-blue-400 hover:text-white transition"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="rounded-3xl bg-gray-900 border border-gray-700 p-8">
                <h2 className="text-2xl font-semibold mb-4">Projects</h2>
                {projects.length === 0 ? (
                  <p className="text-gray-400">No projects available.</p>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project._id} className="rounded-3xl border border-gray-700 bg-gray-800 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <p className="text-gray-400 text-sm">{(project.tech || []).join(', ')}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                handleProjectEdit(project);
                              }}
                              className="rounded-3xl bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                requestProjectDelete(project._id);
                              }}
                              className="rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="rounded-3xl bg-gray-900 border border-gray-700 p-8">
              <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="profile-name">Name</label>
                  <input
                    id="profile-name"
                    value={profileData.name}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="profile-title">Title</label>
                  <input
                    id="profile-title"
                    value={profileData.title}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2" htmlFor="profile-bio">Bio</label>
                  <textarea
                    id="profile-bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="profile-years">Years experience</label>
                    <input
                      id="profile-years"
                      type="number"
                      value={profileData.yearsExperience}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, yearsExperience: Number(e.target.value) }))}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="profile-projects">Projects completed</label>
                    <input
                      id="profile-projects"
                      type="number"
                      value={profileData.projectsCompleted}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, projectsCompleted: Number(e.target.value) }))}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="profile-clients">Clients served</label>
                    <input
                      id="profile-clients"
                      type="number"
                      value={profileData.clientsServed}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, clientsServed: Number(e.target.value) }))}
                      className="w-full rounded-3xl border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-gray-300 mb-2">Profile image</label>
                    <button
                      type="button"
                      onClick={() => profileImageInputRef.current?.click()}
                      className="w-full rounded-3xl bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600"
                    >
                      Upload profile image
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={profileImageInputRef}
                      className="hidden"
                      onChange={(e) => uploadProfileImage(e.target.files?.[0])}
                    />
                    {profileImageFileName && (
                      <p className="mt-2 text-sm text-gray-400">Selected: {profileImageFileName}</p>
                    )}
                    {profileData.profileImage && (
                      <img
                        src={profileData.profileImage}
                        alt="Current profile"
                        className="mt-3 h-24 w-24 rounded-full object-cover border border-gray-700"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Resume file</label>
                    <button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="w-full rounded-3xl bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600"
                    >
                      Upload resume
                    </button>
                    <input
                      type="file"
                      accept="application/pdf"
                      ref={resumeInputRef}
                      className="hidden"
                      onChange={(e) => uploadResumeFile(e.target.files?.[0])}
                    />
                    {resumeFileName && (
                      <p className="mt-2 text-sm text-gray-400">Selected: {resumeFileName}</p>
                    )}
                    {profileData.resumeUrl && (
                      <a
                        href={new URL(profileData.resumeUrl, API_URL).href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm text-blue-300 hover:text-blue-100"
                      >
                        View current resume
                      </a>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-3xl bg-blue-500 px-6 py-3 text-white font-semibold transition hover:bg-blue-600 disabled:opacity-50"
                >
                  Save profile
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
