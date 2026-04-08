// 问卷调查页面JavaScript

let allSurveys = [];
let userSurveyRecords = {};
let currentSurvey = null;

document.addEventListener('DOMContentLoaded', () => {
  initSurveyPage();
});

async function initSurveyPage() {
  updateNavBar();
  await loadSurveys();
  await loadUserRecords();
  setupEventListeners();
}

// 加载问卷列表
async function loadSurveys() {
  try {
    const response = await fetch(`${API_BASE_URL}/survey/list`);
    const data = await response.json();
    allSurveys = data.surveys;

    displaySurveyList();
  } catch (error) {
    console.error('加载问卷失败:', error);
  }
}

// 加载用户问卷记录
async function loadUserRecords() {
  try {
    const status = await checkAuthStatus();
    if (!status.isLoggedIn) return;

    const data = await apiRequest('/survey/user/records');
    
    data.records.forEach(record => {
      userSurveyRecords[record.survey_id] = record;
    });

    displayUserRecords();
  } catch (error) {
    console.error('加载用户记录失败:', error);
  }
}

// 显示问卷列表
function displaySurveyList() {
  const grid = document.getElementById('surveysGrid');
  grid.innerHTML = '';

  allSurveys.forEach(survey => {
    const card = createSurveyCard(survey);
    grid.appendChild(card);
  });
}

// 创建问卷卡片
function createSurveyCard(survey) {
  const card = document.createElement('div');
  card.className = 'survey-card';

  const hasCompleted = userSurveyRecords[survey.id];

  card.innerHTML = `
    <div class="survey-card-header">
      <h3>${survey.title}</h3>
      ${hasCompleted ? '<span class="badge badge-success">✓ 已完成</span>' : ''}
    </div>
    <p class="survey-description">${survey.description}</p>
    <button class="btn btn-primary btn-full take-survey-btn" data-id="${survey.id}">
      ${hasCompleted ? '重新填写' : '开始问卷'}
    </button>
  `;

  return card;
}

// 显示用户问卷记录
function displayUserRecords() {
  const tbody = document.getElementById('recordsTableBody');
  const empty = document.getElementById('emptyRecords');

  const records = Object.values(userSurveyRecords);
  if (records.length === 0) {
    empty.style.display = 'block';
    tbody.innerHTML = '';
    return;
  }

  empty.style.display = 'none';
  tbody.innerHTML = '';

  records.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.title}</td>
      <td>${formatDate(record.completed_at)}</td>
      <td>${record.score}分</td>
      <td><a href="#" class="view-record-link" data-id="${record.id}">查看答卷</a></td>
    `;
    tbody.appendChild(row);
  });
}

// 设置事件监听
function setupEventListeners() {
  // 填写问卷按钮
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('take-survey-btn')) {
      const surveyId = e.target.dataset.id;
      startSurvey(surveyId);
    }
  });

  // 返回按钮
  document.getElementById('backBtn').addEventListener('click', backToList);

  // 提交问卷
  document.getElementById('currentSurveyForm').addEventListener('submit', submitSurvey);

  // 关闭结果模态框
  document.getElementById('closeResultBtn').addEventListener('click', () => {
    document.getElementById('resultModal').style.display = 'none';
    backToList();
  });
}

// 开始问卷
async function startSurvey(surveyId) {
  try {
    const response = await fetch(`${API_BASE_URL}/survey/${surveyId}`);
    const data = await response.json();
    currentSurvey = data.survey;

    // 显示问卷表单
    document.getElementById('surveyList').style.display = 'none';
    document.getElementById('myRecords').style.display = 'none';
    document.getElementById('surveyForm').style.display = 'block';

    // 填充问卷内容
    document.getElementById('surveyTitle').textContent = currentSurvey.title;

    const content = document.getElementById('surveyContent');
    content.innerHTML = '';

    currentSurvey.questions.forEach((question, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'survey-question';

      let optionsHtml = '';
      if (question.options) {
        question.options.forEach((option, optIndex) => {
          optionsHtml += `
            <label class="option-label">
              <input type="radio" name="question_${index}" value="${option}" required>
              <span>${option}</span>
            </label>
          `;
        });
      }

      questionDiv.innerHTML = `
        <h4>${index + 1}. ${question.question}</h4>
        <div class="options-group">
          ${optionsHtml}
        </div>
      `;

      content.appendChild(questionDiv);
    });

    window.scrollTo(0, 0);
  } catch (error) {
    console.error('加载问卷失败:', error);
    alert('加载问卷失败: ' + error.message);
  }
}

// 返回列表
function backToList() {
  document.getElementById('surveyForm').style.display = 'none';
  document.getElementById('surveyList').style.display = 'block';
  document.getElementById('myRecords').style.display = 'block';
  currentSurvey = null;
}

// 提交问卷
async function submitSurvey(e) {
  e.preventDefault();

  const status = await checkAuthStatus();
  if (!status.isLoggedIn) {
    alert('请先登录');
    window.location.href = '/login';
    return;
  }

  // 收集答案
  const answers = {};
  currentSurvey.questions.forEach((question, index) => {
    const checked = document.querySelector(`input[name="question_${index}"]:checked`);
    if (checked) {
      answers[`question_${index}`] = checked.value;
    }
  });

  try {
    const data = await apiRequest('/survey/submit', {
      method: 'POST',
      body: JSON.stringify({
        surveyId: currentSurvey.id,
        answers: answers
      })
    });

    // 显示结果
    showResult(data.score);
  } catch (error) {
    showMessage('surveyMessage', '提交失败: ' + error.message, 'error');
  }
}

// 显示结果
function showResult(score) {
  document.getElementById('resultScore').textContent = score;

  let message = '';
  if (score >= 90) {
    message = '太棒了！您的防诈骗意识非常强，请继续保持警惕！';
  } else if (score >= 70) {
    message = '不错！您的防诈骗意识比较好，建议继续学习提高。';
  } else if (score >= 50) {
    message = '还可以，您需要加强防诈骗知识的学习。';
  } else {
    message = '您需要认真学习防诈骗知识，提高防范意识。';
  }

  document.getElementById('resultMessage').textContent = message;

  const modal = document.getElementById('resultModal');
  modal.style.display = 'block';

  // 重新加载记录
  loadUserRecords();
}

// 模态框关闭
document.querySelectorAll('.close').forEach(closeBtn => {
  closeBtn.addEventListener('click', function() {
    this.closest('.modal').style.display = 'none';
  });
});

window.addEventListener('click', (e) => {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
