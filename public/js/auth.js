// 处理登录和注册的JavaScript

// 检查页面类型
const isLoginPage = window.location.pathname.includes('/login');
const isRegisterPage = window.location.pathname.includes('/register');

document.addEventListener('DOMContentLoaded', () => {
  if (isLoginPage) {
    initLoginPage();
  } else if (isRegisterPage) {
    initRegisterPage();
  }
});

// 初始化登录页面
function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

// 处理登录
async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const rememberMe = document.querySelector('input[name="rememberMe"]').checked;

  if (!username || !password) {
    showMessage('message', '请填写用户名和密码', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage('message', data.error || '登录失败', 'error');
      return;
    }

    // 保存token
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (rememberMe) {
        localStorage.setItem('rememberUsername', username);
      }
    }

    // 保存用户信息
    if (data.user) {
      setUserId(data.user.id);
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }

    showMessage('message', '登录成功，正在跳转...', 'success');

    // 2秒后跳转到仪表板
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  } catch (error) {
    showMessage('message', error.message || '登录失败，请重试', 'error');
  }
}

// 初始化注册页面
function initRegisterPage() {
  const registerForm = document.getElementById('registerForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // 实时验证密码匹配
  if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.style.borderColor = '#e74c3c';
      } else {
        confirmPasswordInput.style.borderColor = '#3498db';
      }
    });
  }
}

// 处理注册
async function handleRegister(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const real_name = document.getElementById('realName').value.trim();
  const student_id = document.getElementById('studentId').value.trim();
  const college = document.getElementById('college').value.trim();
  const major = document.getElementById('major').value.trim();

  // 验证输入
  if (!username || !email || !password || !confirmPassword) {
    showMessage('message', '请填写所有必填项', 'error');
    return;
  }

  if (username.length < 3 || username.length > 16) {
    showMessage('message', '用户名长度必须在3-16个字符之间', 'error');
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showMessage('message', '用户名只能包含字母、数字和下划线', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('message', '密码长度至少为6位', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('message', '两次输入的密码不一致', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword,
        real_name: real_name || null,
        student_id: student_id || null,
        college: college || null,
        major: major || null
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage('message', data.error || '注册失败', 'error');
      return;
    }

    showMessage('message', '注册成功！即将跳转到登录页面...', 'success');

    // 2秒后跳转到登录页
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  } catch (error) {
    showMessage('message', error.message || '注册失败，请重试', 'error');
  }
}

// 页面加载时，如果有记住的用户名，自动填充
window.addEventListener('DOMContentLoaded', () => {
  if (isLoginPage) {
    const remembered = localStorage.getItem('rememberUsername');
    if (remembered) {
      document.getElementById('username').value = remembered;
    }
  }
});
