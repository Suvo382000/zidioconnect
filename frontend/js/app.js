// ===== Main Application JS =====

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initScrollAnimations();
  initParticles();
  initCounters();
  updateNavAuth();
  loadLatestJobs();
  initHeroSearch();
});

// Page Loader
function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('page-loader')?.classList.add('loaded');
    }, 1500);
  });
}

// Navbar
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('show');
  });

  // User dropdown
  const userAvatar = document.getElementById('user-avatar');
  const dropdownMenu = document.getElementById('dropdown-menu');
  userAvatar?.addEventListener('click', () => {
    dropdownMenu?.classList.toggle('show');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown')) {
      dropdownMenu?.classList.remove('show');
    }
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout();
  });
}

// Update nav based on auth state
function updateNavAuth() {
  const navAuth = document.getElementById('nav-auth');
  const navUser = document.getElementById('nav-user');

  if (Auth.isLoggedIn()) {
    navAuth?.classList.add('hidden');
    navUser?.classList.remove('hidden');
    loadNotificationCount();
  } else {
    navAuth?.classList.remove('hidden');
    navUser?.classList.add('hidden');
  }
}

// Load notification count
async function loadNotificationCount() {
  try {
    const res = await fetch(API.notifications.list, { headers: Auth.getHeaders() });
    if (res.ok) {
      const data = await res.json();
      const badge = document.getElementById('notification-badge');
      if (badge && data.unread_count > 0) {
        badge.textContent = data.unread_count;
        badge.classList.remove('hidden');
      }
    }
  } catch (err) { /* silent */ }
}

// Scroll Animations (Intersection Observer)
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-fade-up, .animate-fade-down, .animate-slide-left, .animate-slide-right, .animate-scale, .stagger-children').forEach(el => {
    observer.observe(el);
  });
}

// Particles Background
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 100 + 20;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
    container.appendChild(particle);
  }
}

// Counter Animation
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 30);
}

// Load Latest Jobs on Homepage
async function loadLatestJobs() {
  const grid = document.getElementById('latest-jobs-grid');
  if (!grid) return;

  try {
    const res = await fetch(`${API.jobs.list}?limit=6`);
    if (res.ok) {
      const data = await res.json();
      if (data.jobs && data.jobs.length > 0) {
        grid.innerHTML = data.jobs.map(job => createJobCard(job)).join('');
      } else {
        grid.innerHTML = `<div class="no-data"><p>No jobs posted yet. Check back soon!</p></div>`;
      }
    } else {
      grid.innerHTML = `<div class="no-data"><p>Unable to load jobs. Make sure the backend is running.</p></div>`;
    }
  } catch (err) {
    grid.innerHTML = `<div class="no-data"><p>Connect to backend at ${API_BASE_URL} to see jobs.</p></div>`;
  }
}

// Create Job Card HTML
function createJobCard(job) {
  const logo = job.company_name ? job.company_name.charAt(0) : 'C';
  const salary = job.salary_min && job.salary_max
    ? `₹${(job.salary_min/1000).toFixed(0)}K - ₹${(job.salary_max/1000).toFixed(0)}K`
    : 'Not disclosed';
  const skills = job.skills_required ? job.skills_required.split(',').slice(0, 3) : [];
  const badgeClass = job.type === 'internship' ? 'badge-internship' : 'badge-job';

  return `
    <div class="job-card hover-lift">
      <span class="job-type-badge ${badgeClass}">${job.type}</span>
      <div class="job-card-header">
        <div class="job-company-logo">${logo}</div>
        <div class="job-card-info">
          <h3>${job.title}</h3>
          <span class="company-name">${job.company_name || 'Company'}</span>
        </div>
      </div>
      <div class="job-card-tags">
        ${skills.map(s => `<span class="job-tag">${s.trim()}</span>`).join('')}
        ${job.work_mode ? `<span class="job-tag"><i class="fas fa-globe"></i> ${job.work_mode}</span>` : ''}
      </div>
      <div class="job-card-footer">
        <span class="job-salary">${salary}</span>
        <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location || 'Remote'}</span>
      </div>
    </div>
  `;
}

// Hero Search
function initHeroSearch() {
  const btn = document.getElementById('hero-search-btn');
  const input = document.getElementById('hero-search-input');

  btn?.addEventListener('click', () => {
    const search = input?.value || '';
    const type = document.getElementById('hero-search-type')?.value || '';
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    window.location.href = `${getBasePath()}pages/jobs.html?${params.toString()}`;
  });

  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btn?.click();
  });
}

// Toast Notification
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Button Ripple Effect
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  ripple.style.left = (e.clientX - rect.left) + 'px';
  ripple.style.top = (e.clientY - rect.top) + 'px';
  ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});
