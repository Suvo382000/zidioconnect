// Authentication Module
const Auth = {
  getToken() {
    return localStorage.getItem('zidio_token');
  },

  getUser() {
    const user = localStorage.getItem('zidio_user');
    return user ? JSON.parse(user) : null;
  },

  setAuth(token, user) {
    localStorage.setItem('zidio_token', token);
    localStorage.setItem('zidio_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('zidio_token');
    localStorage.removeItem('zidio_user');
    window.location.href = getBasePath() + 'index.html';
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  requireAuth(allowedRoles = []) {
    if (!this.isLoggedIn()) {
      window.location.href = getBasePath() + 'pages/login.html';
      return false;
    }
    if (allowedRoles.length > 0) {
      const user = this.getUser();
      if (!allowedRoles.includes(user.role)) {
        window.location.href = getBasePath() + 'pages/dashboard.html';
        return false;
      }
    }
    return true;
  }
};

function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/pages/')) return '../';
  return '';
}
