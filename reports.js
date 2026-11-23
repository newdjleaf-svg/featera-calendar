const ExcelJS = require('exceljs');
const COURSE_TYPES = require('./course-types');

const PRODUCTS = ['N1', 'N2', 'N3', 'N4', 'N5', 'S1', 'S2', 'S3'];
const COUNT_KEYS = ['attendance', ...PRODUCTS];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function initReports(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS featera_course_reports (
    id UUID PRIMARY KEY,
    class_date DATE NOT NULL,
    course TEXT NOT NULL,
    counts JSONB NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query('CREATE INDEX IF NOT EXISTS featera_reports_by_date ON featera_course_reports (class_date)');
}

async function courseNames(pool) {
  const { rows } = await pool.query("SELECT payload FROM featera_calendar_state WHERE id='main'");
  const data = rows[0]?.payload || {};
  const library = Array.isArray(data.meta?.courseLibrary) ? data.meta.courseLibrary : [];
  const events = Array.isArray(data.events) ? data.events : [];
  const legacy = Array.isArray(data.reference?.courseCatalog) ? data.reference.courseCatalog : [];
  const names = [
    ...COURSE_TYPES,
    ...library,
    ...events.flatMap(event => [event?.courseName, event?.type]),
    ...legacy.filter(course => course?.source === '行程手動新增').map(course => course.name)
  ];
  return [...new Set(names.filter(name => typeof name === 'string').map(name => name.trim()).filter(Boolean))];
}

function validDate(value) {
  if (typeof value !== 'string' || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) || value.startsWith('0000')) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value;
}

function validCount(value) {
  return Number.isInteger(value) && value >= 0 && value <= 2147483647;
}

async function readReports(pool, filters) {
  const { date = '', month = '', course = '' } = filters;
  if ((date !== '' && !validDate(date)) ||
      (month !== '' && (typeof month !== 'string' || !validDate(month + '-01'))) ||
      typeof course !== 'string') {
    return null;
  }

  const { rows } = await pool.query(`
    SELECT id, to_char(class_date, 'YYYY-MM-DD') AS date, course, counts, notes
    FROM featera_course_reports
    WHERE (NULLIF($1, '')::date IS NULL OR class_date = NULLIF($1, '')::date)
      AND (NULLIF($2, '')::date IS NULL OR (
        class_date >= NULLIF($2, '')::date AND class_date < NULLIF($2, '')::date + INTERVAL '1 month'
      ))
      AND ($3 = '' OR course = $3)
    ORDER BY class_date DESC, created_at DESC, id
  `, [date, month ? month + '-01' : '', course]);
  return rows;
}

function summarize(reports, key) {
  const groups = new Map();
  for (const report of reports) {
    const group = key(report);
    if (!groups.has(group)) {
      groups.set(group, { group, lessons: 0, ...Object.fromEntries(COUNT_KEYS.map(name => [name, 0])) });
    }
    const totals = groups.get(group);
    totals.lessons++;
    for (const name of COUNT_KEYS) totals[name] += report.counts[name];
  }
  return [...groups.values()];
}

function reportData(reports) {
  return {
    reports,
    summary: {
      date: summarize(reports, report => report.date),
      course: summarize(reports, report => report.course).sort((a, b) => a.group.localeCompare(b.group, 'zh-Hant')),
      month: summarize(reports, report => report.date.slice(0, 7))
    }
  };
}

function buildWorkbook({ reports, summary }) {
  const workbook = new ExcelJS.Workbook();
  const headers = ['上課人數', ...PRODUCTS];
  const details = workbook.addWorksheet('回報明細');
  details.addRow(['上課日期', '課程名稱', ...headers, '備註']);
  for (const report of reports) {
    details.addRow([report.date, report.course, ...COUNT_KEYS.map(key => report.counts[key]), report.notes]);
  }
  for (const [group, title] of Object.entries({ date: '日期', course: '課程', month: '月份' })) {
    const sheet = workbook.addWorksheet('依' + title + '統計');
    sheet.addRow([title, '場次', ...headers]);
    for (const row of summary[group]) {
      sheet.addRow([row.group, row.lessons, ...COUNT_KEYS.map(key => row[key])]);
    }
  }
  for (const sheet of workbook.worksheets) {
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    sheet.getRow(1).font = { bold: true };
    sheet.columns.forEach((column, index) => {
      column.width = index === 0 ? 20 : index === 1 ? 32 : 13;
    });
  }
  details.getColumn('L').width = 40;
  return workbook;
}

function registerReportRoutes(app, pool, getRole) {
  app.use('/api/reports', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    const role = getRole(req);
    if (!role) return res.status(401).json({ error: '請先登入' });
    if (!['admin', 'frontdesk'].includes(role)) return res.status(403).json({ error: '此帳號無法使用櫃台回報' });
    next();
  });

  app.get('/api/reports/options', async (req, res) => {
    const courses = await courseNames(pool);
    const { rows } = await pool.query('SELECT DISTINCT course FROM featera_course_reports ORDER BY course');
    res.json({ role: getRole(req), courses, filterCourses: [...new Set([...courses, ...rows.map(row => row.course)])] });
  });

  app.post('/api/reports', async (req, res) => {
    const { id, date, course, counts, notes = '' } = req.body || {};
    if (typeof id !== 'string' || !UUID.test(id) || !validDate(date) ||
        typeof course !== 'string' || !COUNT_KEYS.every(key => validCount(counts?.[key])) ||
        typeof notes !== 'string' || notes.length > 2000 || notes.includes('\u0000')) {
      return res.status(400).json({ error: '請確認日期、課程及數量。數量須為 0 至 2147483647 的整數，備註最多 2000 字元。' });
    }
    const values = Object.fromEntries(COUNT_KEYS.map(key => [key, counts[key]]));
    const params = [id, date, course, values, notes];
    const getExisting = () => pool.query(`
      SELECT class_date = $2::date AND course = $3 AND counts = $4::jsonb AND notes = $5 AS matches
      FROM featera_course_reports WHERE id = $1
    `, params);
    const existing = await getExisting();
    if (existing.rowCount) {
      if (existing.rows[0].matches) return res.json({ id });
      return res.status(409).json({ error: '這筆回報已儲存，請重新載入頁面後新增下一筆。' });
    }
    if (!(await courseNames(pool)).includes(course)) {
      return res.status(400).json({ error: '請從最新的課程清單選擇課程。' });
    }
    const inserted = await pool.query(`
      INSERT INTO featera_course_reports (id, class_date, course, counts, notes)
      VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING
    `, params);
    if (inserted.rowCount) return res.status(201).json({ id });
    const concurrent = await getExisting();
    if (concurrent.rows[0]?.matches) return res.json({ id });
    res.status(409).json({ error: '這筆回報已儲存，請重新載入頁面後新增下一筆。' });
  });

  app.get(['/api/reports', '/api/reports/export'], async (req, res) => {
    const reports = await readReports(pool, req.query);
    if (!reports) return res.status(400).json({ error: '篩選日期或月份格式錯誤。' });
    const data = reportData(reports);
    if (req.path === '/api/reports') return res.json(data);

    const buffer = await buildWorkbook(data).xlsx.writeBuffer();
    res.attachment('FEATERA-course-reports.xlsx').send(Buffer.from(buffer));
  });

  app.use('/api/reports', (error, req, res, next) => {
    console.error('FEATERA reports:', error.message);
    if (res.headersSent) return next(error);
    res.status(500).json({ error: '回報服務暫時無法使用，請稍後再試。' });
  });
}

module.exports = { initReports, registerReportRoutes };
