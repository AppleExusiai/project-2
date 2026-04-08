// 通用工具函数
const API_BASE_URL = '/api';

// 显示消息
function showMessage(elementId, message, type = 'success') {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';

    // 5秒后自动隐藏
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}

// 检查用户登记状态
async function checkAuthStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('检查认证状态失败:', error);
    return { isLoggedIn: false };
  }
}

// 更新导航栏
async function updateNavBar() {
  const status = await checkAuthStatus();
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');

  if (authButtons && userMenu) {
    if (status.isLoggedIn && status.user) {
      authButtons.style.display = 'none';
      userMenu.style.display = 'flex';
      document.getElementById('userName').textContent = status.user.username;
      
      // 设置用户头像
      const avatarUrl = status.user.avatar_url || '/images/default_avatar.jpg';
      document.getElementById('userAvatar').src = avatarUrl;
    } else {
      authButtons.style.display = 'flex';
      userMenu.style.display = 'none';
    }
  }
}

// 登出函数
async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    
    localStorage.removeItem('token');
    window.location.href = '/';
  } catch (error) {
    console.error('登出失败:', error);
  }
}

// 获取用户ID
function getUserId() {
  return sessionStorage.getItem('userId') || localStorage.getItem('userId');
}

// 设置用户ID
function setUserId(id) {
  sessionStorage.setItem('userId', id);
  localStorage.setItem('userId', id);
}

// API请求函数（带认证）
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '请求失败');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 页面加载时更新导航栏
document.addEventListener('DOMContentLoaded', () => {
  updateNavBar();

  // 登出按钮事件
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('确定要登出吗？')) {
        logout();
      }
    });
  }
});

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 防抖函数
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
