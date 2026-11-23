const products = ['N1', 'N2', 'N3', 'N4', 'N5', 'S1', 'S2', 'S3'];
const countKeys = ['attendance', ...products];
const countLabels = ['上課人數', ...products];
const byId = id => document.getElementById(id);
const loginPanel = byId('reportLogin');
const loginForm = byId('reportLoginForm');
const workspace = byId('reportWorkspace');
const form = byId('reportForm');
const filters = byId('reportFilters');
const exportButton = byId('reportExport');
const results = byId('reportResults');
const status = byId('reportStatus');
const queryStatus = byId('queryStatus');
const saveStatus = byId('saveStatus');
const logoutButton = byId('reportLogout');

let requestNumber = 0;
let appliedFilters = '';
let pending = null;

for (const product of products) {
  const label = document.createElement('label');
  label.textContent = product;
  const input = document.createElement('input');
  input.type = 'number';
  input.inputMode = 'numeric';
  input.name = product;
  input.min = '0';
  input.max = '2147483647';
  input.step = '1';
  input.value = '0';
  input.required = true;
  label.append(input);
  byId('productInputs').append(label);
}

function taipeiDate() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return [values.year, values.month, values.day].join('-');
}

async function api(path, options) {
  const response = await fetch(path, options);
  if (!response.ok) {
    const { error } = await response.json().catch(() => ({}));
    throw Object.assign(new Error(error || '連線失敗，請稍後再試。'), { status: response.status });
  }
  return response;
}

function post(path, body) {
  return api(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

function showLogin(message, signedIn = false) {
  requestNumber++;
  workspace.hidden = true;
  loginPanel.hidden = false;
  logoutButton.hidden = !signedIn;
  status.textContent = message;
}

function handleError(error, target) {
  if (error.status === 401 || error.status === 403) {
    showLogin(error.message, error.status === 403);
  } else {
    target.textContent = error.message;
  }
}

async function openWorkspace() {
  const { role, courses, filterCourses } = await (await api('/api/reports/options')).json();
  form.elements.course.replaceChildren(new Option('請選擇課程', ''), ...courses.map(name => new Option(name, name)));
  filters.elements.course.replaceChildren(new Option('全部課程', ''), ...filterCourses.map(name => new Option(name, name)));
  loginPanel.hidden = true;
  workspace.hidden = false;
  logoutButton.hidden = false;
  status.textContent = role === 'admin' ? '管理員' : '櫃台';
  if (!form.elements.date.value) form.elements.date.value = taipeiDate();
  await loadReports(new URLSearchParams(new FormData(filters)).toString());
}

function table(title, headers, data) {
  const heading = document.createElement('h3');
  heading.textContent = title;
  const wrapper = document.createElement('div');
  wrapper.className = 'report-table';
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', title);
  const grid = document.createElement('table');
  const header = grid.createTHead().insertRow();
  for (const name of headers) {
    const column = document.createElement('th');
    column.scope = 'col';
    column.textContent = name;
    header.append(column);
  }
  const body = grid.createTBody();
  for (const row of data) {
    const tr = body.insertRow();
    row.forEach((value, index) => {
      const cell = tr.insertCell();
      cell.textContent = value;
      if (headers[index] === '備註') cell.className = 'report-notes';
    });
  }
  wrapper.append(grid);
  results.append(heading, wrapper);
}

async function loadReports(query) {
  const request = ++requestNumber;
  appliedFilters = query;
  results.replaceChildren();
  exportButton.disabled = true;
  queryStatus.textContent = '正在查詢…';
  try {
    const { reports, summary } = await (await api('/api/reports?' + query)).json();
    if (request !== requestNumber) return;
    queryStatus.textContent = reports.length ? `共 ${reports.length} 堂課` : '這些條件下沒有回報。';
    if (reports.length) {
      table('回報明細', ['上課日期', '課程名稱', ...countLabels, '備註'],
        reports.map(row => [row.date, row.course, ...countKeys.map(key => row.counts[key]), row.notes]));
      for (const [key, title] of Object.entries({ date: '日期', course: '課程', month: '月份' })) {
        table('依' + title + '統計', [title, '場次', ...countLabels],
          summary[key].map(row => [row.group, row.lessons, ...countKeys.map(name => row[name])]));
      }
    }
    exportButton.disabled = false;
  } catch (error) {
    if (request === requestNumber) handleError(error, queryStatus);
  }
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const button = loginForm.querySelector('button');
  button.disabled = true;
  status.textContent = '登入中…';
  try {
    await post('/api/login', { ...Object.fromEntries(new FormData(loginForm)), portal: 'reports' });
    loginForm.reset();
    await openWorkspace();
  } catch (error) {
    handleError(error, status);
  } finally {
    button.disabled = false;
  }
});

logoutButton.addEventListener('click', async () => {
  logoutButton.disabled = true;
  try {
    await post('/api/logout', {});
    showLogin('已登出。');
    results.replaceChildren();
    form.reset();
    filters.reset();
    pending = null;
    saveStatus.textContent = '';
    queryStatus.textContent = '';
  } catch (error) {
    status.textContent = error.message;
  } finally {
    logoutButton.disabled = false;
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const fields = new FormData(form);
  const record = {
    date: fields.get('date'),
    course: fields.get('course'),
    counts: Object.fromEntries(countKeys.map(key => [key, Number(fields.get(key))])),
    notes: fields.get('notes')
  };
  const content = JSON.stringify(record);
  if (content !== pending?.content) pending = { content, id: crypto.randomUUID() };
  const controls = [...form.elements];
  for (const control of controls) control.disabled = true;
  logoutButton.disabled = true;
  saveStatus.textContent = '正在儲存…';

  try {
    await post('/api/reports', { id: pending.id, ...record });
    pending = null;
    form.reset();
    form.elements.date.value = record.date;
    saveStatus.textContent = '回報已儲存。';
    await loadReports(appliedFilters);
  } catch (error) {
    handleError(error, saveStatus);
  } finally {
    for (const control of controls) control.disabled = false;
    logoutButton.disabled = false;
  }
});

filters.addEventListener('submit', event => {
  event.preventDefault();
  loadReports(new URLSearchParams(new FormData(filters)).toString());
});

filters.addEventListener('reset', () => loadReports(''));

exportButton.addEventListener('click', async () => {
  const request = requestNumber;
  exportButton.disabled = true;
  try {
    const response = await api('/api/reports/export?' + appliedFilters);
    const blob = await response.blob();
    if (request !== requestNumber) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FEATERA-course-reports.xlsx';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    if (request === requestNumber) handleError(error, queryStatus);
  } finally {
    if (request === requestNumber) exportButton.disabled = false;
  }
});

openWorkspace().catch(error => showLogin(error.status === 401 ? '' : error.message, error.status === 403));
