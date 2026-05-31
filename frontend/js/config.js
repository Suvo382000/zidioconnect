// API Configuration
// Change this URL to your deployed backend URL
// Local: http://localhost:5000/api
// Production: https://your-app-name.onrender.com/api
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://zidioconnect-backend.onrender.com/api';  // ← Change this after deploying backend

const API = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`,
  },
  jobs: {
    list: `${API_BASE_URL}/jobs`,
    single: (id) => `${API_BASE_URL}/jobs/${id}`,
    myJobs: `${API_BASE_URL}/jobs/recruiter/my-jobs`,
    create: `${API_BASE_URL}/jobs`,
    update: (id) => `${API_BASE_URL}/jobs/${id}`,
    delete: (id) => `${API_BASE_URL}/jobs/${id}`,
  },
  applications: {
    apply: `${API_BASE_URL}/applications`,
    myApplications: `${API_BASE_URL}/applications/my-applications`,
    forJob: (jobId) => `${API_BASE_URL}/applications/job/${jobId}`,
    updateStatus: (id) => `${API_BASE_URL}/applications/${id}/status`,
  },
  profile: {
    student: `${API_BASE_URL}/profile/student`,
    recruiter: `${API_BASE_URL}/profile/recruiter`,
    resume: `${API_BASE_URL}/profile/resume`,
    avatar: `${API_BASE_URL}/profile/avatar`,
  },
  bookmarks: {
    list: `${API_BASE_URL}/bookmarks`,
    toggle: (jobId) => `${API_BASE_URL}/bookmarks/${jobId}`,
    check: (jobId) => `${API_BASE_URL}/bookmarks/check/${jobId}`,
  },
  notifications: {
    list: `${API_BASE_URL}/notifications`,
    read: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    readAll: `${API_BASE_URL}/notifications/read-all`,
  },
  admin: {
    users: `${API_BASE_URL}/admin/users`,
    toggleUser: (id) => `${API_BASE_URL}/admin/users/${id}/toggle-status`,
    analytics: `${API_BASE_URL}/admin/analytics`,
    jobs: `${API_BASE_URL}/admin/jobs`,
    deleteJob: (id) => `${API_BASE_URL}/admin/jobs/${id}`,
  }
};
