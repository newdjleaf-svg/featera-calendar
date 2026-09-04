const STORAGE_KEY="featera_calendar_app_v2",TITLE_KEY="featera_calendar_title_v1",COUNTRY_KEY="featera_calendar_country_v1";
const state={country:localStorage.getItem(COUNTRY_KEY)||"taiwan",date:new Date(2026,8,1),title:"",customTitle:false,events:[]};
const countryNames={taiwan:"台灣",xiamen:"中國廈門"};

// 使用者自訂行程；國定假日不再寫死在這裡，而是依地區自動套用。
const seedEvents=[
{id:"e1",date:"2026-09-03",title:"幸福講堂",desc:"魅力NP全營養\n主持：楊惠娜\n主講：張恩淇",color:"green",titleSize:18,descSize:14},
{id:"e2",date:"2026-09-10",title:"幸福講堂",desc:"市場Q&A(地雷)\n主持：朱呈霖\n主講：陳沛瑩",color:"green",titleSize:18,descSize:14},
{id:"e3",date:"2026-09-17",title:"幸福講堂",desc:"產品Q&A\n主持：張恩淇\n主講：黃麗紅",color:"green",titleSize:18,descSize:14},
{id:"e5",date:"2026-09-24",title:"幸福講堂",desc:"制度Q&A\n主持：馮玲\n主講：賴婷柔",color:"green",titleSize:18,descSize:14},
{id:"e8",date:"2026-09-27",title:"9月健康回饋日",desc:"地點：廈門公司大會場\n主講：曾泰华總裁\n主持：\n時間：13:30進場／17:00結束",color:"purple",titleSize:17,descSize:13},
{id:"e9",date:"2026-09-30",title:"幸福講堂",desc:"九大慢性病\n主持：耿玉春\n主講：曾泰华",color:"green",titleSize:18,descSize:14}
];

// 2026 官方假日資料。
// type=holiday：放假；type=workday：中國大陸因調休而週末上班。
const HOLIDAY_DATA={
  taiwan:{
    2026:{
      "2026-01-01":{label:"開國紀念日",type:"holiday"},
      "2026-02-14":{label:"春節連假",type:"holiday"},"2026-02-15":{label:"春節連假",type:"holiday"},"2026-02-16":{label:"春節連假",type:"holiday"},"2026-02-17":{label:"春節",type:"holiday"},"2026-02-18":{label:"春節連假",type:"holiday"},"2026-02-19":{label:"春節連假",type:"holiday"},"2026-02-20":{label:"春節補假",type:"holiday"},"2026-02-21":{label:"春節連假",type:"holiday"},"2026-02-22":{label:"春節連假",type:"holiday"},
      "2026-02-27":{label:"和平紀念日補假",type:"holiday"},"2026-02-28":{label:"和平紀念日",type:"holiday"},"2026-03-01":{label:"連假",type:"holiday"},
      "2026-04-03":{label:"兒童節補假",type:"holiday"},"2026-04-04":{label:"兒童節",type:"holiday"},"2026-04-05":{label:"清明節",type:"holiday"},"2026-04-06":{label:"清明節補假",type:"holiday"},
      "2026-05-01":{label:"勞動節",type:"holiday"},"2026-05-02":{label:"勞動節連假",type:"holiday"},"2026-05-03":{label:"勞動節連假",type:"holiday"},
      "2026-06-19":{label:"端午節",type:"holiday"},"2026-06-20":{label:"端午連假",type:"holiday"},"2026-06-21":{label:"端午連假",type:"holiday"},
      "2026-09-25":{label:"中秋節",type:"holiday"},"2026-09-26":{label:"中秋連假",type:"holiday"},"2026-09-27":{label:"中秋連假",type:"holiday"},"2026-09-28":{label:"教師節",type:"holiday"},
      "2026-10-09":{label:"國慶日補假",type:"holiday"},"2026-10-10":{label:"國慶日",type:"holiday"},"2026-10-11":{label:"國慶連假",type:"holiday"},
      "2026-10-24":{label:"光復節連假",type:"holiday"},"2026-10-25":{label:"臺灣光復紀念日",type:"holiday"},"2026-10-26":{label:"光復節補假",type:"holiday"},
      "2026-12-25":{label:"行憲紀念日",type:"holiday"},"2026-12-26":{label:"行憲紀念日連假",type:"holiday"},"2026-12-27":{label:"行憲紀念日連假",type:"holiday"}
    }
  },
  xiamen:{
    2026:{
      "2026-01-01":{label:"元旦",type:"holiday"},"2026-01-02":{label:"元旦假期",type:"holiday"},"2026-01-03":{label:"元旦假期",type:"holiday"},"2026-01-04":{label:"調休上班",type:"workday"},
      "2026-02-14":{label:"調休上班",type:"workday"},"2026-02-15":{label:"春節假期",type:"holiday"},"2026-02-16":{label:"春節假期",type:"holiday"},"2026-02-17":{label:"春節",type:"holiday"},"2026-02-18":{label:"春節假期",type:"holiday"},"2026-02-19":{label:"春節假期",type:"holiday"},"2026-02-20":{label:"春節假期",type:"holiday"},"2026-02-21":{label:"春節假期",type:"holiday"},"2026-02-22":{label:"春節假期",type:"holiday"},"2026-02-23":{label:"春節假期",type:"holiday"},"2026-02-28":{label:"調休上班",type:"workday"},
      "2026-04-04":{label:"清明節",type:"holiday"},"2026-04-05":{label:"清明假期",type:"holiday"},"2026-04-06":{label:"清明假期",type:"holiday"},
      "2026-05-01":{label:"勞動節",type:"holiday"},"2026-05-02":{label:"勞動節假期",type:"holiday"},"2026-05-03":{label:"勞動節假期",type:"holiday"},"2026-05-04":{label:"勞動節假期",type:"holiday"},"2026-05-05":{label:"勞動節假期",type:"holiday"},"2026-05-09":{label:"調休上班",type:"workday"},
      "2026-06-19":{label:"端午節",type:"holiday"},"2026-06-20":{label:"端午假期",type:"holiday"},"2026-06-21":{label:"端午假期",type:"holiday"},
      "2026-09-20":{label:"調休上班",type:"workday"},"2026-09-25":{label:"中秋節",type:"holiday"},"2026-09-26":{label:"中秋假期",type:"holiday"},"2026-09-27":{label:"中秋假期",type:"holiday"},
      "2026-10-01":{label:"國慶節",type:"holiday"},"2026-10-02":{label:"國慶假期",type:"holiday"},"2026-10-03":{label:"國慶假期",type:"holiday"},"2026-10-04":{label:"國慶假期",type:"holiday"},"2026-10-05":{label:"國慶假期",type:"holiday"},"2026-10-06":{label:"國慶假期",type:"holiday"},"2026-10-07":{label:"國慶假期",type:"holiday"},"2026-10-10":{label:"調休上班",type:"workday"}
    }
  }
};

const $=id=>document.getElementById(id),pad=n=>String(n).padStart(2,"0"),iso=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function loadState(){try{const raw=localStorage.getItem(STORAGE_KEY);state.events=raw?JSON.parse(raw):seedEvents.map(e=>({...e}))}catch{state.events=seedEvents.map(e=>({...e}))}const savedTitle=localStorage.getItem(TITLE_KEY);if(savedTitle){state.title=savedTitle;state.customTitle=true}else updateAutoTitle()}
function saveEvents(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.events))}
function updateAutoTitle(){if(state.customTitle)return;state.title=`${countryNames[state.country]}${state.date.getFullYear()}年${state.date.getMonth()+1}月行事曆`}
function getDayMeta(dt){const year=Number(dt.slice(0,4));return HOLIDAY_DATA[state.country]?.[year]?.[dt]||null}
function populateSelectors(){yearSelect.innerHTML="";monthSelect.innerHTML="";for(let y=2024;y<=2035;y++)yearSelect.add(new Option(`${y}年`,y));for(let m=1;m<=12;m++)monthSelect.add(new Option(`${m}月`,m-1));yearSelect.value=state.date.getFullYear();monthSelect.value=state.date.getMonth();countrySelect.value=state.country}

function dayHtml(dateObj,label){
  const dt=iso(dateObj.getFullYear(),dateObj.getMonth(),dateObj.getDate());
  const dow=dateObj.getDay(),weekend=dow===0||dow===6;
  const isToday=new Date().toDateString()===dateObj.toDateString();
  const meta=getDayMeta(dt);
  const events=state.events.filter(e=>e.date===dt).sort((a,b)=>(a.start||"").localeCompare(b.start||""));
  const holidayClass=meta?.type==="holiday"?"holiday":meta?.type==="workday"?"makeup-workday":"";
  return `<div class="day ${weekend?"weekend":""} ${isToday?"today":""} ${holidayClass}" data-date="${dt}">
    <div class="date-num">${label}</div>
    ${meta?`<div class="holiday-label ${meta.type}">${escapeHtml(meta.label)}</div>`:""}
    ${events.map(eventHtml).join("")}
  </div>`;
}

function render(){
  updateAutoTitle();calendarTitle.textContent=state.title;
  const y=state.date.getFullYear(),m=state.date.getMonth(),first=new Date(y,m,1),mondayIndex=(first.getDay()+6)%7;
  const gridStart=new Date(y,m,1-mondayIndex);
  let cells="";
  // 固定 7 x 5 = 35 格。從包含當月1號的星期一開始連續顯示35天。
  for(let i=0;i<35;i++){
    const d=new Date(gridStart);d.setDate(gridStart.getDate()+i);
    const inCurrentMonth=d.getMonth()===m;
    const label=inCurrentMonth?d.getDate():`${d.getMonth()+1}/${d.getDate()}`;
    cells+=dayHtml(d,label);
  }
  calendarGrid.innerHTML=cells;
  document.querySelectorAll('.day[data-date]').forEach(el=>el.onclick=e=>{if(!e.target.closest('.event'))openEventModal(null,el.dataset.date)});
  document.querySelectorAll('.event[data-id]').forEach(el=>el.onclick=e=>{e.stopPropagation();openEventModal(el.dataset.id)});
}

function eventHtml(e){const titleSize=Math.min(Math.max(Number(e.titleSize)||18,12),36),descSize=Math.min(Math.max(Number(e.descSize)||14,10),30),time=e.start?`${e.start}${e.end?" - "+e.end:""}`:"";return `<div class="event ${escapeHtml(e.color||"green")}" data-id="${escapeHtml(e.id)}">${time?`<div class="event-time" style="font-size:${Math.max(descSize-1,10)}px">${escapeHtml(time)}</div>`:""}<div class="event-title" style="font-size:${titleSize}px">${escapeHtml(e.title)}</div>${e.desc?`<div class="event-desc" style="font-size:${descSize}px">${escapeHtml(e.desc)}</div>`:""}</div>`}

countrySelect.onchange=()=>{state.country=countrySelect.value;localStorage.setItem(COUNTRY_KEY,state.country);if(state.customTitle&&confirm("目前使用自訂大標題。要改回自動標題並套用新地區嗎？")){state.customTitle=false;localStorage.removeItem(TITLE_KEY)}updateAutoTitle();render()};
yearSelect.onchange=()=>{state.date.setFullYear(Number(yearSelect.value));render()};
monthSelect.onchange=()=>{state.date.setMonth(Number(monthSelect.value));render()};
editTitleBtn.onclick=()=>{titleInput.value=state.title;titleModal.classList.remove('hidden')};
function closeTitle(){titleModal.classList.add('hidden')}
closeTitleModal.onclick=cancelTitleBtn.onclick=closeTitle;titleModal.onclick=e=>{if(e.target===titleModal)closeTitle()};
titleForm.onsubmit=e=>{e.preventDefault();const t=titleInput.value.trim();if(!t)return;state.title=t;state.customTitle=true;localStorage.setItem(TITLE_KEY,t);render();closeTitle()};

function openEventModal(id,date){const ev=id?state.events.find(x=>x.id===id):null;eventModalTitle.textContent=ev?"修改行程":"新增行程";eventId.value=ev?.id||"";eventDate.value=ev?.date||date||iso(state.date.getFullYear(),state.date.getMonth(),1);eventColor.value=ev?.color||"green";eventStart.value=ev?.start||"";eventEnd.value=ev?.end||"";eventTitle.value=ev?.title||"";eventDesc.value=ev?.desc||"";eventTitleSize.value=ev?.titleSize||18;eventDescSize.value=ev?.descSize||14;deleteEventBtn.classList.toggle('hidden',!ev);eventModal.classList.remove('hidden')}
function closeEvent(){eventModal.classList.add('hidden')}
addEventBtn.onclick=()=>openEventModal();closeEventModal.onclick=cancelEventBtn.onclick=closeEvent;eventModal.onclick=e=>{if(e.target===eventModal)closeEvent()};
eventForm.onsubmit=e=>{e.preventDefault();const oldId=eventId.value.trim(),id=oldId||crypto.randomUUID(),obj={id,date:eventDate.value,color:eventColor.value,start:eventStart.value,end:eventEnd.value,title:eventTitle.value.trim(),desc:eventDesc.value.trim(),titleSize:Number(eventTitleSize.value)||18,descSize:Number(eventDescSize.value)||14};if(!obj.date||!obj.title)return alert("請完整填寫日期與行程標題。");if(obj.start&&obj.end&&obj.end<obj.start)return alert("結束時間不能早於開始時間。");const idx=state.events.findIndex(x=>x.id===oldId);idx>=0?state.events[idx]=obj:state.events.push(obj);saveEvents();render();closeEvent()};
deleteEventBtn.onclick=()=>{const id=eventId.value;if(id&&confirm("確定要刪除此行程嗎？")){state.events=state.events.filter(e=>e.id!==id);saveEvents();render();closeEvent()}};

exportBtn.onclick=async()=>{exportBtn.disabled=true;exportBtn.textContent="產生 PNG…";try{if(typeof html2canvas==="undefined")throw new Error();const target=captureArea,canvas=await html2canvas(target,{scale:2,backgroundColor:"#f7efde",useCORS:true,logging:false,width:target.clientWidth,height:target.clientHeight});const a=document.createElement('a');a.download=`${state.title}.png`;a.href=canvas.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove()}catch{alert("PNG 匯出失敗，請確認瀏覽器下載權限與網路連線。") }finally{exportBtn.disabled=false;exportBtn.textContent="匯出 PNG"}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!titleModal.classList.contains('hidden'))closeTitle();if(!eventModal.classList.contains('hidden'))closeEvent()}});
loadState();populateSelectors();render();

/* =========================================================
   Mobile export / iOS / Android / native sharing layer
   ========================================================= */
const mobileExportState={blob:null,file:null,url:null};

function detectPlatform(){
  const ua=navigator.userAgent||"";
  const isIOS=/iPad|iPhone|iPod/.test(ua) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
  const isAndroid=/Android/i.test(ua);
  document.body.classList.remove("platform-ios","platform-android","platform-desktop");
  document.body.classList.add(isIOS?"platform-ios":isAndroid?"platform-android":"platform-desktop");
  return isIOS?"ios":isAndroid?"android":"desktop";
}

function safeFilename(name){
  return String(name||"FEATERA行事曆").replace(/[\\/:*?"<>|]+/g,"_").trim()||"FEATERA行事曆";
}

function canvasToBlob(canvas){
  return new Promise((resolve,reject)=>{
    canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("PNG Blob 產生失敗")),"image/png",1);
  });
}

async function buildPngFile(){
  if(typeof html2canvas==="undefined") throw new Error("html2canvas 尚未載入");
  const target=captureArea;
  const canvas=await html2canvas(target,{
    scale:2,
    backgroundColor:"#f7efde",
    useCORS:true,
    logging:false,
    width:target.clientWidth,
    height:target.clientHeight,
    scrollX:0,
    scrollY:0
  });
  const blob=await canvasToBlob(canvas);
  const filename=`${safeFilename(state.title)}.png`;
  const file=new File([blob],filename,{type:"image/png",lastModified:Date.now()});
  if(mobileExportState.url) URL.revokeObjectURL(mobileExportState.url);
  mobileExportState.blob=blob;
  mobileExportState.file=file;
  mobileExportState.url=URL.createObjectURL(blob);
  return {blob,file,url:mobileExportState.url,filename};
}

function downloadExportFile(file=mobileExportState.file){
  if(!file) return;
  const url=URL.createObjectURL(file);
  const a=document.createElement("a");
  a.href=url;
  a.download=file.name;
  a.rel="noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}

function openPreview(mode="share"){
  const platform=detectPlatform();
  if(!mobileExportState.url) return;
  previewImage.src=mobileExportState.url;
  imagePreviewModal.classList.remove("hidden");
  if(platform==="ios"){
    previewHint.textContent=mode==="save"
      ? "iPhone／iPad：網頁無法跳過 iOS 權限直接寫入『照片』。可長按下方圖片選擇儲存，或按『開啟系統分享』後選『儲存影像』／LINE 等 App。"
      : "按『開啟系統分享』即可叫出 iOS 分享面板，再選 LINE、Messenger、WhatsApp、Telegram、郵件等支援的 App。";
  }else if(platform==="android"){
    previewHint.textContent=mode==="save"
      ? "Android：可按『下載 PNG』儲存到裝置；若相簿未立即顯示，可從下載項目開啟圖片。也可使用系統分享傳送到 LINE 等 App。"
      : "按『開啟系統分享』即可叫出 Android 原生分享選單，選擇 LINE、Messenger、WhatsApp、Telegram 等已安裝 App。";
  }else{
    previewHint.textContent="可下載 PNG，或在支援 Web Share 的瀏覽器使用系統分享。";
  }
}

function closePreview(){
  imagePreviewModal.classList.add("hidden");
}

async function nativeShareCurrentFile(){
  const file=mobileExportState.file;
  if(!file){alert("請先產生 PNG。 ");return;}
  const data={
    files:[file],
    title:state.title,
    text:`${state.title}`
  };
  try{
    if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
      await navigator.share(data);
      return;
    }
    alert("目前瀏覽器不支援圖片檔案的系統分享，請改用『下載 PNG』後再從相簿／檔案 App 分享。 ");
  }catch(err){
    if(err && err.name!=="AbortError"){
      console.error(err);
      alert("系統分享未能啟動。請確認網站使用 HTTPS，或改用下載 PNG。 ");
    }
  }
}

/* Desktop PNG export */
exportBtn.onclick=async()=>{
  exportBtn.disabled=true;
  exportBtn.textContent="產生 PNG…";
  try{
    const {file}=await buildPngFile();
    downloadExportFile(file);
  }catch(err){
    console.error(err);
    alert("PNG 匯出失敗，請確認瀏覽器下載權限與網路連線。 ");
  }finally{
    exportBtn.disabled=false;
    exportBtn.textContent="匯出 PNG";
  }
};

/* Mobile save: iOS opens a save-friendly preview; Android downloads + preview fallback. */
savePhotoBtn.onclick=async()=>{
  const platform=detectPlatform();
  savePhotoBtn.disabled=true;
  savePhotoBtn.textContent="產生中…";
  try{
    const {file}=await buildPngFile();
    if(platform==="android") downloadExportFile(file);
    openPreview("save");
  }catch(err){
    console.error(err);
    alert("圖片產生失敗。 ");
  }finally{
    savePhotoBtn.disabled=false;
    savePhotoBtn.textContent="儲存圖片";
  }
};

/* Generate first, then preview; the preview Share button provides a fresh user gesture for Web Share. */
shareBtn.onclick=async()=>{
  shareBtn.disabled=true;
  shareBtn.textContent="產生中…";
  try{
    await buildPngFile();
    openPreview("share");
  }catch(err){
    console.error(err);
    alert("分享圖片產生失敗。 ");
  }finally{
    shareBtn.disabled=false;
    shareBtn.textContent="分享";
  }
};

previewShareBtn.onclick=nativeShareCurrentFile;
previewDownloadBtn.onclick=()=>downloadExportFile();
closePreviewModal.onclick=closePreview;
imagePreviewModal.onclick=e=>{if(e.target===imagePreviewModal)closePreview()};

window.addEventListener("resize",detectPlatform,{passive:true});
detectPlatform();
