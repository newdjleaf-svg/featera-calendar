const $ = (id)=>document.getElementById(id);
const LS_KEY='featera_calendar_v3';
const CONFIG_KEY='featera_calendar_config_v1';
const DEFAULT_ADMIN={user:'Featera',pass:'featera168'};
const RANKS=['SM','GM','PM','SD','GD','PD','SP','GP','PP','DP','DDP'];
const RANK_ZH={SM:'經理',GM:'經理',PM:'經理',SD:'總監',GD:'總監',PD:'總監',SP:'總裁',GP:'總裁',PP:'總裁',DP:'總裁',DDP:'總裁'};
function rankWithZh(rank){return rank?`${rank} ${RANK_ZH[rank]||''}`.trim():''}
const REGIONS=['台北','中壢','宜蘭','花蓮','台中','嘉義','台南','高雄','台東'];
const COURSE_TYPES=['系統培訓','健康回饋日','說明會','NDO/希望工程','MCC','會議','假日/休假','其他'];

const DJ_USER_DEFAULT='featera_dj';
const DJ_REGIONS=['高雄','花蓮','宜蘭','嘉義','台南','中壢','台北','台中','台東'];
const DJ_WEEKDAY_REGIONS={1:['高雄','花蓮'],2:['宜蘭','嘉義'],3:['台南','中壢'],4:['台北'],5:['台中','台東']};
const DEFAULT_DJ_META={titleTemplate:'{Y}年{M}月份音控擔任表',branchLabel:'分公司',dateLabel:'日期',audioLabel:'音控',feedbackLabel:'健康回饋日',titleColor:'#16831f',weekdayBg:'#eef1df',weekdayText:'#176aa1',weekendText:'#c71920',dateBg:'#e7e4f3',audioBg:'#fae8dc',gridColor:'#111111',logo:''};
const DEFAULT_DJ_STAFF=[
  ['林俊賢',['宜蘭','花蓮']],['胡姿因',['嘉義']],['謝旻翰',['台南','台中','嘉義']],['葉丞緯',['中壢']],['陳廷軒',['台北']],['黃瑞祺',['台東']],['翟偉翔',['台北']],['楊恆睿',['台中']],['徐湘芸',['花蓮']],['侯博智',['高雄']],['陳昱儒',['宜蘭']],['賴筱雯',['嘉義']],['陳麗莉',['台南']],['邱繼炎',['中壢']],['游明烽',['中壢']],['薛妙芬',['高雄']],['謝宏寬',['台東']]
].map((x,i)=>({id:'dj'+(i+1),name:x[0],regions:x[1],note:''}));
const DEFAULT_DJ_SCHEDULE=[
 ['2026-09-01','宜蘭','林俊賢'],['2026-09-01','嘉義','胡姿因'],['2026-09-02','台南','謝旻翰'],['2026-09-02','中壢','葉丞緯'],['2026-09-03','台北','陳廷軒'],['2026-09-04','台中','謝旻翰'],['2026-09-04','台東','黃瑞祺'],
 ['2026-09-05','台北','翟偉翔'],['2026-09-05','台中','楊恆睿'],['2026-09-06','花蓮','徐湘芸'],['2026-09-06','嘉義','謝旻翰'],['2026-09-07','高雄','侯博智'],['2026-09-07','花蓮','徐湘芸'],['2026-09-08','宜蘭','陳昱儒'],['2026-09-08','嘉義','賴筱雯'],
 ['2026-09-09','台南','陳麗莉'],['2026-09-09','中壢','邱繼炎'],['2026-09-10','台北','翟偉翔'],['2026-09-11','台中','楊恆睿'],['2026-09-11','台東','謝宏寬'],['2026-09-12','中壢','游明烽'],['2026-09-12','高雄','薛妙芬'],['2026-09-13','宜蘭','林俊賢'],['2026-09-13','台東','謝宏寬'],['2026-09-13','台南','謝旻翰'],
 ['2026-09-14','高雄','薛妙芬'],['2026-09-14','花蓮','林俊賢'],['2026-09-15','宜蘭','陳昱儒'],['2026-09-15','嘉義','胡姿因'],['2026-09-16','台南','謝旻翰'],['2026-09-16','中壢','游明烽'],['2026-09-17','台北','陳廷軒'],
 ['2026-09-24','台北','翟偉翔'],['2026-09-29','宜蘭','林俊賢'],['2026-09-29','嘉義','賴筱雯'],['2026-09-30','台南','陳麗莉'],['2026-09-30','中壢','邱繼炎']
].map((x,i)=>({id:'djs'+(i+1),date:x[0],region:x[1],personId:DEFAULT_DJ_STAFF.find(p=>p.name===x[2])?.id||'',text:x[2],size:16,color:'#111111',align:'center',bold:false,italic:false,underline:false,note:''})).concat([
  ...['18','19','20','21','22','23'].map((d,i)=>({id:'djsp'+i,date:`2026-09-${d}`,region:'全區',personId:'',text:'越南之旅',size:16,color:'#16831f',align:'center',bold:true,italic:false,underline:false,note:'',kind:'special'})),
  {id:'djsp7',date:'2026-09-25',region:'全區',personId:'',text:'中秋節',size:16,color:'#c71920',align:'center',bold:true,italic:false,underline:false,note:'',kind:'special'},
  {id:'djsp8',date:'2026-09-26',region:'全區',personId:'',text:'中秋節連假',size:16,color:'#c71920',align:'center',bold:true,italic:false,underline:false,note:'',kind:'special'},
  {id:'djsp9',date:'2026-09-27',region:'全區',personId:'',text:'中秋節連假',size:16,color:'#c71920',align:'center',bold:true,italic:false,underline:false,note:'',kind:'special'},
  {id:'djsp10',date:'2026-09-28',region:'全區',personId:'',text:'教師節',size:16,color:'#c71920',align:'center',bold:true,italic:false,underline:false,note:'',kind:'special'}
]);


// Taiwan government holidays (DGPA official work calendars).
// System holidays are generated at render time, so they do not overwrite user-created events.
const TAIWAN_HOLIDAYS={
  2026:{
    '2026-01-01':'中華民國開國紀念日',
    '2026-02-14':'春節連假','2026-02-15':'春節連假','2026-02-16':'除夕前一日','2026-02-17':'除夕','2026-02-18':'春節','2026-02-19':'春節','2026-02-20':'春節補假','2026-02-21':'春節連假','2026-02-22':'春節連假',
    '2026-02-27':'和平紀念日補假','2026-02-28':'和平紀念日','2026-03-01':'和平紀念日連假',
    '2026-04-03':'兒童節補假','2026-04-04':'兒童節','2026-04-05':'清明節','2026-04-06':'清明節補假',
    '2026-05-01':'勞動節','2026-05-02':'勞動節連假','2026-05-03':'勞動節連假',
    '2026-06-19':'端午節','2026-06-20':'端午節連假','2026-06-21':'端午節連假',
    '2026-09-25':'中秋節','2026-09-26':'中秋節連假','2026-09-27':'中秋節連假','2026-09-28':'孔子誕辰紀念日／教師節',
    '2026-10-09':'國慶日補假','2026-10-10':'國慶日','2026-10-11':'國慶日連假',
    '2026-10-24':'光復節連假','2026-10-25':'臺灣光復暨金門古寧頭大捷紀念日','2026-10-26':'光復節補假',
    '2026-12-25':'行憲紀念日','2026-12-26':'行憲紀念日連假','2026-12-27':'行憲紀念日連假'
  },
  2027:{
    '2027-01-01':'中華民國開國紀念日','2027-01-02':'元旦連假','2027-01-03':'元旦連假',
    '2027-02-04':'除夕前一日','2027-02-05':'除夕','2027-02-06':'春節','2027-02-07':'春節','2027-02-08':'春節','2027-02-09':'春節補假','2027-02-10':'春節補假',
    '2027-02-27':'和平紀念日連假','2027-02-28':'和平紀念日','2027-03-01':'和平紀念日補假',
    '2027-04-03':'兒童節／清明節連假','2027-04-04':'兒童節','2027-04-05':'清明節','2027-04-06':'兒童節補假',
    '2027-04-30':'勞動節補假','2027-05-01':'勞動節','2027-05-02':'勞動節連假',
    '2027-06-09':'端午節','2027-09-15':'中秋節','2027-09-28':'孔子誕辰紀念日／教師節',
    '2027-10-09':'國慶日連假','2027-10-10':'國慶日','2027-10-11':'國慶日補假',
    '2027-10-23':'光復節連假','2027-10-24':'光復節連假','2027-10-25':'臺灣光復暨金門古寧頭大捷紀念日',
    '2027-12-24':'行憲紀念日補假','2027-12-25':'行憲紀念日','2027-12-26':'行憲紀念日連假','2027-12-31':'2028元旦補假'
  }
};
function taiwanHolidayName(date){return state.meta.taiwanHolidays===false?'':(TAIWAN_HOLIDAYS[+String(date).slice(0,4)]?.[date]||'')}
function systemHolidayEvent(date){const name=taiwanHolidayName(date);if(!name)return null;return {id:'sys-holiday-'+date,date,type:'假日/休假',systemHoliday:true,highlight:false,lines:[{text:name,size:16,color:ensureAppearance().date.holiday||'#d0181d',align:'center',bold:true,italic:false,underline:false}],order:999}}
function calendarEventsForDate(date){const user=state.events.filter(e=>e.date===date).sort((a,b)=>(a.order||0)-(b.order||0));const sys=systemHolidayEvent(date);if(!sys)return user;return user.some(isHolidayEvent)?user:[...user,sys]}

const DEFAULT_APPEARANCE={
  weekdays:[
    {bg:'#ffffff',transparent:false,text:'#111111'},
    {bg:'#ffffff',transparent:false,text:'#111111'},
    {bg:'#ffffff',transparent:false,text:'#111111'},
    {bg:'#ffffff',transparent:false,text:'#111111'},
    {bg:'#ffffff',transparent:false,text:'#111111'},
    {bg:'#ffffff',transparent:false,text:'#d0181d'},
    {bg:'#ffffff',transparent:false,text:'#d0181d'}
  ],
  date:{bg:'#ffffff',transparent:true,text:'#111111',sat:'#d0181d',sun:'#d0181d',holiday:'#d0181d',holidayCustom:true,align:'left',size:19}
};
const state={
  month:new Date(2026,8,1), mode:'admin', view:'calendar', events:[], blankCells:{}, staff:{lecturers:[],hosts:[],audio:[]}, contacts:[],
  audioMonth:new Date(2026,8,1), audioState:{schedule:[],staff:[],meta:clone(DEFAULT_DJ_META)}, audioContext:{events:[],hosts:[]},
  meta:{titleTemplate:'{Y}年{M}月行事曆',subtitle:'',businessHours:'',hotline:'',logo:'',taiwanHolidays:true,appearance:clone(DEFAULT_APPEARANCE)}, admin:{...DEFAULT_ADMIN}, history:[], reference:{lecturers:[],hosts:[],courseCatalog:[],courseNameUpdates:[],schedulingRules:[]}
};
let cloudReady=false;
let cloudSaveTimer=null;

function uid(prefix='e'){return prefix+Math.random().toString(36).slice(2)+Date.now().toString(36)}
function pad(n){return String(n).padStart(2,'0')}
function ymd(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`}
function parseDate(s){const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d)}
function monthKey(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}`}
function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function clone(v){return JSON.parse(JSON.stringify(v))}
function rankScore(rank){const i=RANKS.indexOf(rank);return i<0?0:i+1}
function getConfig(){try{return JSON.parse(localStorage.getItem(CONFIG_KEY))||{}}catch{return {}}}
function saveConfig(c){localStorage.setItem(CONFIG_KEY,JSON.stringify(c))}
function cloudPayload(){return {events:state.events,blankCells:state.blankCells||{},staff:state.staff,contacts:state.contacts,meta:state.meta,history:state.history,reference:state.reference}}
function saveLocal(){
  localStorage.setItem(LS_KEY,JSON.stringify({events:state.events,blankCells:state.blankCells||{},staff:state.staff,contacts:state.contacts,meta:state.meta,admin:state.admin,history:state.history}));
  if(cloudReady&&state.mode==='admin')scheduleCloudSave();
}
function scheduleCloudSave(){clearTimeout(cloudSaveTimer);cloudSaveTimer=setTimeout(()=>pushCloudState(false),500)}
async function pullCloudState(){
  const r=await fetch('/api/state',{cache:'no-store'});
  if(!r.ok)throw new Error('雲端讀取失敗 ('+r.status+')');
  const data=await r.json();
  if(data?.payload&&Object.keys(data.payload).length){Object.assign(state,data.payload);mergeReferenceIntoStaff();localStorage.setItem(LS_KEY,JSON.stringify({...data.payload,admin:state.admin}));return true}
  return false;
}
async function pushCloudState(showMessage=true){
  const r=await fetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload:cloudPayload()})});
  if(!r.ok){const x=await r.json().catch(()=>({}));throw new Error(x.error||'雲端儲存失敗 ('+r.status+')')}
  if(showMessage)alert('已同步到 Railway PostgreSQL');
}
async function cloudLogin(user,pass){
  const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user,pass})});
  if(!r.ok)return null;return await r.json();
}
async function cloudLogout(){try{await fetch('/api/logout',{method:'POST'})}catch{}}
async function loadSeed(){
  const r=await fetch('seed.json'); const seed=await r.json();
  try{const rr=await fetch('reference.json',{cache:'no-store'});state.reference=await rr.json()}catch(e){console.warn('reference.json load failed',e)}
  state.staff={lecturers:seed.lecturers||[],hosts:seed.hosts||[],audio:seed.audio||[]};
  state.contacts=seed.contacts||[]; state.meta.businessHours=seed.meta?.businessHours||'';state.meta.hotline=seed.meta?.hotline||'';
  state.history=[
    {month:'2026-06',note:'附件「課程人數」記錄 6 月各區系統培訓與回饋日人數，例如中壢回饋日 256、宜蘭 91、台東 61。'},
    {month:'2026-05',note:'附件記錄 5 月台北回饋日 270、中壢 211、台中 110 等。'},
    {month:'2026-04',note:'附件記錄 4 月台北回饋日 225、中壢 200、台中 180 等。'},
    {month:'2026-03',note:'附件記錄 3 月台北回饋日 274、中壢 138、台中 119 等。'},
    {month:'2026-02',note:'附件記錄 2 月中壢回饋日 268 等。'},
    {month:'2026-01',note:'附件記錄 1 月中壢 163、台北 172、嘉義 105、台中 140 等回饋日人數。'}
  ];
  mergeReferenceIntoStaff();
}
function mergeReferenceIntoStaff(){
  const merge=(list,refs)=>{for(const p of list){const r=(refs||[]).find(x=>x.name===p.name);if(!r)continue;for(const k of ['seminarQualified','regions','seniority'])if((p[k]===undefined||p[k]===null||p[k]===''||(Array.isArray(p[k])&&!p[k].length))&&r[k]!==undefined)p[k]=clone(r[k]);if(!p.note&&r.note)p.note=r.note;if(p.stars===undefined&&r.stars!==undefined)p.stars=r.stars;if(!p.rank&&r.rank)p.rank=r.rank;}for(const r of (refs||[])){if(!list.some(x=>x.name===r.name))list.push(clone(r))}};
  merge(state.staff.lecturers,state.reference?.lecturers);merge(state.staff.hosts,state.reference?.hosts);
}
function eventCourseText(e){return (e.lines||[]).map(x=>x.text||'').join(' ')}
function nameMatch(list,name){return (list||[]).some(x=>{const n=String(x).replace(/\(.*?\)/g,'').replace(/^(圓夢計畫-)/,'').trim();return n&&name.includes(n)})}
async function initialize(){
  await loadSeed();
  try{const saved=JSON.parse(localStorage.getItem(LS_KEY)||'null');if(saved)Object.assign(state,saved)}catch{}
  bind(); renderAll();
}
function bind(){
  $('adminLoginForm').addEventListener('submit',async e=>{e.preventDefault();const u=$('loginUser').value.trim(),p=$('loginPass').value;$('loginError').textContent='登入中…';try{const x=await cloudLogin(u,p);if(x?.role==='admin'){state.admin.user=u;state.admin.pass='';await login('admin');$('loginError').textContent=''}else $('loginError').textContent='帳號或密碼錯誤'}catch(err){$('loginError').textContent='登入服務錯誤：'+err.message}});
  $('djLoginForm').addEventListener('submit',async e=>{e.preventDefault();const u=$('djLoginUser').value.trim(),p=$('djLoginPass').value;$('loginError').textContent='登入中…';try{const x=await cloudLogin(u,p);if(x?.role==='dj'){await login('dj');$('loginError').textContent=''}else $('loginError').textContent='音控帳號或密碼錯誤'}catch(err){$('loginError').textContent='登入服務錯誤：'+err.message}});
  $('guestLoginBtn').onclick=()=>login('guest'); $('logoutBtn').onclick=logout;
  $('menuBtn').onclick=toggleSidebar; $('drawerBackdrop').onclick=toggleSidebar;
  $('prevBtn').onclick=()=>changeMonth(-1);$('nextBtn').onclick=()=>changeMonth(1);$('todayBtn').onclick=()=>{const d=new Date();state.month=new Date(d.getFullYear(),d.getMonth(),1);renderAll()};
  $('monthPicker').onchange=e=>{if(e.target.value){const [y,m]=e.target.value.split('-').map(Number);state.month=new Date(y,m-1,1);renderAll()}};
  $('addEventBtn').onclick=()=>openEventEditor(null,ymd(state.month)); $('plannerBtn').onclick=showSmartPlanner; $('validateBtn').onclick=showValidation;
  $('staffBtn').onclick=showStaff; $('audioBtn').onclick=()=>openAudioWorkspace(); $('layoutBtn').onclick=showLayout; $('appearanceBtn').onclick=showAppearance; $('settingsBtn').onclick=showSettings; $('statsBtn').onclick=showStats; $('historyBtn').onclick=showHistory;
  $('exportBtn').onclick=exportPNG; $('shareBtn').onclick=sharePNG; $('cloudBtn').onclick=showCloud;
  $('modalClose').onclick=closeModal; $('modal').addEventListener('click',e=>{if(e.target===$('modal'))closeModal()});
  $('logoUpload').onchange=handleLogoUpload; bindAudioControls();
}
async function login(mode){
  state.mode=mode;state.view=mode==='dj'?'audio':'calendar';
  $('loginView').classList.add('hidden');$('app').classList.remove('hidden');
  $('modeBadge').textContent=mode==='admin'?'管理員':mode==='dj'?'音控':'訪客';
  document.body.classList.toggle('guest',mode==='guest');document.body.classList.toggle('dj-mode',mode==='dj');
  document.querySelectorAll('.admin-only').forEach(x=>x.classList.toggle('hidden',mode!=='admin'));
  document.querySelectorAll('.dj-editor-only').forEach(x=>x.classList.toggle('hidden',!['admin','dj'].includes(mode)));
  try{
    if(mode==='dj'){
      await pullCloudState();
      await pullAudioState();cloudReady=true;openAudioWorkspace(false);
    }else{
      const found=await pullCloudState();cloudReady=true;if(!found&&mode==='admin')await pushCloudState(false);showCalendarWorkspace();
    }
  }catch(e){console.warn(e);cloudReady=false;alert('目前無法連接雲端資料庫：'+e.message)}
  renderAll();
}
async function logout(){cloudReady=false;await cloudLogout();$('app').classList.add('hidden');$('loginView').classList.remove('hidden');$('sidebar').classList.remove('open');$('drawerBackdrop').classList.add('hidden')}
function toggleSidebar(){$('sidebar').classList.toggle('open');$('drawerBackdrop').classList.toggle('hidden',!$('sidebar').classList.contains('open'))}
function changeMonth(n){state.month=new Date(state.month.getFullYear(),state.month.getMonth()+n,1);renderAll()}
function ensureAppearance(){
  if(!state.meta)state.meta={};
  const a=state.meta.appearance||{};
  const w=Array.isArray(a.weekdays)?a.weekdays:[];
  state.meta.appearance={
    weekdays:DEFAULT_APPEARANCE.weekdays.map((d,i)=>({...d,...(w[i]||{})})),
    date:{...DEFAULT_APPEARANCE.date,...(a.date||{})}
  };
  return state.meta.appearance;
}
function isHolidayEvent(e){
  if(e?.type==='假日/休假')return true;
  const t=eventCourseText(e);
  return /國定假日|連假|元旦|開國紀念日|春節|除夕|清明|勞動節|端午|中秋|國慶|和平紀念日|教師節|行憲紀念日/.test(t);
}
function colorValue(color,transparent){return transparent?'transparent':(color||'#ffffff')}
function applyAppearanceStyles(){
  const a=ensureAppearance();
  const sheet=$('sheet');
  if(!sheet)return;
  // Use direct style properties with !important so legacy stylesheet rules can never override user choices.
  document.querySelectorAll('#weekdayRow .weekday').forEach((el,i)=>{
    const w=a.weekdays[i]||DEFAULT_APPEARANCE.weekdays[i];
    el.style.setProperty('background-color',colorValue(w.bg,w.transparent),'important');
    el.style.setProperty('color',w.text||'#111111','important');
  });
  document.querySelectorAll('#calendarGrid .day.in-month').forEach(day=>{
    const strip=day.querySelector('.date-strip');
    if(!strip)return;
    const dateObj=parseDate(day.dataset.date);
    const dow=dateObj.getDay();
    const holiday=day.classList.contains('holiday');
    const d=a.date;
    let color=d.text||'#111111';
    if(holiday&&d.holidayCustom!==false)color=d.holiday||'#d0181d';
    else if(dow===6)color=d.sat||'#d0181d';
    else if(dow===0)color=d.sun||'#d0181d';
    strip.style.setProperty('background-color',colorValue(d.bg,d.transparent),'important');
    strip.style.setProperty('color',color,'important');
    strip.style.setProperty('text-align',d.align||'left','important');
    strip.style.setProperty('font-size',`${Number(d.size)||19}px`,'important');
  });
}
function renderAll(){ensureAppearance();renderHeader();renderCalendar();renderContacts();applyAppearanceStyles();$('monthPicker').value=monthKey(state.month)}
function renderHeader(){const y=state.month.getFullYear(),m=state.month.getMonth()+1;let title=state.meta.titleTemplate.replaceAll('{Y}',y).replaceAll('{M}',m);if(/^\s*\d{4}年\d{1,2}月行事曆\s*$/.test(title))title=title.replace(/(\d{4})年(\d{1,2})月行事曆/,'$1 年 $2 月行事曆');$('calendarTitle').textContent=title;$('subtitleText').textContent=state.meta.subtitle||'';$('businessHours').textContent=state.meta.businessHours||'';$('hotline').textContent=state.meta.hotline||'';if(state.meta.logo){$('logoImg').src=state.meta.logo;$('logoImg').classList.remove('hidden');$('logoFallback').classList.add('hidden')}else{$('logoImg').classList.add('hidden');$('logoFallback').classList.remove('hidden')}}
function weeksForMonth(y,m){const first=new Date(y,m,1),last=new Date(y,m+1,0);const monday=(first.getDay()+6)%7;return Math.ceil((monday+last.getDate())/7)}
function blankCellKey(index){return `${monthKey(state.month)}:blank-${index}`}
function normalizedSegments(line){
  if(Array.isArray(line?.segments)&&line.segments.length)return line.segments.map(s=>({text:String(s.text??''),color:normalizeHexColor(s.color||line.color||'#111111'),bold:!!s.bold,italic:!!s.italic,underline:!!s.underline}));
  return [{text:String(line?.text??''),color:normalizeHexColor(line?.color||'#111111'),bold:!!line?.bold,italic:!!line?.italic,underline:!!line?.underline}];
}
function lineText(line){return normalizedSegments(line).map(s=>s.text).join('')}
function renderInlineSegments(line){
  const segs=normalizedSegments(line);
  if(!segs.some(s=>s.text))return '&nbsp;';
  return segs.map(s=>`<span style="color:${esc(s.color)};font-weight:${s.bold?'900':'inherit'};font-style:${s.italic?'italic':'inherit'};text-decoration:${s.underline?'underline':'inherit'}">${esc(s.text)||'&nbsp;'}</span>`).join('');
}
function renderCalendarLine(l,idx=0,highlight=false){
  const size=Number(l.size)||14,txt=lineText(l);
  const st=`font-size:${size}px;line-height:1.25;min-height:${Math.max(size*1.25,12)}px;color:${esc(l.color||'#111')};text-align:${l.align||'left'};font-weight:${l.bold?'900':'400'};font-style:${l.italic?'italic':'normal'};text-decoration:${l.underline?'underline':'none'}`;
  return `<div class="calendar-line ${idx===0&&highlight?'region-line':''} ${txt.trim()?'':'blank-calendar-line'}" style="${st}">${renderInlineSegments(l)}</div>`;
}
function renderBlankCellNote(key){const note=(state.blankCells||{})[key];return note?.lines?.length?`<div class="blank-note-content">${note.lines.map((l,i)=>renderCalendarLine(l,i,false)).join('')}</div>`:''}
function renderCalendar(){
  const weekdays=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
  const appearance=ensureAppearance();
  $('weekdayRow').innerHTML=weekdays.map((w,i)=>{const s=appearance.weekdays[i];return `<div class="weekday ${i>4?'weekend':''}" style="background:${colorValue(s.bg,s.transparent)};color:${s.text}">${w}</div>`}).join('');
  const y=state.month.getFullYear(),m=state.month.getMonth(),first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),offset=(first.getDay()+6)%7,weeks=weeksForMonth(y,m);let html='';
  for(let i=0;i<weeks*7;i++){
    const d=i-offset+1;if(d<1||d>days){const key=blankCellKey(i);const has=!!(state.blankCells?.[key]?.lines?.length);html+=`<div class="day blank ${has?'has-blank-note':''}" data-blank-key="${esc(key)}">${renderBlankCellNote(key)}</div>`;continue}
    const dateObj=new Date(y,m,d),date=ymd(dateObj),dow=dateObj.getDay(),evs=calendarEventsForDate(date);
    const holiday=evs.some(isHolidayEvent),ds=appearance.date;
    let dateColor=ds.text||'#111111';
    if(holiday&&ds.holidayCustom!==false)dateColor=ds.holiday||'#d0181d';else if(dow===6)dateColor=ds.sat||'#d0181d';else if(dow===0)dateColor=ds.sun||'#d0181d';
    const dateStyle=`background:${colorValue(ds.bg,ds.transparent)};color:${dateColor};text-align:${ds.align||'left'};font-size:${Number(ds.size)||19}px`;
    html+=`<div class="day in-month ${dow===0||dow===6?'weekend':''} ${holiday?'holiday':''} ${evs.length?'has-events':''}" data-date="${date}"><div class="date-strip" style="${dateStyle}">${d}</div><div class="day-content">${evs.map(renderEvent).join('')}</div></div>`;
  }
  $('calendarGrid').innerHTML=html;$('calendarGrid').style.gridTemplateRows=`repeat(${weeks},1fr)`;
  document.querySelectorAll('.day.in-month').forEach(el=>el.addEventListener('dblclick',()=>state.mode==='admin'&&openEventEditor(null,el.dataset.date)));
  document.querySelectorAll('.day.blank[data-blank-key]').forEach(el=>el.addEventListener('dblclick',()=>state.mode==='admin'&&openBlankCellEditor(el.dataset.blankKey)));
  document.querySelectorAll('.event-block.clickable').forEach(el=>el.onclick=()=>state.mode==='admin'&&openEventEditor(el.dataset.id));
}
function renderEvent(e){
  const lines=(e.lines||[]).map((l,idx)=>renderCalendarLine(l,idx,e.highlight)).join('');
  const c=e.headcount?`<span class="count-badge">${esc(e.headcount)}人</span>`:'';
  return `<div class="event-block ${state.mode==='admin'&&!e.systemHoliday?'clickable':''} ${e.systemHoliday?'system-holiday':''}" ${e.systemHoliday?'':`data-id="${esc(e.id)}"`}>${lines}${c}</div>`
}
function renderContacts(){$('contactsGrid').innerHTML=state.contacts.map(c=>`<div class="contact-line"><span class="contact-name">※${esc(c.name)}：</span><span>${esc(c.address)}</span><span class="contact-tel">TEL：${esc(c.tel)}</span><span>FAX：${esc(c.fax)}</span></div>`).join('')}

function openModal(title,body,foot=''){$('modalTitle').textContent=title;$('modalBody').innerHTML=body;$('modalFoot').innerHTML=foot;$('modal').classList.remove('hidden')}
function closeModal(){$('modal').classList.add('hidden')}
function personOptions(list,selected=''){return `<option value="">— 未指定 —</option>`+list.map(p=>`<option value="${esc(p.id)}" ${p.id===selected?'selected':''}>${esc(p.name)} ${p.rank?`(${esc(p.rank)})`:''}${p.stars?` ${'★'.repeat(p.stars)}`:''}</option>`).join('')}
function personName(list,id){return list.find(p=>p.id===id)?.name||''}
function personByName(list,name){const n=String(name||'').trim();return list.find(p=>String(p.name||'').trim()===n)||null}
function ensurePersonFromInput(kind,name){
  const n=String(name||'').trim();if(!n)return null;
  const list=kind==='lecturer'?state.staff.lecturers:state.staff.hosts;
  let p=personByName(list,n);if(p)return p;
  p={id:uid(kind==='lecturer'?'l':'h'),name:n,note:'手動於行程新增'};
  if(kind==='lecturer')Object.assign(p,{stars:1,rank:'',special:false});else Object.assign(p,{rank:'SM',stars:0});
  list.push(p);return p;
}
function datalistHtml(id,items){const vals=[...new Set(items.map(x=>String(x||'').trim()).filter(Boolean))];return `<datalist id="${id}">${vals.map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist>`}
function courseSuggestionNames(){return [...COURSE_TYPES,...(state.reference.courseCatalog||[]).flatMap(c=>[c.name,c.category]),...(state.reference.courseNameUpdates||[]).flatMap(x=>[x.oldName,x.newName])].filter(Boolean)}
function ensureCourseFromInput(name,type){
  const n=String(name||'').trim(),cat=String(type||'').trim();if(!n)return null;
  state.reference=state.reference||{};state.reference.courseCatalog=Array.isArray(state.reference.courseCatalog)?state.reference.courseCatalog:[];
  let c=state.reference.courseCatalog.find(x=>String(x.name||'').trim()===n);
  if(c){if(!c.category&&cat)c.category=cat;return c}
  c={category:cat||'自訂課程',name:n,frequency:'',recommendedLecturers:[],allowedLecturers:[],source:'行程手動新增'};state.reference.courseCatalog.push(c);return c;
}
function defaultLines(){return []}
const COMMON_LINE_COLORS=['#111111','#555555','#0057B8','#16831F','#D0181D','#F28C28','#7A2CBF','#B8860B'];
function normalizeHexColor(v){const x=String(v||'').trim();return /^#[0-9a-fA-F]{6}$/.test(x)?x.toUpperCase():'#111111'}
function recentLineColors(){state.meta.recentLineColors=Array.isArray(state.meta.recentLineColors)?state.meta.recentLineColors.map(normalizeHexColor):[];return [...new Set(state.meta.recentLineColors)].slice(0,8)}
function rememberLineColor(color){const c=normalizeHexColor(color);state.meta.recentLineColors=[c,...recentLineColors().filter(x=>x!==c)].slice(0,8)}
function colorSwatches(colors,cls){return colors.map(c=>`<button type="button" class="color-swatch ${cls||''}" data-color="${c}" style="background:${c}" title="${c}"></button>`).join('')}
function lineColorControl(color,scope='line'){const c=normalizeHexColor(color);const recent=recentLineColors();return `<div class="line-color-control"><button type="button" class="mini ${scope}-color-btn" title="文字顏色"><span class="line-color-chip" style="background:${c}"></span></button><input class="${scope}-color-value" type="hidden" value="${c}"><div class="line-color-popover hidden"><div class="color-section"><b>常用色</b><div class="color-swatches">${colorSwatches(COMMON_LINE_COLORS,'common-color')}</div></div><div class="color-section recent-color-section"><b>最近使用</b><div class="color-swatches recent-color-swatches">${recent.length?colorSwatches(recent,'recent-color'):'<span class="empty-recent-color">尚無紀錄</span>'}</div></div><label class="other-color"><span>其他顏色</span><input class="${scope}-color-native" type="color" value="${c}"></label></div></div>`}
function segmentRow(seg={}){return `<div class="segment-row"><input class="mini segment-text" type="text" value="${esc(seg.text||'')}" placeholder="文字片段">${lineColorControl(seg.color||'#111111','segment')}<button type="button" class="mini style-btn toggle segment-bold ${seg.bold?'active':''}"><b>B</b></button><button type="button" class="mini style-btn toggle segment-italic ${seg.italic?'active':''}"><i>I</i></button><button type="button" class="mini style-btn toggle segment-underline ${seg.underline?'active':''}"><u>U</u></button><button type="button" class="mini danger remove-segment">刪</button></div>`}
function segmentEditorHtml(l){const segs=Array.isArray(l?.segments)&&l.segments.length?l.segments:[];return `<div class="segment-editor-wrap ${segs.length?'':'hidden'}"><div class="segment-hint">同一行可拆成多個文字片段，各自設定顏色、粗體、斜體、底線。</div><div class="segment-list">${segs.map(segmentRow).join('')}</div><button type="button" class="mini secondary add-segment">＋ 新增文字片段</button></div>`}
function lineEditorHtml(lines){return (lines||[]).map((l,i)=>lineRow(l,i)).join('')}
function lineRow(l,i){const segmented=Array.isArray(l?.segments)&&l.segments.length;return `<div class="line-editor ${segmented?'is-segmented':''}" data-line="${i}"><div class="line-toolbar">
<input class="mini line-text" type="text" value="${esc(lineText(l))}" placeholder="輸入文字（完全可手動修改）" ${segmented?'readonly':''}>
<input class="mini line-size" type="number" min="8" max="48" value="${Number(l.size)||14}" title="字體大小">
${lineColorControl(l.color||'#111111','line')}
<select class="mini line-align"><option value="left" ${l.align==='left'?'selected':''}>靠左</option><option value="center" ${l.align==='center'?'selected':''}>置中</option><option value="right" ${l.align==='right'?'selected':''}>靠右</option></select>
<button type="button" class="mini style-btn toggle line-bold ${l.bold?'active':''}" title="整行粗體"><b>B</b></button>
<button type="button" class="mini style-btn toggle line-italic ${l.italic?'active':''}" title="整行斜體"><i>I</i></button>
<button type="button" class="mini style-btn toggle line-underline ${l.underline?'active':''}" title="整行底線"><u>U</u></button>
<button type="button" class="mini segment-toggle ${segmented?'active':''}" title="同一行分段樣式">分段</button>
<button type="button" class="mini move-line-up" title="上移">▲</button><button type="button" class="mini move-line-down" title="下移">▼</button>
<button type="button" class="mini danger remove-line">刪</button></div>${segmentEditorHtml(l)}</div>`}
function appendDisplayLine(line,containerId='lineEditors'){
  if(!line)return;
  const box=$(containerId);if(!box)return;
  const count=box.querySelectorAll('.line-editor').length;
  box.insertAdjacentHTML('beforeend',lineRow(line,count));wireLineEditors(box);
}
function syncSegmentedLine(row){const segs=[...row.querySelectorAll('.segment-row')].map(r=>r.querySelector('.segment-text').value);const t=row.querySelector('.line-text');if(t)t.value=segs.join('')}
function setScopedColor(row,scope,color,remember=true){const c=normalizeHexColor(color),hidden=row.querySelector(`.${scope}-color-value`),native=row.querySelector(`.${scope}-color-native`),chip=row.querySelector('.line-color-chip');if(hidden)hidden.value=c;if(native)native.value=c;if(chip)chip.style.background=c;if(remember){rememberLineColor(c);refreshRecentColorSwatches()}}
function wireColorControl(control,scope){if(!control)return;const btn=control.querySelector(`.${scope}-color-btn`),pop=control.querySelector('.line-color-popover');if(btn&&pop){btn.onclick=e=>{e.stopPropagation();document.querySelectorAll('.line-color-popover').forEach(x=>{if(x!==pop)x.classList.add('hidden')});pop.classList.toggle('hidden')};pop.onclick=e=>{e.stopPropagation();const sw=e.target.closest('.color-swatch');if(sw){setScopedColor(control,scope,sw.dataset.color,true);pop.classList.add('hidden')}}}const native=control.querySelector(`.${scope}-color-native`);if(native)native.oninput=()=>setScopedColor(control,scope,native.value,true)}
function wireSegmentRows(lineRowEl){lineRowEl.querySelectorAll('.segment-row').forEach(seg=>{seg.querySelectorAll('.toggle').forEach(btn=>btn.onclick=()=>btn.classList.toggle('active'));seg.querySelector('.remove-segment').onclick=()=>{seg.remove();syncSegmentedLine(lineRowEl)};seg.querySelector('.segment-text').oninput=()=>syncSegmentedLine(lineRowEl);wireColorControl(seg.querySelector('.line-color-control'),'segment')})}
function refreshRecentColorSwatches(){const html=recentLineColors().length?colorSwatches(recentLineColors(),'recent-color'):'<span class="empty-recent-color">尚無紀錄</span>';document.querySelectorAll('.recent-color-swatches').forEach(el=>{el.innerHTML=html})}
function setLineColor(row,color,remember=true){setScopedColor(row,'line',color,remember)}
function wireLineEditors(root=document){root.querySelectorAll('.line-editor').forEach(row=>{
  row.querySelectorAll(':scope > .line-toolbar .toggle').forEach(btn=>btn.onclick=()=>btn.classList.toggle('active'));
  row.querySelector('.remove-line').onclick=()=>row.remove();
  row.querySelector('.move-line-up').onclick=()=>{const prev=row.previousElementSibling;if(prev)row.parentNode.insertBefore(row,prev)};
  row.querySelector('.move-line-down').onclick=()=>{const next=row.nextElementSibling;if(next)row.parentNode.insertBefore(next,row)};
  wireColorControl(row.querySelector(':scope > .line-toolbar .line-color-control'),'line');
  const toggle=row.querySelector('.segment-toggle'),wrap=row.querySelector('.segment-editor-wrap'),list=row.querySelector('.segment-list'),text=row.querySelector('.line-text');
  toggle.onclick=()=>{const active=row.classList.toggle('is-segmented');toggle.classList.toggle('active',active);wrap.classList.toggle('hidden',!active);text.readOnly=active;if(active&&list.children.length===0){list.insertAdjacentHTML('beforeend',segmentRow({text:text.value,color:row.querySelector('.line-color-value')?.value||'#111111',bold:row.querySelector('.line-bold').classList.contains('active'),italic:row.querySelector('.line-italic').classList.contains('active'),underline:row.querySelector('.line-underline').classList.contains('active')}));wireSegmentRows(row)}else if(!active){text.value=[...list.querySelectorAll('.segment-text')].map(x=>x.value).join('');list.innerHTML=''}};
  row.querySelector('.add-segment').onclick=()=>{if(!row.classList.contains('is-segmented'))toggle.click();list.insertAdjacentHTML('beforeend',segmentRow({text:'',color:'#111111'}));wireSegmentRows(row)};
  wireSegmentRows(row);
})}
function collectLines(containerId='lineEditors'){const box=$(containerId);if(!box)return[];return [...box.querySelectorAll('.line-editor')].map(row=>{const base={text:row.querySelector('.line-text').value,size:+row.querySelector('.line-size').value||14,color:normalizeHexColor(row.querySelector('.line-color-value')?.value),align:row.querySelector('.line-align').value,bold:row.querySelector('.line-bold').classList.contains('active'),italic:row.querySelector('.line-italic').classList.contains('active'),underline:row.querySelector('.line-underline').classList.contains('active')};if(row.classList.contains('is-segmented')){base.segments=[...row.querySelectorAll('.segment-row')].map(seg=>({text:seg.querySelector('.segment-text').value,color:normalizeHexColor(seg.querySelector('.segment-color-value')?.value),bold:seg.querySelector('.segment-bold').classList.contains('active'),italic:seg.querySelector('.segment-italic').classList.contains('active'),underline:seg.querySelector('.segment-underline').classList.contains('active')}));base.text=base.segments.map(x=>x.text).join('')}return base})}
function generatedBlankCellLines(){
  const type=$('blankType')?.value.trim()||'',course=$('blankCourseName')?.value.trim()||'',region=$('blankRegion')?.value.trim()||'';
  const hostName=$('blankHostName')?.value.trim()||'',lecName=$('blankLecturerName')?.value.trim()||'',head=$('blankCount')?.value||'';
  const host=personByName(state.staff.hosts,hostName),lec=personByName(state.staff.lecturers,lecName);
  const lines=[];
  const first=[region,course||type].filter(Boolean).join('-');
  if(first){const segs=[];if(region)segs.push({text:region+(course||type?'-':''),color:'#111111',bold:true,italic:false,underline:false});if(course||type)segs.push({text:course||type,color:'#111111',bold:true,italic:false,underline:false});lines.push({text:first,size:16,color:'#111111',align:'left',bold:true,italic:false,underline:false,segments:segs.length>1?segs:undefined})}
  if(host)lines.push({text:`主持：${host.name}${host.rank?' '+rankWithZh(host.rank):''}`,size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  else if(hostName)lines.push({text:`主持：${hostName}`,size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  if(lec)lines.push({text:`講師：${lec.name}${lec.stars?' '+['','一星','二星','三星'][lec.stars]+'講師':''}`,size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  else if(lecName)lines.push({text:`講師：${lecName}`,size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  if(head)lines.push({text:`統計人數：${head}人`,size:12,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  return lines;
}
function openBlankCellEditor(key){
  state.blankCells=state.blankCells||{};
  const existing=clone(state.blankCells[key]||{lines:[],type:'',courseName:'',region:'',lecturerName:'',hostName:'',headcount:'',note:''});
  openModal('跨月空白格行程排定',`<div class="event-assist-note panel-note"><b>跨月空白格也可排入內容</b>：可像一般行程一樣從上方快速帶入課程、區域、主持人、講師與統計人數；加入下方後，每一行都能完全獨立修改文字、大小、顏色、對齊、粗體、斜體、底線、分段顏色與順序。此格不代表實際日期，不參與三個月排程衝突檢查。</div>
  <div class="form-grid event-assist-grid blank-assist-grid">
    <label class="field"><span>課程類型（可選／可新增）</span><input id="blankType" list="blankTypeList" value="${esc(existing.type||'')}" placeholder="例如：系統培訓">${datalistHtml('blankTypeList',COURSE_TYPES)}</label>
    <label class="field"><span>課程 / 活動名稱（可選／可新增）</span><input id="blankCourseName" list="blankCourseList" value="${esc(existing.courseName||'')}" placeholder="例如：注意事項 / 健康回饋日">${datalistHtml('blankCourseList',courseSuggestionNames())}</label>
    <label class="field"><span>區域（可選／可新增）</span><input id="blankRegion" list="blankRegionList" value="${esc(existing.region||'')}" placeholder="例如：中壢">${datalistHtml('blankRegionList',REGIONS)}</label>
    <label class="field"><span>統計人數</span><input id="blankCount" type="number" min="0" value="${esc(existing.headcount||'')}" placeholder="可留空"></label>
    <label class="field"><span>講師（可選／可新增）</span><input id="blankLecturerName" list="blankLecturerList" value="${esc(existing.lecturerName||'')}" placeholder="輸入或選擇講師">${datalistHtml('blankLecturerList',state.staff.lecturers.map(x=>x.name))}</label>
    <label class="field"><span>主持人（可選／可新增）</span><input id="blankHostName" list="blankHostList" value="${esc(existing.hostName||'')}" placeholder="輸入或選擇主持人">${datalistHtml('blankHostList',state.staff.hosts.map(x=>x.name))}</label>
    <label class="field span2"><span>附註事項（內部備註，不固定顯示）</span><textarea id="blankNote">${esc(existing.note||'')}</textarea></label>
    <div class="span2 transfer-panel"><div class="transfer-title"><b>↓ 將上方資料加入下方顯示文字</b><span>可重複加入多組內容，同一個空白格可排多筆文字。</span></div>
      <div class="toolbar-row transfer-buttons"><button id="blankAddCourseBtn" type="button" class="secondary">＋ 課程 / 區域</button><button id="blankAddHostBtn" type="button" class="secondary">＋ 主持人</button><button id="blankAddLecturerBtn" type="button" class="secondary">＋ 講師</button><button id="blankAddCountBtn" type="button" class="secondary">＋ 統計人數</button><button id="blankAutoFillBtn" type="button" class="primary">＋ 全部加入下方</button></div>
    </div>
    <div class="span2 display-lines-panel"><div class="toolbar-row"><b>實際顯示文字（每行皆可修改）</b><button id="blankAddLineBtn" type="button" class="secondary">＋ 手動新增一行</button><button id="blankAddSpaceBtn" type="button" class="secondary">＋ 空白間距行</button></div><div class="panel-note small-note">下方才是實際出現在跨月空白格的內容。每行都可自由輸入，並可獨立設定字體大小、顏色、左／中／右、粗體、斜體、底線、同一行分段顏色與上下順序。</div><div id="blankLineEditors">${lineEditorHtml(existing.lines||[])}</div></div>
  </div>`,`<button id="blankDeleteBtn" class="danger">清除此格</button><button id="blankCancelBtn" class="secondary">取消</button><button id="blankSaveBtn" class="primary">儲存</button>`);
  wireLineEditors($('blankLineEditors'));
  $('blankAddLineBtn').onclick=()=>appendDisplayLine({text:'',size:14,color:'#111111',align:'left',bold:false,italic:false,underline:false},'blankLineEditors');
  $('blankAddSpaceBtn').onclick=()=>appendDisplayLine({text:'',size:18,color:'#111111',align:'left',bold:false,italic:false,underline:false},'blankLineEditors');
  $('blankAddCourseBtn').onclick=()=>{const [x]=generatedBlankCellLines();if(x)appendDisplayLine(x,'blankLineEditors')};
  $('blankAddHostBtn').onclick=()=>{const x=generatedBlankCellLines().find(x=>x.text.startsWith('主持：'));if(x)appendDisplayLine(x,'blankLineEditors')};
  $('blankAddLecturerBtn').onclick=()=>{const x=generatedBlankCellLines().find(x=>x.text.startsWith('講師：'));if(x)appendDisplayLine(x,'blankLineEditors')};
  $('blankAddCountBtn').onclick=()=>{const x=generatedBlankCellLines().find(x=>x.text.startsWith('統計人數：'));if(x)appendDisplayLine(x,'blankLineEditors')};
  $('blankAutoFillBtn').onclick=()=>generatedBlankCellLines().forEach(x=>appendDisplayLine(x,'blankLineEditors'));
  $('blankCancelBtn').onclick=closeModal;
  $('blankDeleteBtn').onclick=()=>{delete state.blankCells[key];saveLocal();closeModal();renderAll()};
  $('blankSaveBtn').onclick=()=>{
    const lines=collectLines('blankLineEditors');
    lines.forEach(l=>{rememberLineColor(l.color);(l.segments||[]).forEach(s=>rememberLineColor(s.color))});
    const type=$('blankType').value.trim(),courseName=$('blankCourseName').value.trim(),region=$('blankRegion').value.trim(),lecturerName=$('blankLecturerName').value.trim(),hostName=$('blankHostName').value.trim();
    if(courseName)ensureCourseFromInput(courseName,type);
    if(lecturerName)ensurePersonFromInput('lecturer',lecturerName);
    if(hostName)ensurePersonFromInput('host',hostName);
    state.blankCells[key]={lines,type,courseName,region,lecturerName,hostName,headcount:$('blankCount').value,note:$('blankNote').value};
    saveLocal();closeModal();renderAll();
  };
}
function generatedEventLines(){
  const type=$('evType').value.trim(),course=$('evCourseName').value.trim(),region=$('evRegion').value.trim();
  const lec=personByName(state.staff.lecturers,$('evLecturerName').value),host=personByName(state.staff.hosts,$('evHostName').value);
  const head=$('evCount').value;
  const lines=[];
  const first=[region,course||type].filter(Boolean).join('-');
  if(first){const segs=[];if(region)segs.push({text:region+(course||type?'-':''),color:'#111111',bold:true,italic:false,underline:false});if(course||type)segs.push({text:course||type,color:'#111111',bold:true,italic:false,underline:false});lines.push({text:first,size:16,color:'#111111',align:'left',bold:true,italic:false,underline:false,segments:segs.length>1?segs:undefined})}
  if(host)lines.push({text:`主持：${host.name}${host.rank?' '+rankWithZh(host.rank):''}`,size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  else if($('evHostName').value.trim())lines.push({text:`主持：${$('evHostName').value.trim()}`,size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  if(lec)lines.push({text:`講師：${lec.name}${lec.stars?' '+['','一星','二星','三星'][lec.stars]+'講師':''}`,size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  else if($('evLecturerName').value.trim())lines.push({text:`講師：${$('evLecturerName').value.trim()}`,size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  if(head)lines.push({text:`統計人數：${head}人`,size:12,color:'#555555',align:'left',bold:false,italic:false,underline:false});
  return lines;
}
function openEventEditor(id,date){
  const e=id?state.events.find(x=>x.id===id):null;
  const obj=e?clone(e):{id:'',date:date||ymd(state.month),type:'系統培訓',courseName:'',region:'',lecturerId:'',hostId:'',audioId:'',headcount:'',note:'',highlight:false,lines:defaultLines()};
  const lecName=personName(state.staff.lecturers,obj.lecturerId),hostName=personName(state.staff.hosts,obj.hostId);
  const knownCourse=obj.courseName||'';
  openModal(e?'編輯行程':'新增行程',`<div class="event-assist-note panel-note"><b>上方是「排程資料 / 快速帶入區」</b>：可從既有資料選擇，也可直接輸入新內容；不會鎖定下方顯示文字。按「加入下方」後，每一行仍可獨立修改文字與格式。同一天可儲存多筆不同區域行程。手動輸入的新課程、講師、主持人，儲存後會自動加入資料庫，之後可直接選用。</div>
  <div class="form-grid event-assist-grid">
    <label class="field"><span>日期</span><input id="evDate" type="date" value="${esc(obj.date)}"></label>
    <label class="field"><span>課程類型（可選／可新增）</span><input id="evType" list="evTypeList" value="${esc(obj.type||'')}" placeholder="例如：系統培訓">${datalistHtml('evTypeList',COURSE_TYPES)}</label>
    <label class="field"><span>課程 / 活動名稱（可選／可新增）</span><input id="evCourseName" list="evCourseList" value="${esc(knownCourse)}" placeholder="例如：產品 Q&A">${datalistHtml('evCourseList',courseSuggestionNames())}</label>
    <label class="field"><span>區域（可選／可新增）</span><input id="evRegion" list="evRegionList" value="${esc(obj.region||'')}" placeholder="例如：宜蘭">${datalistHtml('evRegionList',REGIONS)}</label>
    <label class="field"><span>統計人數</span><input id="evCount" type="number" min="0" value="${esc(obj.headcount||'')}" placeholder="可留空"></label>
    <label class="field"><span>講師（可選／可新增）</span><input id="evLecturerName" list="evLecturerList" value="${esc(lecName)}" placeholder="輸入或選擇講師">${datalistHtml('evLecturerList',state.staff.lecturers.map(x=>x.name))}</label>
    <label class="field"><span>主持人（可選／可新增）</span><input id="evHostName" list="evHostList" value="${esc(hostName)}" placeholder="輸入或選擇主持人">${datalistHtml('evHostList',state.staff.hosts.map(x=>x.name))}</label>
    <label class="field"><span>首行底色提示</span><select id="evHighlight"><option value="0" ${!obj.highlight?'selected':''}>關閉</option><option value="1" ${obj.highlight?'selected':''}>開啟</option></select></label>
    <label class="field span2"><span>附註事項（內部備註，不固定顯示）</span><textarea id="evNote">${esc(obj.note||'')}</textarea></label>
    <div class="span2 transfer-panel"><div class="transfer-title"><b>↓ 將上方資料加入下方顯示文字</b><span>加入後可完全獨立修改，不會因上方欄位再次變更而被覆蓋。</span></div>
      <div class="toolbar-row transfer-buttons"><button id="addCourseBtn" type="button" class="secondary">＋ 課程 / 區域</button><button id="addHostBtn" type="button" class="secondary">＋ 主持人</button><button id="addLecturerBtn" type="button" class="secondary">＋ 講師</button><button id="addCountBtn" type="button" class="secondary">＋ 統計人數</button><button id="autoFillBtn" type="button" class="primary">＋ 全部加入下方</button><button id="smartSuggestBtn" type="button" class="secondary">✨ 智慧推薦人員</button></div>
      <div id="smartSuggestBox" class="smart-suggest-box"></div>
    </div>
    <div class="span2 display-lines-panel"><div class="toolbar-row"><b>實際顯示文字（每行獨立設定）</b><button id="addLineBtn" type="button" class="secondary">＋ 手動新增一行</button><button id="addBlankLineBtn" type="button" class="secondary">＋ 空白間距行</button></div><div class="panel-note small-note">下方才是實際出現在月曆上的文字。每行可調整字體大小、顏色、靠左／置中／靠右、粗體、斜體、底線與順序。</div><div id="lineEditors">${lineEditorHtml(obj.lines||[])}</div></div>
  </div>`,`${e?'<button id="deleteEventBtn" class="danger primary">刪除</button>':''}<button id="cancelModalBtn" class="secondary">取消</button><button id="saveAddSameDayBtn" class="secondary">儲存＋同日新增另一區</button><button id="saveEventBtn" class="primary">儲存</button>`);
  wireLineEditors();
  $('addLineBtn').onclick=()=>appendDisplayLine({text:'',size:14,color:'#111111',align:'left',bold:false,italic:false,underline:false});$('addBlankLineBtn').onclick=()=>appendDisplayLine({text:'',size:18,color:'#111111',align:'left',bold:false,italic:false,underline:false});
  $('addCourseBtn').onclick=()=>{const [x]=generatedEventLines();if(x)appendDisplayLine(x)};
  $('addHostBtn').onclick=()=>{const x=generatedEventLines().find(x=>x.text.startsWith('主持：'));if(x)appendDisplayLine(x)};
  $('addLecturerBtn').onclick=()=>{const x=generatedEventLines().find(x=>x.text.startsWith('講師：'));if(x)appendDisplayLine(x)};
  $('addCountBtn').onclick=()=>{const x=generatedEventLines().find(x=>x.text.startsWith('統計人數：'));if(x)appendDisplayLine(x)};
  $('autoFillBtn').onclick=()=>generatedEventLines().forEach(appendDisplayLine);
  $('smartSuggestBtn').onclick=()=>smartSuggestForEditor();$('cancelModalBtn').onclick=closeModal;$('saveEventBtn').onclick=()=>saveEvent(obj.id,false);$('saveAddSameDayBtn').onclick=()=>saveEvent(obj.id,true);
  if(e)$('deleteEventBtn').onclick=()=>{if(confirm('確定刪除此行程？')){state.events=state.events.filter(x=>x.id!==e.id);saveLocal();closeModal();renderAll()}};
}
function refreshRecentColorSwatches(){
  const html=recentLineColors().length?colorSwatches(recentLineColors(),'recent-color'):'<span class="empty-recent-color">尚無紀錄</span>';
  document.querySelectorAll('.recent-color-swatches').forEach(el=>{el.innerHTML=html});
}
function setLineColor(row,color,remember=true){
  const c=normalizeHexColor(color),hidden=row.querySelector('.line-color-value'),native=row.querySelector('.line-color-native'),chip=row.querySelector('.line-color-chip');
  if(hidden)hidden.value=c;if(native)native.value=c;if(chip)chip.style.background=c;
  if(remember){rememberLineColor(c);refreshRecentColorSwatches()}
}
function wireLineEditors(){document.querySelectorAll('.line-editor').forEach(row=>{
  row.querySelectorAll('.toggle').forEach(btn=>btn.onclick=()=>btn.classList.toggle('active'));
  row.querySelector('.remove-line').onclick=()=>row.remove();
  row.querySelector('.move-line-up').onclick=()=>{const prev=row.previousElementSibling;if(prev)row.parentNode.insertBefore(row,prev)};
  row.querySelector('.move-line-down').onclick=()=>{const next=row.nextElementSibling;if(next)row.parentNode.insertBefore(next,row)};
  const btn=row.querySelector('.line-color-btn'),pop=row.querySelector('.line-color-popover');
  if(btn&&pop){btn.onclick=e=>{e.stopPropagation();document.querySelectorAll('.line-color-popover').forEach(x=>{if(x!==pop)x.classList.add('hidden')});pop.classList.toggle('hidden')};pop.onclick=e=>{e.stopPropagation();const sw=e.target.closest('.color-swatch');if(sw){setLineColor(row,sw.dataset.color,true);pop.classList.add('hidden')}}}
  const native=row.querySelector('.line-color-native');if(native)native.oninput=()=>setLineColor(row,native.value,true);
})}
function collectLines(){return [...document.querySelectorAll('#lineEditors .line-editor')].map(row=>({text:row.querySelector('.line-text').value,size:+row.querySelector('.line-size').value||14,color:normalizeHexColor(row.querySelector('.line-color-value')?.value),align:row.querySelector('.line-align').value,bold:row.querySelector('.line-bold').classList.contains('active'),italic:row.querySelector('.line-italic').classList.contains('active'),underline:row.querySelector('.line-underline').classList.contains('active')}))}
function autofillEventLines(){generatedEventLines().forEach(appendDisplayLine)}
function saveEvent(id,addSameDay=false){
  const existing=id?state.events.find(x=>x.id===id):null;
  const typeInput=$('evType').value.trim(),courseInput=$('evCourseName').value.trim();
  const lecturer=ensurePersonFromInput('lecturer',$('evLecturerName').value),host=ensurePersonFromInput('host',$('evHostName').value);
  ensureCourseFromInput(courseInput,typeInput);
  const lines=collectLines();lines.forEach(l=>{rememberLineColor(l.color);(l.segments||[]).forEach(s=>rememberLineColor(s.color))});
  const obj={id:id||uid(),date:$('evDate').value,type:typeInput,courseName:courseInput,region:$('evRegion').value.trim(),lecturerId:lecturer?.id||'',hostId:host?.id||'',audioId:existing?.audioId||'',headcount:$('evCount').value,note:$('evNote').value,highlight:$('evHighlight').value==='1',lines,order:existing?.order||0};
  if(!obj.date)return alert('請選擇日期');if(!obj.lines.length&&!confirm('目前下方沒有顯示文字，仍要儲存這筆行程嗎？'))return;
  const idx=state.events.findIndex(x=>x.id===obj.id);if(idx>=0)state.events[idx]=obj;else state.events.push(obj);saveLocal();closeModal();renderAll();if(addSameDay)setTimeout(()=>openEventEditor(null,obj.date),0)
}

function showValidation(){const warnings=validate3Months();openModal('三個月排程檢查',`<div class="panel-note">檢查範圍：${monthKey(state.month)} 起連續三個月。提示依「行事曆安排注意事項」整理，屬排程提醒，不會自動更改行程。</div><div class="warning-list">${warnings.length?warnings.map(w=>`<div class="warning-item ${w.severe?'severe':''}"><b>${esc(w.title)}</b><div>${esc(w.text)}</div></div>`).join(''):'<div class="panel-note">目前沒有偵測到異常排程。</div>'}</div>`,`<button id="okModal" class="primary">完成</button>`);$('okModal').onclick=closeModal}
function validate3Months(){
  const start=new Date(state.month),end=new Date(start.getFullYear(),start.getMonth()+3,1),ev=state.events.filter(e=>{const d=parseDate(e.date);return d>=start&&d<end}).sort((a,b)=>a.date.localeCompare(b.date)),w=[];
  const byPerson=(key,label)=>{const map={};ev.filter(e=>e[key]).forEach(e=>(map[e[key]]??=[]).push(e));for(const [id,arr] of Object.entries(map)){arr.sort((a,b)=>a.date.localeCompare(b.date));for(let i=1;i<arr.length;i++){const d=(parseDate(arr[i].date)-parseDate(arr[i-1].date))/86400000;if(d<=1){const p=[...state.staff.lecturers,...state.staff.hosts].find(x=>x.id===id);w.push({title:`${label}連續安排`,text:`${p?.name||id} 在 ${arr[i-1].date} 與 ${arr[i].date} 連續場次，建議調整。`,severe:true})}}}};
  byPerson('lecturerId','講師');byPerson('hostId','主持人');
  // monthly frequency
  for(const p of state.staff.lecturers){const counts={};ev.filter(e=>e.lecturerId===p.id).forEach(e=>counts[e.date.slice(0,7)]=(counts[e.date.slice(0,7)]||0)+1);for(const [m,c] of Object.entries(counts))if(c>2&&!p.special)w.push({title:'講師安排頻率',text:`${p.name} ${m} 共 ${c} 堂，附件原則為每月盡量 1–2 堂。`})}
  for(const p of state.staff.hosts){const counts={};ev.filter(e=>e.hostId===p.id).forEach(e=>counts[e.date.slice(0,7)]=(counts[e.date.slice(0,7)]||0)+1);for(const [m,c] of Object.entries(counts))if(c>1)w.push({title:'主持人輪替',text:`${p.name} ${m} 共主持 ${c} 堂，建議平均輪替。`})}
  const feedback=ev.filter(e=>e.type==='健康回饋日');
  feedback.forEach(e=>{const d=parseDate(e.date),dow=d.getDay(),day=d.getDate();if(['中壢','宜蘭','花蓮','台東'].includes(e.region)&&dow!==0)w.push({title:'回饋日日期偏好',text:`${e.region} ${e.date} 不是週日；附件建議如行程允許優先週日。`});if(['中壢','台北'].includes(e.region)&&day>14)w.push({title:'回饋日月初偏好',text:`${e.region} ${e.date} 位於月中後；附件指出中壢/台北通常安排前兩週。`})});
  const sameDatePairs=[['宜蘭','花蓮'],['台北','中壢'],['中壢','宜蘭'],['台東','嘉義']];for(const [a,b] of sameDatePairs){for(const x of feedback.filter(e=>e.region===a))if(feedback.some(e=>e.region===b&&e.date===x.date))w.push({title:'鄰近區域撞期',text:`${x.date} ${a} 與 ${b} 同日舉辦，建議錯開。`,severe:true})}
  const ty=feedback.filter(e=>['台南','高雄'].includes(e.region));for(let i=0;i<ty.length;i++)for(let j=i+1;j<ty.length;j++){const a=parseDate(ty[i].date),b=parseDate(ty[j].date);if(Math.abs(a-b)/86400000<7&&ty[i].region!==ty[j].region)w.push({title:'台南/高雄同週過近',text:`${ty[i].date} ${ty[i].region} 與 ${ty[j].date} ${ty[j].region} 間隔未滿一週，建議避免同週連續。`})}
  for(const r of REGIONS){const arr=feedback.filter(e=>e.region===r).sort((a,b)=>a.date.localeCompare(b.date));for(let i=1;i<arr.length;i++){const days=(parseDate(arr[i].date)-parseDate(arr[i-1].date))/86400000;if(days<12)w.push({title:'同區回饋日間隔',text:`${r} ${arr[i-1].date} 與 ${arr[i].date} 僅相隔 ${days} 天，附件建議約兩週。`})}}
  feedback.forEach(e=>{const host=state.staff.hosts.find(x=>x.id===e.hostId),lec=state.staff.lecturers.find(x=>x.id===e.lecturerId);if(!host||!lec||lec.special)return;const hs=rankScore(host.rank),ls=rankScore(lec.rank);if((host.stars||0)>(lec.stars||0)&&lec.stars>0)w.push({title:'主持/講師星級順序',text:`${e.date} 主持人 ${host.name} 的講師星級可能高於主講 ${lec.name}，請人工確認。`,severe:true});if(hs&&ls&&hs>ls)w.push({title:'主持/講師聘級順序',text:`${e.date} 主持人 ${host.name} 聘級高於主講 ${lec.name}，請確認是否符合例外條件。`,severe:true})});
  // Excel 名單資格、區域與課程推薦規則
  ev.forEach(e=>{const lec=state.staff.lecturers.find(x=>x.id===e.lecturerId),host=state.staff.hosts.find(x=>x.id===e.hostId),txt=eventCourseText(e);if(e.type==='說明會'){if(lec&&lec.seminarQualified===false)w.push({title:'講師說明會資格',text:`${e.date} ${lec.name} 在來源名單未標示說明會主講資格 V，請確認。`,severe:true});if(host&&host.seminarQualified===false)w.push({title:'主持人說明會資格',text:`${e.date} ${host.name} 在來源名單未標示說明會資格 V，請確認。`,severe:true})}for(const p of [lec,host])if(p&&e.region&&Array.isArray(p.regions)&&p.regions.length&&!p.regions.includes(e.region))w.push({title:'支援區域確認',text:`${e.date} ${p.name} 名單支援區域為 ${p.regions.join('、')}，本次安排 ${e.region}，請人工確認。`});const rule=(state.reference.courseCatalog||[]).find(c=>c.name&&txt.includes(c.name)||c.category&&txt.includes(c.category));if(rule&&lec){const listed=[...(rule.recommendedLecturers||[]),...(rule.allowedLecturers||[])];if(listed.length&&!nameMatch(listed,lec.name))w.push({title:'課程講師建議',text:`${e.date}「${rule.name||rule.category}」主講 ${lec.name} 不在來源表推薦/可安排名單，請人工確認。`})}});
  for(const rule of (state.reference.schedulingRules||[]).filter(x=>x.type==='courseFrequency')){for(let mi=0;mi<3;mi++){const md=new Date(start.getFullYear(),start.getMonth()+mi,1),mk=monthKey(md);const n=ev.filter(e=>e.date.startsWith(mk)&&rule.match.some(t=>eventCourseText(e).includes(t))).length;if(rule.maxPerMonth&&n>rule.maxPerMonth)w.push({title:'課程頻率提示',text:`${mk}「${rule.match[0]}」共 ${n} 堂；${rule.message}`})}}
  return dedupeWarnings(w)
}
function dedupeWarnings(w){const s=new Set();return w.filter(x=>{const k=x.title+x.text;if(s.has(k))return false;s.add(k);return true})}

function showStaff(){let active='lecturers';const draw=()=>{const list=state.staff[active],isL=active==='lecturers',isH=active==='hosts';$('modalBody').innerHTML=`<div class="tabs"><button class="tab ${active==='lecturers'?'active':''}" data-tab="lecturers">講師</button><button class="tab ${active==='hosts'?'active':''}" data-tab="hosts">主持人</button></div><div class="toolbar-row"><button id="addStaff" class="primary">＋ 新增人員</button></div><table class="staff-table"><thead><tr><th>姓名</th>${isL?'<th>星級</th><th>聘級</th><th>特聘/顧問</th>':isH?'<th>聘級</th>':''}<th>備註</th><th></th></tr></thead><tbody>${list.map(p=>`<tr data-id="${p.id}"><td><input class="s-name" value="${esc(p.name)}"></td>${isL?`<td><select class="s-stars">${[0,1,2,3].map(n=>`<option value="${n}" ${p.stars==n?'selected':''}>${n?`${n}星`:'無'}</option>`).join('')}</select></td><td><select class="s-rank"><option value="">—</option>${RANKS.map(r=>`<option ${p.rank===r?'selected':''}>${r}</option>`).join('')}</select></td><td><input class="s-special" type="checkbox" ${p.special?'checked':''}></td>`:isH?`<td><select class="s-rank"><option value="">—</option>${RANKS.map(r=>`<option ${p.rank===r?'selected':''}>${r}</option>`).join('')}</select></td>`:''}<td><input class="s-note" value="${esc(p.note||'')}" title="${esc([p.seminarQualified?'說明會資格V':'',p.regions?.length?'支援:'+p.regions.join('、'):'',p.seniority||''].filter(Boolean).join('｜'))}"><div style="font-size:11px;color:#666;margin-top:3px">${esc([p.seminarQualified?'說明會V':'',p.regions?.length?p.regions.join('、'):'',p.seniority||''].filter(Boolean).join('｜'))}</div></td><td><button class="danger mini s-del">刪</button></td></tr>`).join('')}</tbody></table>`;document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{active=b.dataset.tab;draw()});$('addStaff').onclick=()=>{const obj={id:uid(active[0]),name:'新成員',note:''};if(active==='lecturers')Object.assign(obj,{stars:1,rank:'',special:false});if(active==='hosts')Object.assign(obj,{rank:'SM',stars:0});state.staff[active].push(obj);draw()};document.querySelectorAll('tbody tr').forEach(tr=>{tr.querySelector('.s-del').onclick=()=>{state.staff[active]=state.staff[active].filter(x=>x.id!==tr.dataset.id);draw()}})};openModal('講師 / 主持人名單','',`<button id="staffCancel" class="secondary">取消</button><button id="staffSave" class="primary">儲存</button>`);draw();$('staffCancel').onclick=closeModal;$('staffSave').onclick=()=>{document.querySelectorAll('tbody tr').forEach(tr=>{const p=state.staff[active].find(x=>x.id===tr.dataset.id);if(!p)return;p.name=tr.querySelector('.s-name').value;p.note=tr.querySelector('.s-note').value;if(tr.querySelector('.s-rank'))p.rank=tr.querySelector('.s-rank').value;if(tr.querySelector('.s-stars'))p.stars=+tr.querySelector('.s-stars').value;if(tr.querySelector('.s-special'))p.special=tr.querySelector('.s-special').checked});saveLocal();closeModal();renderAll()}}

function showAppearance(){
  const a=ensureAppearance(),names=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
  const weekdayRows=names.map((name,i)=>{const s=a.weekdays[i];return `<div class="appearance-row" data-wd="${i}"><b>${name}</b><label>背景 <input class="wd-bg" type="color" value="${esc(s.bg||'#ffffff')}"></label><label class="check-label"><input class="wd-transparent" type="checkbox" ${s.transparent?'checked':''}>透明</label><label>文字 <input class="wd-text" type="color" value="${esc(s.text||'#111111')}"></label></div>`}).join('');
  openModal('星期 / 日期配色設定',`<div class="appearance-settings">
    <div class="panel-note">此處設定會直接套用到畫面與 PNG 匯出，並同步到 Railway PostgreSQL。透明選項會覆蓋背景色。</div>
    <div class="toolbar-row"><button id="presetOfficial" class="secondary">官方白底配色</button><button id="presetGreen" class="secondary">綠色星期配色</button></div>
    <h3>星期欄位</h3>${weekdayRows}
    <h3>日期欄位</h3>
    <div class="appearance-row date-settings-row"><b>日期背景</b><label>背景 <input id="dateBg" type="color" value="${esc(a.date.bg||'#ffffff')}"></label><label class="check-label"><input id="dateTransparent" type="checkbox" ${a.date.transparent?'checked':''}>透明</label></div>
    <div class="appearance-row"><b>日期文字</b><label>一般 <input id="dateText" type="color" value="${esc(a.date.text||'#111111')}"></label><label>週六 <input id="dateSat" type="color" value="${esc(a.date.sat||'#d0181d')}"></label><label>週日 <input id="dateSun" type="color" value="${esc(a.date.sun||'#d0181d')}"></label></div>
    <div class="appearance-row"><b>國定假日</b><label>顏色 <input id="dateHoliday" type="color" value="${esc(a.date.holiday||'#d0181d')}"></label><label class="check-label"><input id="holidayCustom" type="checkbox" ${a.date.holidayCustom!==false?'checked':''}>使用自訂假日顏色</label><small>取消勾選時，國定假日依一般週六／週日／平日日期色顯示。</small></div>
    <div class="appearance-row"><b>日期位置</b><label><select id="dateAlign"><option value="left" ${a.date.align==='left'?'selected':''}>偏左</option><option value="center" ${a.date.align==='center'?'selected':''}>置中</option><option value="right" ${a.date.align==='right'?'selected':''}>偏右</option></select></label><label>字體大小 <input id="dateSize" type="number" min="10" max="36" value="${Number(a.date.size)||19}"> px</label></div>
  </div>`,`<button id="appearanceCancel" class="secondary">取消</button><button id="appearanceSave" class="primary">儲存並套用</button>`);
  const applyPreset=(kind)=>{document.querySelectorAll('.appearance-row[data-wd]').forEach((row,i)=>{const bg=row.querySelector('.wd-bg'),tr=row.querySelector('.wd-transparent'),tx=row.querySelector('.wd-text');if(kind==='official'){bg.value='#ffffff';tr.checked=false;tx.value=i>4?'#d0181d':'#111111'}else{bg.value=i%2===0?'#2d807d':'#355b22';tr.checked=false;tx.value='#ffffff'}});$('dateBg').value='#ffffff';$('dateTransparent').checked=kind==='official';$('dateText').value='#111111';$('dateSat').value='#d0181d';$('dateSun').value='#d0181d';$('dateHoliday').value='#d0181d';$('holidayCustom').checked=true;$('dateAlign').value=kind==='official'?'left':'center'};
  $('presetOfficial').onclick=()=>{applyPreset('official');preview()};$('presetGreen').onclick=()=>{applyPreset('green');preview()};$('appearanceCancel').onclick=()=>{closeModal();renderAll()};
  // 即時預覽：調整色卡、透明、日期位置或字級時，先套用到月曆；按儲存才寫入雲端。
  const preview=()=>{const temp={weekdays:[],date:{}};document.querySelectorAll('.appearance-row[data-wd]').forEach(row=>temp.weekdays.push({bg:row.querySelector('.wd-bg').value,transparent:row.querySelector('.wd-transparent').checked,text:row.querySelector('.wd-text').value}));temp.date={bg:$('dateBg').value,transparent:$('dateTransparent').checked,text:$('dateText').value,sat:$('dateSat').value,sun:$('dateSun').value,holiday:$('dateHoliday').value,holidayCustom:$('holidayCustom').checked,align:$('dateAlign').value,size:+$('dateSize').value||19};const original=state.meta.appearance;state.meta.appearance=temp;renderCalendar();applyAppearanceStyles();state.meta.appearance=original;};
  document.querySelectorAll('.appearance-settings input,.appearance-settings select').forEach(el=>el.addEventListener('input',preview));
  $('appearanceSave').onclick=async()=>{const btn=$('appearanceSave');const next={weekdays:[],date:{}};document.querySelectorAll('.appearance-row[data-wd]').forEach(row=>next.weekdays.push({bg:row.querySelector('.wd-bg').value,transparent:row.querySelector('.wd-transparent').checked,text:row.querySelector('.wd-text').value}));next.date={bg:$('dateBg').value,transparent:$('dateTransparent').checked,text:$('dateText').value,sat:$('dateSat').value,sun:$('dateSun').value,holiday:$('dateHoliday').value,holidayCustom:$('holidayCustom').checked,align:$('dateAlign').value,size:+$('dateSize').value||19};state.meta.appearance=next;localStorage.setItem(LS_KEY,JSON.stringify({events:state.events,blankCells:state.blankCells||{},staff:state.staff,contacts:state.contacts,meta:state.meta,admin:state.admin,history:state.history}));renderAll();if(cloudReady&&state.mode==='admin'){btn.disabled=true;btn.textContent='同步中…';try{await pushCloudState(false)}catch(e){alert('配色已套用於此裝置，但雲端同步失敗：'+e.message)}finally{btn.disabled=false;btn.textContent='儲存並套用'}}closeModal();};
}

function showLayout(){openModal('版面設定',`<div class="form-grid"><label class="field span2"><span>大標題格式</span><input id="layTitle" value="${esc(state.meta.titleTemplate)}"><small>可使用 {Y} 年、{M} 月，例如：FEATERA {Y}年{M}月行事曆</small></label><label class="field span2"><span>副標題</span><input id="laySubtitle" value="${esc(state.meta.subtitle||'')}"></label><label class="field"><span>公司營業時間</span><input id="layHours" value="${esc(state.meta.businessHours)}"></label><label class="field"><span>客服專線</span><input id="layHotline" value="${esc(state.meta.hotline)}"></label><div class="span2 toolbar-row"><button id="chooseLogo" class="secondary">上傳 / 更換 Logo</button><button id="clearLogo" class="secondary">移除 Logo</button></div><div class="span2"><b>分公司聯絡資訊</b><div id="contactEditors">${state.contacts.map((c,i)=>`<div class="form-grid" style="border-top:1px solid #ddd;padding-top:10px;margin-top:8px"><label class="field"><span>名稱</span><input data-c="${i}" data-k="name" value="${esc(c.name)}"></label><label class="field"><span>地址</span><input data-c="${i}" data-k="address" value="${esc(c.address)}"></label><label class="field"><span>TEL</span><input data-c="${i}" data-k="tel" value="${esc(c.tel)}"></label><label class="field"><span>FAX</span><input data-c="${i}" data-k="fax" value="${esc(c.fax)}"></label></div>`).join('')}</div></div>`, `<button id="layCancel" class="secondary">取消</button><button id="laySave" class="primary">儲存</button>`);$('chooseLogo').onclick=()=>$('logoUpload').click();$('clearLogo').onclick=()=>{state.meta.logo='';renderHeader()};$('layCancel').onclick=closeModal;$('laySave').onclick=()=>{state.meta.titleTemplate=$('layTitle').value||'{Y}年{M}月行事曆';state.meta.subtitle=$('laySubtitle').value;state.meta.businessHours=$('layHours').value;state.meta.hotline=$('layHotline').value;document.querySelectorAll('#contactEditors input[data-c]').forEach(i=>state.contacts[+i.dataset.c][i.dataset.k]=i.value);saveLocal();closeModal();renderAll()}}
function handleLogoUpload(e){const f=e.target.files?.[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{state.meta.logo=rd.result;saveLocal();renderHeader()};rd.readAsDataURL(f);e.target.value=''}
function showSettings(){openModal('系統設定',`<div class="form-grid"><div class="span2 panel-note"><b>Railway PostgreSQL 雲端版</b><br>管理員帳號與密碼由 Railway Service Variables 管理：<code>ADMIN_USER</code>、<code>ADMIN_PASSWORD</code>。資料會在管理員儲存修改時自動同步；訪客登入時會自動讀取最新雲端資料。</div><label class="field span2"><span>台灣國定假日</span><span class="check-label"><input id="taiwanHolidayToggle" type="checkbox" ${state.meta.taiwanHolidays!==false?'checked':''}> 自動顯示行政院人事行政總處公布之國定假日／補假／連假（目前內建 2026、2027）</span><small>系統假日不會覆蓋你手動建立的假日行程；假日日期與文字顏色沿用「星期 / 日期配色」中的國定假日顏色。</small></label></div>`,`<button id="setClose" class="secondary">取消</button><button id="setSave" class="primary">儲存設定</button>`);$('setClose').onclick=closeModal;$('setSave').onclick=()=>{state.meta.taiwanHolidays=$('taiwanHolidayToggle').checked;saveLocal();renderAll();closeModal()}}
function showCloud(){openModal('Railway 雲端同步',`<div class="panel-note">目前使用 Railway PostgreSQL。登入時自動下載最新資料；管理員每次儲存修改後會自動上傳。也可在此手動同步。</div><div class="toolbar-row"><button id="cloudUpload" class="primary admin-only">↑ 立即上傳</button><button id="cloudDownload" class="secondary">↓ 重新下載</button></div><div id="cloudStatus"></div>`,`<button id="cloudClose" class="secondary">關閉</button>`);$('cloudClose').onclick=closeModal;if(state.mode==='guest')$('cloudUpload')?.classList.add('hidden');$('cloudUpload')?.addEventListener('click',async()=>{try{$('cloudStatus').textContent='上傳中…';await pushCloudState(false);$('cloudStatus').textContent='✅ 已完成 PostgreSQL 上傳'}catch(e){$('cloudStatus').textContent='❌ '+e.message}});$('cloudDownload').onclick=async()=>{try{$('cloudStatus').textContent='下載中…';await pullCloudState();renderAll();$('cloudStatus').textContent='✅ 已下載最新雲端資料'}catch(e){$('cloudStatus').textContent='❌ '+e.message}}}
function showStats(){const m=monthKey(state.month),ev=state.events.filter(e=>e.date.startsWith(m)),counts=ev.map(e=>+e.headcount||0),total=counts.reduce((a,b)=>a+b,0),n=counts.filter(x=>x>0).length,avg=n?Math.round(total/n):0;const byRegion={};ev.forEach(e=>{if(e.region)byRegion[e.region]=(byRegion[e.region]||0)+(+e.headcount||0)});openModal('本月人數統計',`<div class="stat-cards"><div class="stat-card"><span>排程場次</span><br><b>${ev.length}</b></div><div class="stat-card"><span>簽到總人數</span><br><b>${total}</b></div><div class="stat-card"><span>有填人數場次平均</span><br><b>${avg}</b></div></div><h3>各區合計</h3><table class="history-table"><tr><th>區域</th><th>人數</th></tr>${Object.entries(byRegion).sort((a,b)=>b[1]-a[1]).map(([r,c])=>`<tr><td>${esc(r)}</td><td>${c}</td></tr>`).join('')}</table>`,`<button id="statsClose" class="primary">關閉</button>`);$('statsClose').onclick=closeModal}
function showHistory(){const ref=state.reference||{};const courseRows=(ref.courseCatalog||[]).map(c=>`<tr><td>${esc(c.category||c.name)}</td><td>${esc(c.name||'')}</td><td>${esc(c.frequency||'')}</td><td>${esc((c.recommendedLecturers||[]).join('、'))}</td><td>${esc((c.allowedLecturers||[]).join('、'))}</td></tr>`).join('');openModal('排程資料庫 / 歷史參考',`<div class="panel-note"><b>已整合「課程行事曆安排(1).xlsx」</b><br>講師 ${(ref.lecturers||[]).length} 人、主持人 ${(ref.hosts||[]).length} 人，並將說明會資格、支援區域、年資、課程頻率與推薦講師納入排程提示。</div><h3>課程規則與推薦</h3><div style="overflow:auto;max-height:38vh"><table class="history-table"><tr><th>類別</th><th>課程</th><th>頻率</th><th>推薦講師</th><th>可安排講師</th></tr>${courseRows}</table></div><h3>課程名稱更新</h3><table class="history-table"><tr><th>原名稱</th><th>更新名稱</th></tr>${(ref.courseNameUpdates||[]).filter(x=>x.new).map(x=>`<tr><td>${esc(x.old)}</td><td>${esc(x.new)}</td></tr>`).join('')}</table><h3>既有歷史摘要</h3><table class="history-table"><tr><th>月份</th><th>摘要</th></tr>${state.history.map(h=>`<tr><td>${esc(h.month)}</td><td>${esc(h.note)}</td></tr>`).join('')}</table>`,`<button id="histClose" class="primary">關閉</button>`);$('histClose').onclick=closeModal}

async function makeCanvas(){document.body.classList.add('exporting');await new Promise(r=>setTimeout(r,80));const sheet=$('sheet');const canvas=await html2canvas(sheet,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false,width:sheet.scrollWidth,height:sheet.scrollHeight});document.body.classList.remove('exporting');return canvas}
async function exportPNG(){try{const canvas=await makeCanvas();const a=document.createElement('a');a.download=`FEATERA_${$('calendarTitle').textContent}.png`;a.href=canvas.toDataURL('image/png');a.click()}catch(e){document.body.classList.remove('exporting');alert('匯出失敗：'+e.message)}}
async function sharePNG(){try{const canvas=await makeCanvas();const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));const file=new File([blob],`FEATERA_${$('calendarTitle').textContent}.png`,{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({title:$('calendarTitle').textContent,text:'FEATERA 行事曆',files:[file]})}else{const a=document.createElement('a');a.download=file.name;a.href=URL.createObjectURL(blob);a.click();alert('此瀏覽器不支援直接分享，已改為下載 PNG。')}}catch(e){document.body.classList.remove('exporting');if(e.name!=='AbortError')alert('分享失敗：'+e.message)}}



// ===== v8.0 三個月智慧排課中心 =====
function getPlannerRange(){
  const start=new Date(state.month.getFullYear(),state.month.getMonth(),1);
  const end=new Date(start.getFullYear(),start.getMonth()+3,1);
  return {start,end,months:[0,1,2].map(i=>monthKey(new Date(start.getFullYear(),start.getMonth()+i,1)))};
}
function inRangeDate(date,start,end){const d=parseDate(date);return d>=start&&d<end}
function daysBetween(a,b){return Math.round((parseDate(b)-parseDate(a))/86400000)}
function personById(id){return [...state.staff.lecturers,...state.staff.hosts,...state.staff.audio].find(p=>p.id===id)}
function courseRuleForText(txt){return (state.reference.courseCatalog||[]).find(c=>(c.name&&txt.includes(c.name))||(c.category&&txt.includes(c.category)))}
function courseRuleForEditor(){
  const txt=[...document.querySelectorAll('.line-text')].map(x=>x.value).join(' ');
  return courseRuleForText(txt);
}
function assignmentEventsForPerson(id){return state.events.filter(e=>e.lecturerId===id||e.hostId===id)}
function candidateScore(person,role,ctx){
  let score=100,reasons=[];
  const {date,region,type,courseText,lecturer}=ctx;
  const assignments=assignmentEventsForPerson(person.id).sort((a,b)=>a.date.localeCompare(b.date));
  const sameDay=assignments.filter(e=>e.date===date);
  if(sameDay.length){score-=100;reasons.push('當日已有排程')}
  const prevNear=assignments.filter(e=>e.date<date).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const nextNear=assignments.filter(e=>e.date>date).sort((a,b)=>a.date.localeCompare(b.date))[0];
  if(prevNear){const d=daysBetween(prevNear.date,date);if(d===1){score-=35;reasons.push('前一天已有排程')}else if(d<=7){score-=8;reasons.push(`距前次僅 ${d} 天`)}else if(d>=21){score+=8;reasons.push('輪替間隔充足')}}
  if(nextNear){const d=daysBetween(date,nextNear.date);if(d===1){score-=35;reasons.push('隔天已有排程')}else if(d<=7){score-=8;reasons.push(`距下次僅 ${d} 天`)}}
  const mk=date.slice(0,7), monthly=assignments.filter(e=>e.date.startsWith(mk)).length;
  if(role==='lecturer'){
    if(monthly===0){score+=14;reasons.push('本月尚未授課')}else if(monthly===1){score+=5;reasons.push('本月已授課 1 堂')}else {score-=18*(monthly-1);reasons.push(`本月已授課 ${monthly} 堂`)}
  } else {
    if(monthly===0){score+=18;reasons.push('本月尚未主持')}else {score-=24*monthly;reasons.push(`本月已主持 ${monthly} 堂`)}
  }
  if(type==='說明會'){
    if(person.seminarQualified===true){score+=14;reasons.push('具說明會資格')}
    else if(person.seminarQualified===false){score-=45;reasons.push('名單未標示說明會資格')}
  }
  if(region&&Array.isArray(person.regions)&&person.regions.length){
    if(person.regions.includes(region)){score+=10;reasons.push('符合支援區域')}
    else {score-=22;reasons.push(`支援區域為 ${person.regions.join('、')}`)}
  }
  const rule=courseRuleForText(courseText||'');
  if(role==='lecturer'&&rule){
    if(nameMatch(rule.recommendedLecturers||[],person.name)){score+=28;reasons.push('來源表推薦講師')}
    else if(nameMatch(rule.allowedLecturers||[],person.name)){score+=16;reasons.push('來源表可安排講師')}
    else if((rule.recommendedLecturers||[]).length||(rule.allowedLecturers||[]).length){score-=12;reasons.push('不在來源表推薦/可安排名單')}
  }
  if(role==='host'&&lecturer&&!lecturer.special){
    const hs=rankScore(person.rank),ls=rankScore(lecturer.rank);
    if(hs&&ls&&hs>ls){score-=35;reasons.push('主持聘級高於主講')}
    if((person.stars||0)>(lecturer.stars||0)&&(lecturer.stars||0)>0){score-=35;reasons.push('主持講師星級高於主講')}
  }
  return {person,score,reasons};
}
function recommendPeople(role,ctx,limit=5){
  const list=role==='lecturer'?state.staff.lecturers:state.staff.hosts;
  return list.map(p=>candidateScore(p,role,ctx)).sort((a,b)=>b.score-a.score||a.person.name.localeCompare(b.person.name,'zh-Hant')).slice(0,limit);
}
function smartSuggestForEditor(){
  const date=$('evDate').value,region=$('evRegion').value,type=$('evType').value;
  if(!date)return alert('請先選擇日期');
  const courseText=[...document.querySelectorAll('.line-text')].map(x=>x.value).join(' ');
  const lecturers=recommendPeople('lecturer',{date,region,type,courseText},5);
  const chosenLecturer=lecturers[0]?.person||null;
  const hosts=recommendPeople('host',{date,region,type,courseText,lecturer:chosenLecturer},5);
  if(chosenLecturer)$('evLecturerName').value=chosenLecturer.name;
  if(hosts[0]?.person)$('evHostName').value=hosts[0].person.name;
  const fmt=(x,role)=>`<div class="smart-candidate"><div><b>${esc(x.person.name)}</b> <span class="score-pill">${x.score} 分</span></div><div class="smart-reasons">${esc(x.reasons.slice(0,4).join('｜')||'符合一般輪替條件')}</div><button type="button" class="mini pick-candidate" data-role="${role}" data-id="${esc(x.person.id)}">選用</button></div>`;
  $('smartSuggestBox').innerHTML=`<div class="smart-title">✨ 智慧推薦（已先選最高分人選）</div><div class="smart-columns"><div><b>講師 TOP 5</b>${lecturers.map(x=>fmt(x,'lecturer')).join('')}</div><div><b>主持人 TOP 5</b>${hosts.map(x=>fmt(x,'host')).join('')}</div></div><div class="panel-note">評分依三個月輪替、相鄰日期、每月安排次數、說明會資格、支援區域、課程推薦名單，以及主持/主講聘級與星級關係計算。此為排程輔助，仍由管理員最後確認。</div>`;
  document.querySelectorAll('.pick-candidate').forEach(b=>b.onclick=()=>{{const list=b.dataset.role==='lecturer'?state.staff.lecturers:state.staff.hosts;const p=list.find(x=>x.id===b.dataset.id);if(!p)return;if(b.dataset.role==='lecturer')$('evLecturerName').value=p.name;else $('evHostName').value=p.name}});
}
function enhancedValidate3Months(){
  const {start,end,months}=getPlannerRange();
  const ev=state.events.filter(e=>inRangeDate(e.date,start,end)).sort((a,b)=>a.date.localeCompare(b.date));
  const contextStart=new Date(start);contextStart.setDate(contextStart.getDate()-7);
  const contextEnd=new Date(end);contextEnd.setDate(contextEnd.getDate()+7);
  const context=state.events.filter(e=>{const d=parseDate(e.date);return d>=contextStart&&d<contextEnd}).sort((a,b)=>a.date.localeCompare(b.date));
  const w=[];
  const add=(severity,title,text,date='')=>w.push({severity,title,text,date,severe:severity==='high'});
  // 人員同日重複與跨月連續安排
  for(const role of [{key:'lecturerId',label:'講師'},{key:'hostId',label:'主持人'}]){
    const ids=[...new Set(context.map(e=>e[role.key]).filter(Boolean))];
    for(const id of ids){
      const arr=context.filter(e=>e[role.key]===id).sort((a,b)=>a.date.localeCompare(b.date));
      const p=personById(id);const nm=p?.name||id;
      const grouped={};arr.forEach(e=>(grouped[e.date]??=[]).push(e));
      for(const [date,items] of Object.entries(grouped))if(items.length>1&&inRangeDate(date,start,end))add('high',`${role.label}同日重複`,`${nm} 在 ${date} 同日安排 ${items.length} 場，請調整。`,date);
      for(let i=1;i<arr.length;i++){
        const d=daysBetween(arr[i-1].date,arr[i].date);
        if(d===1&&(inRangeDate(arr[i-1].date,start,end)||inRangeDate(arr[i].date,start,end)))add('high',`${role.label}連續安排`,`${nm} 在 ${arr[i-1].date} 與 ${arr[i].date} 連續場次；已包含跨月邊界檢查。`,arr[i].date);
      }
    }
  }
  // 同一人同日跨角色
  for(const e of ev){if(e.lecturerId&&e.hostId&&e.lecturerId===e.hostId)add('high','同場角色衝突',`${e.date} 同一人同時被指定為講師與主持人。`,e.date)}
  // 月頻率與輪替
  for(const p of state.staff.lecturers){for(const m of months){const c=ev.filter(e=>e.lecturerId===p.id&&e.date.startsWith(m)).length;if(c>2&&!p.special)add('medium','講師安排頻率',`${p.name} ${m} 共 ${c} 堂；來源原則為每月盡量 1–2 堂。`,m)}}
  for(const p of state.staff.hosts){for(const m of months){const c=ev.filter(e=>e.hostId===p.id&&e.date.startsWith(m)).length;if(c>1)add('medium','主持人輪替',`${p.name} ${m} 共主持 ${c} 堂，建議平均輪替。`,m)}}
  const feedback=ev.filter(e=>e.type==='健康回饋日');
  feedback.forEach(e=>{const d=parseDate(e.date),dow=d.getDay(),day=d.getDate();if(['中壢','宜蘭','花蓮','台東'].includes(e.region)&&dow!==0)add('low','回饋日日期偏好',`${e.region} ${e.date} 不是週日；來源建議如整體行程允許優先週日。`,e.date);if(['中壢','台北'].includes(e.region)&&day>14)add('low','回饋日月初偏好',`${e.region} ${e.date} 位於月中後；來源指出中壢/台北通常安排前兩週。`,e.date)});
  for(const [a,b] of [['宜蘭','花蓮'],['台北','中壢'],['中壢','宜蘭'],['台東','嘉義']])for(const x of feedback.filter(e=>e.region===a))if(feedback.some(e=>e.region===b&&e.date===x.date))add('high','鄰近區域撞期',`${x.date} ${a} 與 ${b} 同日舉辦，建議錯開。`,x.date);
  const ty=feedback.filter(e=>['台南','高雄'].includes(e.region));for(let i=0;i<ty.length;i++)for(let j=i+1;j<ty.length;j++){const gap=Math.abs(daysBetween(ty[i].date,ty[j].date));if(gap<7&&ty[i].region!==ty[j].region)add('medium','台南/高雄同週過近',`${ty[i].date} ${ty[i].region} 與 ${ty[j].date} ${ty[j].region} 間隔 ${gap} 天，來源建議避免同週連續。`,ty[j].date)}
  for(const r of REGIONS){const arr=feedback.filter(e=>e.region===r).sort((a,b)=>a.date.localeCompare(b.date));for(let i=1;i<arr.length;i++){const gap=daysBetween(arr[i-1].date,arr[i].date);if(gap<12)add('medium','同區回饋日間隔',`${r} ${arr[i-1].date} 與 ${arr[i].date} 相隔 ${gap} 天，來源建議約兩週。`,arr[i].date)}}
  feedback.forEach(e=>{const host=state.staff.hosts.find(x=>x.id===e.hostId),lec=state.staff.lecturers.find(x=>x.id===e.lecturerId);if(!host||!lec||lec.special)return;const hs=rankScore(host.rank),ls=rankScore(lec.rank);if((host.stars||0)>(lec.stars||0)&&(lec.stars||0)>0)add('high','主持/講師星級順序',`${e.date} 主持人 ${host.name} 的講師星級高於主講 ${lec.name}，請確認。`,e.date);if(hs&&ls&&hs>ls)add('high','主持/講師聘級順序',`${e.date} 主持人 ${host.name} 聘級高於主講 ${lec.name}，請確認是否屬例外。`,e.date)});
  ev.forEach(e=>{const lec=state.staff.lecturers.find(x=>x.id===e.lecturerId),host=state.staff.hosts.find(x=>x.id===e.hostId),txt=eventCourseText(e);if(e.type==='說明會'){if(lec&&lec.seminarQualified===false)add('high','講師說明會資格',`${e.date} ${lec.name} 在來源名單未標示說明會主講資格 V。`,e.date);if(host&&host.seminarQualified===false)add('high','主持人說明會資格',`${e.date} ${host.name} 在來源名單未標示說明會資格 V。`,e.date)}for(const p of [lec,host])if(p&&e.region&&Array.isArray(p.regions)&&p.regions.length&&!p.regions.includes(e.region))add('medium','支援區域確認',`${e.date} ${p.name} 名單支援區域為 ${p.regions.join('、')}，本次安排 ${e.region}。`,e.date);const rule=courseRuleForText(txt);if(rule&&lec){const listed=[...(rule.recommendedLecturers||[]),...(rule.allowedLecturers||[])];if(listed.length&&!nameMatch(listed,lec.name))add('low','課程講師建議',`${e.date}「${rule.name||rule.category}」主講 ${lec.name} 不在來源表推薦/可安排名單。`,e.date)}});
  for(const rule of (state.reference.schedulingRules||[]).filter(x=>x.type==='courseFrequency'))for(const mk of months){const n=ev.filter(e=>e.date.startsWith(mk)&&rule.match.some(t=>eventCourseText(e).includes(t))).length;if(rule.maxPerMonth&&n>rule.maxPerMonth)add('medium','課程頻率提示',`${mk}「${rule.match[0]}」共 ${n} 堂；${rule.message}`,mk)}
  return dedupeWarnings(w).sort((a,b)=>({high:0,medium:1,low:2}[a.severity]-{high:0,medium:1,low:2}[b.severity])||String(a.date).localeCompare(String(b.date)));
}
function validate3Months(){return enhancedValidate3Months()}
function showValidation(){
  const warnings=validate3Months(),counts={high:0,medium:0,low:0};warnings.forEach(x=>counts[x.severity]=(counts[x.severity]||0)+1);
  openModal('三個月排程檢查',`<div class="panel-note">檢查範圍：${getPlannerRange().months.join('、')}。並向前/向後延伸 7 天檢查跨月連續排程。</div><div class="planner-summary"><div class="planner-kpi danger-kpi"><b>${counts.high}</b><span>高優先</span></div><div class="planner-kpi warn-kpi"><b>${counts.medium}</b><span>需留意</span></div><div class="planner-kpi"><b>${counts.low}</b><span>建議</span></div></div><div class="warning-list">${warnings.length?warnings.map(w=>`<div class="warning-item ${w.severity==='high'?'severe':''}"><div class="severity-badge ${w.severity}">${w.severity==='high'?'高':w.severity==='medium'?'中':'低'}</div><b>${esc(w.title)}</b><div>${esc(w.text)}</div></div>`).join(''):'<div class="panel-note">✅ 目前沒有偵測到異常排程。</div>'}</div>`,`<button id="okModal" class="primary">完成</button>`);$('okModal').onclick=closeModal;
}
function plannerMonthStats(mk){
  const ev=state.events.filter(e=>e.date.startsWith(mk));
  return {events:ev.length,feedback:ev.filter(e=>e.type==='健康回饋日').length,seminar:ev.filter(e=>e.type==='說明會').length,lecturers:new Set(ev.map(e=>e.lecturerId).filter(Boolean)).size,hosts:new Set(ev.map(e=>e.hostId).filter(Boolean)).size};
}
function rotationGaps(role,months){
  const list=role==='lecturer'?state.staff.lecturers:state.staff.hosts,key=role==='lecturer'?'lecturerId':'hostId';
  return list.map(p=>({p,count:state.events.filter(e=>months.some(m=>e.date.startsWith(m))&&e[key]===p.id).length})).sort((a,b)=>a.count-b.count||a.p.name.localeCompare(b.p.name,'zh-Hant'));
}
function smartOpenDateForRegion(region,type){
  const {start,end}=getPlannerRange(),occupied=new Set(state.events.map(e=>e.date));
  const candidates=[];for(let d=new Date(start);d<end;d.setDate(d.getDate()+1)){const dt=ymd(d),dow=d.getDay(),day=d.getDate();let score=50,reasons=[];if(type==='健康回饋日'){if(['中壢','宜蘭','花蓮','台東'].includes(region)&&dow===0){score+=20;reasons.push('符合週日偏好')}if(['台北','中壢'].includes(region)&&day<=14){score+=12;reasons.push('符合月初前兩週偏好')}const same=state.events.filter(e=>e.type==='健康回饋日'&&e.date===dt).map(e=>e.region);for(const [a,b] of [['宜蘭','花蓮'],['台北','中壢'],['中壢','宜蘭'],['台東','嘉義']])if((region===a&&same.includes(b))||(region===b&&same.includes(a)))score-=50;const prev=state.events.filter(e=>e.type==='健康回饋日'&&e.region===region&&e.date<dt).sort((a,b)=>b.date.localeCompare(a.date))[0];if(prev&&daysBetween(prev.date,dt)<12)score-=35}if(!occupied.has(dt))score+=4;candidates.push({date:dt,score,reasons})}return candidates.sort((a,b)=>b.score-a.score||a.date.localeCompare(b.date)).slice(0,5);
}
function showSmartPlanner(){
  const {months}=getPlannerRange(),warnings=enhancedValidate3Months();const high=warnings.filter(x=>x.severity==='high').length,med=warnings.filter(x=>x.severity==='medium').length,score=Math.max(0,100-high*12-med*5-warnings.filter(x=>x.severity==='low').length*2);
  const lecturerRot=rotationGaps('lecturer',months).slice(0,8),hostRot=rotationGaps('host',months).slice(0,8);
  const monthCards=months.map(m=>{const x=plannerMonthStats(m);return `<div class="planner-month-card"><b>${m}</b><div>總場次 ${x.events}</div><div>回饋日 ${x.feedback}｜說明會 ${x.seminar}</div><div>講師 ${x.lecturers} 人｜主持 ${x.hosts} 人</div></div>`}).join('');
  openModal('✨ 三個月智慧排課中心',`<div class="planner-hero"><div class="health-score"><b>${score}</b><span>排程健康分</span></div><div><b>範圍：${months.join(' → ')}</b><div>系統依附件規則、Excel 名單、課程推薦及三個月實際排程進行分析。</div></div></div><div class="planner-months">${monthCards}</div><div class="planner-summary"><div class="planner-kpi danger-kpi"><b>${high}</b><span>高優先異常</span></div><div class="planner-kpi warn-kpi"><b>${med}</b><span>需留意</span></div><div class="planner-kpi"><b>${warnings.length}</b><span>全部提示</span></div></div><div class="smart-columns"><div><h3>優先輪替講師</h3>${lecturerRot.map(x=>`<div class="rotation-row"><span>${esc(x.p.name)}</span><b>${x.count} 堂</b></div>`).join('')}</div><div><h3>優先輪替主持人</h3>${hostRot.map(x=>`<div class="rotation-row"><span>${esc(x.p.name)}</span><b>${x.count} 堂</b></div>`).join('')}</div></div><div class="toolbar-row"><button id="plannerValidate" class="primary">查看全部異常</button><button id="plannerFeedback" class="secondary">推薦回饋日日期</button></div><div id="plannerExtra"></div>`,`<button id="plannerClose" class="secondary">關閉</button>`);
  $('plannerClose').onclick=closeModal;$('plannerValidate').onclick=showValidation;$('plannerFeedback').onclick=()=>{const rows=REGIONS.map(r=>{const arr=smartOpenDateForRegion(r,'健康回饋日').slice(0,3);return `<tr><td><b>${r}</b></td><td>${arr.map(x=>`${x.date}${x.reasons.length?'（'+x.reasons.join('、')+'）':''}`).join('<br>')}</td></tr>`}).join('');$('plannerExtra').innerHTML=`<h3>回饋日建議日期</h3><div class="panel-note">依週日偏好、月初偏好、同區約兩週間隔與指定區域撞期規則排序；仍需人工確認領導人需求與實際場地。</div><table class="history-table"><tr><th>區域</th><th>前三個建議日期</th></tr>${rows}</table>`};
}

// ===== v9.0 音控獨立排程中心 =====
function ensureAudioState(){
  if(!state.audioState||typeof state.audioState!=='object')state.audioState={schedule:[],staff:[],meta:clone(DEFAULT_DJ_META)};
  if(!Array.isArray(state.audioState.staff)||!state.audioState.staff.length)state.audioState.staff=clone(DEFAULT_DJ_STAFF);
  if(!Array.isArray(state.audioState.schedule)||!state.audioState.schedule.length)state.audioState.schedule=clone(DEFAULT_DJ_SCHEDULE);
  state.audioState.meta={...DEFAULT_DJ_META,...(state.audioState.meta||{})};
  if(!Array.isArray(state.audioState.meta.weekdayLabels))state.audioState.meta.weekdayLabels=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
}
async function pullAudioState(){
  const r=await fetch('/api/audio-state',{cache:'no-store'});if(!r.ok)throw new Error('音控雲端讀取失敗 ('+r.status+')');
  const data=await r.json();state.audioContext={events:data.events||[],hosts:data.hosts||[]};
  if(data.payload&&Object.keys(data.payload).length)state.audioState={schedule:data.payload.schedule||[],staff:data.payload.staff||[],meta:data.payload.meta||{}};
  ensureAudioState();
  if(!data.payload&&['admin','dj'].includes(state.mode))await pushAudioState(false);
  return !!data.payload;
}
async function pushAudioState(showMessage=true){
  ensureAudioState();
  const r=await fetch('/api/audio-state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload:state.audioState})});
  if(!r.ok){const x=await r.json().catch(()=>({}));throw new Error(x.error||'音控雲端儲存失敗 ('+r.status+')')}
  if(showMessage)alert('音控排程已同步至 Railway PostgreSQL');
}
function bindAudioControls(){
  $('djBackBtn').onclick=()=>showCalendarWorkspace();
  $('djPrevBtn').onclick=()=>{state.audioMonth=new Date(state.audioMonth.getFullYear(),state.audioMonth.getMonth()-1,1);renderAudioSheet()};
  $('djNextBtn').onclick=()=>{state.audioMonth=new Date(state.audioMonth.getFullYear(),state.audioMonth.getMonth()+1,1);renderAudioSheet()};
  $('djMonthPicker').onchange=e=>{if(e.target.value){const [y,m]=e.target.value.split('-').map(Number);state.audioMonth=new Date(y,m-1,1);renderAudioSheet()}};
  $('djAddBtn').onclick=()=>openAudioEditor();$('djPeopleBtn').onclick=showAudioPeople;$('djLayoutBtn').onclick=showAudioLayout;
  $('djExportBtn').onclick=exportAudioPNG;$('djShareBtn').onclick=shareAudioPNG;
}
function showCalendarWorkspace(){
  state.view='calendar';$('calendarWorkspace').classList.remove('hidden');$('djWorkspace').classList.add('hidden');
  if(state.mode==='admin')$('sidebar').classList.remove('hidden');renderAll();
}
async function openAudioWorkspace(sync=true){
  state.view='audio';$('calendarWorkspace').classList.add('hidden');$('djWorkspace').classList.remove('hidden');
  if(sync){try{await pullAudioState()}catch(e){alert(e.message)}}
  renderAudioSheet();
}
function audioTitle(){const m=state.audioState.meta,y=state.audioMonth.getFullYear(),mo=state.audioMonth.getMonth()+1;return (m.titleTemplate||'{Y}年{M}月份音控擔任表').replaceAll('{Y}',y).replaceAll('{M}',mo)}
function audioPerson(id){return state.audioState.staff.find(x=>x.id===id)}
function audioEntries(date,region=null){return state.audioState.schedule.filter(x=>x.date===date&&(region===null||x.region===region))}
function audioCellStyle(e){return `font-size:${+e.size||16}px;color:${esc(e.color||'#111111')};text-align:${e.align||'center'};font-weight:${e.bold?'800':'400'};font-style:${e.italic?'italic':'normal'};text-decoration:${e.underline?'underline':'none'}`}
function renderAudioEntry(e,prefixRegion=false){const person=audioPerson(e.personId);const text=e.text||person?.name||'';let line={text,color:e.color||'#111111',bold:e.bold,italic:e.italic,underline:e.underline,segments:e.segments};if(prefixRegion&&e.region&&e.region!=='全區'){const current=normalizedSegments(line);line={...line,text:`${e.region}-${text}`,segments:[{text:`${e.region}-`,color:e.regionColor||'#111111',bold:true,italic:false,underline:false},...current]}}return `<div class="dj-entry ${e.kind==='special'?'special':''} ${e.systemHoliday?'system-holiday':''}" ${e.systemHoliday?'':`data-audio-id="${esc(e.id)}"`} style="${audioCellStyle(e)}">${renderInlineSegments(line)}</div>`}
function djCell(date,region,html=''){const editable=['admin','dj'].includes(state.mode);return `<td class="dj-cell ${editable?'editable':''}" data-date="${esc(date||'')}" data-region="${esc(region||'')}">${html}</td>`}
function renderAudioSheet(){
  ensureAudioState();const y=state.audioMonth.getFullYear(),m=state.audioMonth.getMonth(),meta=state.audioState.meta;
  $('djMonthPicker').value=monthKey(state.audioMonth);$('djTitle').textContent=audioTitle();$('djTitle').style.color=meta.titleColor||'#16831f';
  const logo=meta.logo||state.meta.logo;if(logo){$('djLogoImg').src=logo;$('djLogoImg').classList.remove('hidden');$('djLogoFallback').classList.add('hidden')}else{$('djLogoImg').classList.add('hidden');$('djLogoFallback').classList.remove('hidden')}
  const labels=meta.weekdayLabels||['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
  const spans=[2,2,2,1,2,1,1];let html=`<table class="dj-calendar-table" style="--dj-grid:${esc(meta.gridColor||'#111111')};--dj-week-bg:${esc(meta.weekdayBg||'#eef1df')};--dj-week-text:${esc(meta.weekdayText||'#176aa1')};--dj-weekend:${esc(meta.weekendText||'#c71920')};--dj-date-bg:${esc(meta.dateBg||'#e7e4f3')};--dj-audio-bg:${esc(meta.audioBg||'#fae8dc')}"><thead><tr><th></th>`;
  labels.forEach((x,i)=>html+=`<th colspan="${spans[i]}" class="${i>=5?'weekend-head':''}">${esc(x)}</th>`);html+='</tr><tr><th>'+esc(meta.branchLabel)+'</th>';
  DJ_REGIONS.forEach(r=>html+=`<th>${esc(r)}</th>`);html+=`<th colspan="2" class="feedback-head">${esc(meta.feedbackLabel)}</th></tr></thead><tbody>`;
  const first=new Date(y,m,1),monday=(first.getDay()+6)%7,weeks=Math.ceil((monday+new Date(y,m+1,0).getDate())/7);let cursor=1-monday;
  for(let w=0;w<weeks;w++){
    html+=`<tr class="dj-date-row"><th>${esc(meta.dateLabel)}</th>`;
    for(let di=0;di<7;di++){
      const day=cursor+di,dt=new Date(y,m,day),inMonth=dt.getMonth()===m,date=inMonth?ymd(dt):'';
      html+=`<td colspan="${spans[di]}" class="${di>=5?'weekend-date':''}">${inMonth?`${m+1}/${day}`:''}</td>`;
    }
    html+='</tr><tr class="dj-audio-row"><th>'+esc(meta.audioLabel)+'</th>';
    for(let di=0;di<7;di++){
      const day=cursor+di,dt=new Date(y,m,day),inMonth=dt.getMonth()===m,date=inMonth?ymd(dt):'';
      if(!inMonth){html+=`<td colspan="${spans[di]}"></td>`;continue}
      let specials=audioEntries(date,null).filter(e=>e.kind==='special');
      if(!specials.length){const hn=taiwanHolidayName(date);if(hn)specials=[{id:'',date,region:'全區',personId:'',text:hn,size:16,color:meta.weekendText||'#c71920',align:'center',bold:true,italic:false,underline:false,note:'',kind:'special',systemHoliday:true}]}
      if(specials.length){html+=`<td colspan="${spans[di]}" class="dj-cell editable" data-date="${date}" data-region="全區">${specials.map(e=>renderAudioEntry(e,false)).join('')}</td>`;continue}
      if(di<5){
        const regions=DJ_WEEKDAY_REGIONS[di+1]||[];regions.forEach(r=>{const es=audioEntries(date,r);html+=djCell(date,r,es.map(e=>renderAudioEntry(e,false)).join(''))});
      }else{
        const es=audioEntries(date,null).filter(e=>e.kind!=='special');html+=djCell(date,'',es.map(e=>renderAudioEntry(e,true)).join(''));
      }
    }
    html+='</tr><tr class="dj-gap-row"><td colspan="12"></td></tr>';cursor+=7;
  }
  html+='</tbody></table>';$('djTableWrap').innerHTML=html;
  document.querySelectorAll('#djTableWrap .dj-entry[data-audio-id]').forEach(el=>el.onclick=e=>{e.stopPropagation();if(['admin','dj'].includes(state.mode))openAudioEditor(el.dataset.audioId)});
  document.querySelectorAll('#djTableWrap .dj-cell.editable').forEach(el=>el.onclick=()=>{if(!['admin','dj'].includes(state.mode))return;openAudioEditor(null,el.dataset.date,el.dataset.region)});
  renderAudioWarnings();
}
function hostForAudio(date,region){
  const sourceEvents=state.mode==='admin'&&Array.isArray(state.events)?state.events:(state.audioContext.events||[]);
  const sourceHosts=state.mode==='admin'&&state.staff?.hosts?.length?state.staff.hosts:(state.audioContext.hosts||[]);
  const evs=sourceEvents.filter(e=>e.date===date&&(!region||region==='全區'||e.region===region));
  return evs.map(e=>{const h=sourceHosts.find(x=>x.id===e.hostId);return {event:e,host:h}}).filter(x=>x.host);
}
function audioConflict(entry){const p=audioPerson(entry.personId);if(!p)return null;const hits=hostForAudio(entry.date,entry.region).filter(x=>x.host.name===p.name);return hits[0]||null}
function renderAudioWarnings(){
  const conflicts=state.audioState.schedule.filter(e=>e.kind!=='special').map(e=>({e,c:audioConflict(e)})).filter(x=>x.c);
  $('djWarningBar').innerHTML=conflicts.length?`⚠ 發現 ${conflicts.length} 筆音控與主持人同人衝突：${conflicts.slice(0,4).map(x=>`${x.e.date} ${x.e.region} ${audioPerson(x.e.personId)?.name||x.e.text}`).join('、')}${conflicts.length>4?'…':''}`:'✅ 音控排程檢查正常：未發現音控與主持人同一人。';
  $('djWarningBar').classList.toggle('has-warning',!!conflicts.length);
}
function audioOptions(selected=''){return `<option value="">— 特殊事項 / 手動文字 —</option>`+state.audioState.staff.map(p=>`<option value="${esc(p.id)}" ${p.id===selected?'selected':''}>${esc(p.name)}${p.regions?.length?'（'+esc(p.regions.join('、'))+'）':''}</option>`).join('')}
function openAudioEditor(id=null,date='',region=''){
  ensureAudioState();const e=id?state.audioState.schedule.find(x=>x.id===id):null;const obj=e?clone(e):{id:'',date:date||ymd(state.audioMonth),region:region||'',personId:'',text:'',size:16,color:'#111111',align:'center',bold:false,italic:false,underline:false,note:'',kind:'audio'};
  openModal(e?'編輯音控排程':'新增音控排程',`<div class="form-grid"><label class="field"><span>日期</span><input id="djEDate" type="date" value="${esc(obj.date)}"></label><label class="field"><span>地區</span><select id="djERegion"><option value="">—</option><option value="全區" ${obj.region==='全區'?'selected':''}>全區 / 特殊事項</option>${DJ_REGIONS.map(r=>`<option ${r===obj.region?'selected':''}>${r}</option>`).join('')}</select></label><label class="field"><span>音控人員</span><select id="djEPerson">${audioOptions(obj.personId)}</select></label><label class="field"><span>類型</span><select id="djEKind"><option value="audio" ${obj.kind!=='special'?'selected':''}>音控排程</option><option value="special" ${obj.kind==='special'?'selected':''}>特殊事項/假日/旅遊</option></select></label><label class="field span2"><span>顯示文字（可手動修改）</span><input id="djEText" value="${esc(obj.text||'')}"></label><div class="span2 display-lines-panel"><div class="toolbar-row"><b>同一行分段樣式（選用）</b><button id="djAddSegmentBtn" type="button" class="secondary">＋ 新增文字片段</button></div><div class="small-note panel-note">如需同一行不同顏色，可在此拆分文字片段；例如「中壢-」黑色、「健康回饋日」藍色。</div><div id="djSegmentList" class="segment-list">${(obj.segments||[]).map(segmentRow).join('')}</div></div><label class="field"><span>字體大小</span><input id="djESize" type="number" min="9" max="40" value="${+obj.size||16}"></label><label class="field"><span>文字顏色</span><input id="djEColor" type="color" value="${esc(obj.color||'#111111')}"></label><label class="field"><span>對齊</span><select id="djEAlign"><option value="left" ${obj.align==='left'?'selected':''}>靠左</option><option value="center" ${obj.align==='center'?'selected':''}>置中</option><option value="right" ${obj.align==='right'?'selected':''}>靠右</option></select></label><div class="field"><span>文字樣式</span><div class="toolbar-row"><button type="button" id="djEBold" class="mini toggle ${obj.bold?'active':''}"><b>B</b></button><button type="button" id="djEItalic" class="mini toggle ${obj.italic?'active':''}"><i>I</i></button><button type="button" id="djEUnderline" class="mini toggle ${obj.underline?'active':''}"><u>U</u></button></div></div><label class="field span2"><span>附註</span><textarea id="djENote">${esc(obj.note||'')}</textarea></label><div id="djEConflict" class="span2"></div></div>`,`${e?'<button id="djEDelete" class="danger primary">刪除</button>':''}<button id="djECancel" class="secondary">取消</button><button id="djESave" class="dj-primary">儲存並上傳</button>`);
  ['djEBold','djEItalic','djEUnderline'].forEach(k=>$(k).onclick=()=>$(k).classList.toggle('active'));wireAudioSegments();
  $('djEPerson').onchange=()=>{const p=audioPerson($('djEPerson').value);if(p&&!$('djEText').value.trim())$('djEText').value=p.name;previewAudioConflict()};$('djEDate').onchange=previewAudioConflict;$('djERegion').onchange=previewAudioConflict;
  $('djECancel').onclick=closeModal;$('djESave').onclick=()=>saveAudioEntry(obj.id);if(e)$('djEDelete').onclick=async()=>{if(confirm('確定刪除此音控排程？')){state.audioState.schedule=state.audioState.schedule.filter(x=>x.id!==e.id);await pushAudioState(false);closeModal();renderAudioSheet()}};previewAudioConflict();
}
function wireAudioSegments(){const list=$('djSegmentList');if(!list)return;const sync=()=>{const segs=[...list.querySelectorAll('.segment-row')].map(r=>r.querySelector('.segment-text').value);if(segs.length)$('djEText').value=segs.join('')};const wire=()=>{list.querySelectorAll('.segment-row').forEach(seg=>{seg.querySelectorAll('.toggle').forEach(btn=>btn.onclick=()=>btn.classList.toggle('active'));seg.querySelector('.remove-segment').onclick=()=>{seg.remove();sync()};seg.querySelector('.segment-text').oninput=sync;wireColorControl(seg.querySelector('.line-color-control'),'segment')})};wire();$('djAddSegmentBtn').onclick=()=>{list.insertAdjacentHTML('beforeend',segmentRow({text:list.children.length?'':$('djEText').value,color:$('djEColor').value||'#111111'}));wire();sync()}}
function previewAudioConflict(){const p=audioPerson($('djEPerson')?.value);if(!p||!$('djEConflict'))return $('djEConflict')&&($('djEConflict').innerHTML='');const tmp={date:$('djEDate').value,region:$('djERegion').value,personId:p.id};const c=audioConflict(tmp);$('djEConflict').innerHTML=c?`<div class="warning-item severe"><b>禁止排定</b>：${esc(p.name)} 在 ${esc(tmp.date)} ${esc(tmp.region)} 已是主持人，音控不可與主持人為同一人。</div>`:'<div class="panel-note">✅ 未偵測到與主持人同人衝突。</div>'}
async function saveAudioEntry(id){
  const personId=$('djEPerson').value,kind=$('djEKind').value;const segments=$('djSegmentList')?[...$('djSegmentList').querySelectorAll('.segment-row')].map(seg=>({text:seg.querySelector('.segment-text').value,color:normalizeHexColor(seg.querySelector('.segment-color-value')?.value),bold:seg.querySelector('.segment-bold').classList.contains('active'),italic:seg.querySelector('.segment-italic').classList.contains('active'),underline:seg.querySelector('.segment-underline').classList.contains('active')})):[];const obj={id:id||uid('dj'),date:$('djEDate').value,region:$('djERegion').value,personId:kind==='special'?'':personId,text:segments.length?segments.map(x=>x.text).join(''):$('djEText').value.trim(),segments:segments.length?segments:undefined,size:+$('djESize').value||16,color:$('djEColor').value,align:$('djEAlign').value,bold:$('djEBold').classList.contains('active'),italic:$('djEItalic').classList.contains('active'),underline:$('djEUnderline').classList.contains('active'),note:$('djENote').value,kind};
  if(!obj.date)return alert('請選擇日期');if(kind!=='special'&&!obj.region)return alert('請選擇地區');if(kind!=='special'&&!obj.personId)return alert('請選擇音控人員');if(!obj.text){const p=audioPerson(obj.personId);obj.text=p?.name||''}if(kind!=='special'&&audioConflict(obj))return alert('此音控人員當日同區已擔任主持人，依規則不可排為音控。');
  const idx=state.audioState.schedule.findIndex(x=>x.id===obj.id);if(idx>=0)state.audioState.schedule[idx]=obj;else state.audioState.schedule.push(obj);await pushAudioState(false);closeModal();renderAudioSheet();
}
function showAudioPeople(){
  ensureAudioState();let filter='全部';const draw=()=>{const list=filter==='全部'?state.audioState.staff:state.audioState.staff.filter(p=>p.regions?.includes(filter));$('modalBody').innerHTML=`<div class="toolbar-row"><label class="field"><span>地區篩選</span><select id="djPFilter"><option>全部</option>${DJ_REGIONS.map(r=>`<option ${r===filter?'selected':''}>${r}</option>`).join('')}</select></label><button id="djPAdd" class="dj-primary">＋ 新增音控人員</button></div><table class="staff-table"><thead><tr><th>姓名</th><th>地區（可多區，以逗號分隔）</th><th>備註</th><th></th></tr></thead><tbody>${list.map(p=>`<tr data-id="${esc(p.id)}"><td><input class="djp-name" value="${esc(p.name)}"></td><td><input class="djp-regions" value="${esc((p.regions||[]).join('、'))}"></td><td><input class="djp-note" value="${esc(p.note||'')}"></td><td><button class="danger mini djp-del">刪</button></td></tr>`).join('')}</tbody></table>`;$('djPFilter').onchange=e=>{saveVisible();filter=e.target.value;draw()};$('djPAdd').onclick=()=>{saveVisible();state.audioState.staff.push({id:uid('djp'),name:'新音控',regions:filter==='全部'?[]:[filter],note:''});draw()};document.querySelectorAll('.djp-del').forEach(b=>b.onclick=()=>{state.audioState.staff=state.audioState.staff.filter(x=>x.id!==b.closest('tr').dataset.id);draw()})};const saveVisible=()=>{document.querySelectorAll('#modalBody tbody tr').forEach(tr=>{const p=state.audioState.staff.find(x=>x.id===tr.dataset.id);if(!p)return;p.name=tr.querySelector('.djp-name').value.trim();p.regions=tr.querySelector('.djp-regions').value.split(/[、,，]/).map(x=>x.trim()).filter(Boolean);p.note=tr.querySelector('.djp-note').value})};openModal('音控名單管理','',`<button id="djPCancel" class="secondary">取消</button><button id="djPSave" class="dj-primary">儲存並上傳</button>`);draw();$('djPCancel').onclick=closeModal;$('djPSave').onclick=async()=>{saveVisible();await pushAudioState(false);closeModal();renderAudioSheet()}
}
function showAudioLayout(){const m=state.audioState.meta;openModal('音控表版面設定',`<div class="form-grid"><label class="field span2"><span>大標題格式</span><input id="djlTitle" value="${esc(m.titleTemplate)}"><small>可使用 {Y}、{M}</small></label><label class="field"><span>分公司欄文字</span><input id="djlBranch" value="${esc(m.branchLabel)}"></label><label class="field"><span>日期欄文字</span><input id="djlDate" value="${esc(m.dateLabel)}"></label><label class="field"><span>音控欄文字</span><input id="djlAudio" value="${esc(m.audioLabel)}"></label><label class="field"><span>回饋日欄文字</span><input id="djlFeedback" value="${esc(m.feedbackLabel)}"></label><label class="field span2"><span>星期文字（逗號分隔 7 個）</span><input id="djlWeekdays" value="${esc((m.weekdayLabels||['星期一','星期二','星期三','星期四','星期五','星期六','星期日']).join('、'))}"></label><label class="field"><span>標題顏色</span><input id="djlTitleColor" type="color" value="${esc(m.titleColor)}"></label><label class="field"><span>星期背景</span><input id="djlWeekBg" type="color" value="${esc(m.weekdayBg)}"></label><label class="field"><span>星期文字</span><input id="djlWeekText" type="color" value="${esc(m.weekdayText)}"></label><label class="field"><span>週末文字</span><input id="djlWeekend" type="color" value="${esc(m.weekendText)}"></label><label class="field"><span>日期背景</span><input id="djlDateBg" type="color" value="${esc(m.dateBg)}"></label><label class="field"><span>音控背景</span><input id="djlAudioBg" type="color" value="${esc(m.audioBg)}"></label><label class="field"><span>格線顏色</span><input id="djlGrid" type="color" value="${esc(m.gridColor)}"></label><div class="span2 toolbar-row"><button id="djlLogo" class="secondary">使用目前行事曆 Logo</button></div></div>`,`<button id="djlCancel" class="secondary">取消</button><button id="djlSave" class="dj-primary">儲存並上傳</button>`);$('djlCancel').onclick=closeModal;$('djlLogo').onclick=()=>{m.logo=state.meta.logo||'';alert('已套用目前行事曆 Logo，按儲存後上傳。')};$('djlSave').onclick=async()=>{m.titleTemplate=$('djlTitle').value;m.branchLabel=$('djlBranch').value;m.dateLabel=$('djlDate').value;m.audioLabel=$('djlAudio').value;m.feedbackLabel=$('djlFeedback').value;m.weekdayLabels=$('djlWeekdays').value.split(/[、,，]/).map(x=>x.trim()).filter(Boolean).slice(0,7);m.titleColor=$('djlTitleColor').value;m.weekdayBg=$('djlWeekBg').value;m.weekdayText=$('djlWeekText').value;m.weekendText=$('djlWeekend').value;m.dateBg=$('djlDateBg').value;m.audioBg=$('djlAudioBg').value;m.gridColor=$('djlGrid').value;await pushAudioState(false);closeModal();renderAudioSheet()}}
async function makeAudioCanvas(){document.body.classList.add('exporting-audio');await new Promise(r=>setTimeout(r,80));const sheet=$('djSheet');const canvas=await html2canvas(sheet,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false,width:sheet.scrollWidth,height:sheet.scrollHeight});document.body.classList.remove('exporting-audio');return canvas}
async function exportAudioPNG(){try{const canvas=await makeAudioCanvas(),a=document.createElement('a');a.download=`FEATERA_${audioTitle()}.png`;a.href=canvas.toDataURL('image/png');a.click()}catch(e){document.body.classList.remove('exporting-audio');alert('音控表匯出失敗：'+e.message)}}
async function shareAudioPNG(){try{const canvas=await makeAudioCanvas(),blob=await new Promise(r=>canvas.toBlob(r,'image/png')),file=new File([blob],`FEATERA_${audioTitle()}.png`,{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({title:audioTitle(),text:'FEATERA 音控擔任表',files:[file]})}else{const a=document.createElement('a');a.download=file.name;a.href=URL.createObjectURL(blob);a.click();alert('此瀏覽器不支援直接分享，已改為下載 PNG，可再透過通訊軟體或 Email 傳送。')}}catch(e){document.body.classList.remove('exporting-audio');if(e.name!=='AbortError')alert('分享失敗：'+e.message)}}

initialize().catch(e=>{console.error(e);alert('系統初始化失敗：'+e.message)});
