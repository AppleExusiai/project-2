// 知识学习页面JavaScript

let allModules = [];
let userProgress = {};
let currentPage = 1;
const pageSize = 6;

document.addEventListener('DOMContentLoaded', () => {
  initKnowledgePage();
});

async function initKnowledgePage() {
  updateNavBar();
  await loadModules();
  await loadUserProgress();
  setupEventListeners();
}

// 加载模块
async function loadModules() {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge/modules?limit=100`);
    const data = await response.json();

    allModules = data.data;
    displayModules();
    initializeFilters();
  } catch (error) {
    console.error('加载模块失败:', error);
  }
}

// 加载用户进度
async function loadUserProgress() {
  try {
    const status = await checkAuthStatus();
    if (!status.isLoggedIn) return;

    const data = await apiRequest('/knowledge/progress');
    data.progress.forEach(p => {
      userProgress[p.module_id] = p;
    });

    // 更新统计
    const completed = Object.values(userProgress).filter(p => p.completed === 1).length;
    document.getElementById('userCompletedCount').textContent = completed;
    document.getElementById('userCompletionRate').textContent = Math.round((completed / allModules.length) * 100) + '%';
  } catch (error) {
    console.error('加载用户进度失败:', error);
  }
}

// 显示模块
function displayModules() {
  const modulesList = document.getElementById('modulesList');
  modulesList.innerHTML = '';

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageModules = allModules.slice(start, end);

  pageModules.forEach(module => {
    const card = createModuleCard(module);
    modulesList.appendChild(card);
  });

  updateModulesPagination();
}

// 创建模块卡片
function createModuleCard(module) {
  const card = document.createElement('div');
  card.className = 'module-card';

  const levelColors = {
    '初级': '#2ecc71',
    '中级': '#f39c12',
    '高级': '#e74c3c'
  };

  const color = levelColors[module.level] || '#3498db';
  const progress = userProgress[module.id];
  const progressPercent = progress?.progress || 0;
  const isCompleted = progress?.completed === 1;

  card.innerHTML = `
    <div class="module-card-header">
      <h3>${module.title}</h3>
      <span class="module-level" style="background-color: ${color};">${module.level}</span>
    </div>
    <p class="module-category">${module.category}</p>
    <p class="module-description">${module.content.substring(0, 100)}...</p>
    
    ${progress ? `
    <div class="module-progress">
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progressPercent}%"></div>
      </div>
      <small>${progressPercent}% ${isCompleted ? '✓ 已完成' : ''}</small>
    </div>
    ` : '<div class="module-progress"><small>未开始</small></div>'}
    
    <div class="module-footer">
      <span>⏱️ ${module.duration || 0}分钟</span>
      <button class="btn btn-small btn-primary view-module-btn" data-id="${module.id}">查看详情</button>
    </div>
  `;

  return card;
}

// 更新分页
function updateModulesPagination() {
  const totalPages = Math.ceil(allModules.length / pageSize);
  const pagination = document.getElementById('modulesPagination');
  pagination.innerHTML = '';

  if (totalPages <= 1) return;

  // 上一页
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '← 上一页';
    prevBtn.onclick = () => {
      currentPage--;
      displayModules();
      window.scrollTo(0, 0);
    };
    pagination.appendChild(prevBtn);
  }

  // 页码
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.onclick = () => {
      currentPage = i;
      displayModules();
      window.scrollTo(0, 0);
    };
    pagination.appendChild(pageBtn);
  }

  // 下一页
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = '下一页 →';
    nextBtn.onclick = () => {
      currentPage++;
      displayModules();
      window.scrollTo(0, 0);
    };
    pagination.appendChild(nextBtn);
  }
}

// 初始化筛选器
function initializeFilters() {
  const status = await checkAuthStatus();
  
  const categories = new Set();
  const levels = new Set();

  allModules.forEach(module => {
    categories.add(module.category);
    levels.add(module.level);
  });

  // 初始化类别筛选
  const categoryFilters = document.getElementById('categoryFilters');
  categoryFilters.innerHTML = '<label class="radio-item"><input type="radio" name="category" value="all" checked><span>全部课程</span></label>';

  categories.forEach(category => {
    const label = document.createElement('label');
    label.className = 'radio-item';
    label.innerHTML = `
      <input type="radio" name="category" value="${category}">
      <span>${category}</span>
    `;
    categoryFilters.appendChild(label);
  });

  // 初始化等级筛选
  const levelFilters = document.getElementById('levelFilters');
  levelFilters.innerHTML = '<label class="radio-item"><input type="radio" name="level" value="all" checked><span>全部等级</span></label>';

  levels.forEach(level => {
    const label = document.createElement('label');
    label.className = 'radio-item';
    label.innerHTML = `
      <input type="radio" name="level" value="${level}">
      <span>${level}</span>
    `;
    levelFilters.appendChild(label);
  });
}

// 设置事件监听
function setupEventListeners() {
  // Tab切换
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const tabId = e.target.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.getElementById(tabId + '-tab').classList.add('active');

      if (tabId === 'progress') {
        loadProgressList();
      }
    });
  });

  // 筛选
  document.addEventListener('change', (e) => {
    if (e.target.name === 'category' || e.target.name === 'level') {
      applyFilters();
    }
  });

  // 查看详情
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-module-btn')) {
      showModuleDetail(e.target.dataset.id);
    }
  });

  // 关闭模态框
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('moduleModal').style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('moduleModal');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// 应用筛选
function applyFilters() {
  const category = document.querySelector('input[name="category"]:checked')?.value;
  const level = document.querySelector('input[name="level"]:checked')?.value;

  const filtered = allModules.filter(m => {
    return (category === 'all' || m.category === category) &&
           (level === 'all' || m.level === level);
  });

  // 显示筛选结果
  const modulesList = document.getElementById('modulesList');
  modulesList.innerHTML = '';

  filtered.forEach(module => {
    const card = createModuleCard(module);
    modulesList.appendChild(card);
  });
}

// 加载进度列表
function loadProgressList() {
  const container = document.getElementById('progressList');
  const empty = document.getElementById('emptyProgress');

  const progresses = Object.values(userProgress);
  if (progresses.length === 0) {
    empty.style.display = 'block';
    container.innerHTML = '';
    return;
  }

  empty.style.display = 'none';
  container.innerHTML = '';

  progresses.forEach(progress => {
    const item = document.createElement('div');
    item.className = 'progress-item';
    item.innerHTML = `
      <h4>${progress.title}</h4>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress.progress || 0}%"></div>
      </div>
      <div class="progress-info">
        <span>${progress.progress || 0}%</span>
        ${progress.completed === 1 ? '<span class="badge badge-success">✓ 已完成</span>' : ''}
      </div>
    `;
    container.appendChild(item);
  });
}

// 显示模块详情
async function showModuleDetail(moduleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/knowledge/modules/${moduleId}`);
    const data = await response.json();
    const module = data.module;

    const modal = document.getElementById('moduleModal');
    const detail = document.getElementById('moduleDetail');

    const levelColors = {
      '初级': '#2ecc71',
      '中级': '#f39c12',
      '高级': '#e74c3c'
    };

    const color = levelColors[module.level] || '#3498db';

    detail.innerHTML = `
      <h2>${module.title}</h2>
      <div class="module-meta">
        <span class="badge" style="background-color: ${color}; color: white;">${module.level}</span>
        <span class="badge">${module.category}</span>
        <span class="badge">⏱️ ${module.duration || 0}分钟</span>
      </div>
      
      <div class="module-content">
        <h3>课程内容</h3>
        <p>${module.content}</p>
      </div>

      <div class="module-actions">
        <button class="btn btn-primary" onclick="markModuleProgress(${moduleId}, 100, true)">标记为已完成</button>
        <button class="btn btn-outline" onclick="document.getElementById('moduleModal').style.display = 'none'">关闭</button>
      </div>
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('加载模块详情失败:', error);
  }
}

// 标记模块进度
async function markModuleProgress(moduleId, progress, completed) {
  try {
    const status = await checkAuthStatus();
    if (!status.isLoggedIn) {
      alert('请先登录');
      window.location.href = '/login';
      return;
    }

    await apiRequest(`/knowledge/progress/${moduleId}`, {
      method: 'POST',
      body: JSON.stringify({
        progress: progress,
        completed: completed ? 1 : 0
      })
    });

    alert('进度已更新');
    await loadUserProgress();
    document.getElementById('moduleModal').style.display = 'none';
  } catch (error) {
    console.error('更新进度失败:', error);
    alert('更新失败: ' + error.message);
  }
}

// 等等，我需要异步处理initializeFilters
async function initializeFilters() {
  const categories = new Set();
  const levels = new Set();

  allModules.forEach(module => {
    categories.add(module.category);
    levels.add(module.level);
  });

  // 初始化类别筛选
  const categoryFilters = document.getElementById('categoryFilters');
  categoryFilters.innerHTML = '<label class="radio-item"><input type="radio" name="category" value="all" checked><span>全部课程</span></label>';

  categories.forEach(category => {
    const label = document.createElement('label');
    label.className = 'radio-item';
    label.innerHTML = `
      <input type="radio" name="category" value="${category}">
      <span>${category}</span>
    `;
    categoryFilters.appendChild(label);
  });

  // 初始化等级筛选
  const levelFilters = document.getElementById('levelFilters');
  levelFilters.innerHTML = '<label class="radio-item"><input type="radio" name="level" value="all" checked><span>全部等级</span></label>';

  levels.forEach(level => {
    const label = document.createElement('label');
    label.className = 'radio-item';
    label.innerHTML = `
      <input type="radio" name="level" value="${level}">
      <span>${level}</span>
    `;
    levelFilters.appendChild(label);
  });
}
