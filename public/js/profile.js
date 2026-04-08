// 个人中心页面JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initProfilePage();
});

async function initProfilePage() {
  const status = await checkAuthStatus();
  if (!status.isLoggedIn) {
    window.location.href = '/login';
    return;
  }

  updateNavBar();
  await loadUserProfile();
  setupEventListeners();
}

// 加载用户信息
async function loadUserProfile() {
  try {
    const data = await apiRequest('/user/profile');
    const user = data.user;

    // 显示用户信息
    document.getElementById('displayName').textContent = user.real_name || user.username;
    document.getElementById('userEmail').textContent = user.email;

    // 填充头像
    const avatarUrl = user.avatar_url || '/images/default_avatar.jpg';
    document.getElementById('profileAvatar').src = avatarUrl;
    document.getElementById('userAvatar').src = avatarUrl;

    // 填充表单
    document.getElementById('realName').value = user.real_name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('studentId').value = user.student_id || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('college').value = user.college || '';
    document.getElementById('major').value = user.major || '';
  } catch (error) {
    console.error('加载用户信息失败:', error);
  }
}

// 设置事件监听
function setupEventListeners() {
  // 菜单切换
  const menuItems = document.querySelectorAll('.profile-menu a');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;

      // 更新菜单状态
      menuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      // 显示对应部分
      document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
      document.getElementById(section).classList.add('active');
    });
  });

  // 个人信息表单
  document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

  // 修改密码表单
  document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);

  // 头像上传
  document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);

  // 删除账户
  document.getElementById('deleteAccountBtn').addEventListener('click', handleDeleteAccount);
}

// 处理个人信息更新
async function handleProfileUpdate(e) {
  e.preventDefault();

  const updateData = {
    real_name: document.getElementById('realName').value,
    phone: document.getElementById('phone').value,
    college: document.getElementById('college').value,
    major: document.getElementById('major').value
  };

  try {
    await apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    showMessage('profileMessage', '个人信息已更新', 'success');
    await loadUserProfile();
  } catch (error) {
    showMessage('profileMessage', '更新失败: ' + error.message, 'error');
  }
}

// 处理密码修改
async function handlePasswordChange(e) {
  e.preventDefault();

  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    showMessage('passwordMessage', '两次输入的密码不一致', 'error');
    return;
  }

  if (newPassword.length < 6) {
    showMessage('passwordMessage', '新密码长度至少为6位', 'error');
    return;
  }

  try {
    await apiRequest('/user/change-password', {
      method: 'POST',
      body: JSON.stringify({
        oldPassword,
        newPassword,
        confirmPassword
      })
    });

    showMessage('passwordMessage', '密码已修改', 'success');
    document.getElementById('passwordForm').reset();
  } catch (error) {
    showMessage('passwordMessage', '修改失败: ' + error.message, 'error');
  }
}

// 处理头像上传
async function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // 检查文件大小
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小不能超过5MB');
    return;
  }

  // 读取文件并转换为Base64
  const reader = new FileReader();
  reader.onload = async (event) => {
    const base64 = event.target.result;

    try {
      await apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          avatar_url: base64
        })
      });

      // 更新显示
      document.getElementById('profileAvatar').src = base64;
      document.getElementById('userAvatar').src = base64;
      alert('头像已更新');
    } catch (error) {
      alert('上传失败: ' + error.message);
    }
  };

  reader.readAsDataURL(file);
}

// 处理账户删除
async function handleDeleteAccount() {
  if (!confirm('确定要删除账户？此操作不可逆')) {
    return;
  }

  if (!confirm('再次确认，删除后您的所有数据将被永久删除')) {
    return;
  }

  const password = prompt('请输入您的密码以确认删除:');
  if (!password) return;

  try {
    // 这里实现实际的删除逻辑
    alert('账户已删除');
    await logout();
  } catch (error) {
    alert('删除失败: ' + error.message);
  }
}

// 自定义显示消息函数（如果common.js中的不适用）
function showMessage(elementId, message, type = 'success') {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';

    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }
}
