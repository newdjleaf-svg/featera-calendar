const $ = (id)=>document.getElementById(id);
const LS_KEY='featera_calendar_v3';
const CONFIG_KEY='featera_calendar_config_v1';
const DEFAULT_ADMIN={user:'Featera',pass:'featera168'};
const RANKS=['SM','GM','PM','SD','GD','PD','SP','GP','PP','DP','DDP'];
const REGIONS=['台北','中壢','宜蘭','花蓮','台中','嘉義','台南','高雄','台東'];
const COURSE_TYPES=['系統培訓','健康回饋日','說明會','NDO/希望工程','MCC','會議','假日/休假','其他'];
const state={
  month:new Date(2026,8,1), mode:'admin', events:[], staff:{lecturers:[],hosts:[],audio:[]}, contacts:[],
  meta:{titleTemplate:'{Y}年{M}月行事曆',subtitle:'',businessHours:'',hotline:'',logo:''}, admin:{...DEFAULT_ADMIN}, history:[], reference:{lecturers:[],hosts:[],courseCatalog:[],courseNameUpdates:[],schedulingRules:[]}
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
function cloudPayload(){return {events:state.events,staff:state.staff,contacts:state.contacts,meta:state.meta,history:state.history,reference:state.reference}}
function saveLocal(){
  localStorage.setItem(LS_KEY,JSON.stringify({events:state.events,staff:state.staff,contacts:state.contacts,meta:state.meta,admin:state.admin,history:state.history}));
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
  if(!r.ok)return false;return true;
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
  $('adminLoginForm').addEventListener('submit',async e=>{e.preventDefault();const u=$('loginUser').value.trim(),p=$('loginPass').value;$('loginError').textContent='登入中…';try{if(await cloudLogin(u,p)){state.admin.user=u;state.admin.pass='';await login('admin');$('loginError').textContent=''}else $('loginError').textContent='帳號或密碼錯誤'}catch(err){$('loginError').textContent='登入服務錯誤：'+err.message}});
  $('guestLoginBtn').onclick=()=>login('guest'); $('logoutBtn').onclick=logout;
  $('menuBtn').onclick=toggleSidebar; $('drawerBackdrop').onclick=toggleSidebar;
  $('prevBtn').onclick=()=>changeMonth(-1);$('nextBtn').onclick=()=>changeMonth(1);$('todayBtn').onclick=()=>{const d=new Date();state.month=new Date(d.getFullYear(),d.getMonth(),1);renderAll()};
  $('monthPicker').onchange=e=>{if(e.target.value){const [y,m]=e.target.value.split('-').map(Number);state.month=new Date(y,m-1,1);renderAll()}};
  $('addEventBtn').onclick=()=>openEventEditor(null,ymd(state.month)); $('validateBtn').onclick=showValidation;
  $('staffBtn').onclick=showStaff; $('layoutBtn').onclick=showLayout; $('settingsBtn').onclick=showSettings; $('statsBtn').onclick=showStats; $('historyBtn').onclick=showHistory;
  $('exportBtn').onclick=exportPNG; $('shareBtn').onclick=sharePNG; $('cloudBtn').onclick=showCloud;
  $('modalClose').onclick=closeModal; $('modal').addEventListener('click',e=>{if(e.target===$('modal'))closeModal()});
  $('logoUpload').onchange=handleLogoUpload;
}
async function login(mode){
  state.mode=mode;$('loginView').classList.add('hidden');$('app').classList.remove('hidden');$('modeBadge').textContent=mode==='admin'?'管理員':'訪客';document.body.classList.toggle('guest',mode==='guest');document.querySelectorAll('.admin-only').forEach(x=>x.classList.toggle('hidden',mode==='guest'));
  try{const found=await pullCloudState();cloudReady=true;if(!found&&mode==='admin')await pushCloudState(false)}catch(e){console.warn(e);cloudReady=false;alert('目前無法連接雲端資料庫，暫時使用此裝置資料：'+e.message)}
  renderAll();
}
async function logout(){cloudReady=false;await cloudLogout();$('app').classList.add('hidden');$('loginView').classList.remove('hidden');$('sidebar').classList.remove('open');$('drawerBackdrop').classList.add('hidden')}
function toggleSidebar(){$('sidebar').classList.toggle('open');$('drawerBackdrop').classList.toggle('hidden',!$('sidebar').classList.contains('open'))}
function changeMonth(n){state.month=new Date(state.month.getFullYear(),state.month.getMonth()+n,1);renderAll()}
function renderAll(){renderHeader();renderCalendar();renderContacts();$('monthPicker').value=monthKey(state.month)}
function renderHeader(){const y=state.month.getFullYear(),m=state.month.getMonth()+1;let title=state.meta.titleTemplate.replaceAll('{Y}',y).replaceAll('{M}',m);if(/^\s*\d{4}年\d{1,2}月行事曆\s*$/.test(title))title=title.replace(/(\d{4})年(\d{1,2})月行事曆/,'$1 年 $2 月行事曆');$('calendarTitle').textContent=title;$('subtitleText').textContent=state.meta.subtitle||'';$('businessHours').textContent=state.meta.businessHours||'';$('hotline').textContent=state.meta.hotline||'';if(state.meta.logo){$('logoImg').src=state.meta.logo;$('logoImg').classList.remove('hidden');$('logoFallback').classList.add('hidden')}else{$('logoImg').classList.add('hidden');$('logoFallback').classList.remove('hidden')}}
function weeksForMonth(y,m){const first=new Date(y,m,1),last=new Date(y,m+1,0);const monday=(first.getDay()+6)%7;return Math.ceil((monday+last.getDate())/7)}
function renderCalendar(){
  const weekdays=['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
  $('weekdayRow').innerHTML=weekdays.map((w,i)=>`<div class="weekday ${i>4?'weekend':''}">${w}</div>`).join('');
  const y=state.month.getFullYear(),m=state.month.getMonth(),first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),offset=(first.getDay()+6)%7,weeks=weeksForMonth(y,m);let html='';
  for(let i=0;i<weeks*7;i++){
    const d=i-offset+1;if(d<1||d>days){html+=`<div class="day blank"></div>`;continue}
    const date=ymd(new Date(y,m,d)),dow=new Date(y,m,d).getDay(),evs=state.events.filter(e=>e.date===date).sort((a,b)=>(a.order||0)-(b.order||0));
    html+=`<div class="day in-month ${dow===0||dow===6?'weekend':''}" data-date="${date}"><div class="date-strip">${d}</div><div class="day-content">${evs.map(renderEvent).join('')}</div></div>`;
  }
  $('calendarGrid').innerHTML=html;$('calendarGrid').style.gridTemplateRows=`repeat(${weeks},1fr)`;
  document.querySelectorAll('.day.in-month').forEach(el=>el.addEventListener('dblclick',()=>state.mode==='admin'&&openEventEditor(null,el.dataset.date)));
  document.querySelectorAll('.event-block.clickable').forEach(el=>el.onclick=()=>state.mode==='admin'&&openEventEditor(el.dataset.id));
}
function renderEvent(e){
  const lines=(e.lines||[]).map((l,idx)=>{const st=`font-size:${Number(l.size)||14}px;color:${esc(l.color||'#111')};text-align:${l.align||'left'};font-weight:${l.bold?'900':'400'};font-style:${l.italic?'italic':'normal'};text-decoration:${l.underline?'underline':'none'}`;return `<div class="calendar-line ${idx===0&&e.highlight?'region-line':''}" style="${st}">${esc(l.text)}</div>`}).join('');
  const c=e.headcount?`<span class="count-badge">${esc(e.headcount)}人</span>`:'';
  return `<div class="event-block ${state.mode==='admin'?'clickable':''}" data-id="${esc(e.id)}">${lines}${c}</div>`
}
function renderContacts(){$('contactsGrid').innerHTML=state.contacts.map(c=>`<div class="contact-line"><span class="contact-name">※${esc(c.name)}：</span><span>${esc(c.address)}</span><span class="contact-tel">TEL：${esc(c.tel)}</span><span>FAX：${esc(c.fax)}</span></div>`).join('')}

function openModal(title,body,foot=''){$('modalTitle').textContent=title;$('modalBody').innerHTML=body;$('modalFoot').innerHTML=foot;$('modal').classList.remove('hidden')}
function closeModal(){$('modal').classList.add('hidden')}
function personOptions(list,selected=''){return `<option value="">— 未指定 —</option>`+list.map(p=>`<option value="${esc(p.id)}" ${p.id===selected?'selected':''}>${esc(p.name)} ${p.rank?`(${esc(p.rank)})`:''}${p.stars?` ${'★'.repeat(p.stars)}`:''}</option>`).join('')}
function defaultLines(){return [{text:'台北',size:16,color:'#111111',align:'left',bold:true,italic:false,underline:false},{text:'主持：',size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false},{text:'講師：',size:13,color:'#555555',align:'left',bold:false,italic:false,underline:false}]}
function lineEditorHtml(lines){return lines.map((l,i)=>lineRow(l,i)).join('')}
function lineRow(l,i){return `<div class="line-editor" data-line="${i}"><div class="line-toolbar">
<input class="mini line-text" type="text" value="${esc(l.text)}" placeholder="輸入文字">
<input class="mini line-size" type="number" min="8" max="36" value="${Number(l.size)||14}" title="字體大小">
<input class="mini line-color" type="color" value="${esc(l.color||'#111111')}" title="顏色">
<select class="mini line-align"><option value="left" ${l.align==='left'?'selected':''}>靠左</option><option value="center" ${l.align==='center'?'selected':''}>置中</option><option value="right" ${l.align==='right'?'selected':''}>靠右</option></select>
<button type="button" class="mini style-btn toggle line-bold ${l.bold?'active':''}" title="粗體"><b>B</b></button>
<button type="button" class="mini style-btn toggle line-italic ${l.italic?'active':''}" title="斜體"><i>I</i></button>
<button type="button" class="mini style-btn toggle line-underline ${l.underline?'active':''}" title="底線"><u>U</u></button>
<button type="button" class="mini danger remove-line">刪</button></div></div>`}
function openEventEditor(id,date){
  const e=id?state.events.find(x=>x.id===id):null; const obj=e?clone(e):{id:'',date:date||ymd(state.month),type:'系統培訓',region:'',lecturerId:'',hostId:'',audioId:'',headcount:'',note:'',highlight:true,lines:defaultLines()};
  openModal(e?'編輯行程':'新增行程',`<div class="form-grid">
    <label class="field"><span>日期</span><input id="evDate" type="date" value="${esc(obj.date)}"></label>
    <label class="field"><span>課程類型</span><select id="evType">${COURSE_TYPES.map(x=>`<option ${x===obj.type?'selected':''}>${x}</option>`).join('')}</select></label>
    <label class="field"><span>區域</span><select id="evRegion"><option value="">—</option>${REGIONS.map(x=>`<option ${x===obj.region?'selected':''}>${x}</option>`).join('')}</select></label>
    <label class="field"><span>統計人數</span><input id="evCount" type="number" min="0" value="${esc(obj.headcount||'')}"></label>
    <label class="field"><span>講師</span><select id="evLecturer">${personOptions(state.staff.lecturers,obj.lecturerId)}</select></label>
    <label class="field"><span>主持人</span><select id="evHost">${personOptions(state.staff.hosts,obj.hostId)}</select></label>
    <label class="field"><span>音控</span><select id="evAudio">${personOptions(state.staff.audio,obj.audioId)}</select></label>
    <label class="field"><span>第一行樣式</span><select id="evHighlight"><option value="1" ${obj.highlight?'selected':''}>標準</option><option value="0" ${!obj.highlight?'selected':''}>標準</option></select></label>
    <label class="field span2"><span>附註事項</span><textarea id="evNote">${esc(obj.note||'')}</textarea></label>
    <div class="span2"><div class="toolbar-row"><b>顯示文字（每行可獨立格式）</b><button id="addLineBtn" type="button" class="secondary">＋新增一行</button><button id="autoFillBtn" type="button" class="secondary">依人員自動帶入</button></div><div id="lineEditors">${lineEditorHtml(obj.lines||[])}</div></div>
  </div>`,`${e?'<button id="deleteEventBtn" class="danger primary">刪除</button>':''}<button id="cancelModalBtn" class="secondary">取消</button><button id="saveEventBtn" class="primary">儲存</button>`);
  wireLineEditors();$('addLineBtn').onclick=()=>{$('lineEditors').insertAdjacentHTML('beforeend',lineRow({text:'',size:14,color:'#111111',align:'left'},document.querySelectorAll('.line-editor').length));wireLineEditors()};
  $('autoFillBtn').onclick=()=>autofillEventLines();$('cancelModalBtn').onclick=closeModal;$('saveEventBtn').onclick=()=>saveEvent(obj.id);if(e)$('deleteEventBtn').onclick=()=>{if(confirm('確定刪除此行程？')){state.events=state.events.filter(x=>x.id!==e.id);saveLocal();closeModal();renderAll()}};
}
function wireLineEditors(){document.querySelectorAll('.line-editor').forEach(row=>{row.querySelectorAll('.toggle').forEach(btn=>btn.onclick=()=>btn.classList.toggle('active'));row.querySelector('.remove-line').onclick=()=>row.remove()})}
function collectLines(){return [...document.querySelectorAll('.line-editor')].map(row=>({text:row.querySelector('.line-text').value,size:+row.querySelector('.line-size').value||14,color:row.querySelector('.line-color').value,align:row.querySelector('.line-align').value,bold:row.querySelector('.line-bold').classList.contains('active'),italic:row.querySelector('.line-italic').classList.contains('active'),underline:row.querySelector('.line-underline').classList.contains('active')})).filter(x=>x.text.trim())}
function autofillEventLines(){const region=$('evRegion').value,lec=state.staff.lecturers.find(x=>x.id===$('evLecturer').value),host=state.staff.hosts.find(x=>x.id===$('evHost').value),audio=state.staff.audio.find(x=>x.id===$('evAudio').value);const lines=[];if(region)lines.push({text:region,size:16,color:'#111111',align:'left',bold:true});if(host)lines.push({text:`主持：${host.name} ${host.rank||''}`.trim(),size:13,color:'#555555',align:'left'});if(lec)lines.push({text:`講師：${lec.name}${lec.stars?' '+['','一星','二星','三星'][lec.stars]+'講師':''}`,size:13,color:'#555555',align:'left'});if(audio)lines.push({text:`音控：${audio.name}`,size:12,color:'#666666',align:'left'});$('lineEditors').innerHTML=lineEditorHtml(lines);wireLineEditors()}
function saveEvent(id){const obj={id:id||uid(),date:$('evDate').value,type:$('evType').value,region:$('evRegion').value,lecturerId:$('evLecturer').value,hostId:$('evHost').value,audioId:$('evAudio').value,headcount:$('evCount').value,note:$('evNote').value,highlight:$('evHighlight').value==='1',lines:collectLines(),order:0};if(!obj.date)return alert('請選擇日期');const idx=state.events.findIndex(x=>x.id===obj.id);if(idx>=0)state.events[idx]=obj;else state.events.push(obj);saveLocal();closeModal();renderAll()}

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

function showStaff(){let active='lecturers';const draw=()=>{const list=state.staff[active],isL=active==='lecturers',isH=active==='hosts';$('modalBody').innerHTML=`<div class="tabs"><button class="tab ${active==='lecturers'?'active':''}" data-tab="lecturers">講師</button><button class="tab ${active==='hosts'?'active':''}" data-tab="hosts">主持人</button><button class="tab ${active==='audio'?'active':''}" data-tab="audio">音控</button></div><div class="toolbar-row"><button id="addStaff" class="primary">＋ 新增人員</button></div><table class="staff-table"><thead><tr><th>姓名</th>${isL?'<th>星級</th><th>聘級</th><th>特聘/顧問</th>':isH?'<th>聘級</th>':''}<th>備註</th><th></th></tr></thead><tbody>${list.map(p=>`<tr data-id="${p.id}"><td><input class="s-name" value="${esc(p.name)}"></td>${isL?`<td><select class="s-stars">${[0,1,2,3].map(n=>`<option value="${n}" ${p.stars==n?'selected':''}>${n?`${n}星`:'無'}</option>`).join('')}</select></td><td><select class="s-rank"><option value="">—</option>${RANKS.map(r=>`<option ${p.rank===r?'selected':''}>${r}</option>`).join('')}</select></td><td><input class="s-special" type="checkbox" ${p.special?'checked':''}></td>`:isH?`<td><select class="s-rank"><option value="">—</option>${RANKS.map(r=>`<option ${p.rank===r?'selected':''}>${r}</option>`).join('')}</select></td>`:''}<td><input class="s-note" value="${esc(p.note||'')}" title="${esc([p.seminarQualified?'說明會資格V':'',p.regions?.length?'支援:'+p.regions.join('、'):'',p.seniority||''].filter(Boolean).join('｜'))}"><div style="font-size:11px;color:#666;margin-top:3px">${esc([p.seminarQualified?'說明會V':'',p.regions?.length?p.regions.join('、'):'',p.seniority||''].filter(Boolean).join('｜'))}</div></td><td><button class="danger mini s-del">刪</button></td></tr>`).join('')}</tbody></table>`;document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{active=b.dataset.tab;draw()});$('addStaff').onclick=()=>{const obj={id:uid(active[0]),name:'新成員',note:''};if(active==='lecturers')Object.assign(obj,{stars:1,rank:'',special:false});if(active==='hosts')Object.assign(obj,{rank:'SM',stars:0});state.staff[active].push(obj);draw()};document.querySelectorAll('tbody tr').forEach(tr=>{tr.querySelector('.s-del').onclick=()=>{state.staff[active]=state.staff[active].filter(x=>x.id!==tr.dataset.id);draw()}})};openModal('講師 / 主持 / 音控名單','',`<button id="staffCancel" class="secondary">取消</button><button id="staffSave" class="primary">儲存</button>`);draw();$('staffCancel').onclick=closeModal;$('staffSave').onclick=()=>{document.querySelectorAll('tbody tr').forEach(tr=>{const p=state.staff[active].find(x=>x.id===tr.dataset.id);if(!p)return;p.name=tr.querySelector('.s-name').value;p.note=tr.querySelector('.s-note').value;if(tr.querySelector('.s-rank'))p.rank=tr.querySelector('.s-rank').value;if(tr.querySelector('.s-stars'))p.stars=+tr.querySelector('.s-stars').value;if(tr.querySelector('.s-special'))p.special=tr.querySelector('.s-special').checked});saveLocal();closeModal();renderAll()}}

function showLayout(){openModal('版面設定',`<div class="form-grid"><label class="field span2"><span>大標題格式</span><input id="layTitle" value="${esc(state.meta.titleTemplate)}"><small>可使用 {Y} 年、{M} 月，例如：FEATERA {Y}年{M}月行事曆</small></label><label class="field span2"><span>副標題</span><input id="laySubtitle" value="${esc(state.meta.subtitle||'')}"></label><label class="field"><span>公司營業時間</span><input id="layHours" value="${esc(state.meta.businessHours)}"></label><label class="field"><span>客服專線</span><input id="layHotline" value="${esc(state.meta.hotline)}"></label><div class="span2 toolbar-row"><button id="chooseLogo" class="secondary">上傳 / 更換 Logo</button><button id="clearLogo" class="secondary">移除 Logo</button></div><div class="span2"><b>分公司聯絡資訊</b><div id="contactEditors">${state.contacts.map((c,i)=>`<div class="form-grid" style="border-top:1px solid #ddd;padding-top:10px;margin-top:8px"><label class="field"><span>名稱</span><input data-c="${i}" data-k="name" value="${esc(c.name)}"></label><label class="field"><span>地址</span><input data-c="${i}" data-k="address" value="${esc(c.address)}"></label><label class="field"><span>TEL</span><input data-c="${i}" data-k="tel" value="${esc(c.tel)}"></label><label class="field"><span>FAX</span><input data-c="${i}" data-k="fax" value="${esc(c.fax)}"></label></div>`).join('')}</div></div>`, `<button id="layCancel" class="secondary">取消</button><button id="laySave" class="primary">儲存</button>`);$('chooseLogo').onclick=()=>$('logoUpload').click();$('clearLogo').onclick=()=>{state.meta.logo='';renderHeader()};$('layCancel').onclick=closeModal;$('laySave').onclick=()=>{state.meta.titleTemplate=$('layTitle').value||'{Y}年{M}月行事曆';state.meta.subtitle=$('laySubtitle').value;state.meta.businessHours=$('layHours').value;state.meta.hotline=$('layHotline').value;document.querySelectorAll('#contactEditors input[data-c]').forEach(i=>state.contacts[+i.dataset.c][i.dataset.k]=i.value);saveLocal();closeModal();renderAll()}}
function handleLogoUpload(e){const f=e.target.files?.[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{state.meta.logo=rd.result;saveLocal();renderHeader()};rd.readAsDataURL(f);e.target.value=''}
function showSettings(){openModal('系統設定',`<div class="form-grid"><div class="span2 panel-note"><b>Railway PostgreSQL 雲端版</b><br>管理員帳號與密碼由 Railway Service Variables 管理：<code>ADMIN_USER</code>、<code>ADMIN_PASSWORD</code>。資料會在管理員儲存修改時自動同步；訪客登入時會自動讀取最新雲端資料。</div></div>`,`<button id="setClose" class="primary">關閉</button>`);$('setClose').onclick=closeModal}
function showCloud(){openModal('Railway 雲端同步',`<div class="panel-note">目前使用 Railway PostgreSQL。登入時自動下載最新資料；管理員每次儲存修改後會自動上傳。也可在此手動同步。</div><div class="toolbar-row"><button id="cloudUpload" class="primary admin-only">↑ 立即上傳</button><button id="cloudDownload" class="secondary">↓ 重新下載</button></div><div id="cloudStatus"></div>`,`<button id="cloudClose" class="secondary">關閉</button>`);$('cloudClose').onclick=closeModal;if(state.mode==='guest')$('cloudUpload')?.classList.add('hidden');$('cloudUpload')?.addEventListener('click',async()=>{try{$('cloudStatus').textContent='上傳中…';await pushCloudState(false);$('cloudStatus').textContent='✅ 已完成 PostgreSQL 上傳'}catch(e){$('cloudStatus').textContent='❌ '+e.message}});$('cloudDownload').onclick=async()=>{try{$('cloudStatus').textContent='下載中…';await pullCloudState();renderAll();$('cloudStatus').textContent='✅ 已下載最新雲端資料'}catch(e){$('cloudStatus').textContent='❌ '+e.message}}}
function showStats(){const m=monthKey(state.month),ev=state.events.filter(e=>e.date.startsWith(m)),counts=ev.map(e=>+e.headcount||0),total=counts.reduce((a,b)=>a+b,0),n=counts.filter(x=>x>0).length,avg=n?Math.round(total/n):0;const byRegion={};ev.forEach(e=>{if(e.region)byRegion[e.region]=(byRegion[e.region]||0)+(+e.headcount||0)});openModal('本月人數統計',`<div class="stat-cards"><div class="stat-card"><span>排程場次</span><br><b>${ev.length}</b></div><div class="stat-card"><span>簽到總人數</span><br><b>${total}</b></div><div class="stat-card"><span>有填人數場次平均</span><br><b>${avg}</b></div></div><h3>各區合計</h3><table class="history-table"><tr><th>區域</th><th>人數</th></tr>${Object.entries(byRegion).sort((a,b)=>b[1]-a[1]).map(([r,c])=>`<tr><td>${esc(r)}</td><td>${c}</td></tr>`).join('')}</table>`,`<button id="statsClose" class="primary">關閉</button>`);$('statsClose').onclick=closeModal}
function showHistory(){const ref=state.reference||{};const courseRows=(ref.courseCatalog||[]).map(c=>`<tr><td>${esc(c.category||c.name)}</td><td>${esc(c.name||'')}</td><td>${esc(c.frequency||'')}</td><td>${esc((c.recommendedLecturers||[]).join('、'))}</td><td>${esc((c.allowedLecturers||[]).join('、'))}</td></tr>`).join('');openModal('排程資料庫 / 歷史參考',`<div class="panel-note"><b>已整合「課程行事曆安排(1).xlsx」</b><br>講師 ${(ref.lecturers||[]).length} 人、主持人 ${(ref.hosts||[]).length} 人，並將說明會資格、支援區域、年資、課程頻率與推薦講師納入排程提示。</div><h3>課程規則與推薦</h3><div style="overflow:auto;max-height:38vh"><table class="history-table"><tr><th>類別</th><th>課程</th><th>頻率</th><th>推薦講師</th><th>可安排講師</th></tr>${courseRows}</table></div><h3>課程名稱更新</h3><table class="history-table"><tr><th>原名稱</th><th>更新名稱</th></tr>${(ref.courseNameUpdates||[]).filter(x=>x.new).map(x=>`<tr><td>${esc(x.old)}</td><td>${esc(x.new)}</td></tr>`).join('')}</table><h3>既有歷史摘要</h3><table class="history-table"><tr><th>月份</th><th>摘要</th></tr>${state.history.map(h=>`<tr><td>${esc(h.month)}</td><td>${esc(h.note)}</td></tr>`).join('')}</table>`,`<button id="histClose" class="primary">關閉</button>`);$('histClose').onclick=closeModal}

async function makeCanvas(){document.body.classList.add('exporting');await new Promise(r=>setTimeout(r,80));const sheet=$('sheet');const canvas=await html2canvas(sheet,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false,width:sheet.scrollWidth,height:sheet.scrollHeight});document.body.classList.remove('exporting');return canvas}
async function exportPNG(){try{const canvas=await makeCanvas();const a=document.createElement('a');a.download=`FEATERA_${$('calendarTitle').textContent}.png`;a.href=canvas.toDataURL('image/png');a.click()}catch(e){document.body.classList.remove('exporting');alert('匯出失敗：'+e.message)}}
async function sharePNG(){try{const canvas=await makeCanvas();const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));const file=new File([blob],`FEATERA_${$('calendarTitle').textContent}.png`,{type:'image/png'});if(navigator.canShare?.({files:[file]})){await navigator.share({title:$('calendarTitle').textContent,text:'FEATERA 行事曆',files:[file]})}else{const a=document.createElement('a');a.download=file.name;a.href=URL.createObjectURL(blob);a.click();alert('此瀏覽器不支援直接分享，已改為下載 PNG。')}}catch(e){document.body.classList.remove('exporting');if(e.name!=='AbortError')alert('分享失敗：'+e.message)}}

initialize().catch(e=>{console.error(e);alert('系統初始化失敗：'+e.message)});
