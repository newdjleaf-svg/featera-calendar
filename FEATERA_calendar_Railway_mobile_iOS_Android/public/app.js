const STORAGE_KEY="featera_calendar_app_v3",OLD_STORAGE_KEY="featera_calendar_app_v2",TITLE_KEY="featera_calendar_title_v1",COUNTRY_KEY="featera_calendar_country_v1";
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
function normalizeRichEvent(e){
  const title = String(e?.title ?? "");
  const titleSize = Number(e?.titleSize) || 18;
  const descSize = Number(e?.descSize) || 14;

  let lines = Array.isArray(e?.lines) ? e.lines.map(line => ({
    text:String(line?.text ?? ""),
    size:Number(line?.size) || descSize,
    align:["left","center","right"].includes(line?.align) ? line.align : "left",
    bold:line?.bold !== false,
    italic:!!line?.italic,
    color:String(line?.color || "#18324d")
  })) : [];

  // 舊版本 desc 自動轉為逐行格式，既有資料不會消失。
  if(!lines.length && String(e?.desc || "").length){
    lines = String(e.desc).split("\n").map(text => ({
      text,
      size:descSize,
      align:"left",
      bold:true,
      italic:false,
      color:"#18324d"
    }));
  }

  return {
    ...e,
    title,
    titleSize,
    titleAlign:["left","center","right"].includes(e?.titleAlign) ? e.titleAlign : "center",
    titleBold:e?.titleBold !== false,
    titleItalic:!!e?.titleItalic,
    titleColor:String(e?.titleColor || "#102343"),
    lines
  };
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
    const source = raw ? JSON.parse(raw) : seedEvents.map(e=>({...e}));
    state.events = Array.isArray(source) ? source.map(normalizeRichEvent) : seedEvents.map(normalizeRichEvent);
  }catch{
    state.events = seedEvents.map(normalizeRichEvent);
  }

  const savedTitle=localStorage.getItem(TITLE_KEY);
  if(savedTitle){
    state.title=savedTitle;
    state.customTitle=true;
  }else{
    updateAutoTitle();
  }

  saveEvents();
}

function saveEvents(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state.events));
}
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

function styleTextLine(line){
  return [
    `font-size:${Math.min(Math.max(Number(line.size)||14,8),42)}px`,
    `text-align:${["left","center","right"].includes(line.align)?line.align:"left"}`,
    `font-weight:${line.bold?"800":"400"}`,
    `font-style:${line.italic?"italic":"normal"}`,
    `color:${/^#[0-9a-fA-F]{6}$/.test(line.color||"")?line.color:"#18324d"}`
  ].join(";");
}

function eventHtml(e){
  const ev = normalizeRichEvent(e);
  const time = ev.start ? `${ev.start}${ev.end?" - "+ev.end:""}` : "";

  const titleHtml = ev.title
    ? `<div class="event-title rich-event-title" style="${[
        `font-size:${Math.min(Math.max(Number(ev.titleSize)||18,8),42)}px`,
        `text-align:${ev.titleAlign}`,
        `font-weight:${ev.titleBold?"900":"400"}`,
        `font-style:${ev.titleItalic?"italic":"normal"}`,
        `color:${/^#[0-9a-fA-F]{6}$/.test(ev.titleColor||"")?ev.titleColor:"#102343"}`
      ].join(";")}">${escapeHtml(ev.title)}</div>`
    : "";

  const linesHtml = ev.lines
    .filter(line => String(line.text ?? "").length > 0)
    .map(line => `<div class="event-rich-line" style="${styleTextLine(line)}">${escapeHtml(line.text)}</div>`)
    .join("");

  return `<div class="event ${escapeHtml(ev.color||"green")}" data-id="${escapeHtml(ev.id)}">
    ${time?`<div class="event-time" style="font-size:12px">${escapeHtml(time)}</div>`:""}
    ${titleHtml}
    ${linesHtml}
  </div>`;
}

countrySelect.onchange=()=>{state.country=countrySelect.value;localStorage.setItem(COUNTRY_KEY,state.country);if(state.customTitle&&confirm("目前使用自訂大標題。要改回自動標題並套用新地區嗎？")){state.customTitle=false;localStorage.removeItem(TITLE_KEY)}updateAutoTitle();render()};
yearSelect.onchange=()=>{state.date.setFullYear(Number(yearSelect.value));render()};
monthSelect.onchange=()=>{state.date.setMonth(Number(monthSelect.value));render()};
editTitleBtn.onclick=()=>{titleInput.value=state.title;titleModal.classList.remove('hidden')};
function closeTitle(){titleModal.classList.add('hidden')}
closeTitleModal.onclick=cancelTitleBtn.onclick=closeTitle;titleModal.onclick=e=>{if(e.target===titleModal)closeTitle()};
titleForm.onsubmit=e=>{e.preventDefault();const t=titleInput.value.trim();if(!t)return;state.title=t;state.customTitle=true;localStorage.setItem(TITLE_KEY,t);render();closeTitle()};

function makeTextLineEditorRow(line={},index=0){
  const row=document.createElement("div");
  row.className="text-line-row";
  row.innerHTML=`
    <div class="text-line-main">
      <span class="text-line-number">${index+1}</span>
      <input class="text-line-input" type="text" maxlength="180" placeholder="輸入第 ${index+1} 行文字">
      <button class="remove-line-btn" type="button" title="刪除此行">×</button>
    </div>
    <div class="text-line-format">
      <label>大小
        <input class="line-size" type="number" min="8" max="42" value="${Number(line.size)||14}">
      </label>
      <label>對齊
        <select class="line-align">
          <option value="left">靠左</option>
          <option value="center">置中</option>
          <option value="right">靠右</option>
        </select>
      </label>
      <label>顏色
        <input class="line-color" type="color" value="${/^#[0-9a-fA-F]{6}$/.test(line.color||"")?line.color:"#18324d"}">
      </label>
      <label class="toggle-format"><input class="line-bold" type="checkbox"> 粗體</label>
      <label class="toggle-format"><input class="line-italic" type="checkbox"> 斜體</label>
    </div>`;

  row.querySelector(".text-line-input").value=String(line.text??"");
  row.querySelector(".line-align").value=["left","center","right"].includes(line.align)?line.align:"left";
  row.querySelector(".line-bold").checked=line.bold!==false;
  row.querySelector(".line-italic").checked=!!line.italic;

  row.querySelector(".remove-line-btn").onclick=()=>{
    row.remove();
    renumberTextLines();
    if(!textLinesEditor.children.length)addTextLine({});
  };

  return row;
}

function renumberTextLines(){
  [...textLinesEditor.querySelectorAll(".text-line-row")].forEach((row,i)=>{
    row.querySelector(".text-line-number").textContent=i+1;
    row.querySelector(".text-line-input").placeholder=`輸入第 ${i+1} 行文字`;
  });
}

function addTextLine(line={}){
  textLinesEditor.appendChild(makeTextLineEditorRow(line,textLinesEditor.children.length));
}

function collectTextLines(){
  return [...textLinesEditor.querySelectorAll(".text-line-row")].map(row=>({
    text:row.querySelector(".text-line-input").value,
    size:Number(row.querySelector(".line-size").value)||14,
    align:row.querySelector(".line-align").value,
    bold:row.querySelector(".line-bold").checked,
    italic:row.querySelector(".line-italic").checked,
    color:row.querySelector(".line-color").value
  })).filter(line=>line.text.length>0);
}

addTextLineBtn.onclick=()=>addTextLine({text:"",size:14,align:"left",bold:true,italic:false,color:"#18324d"});

function openEventModal(id,date){
  const ev=id?normalizeRichEvent(state.events.find(x=>x.id===id)):null;
  eventModalTitle.textContent=ev?"修改行程":"新增行程";
  eventId.value=ev?.id||"";
  eventDate.value=ev?.date||date||iso(state.date.getFullYear(),state.date.getMonth(),1);
  eventColor.value=ev?.color||"green";
  eventStart.value=ev?.start||"";
  eventEnd.value=ev?.end||"";
  eventTitle.value=ev?.title||"";

  eventTitleSize.value=ev?.titleSize||18;
  eventTitleAlign.value=ev?.titleAlign||"center";
  eventTitleBold.checked=ev?.titleBold!==false;
  eventTitleItalic.checked=!!ev?.titleItalic;
  eventTitleColor.value=/^#[0-9a-fA-F]{6}$/.test(ev?.titleColor||"")?ev.titleColor:"#102343";

  textLinesEditor.innerHTML="";
  const lines=ev?.lines?.length?ev.lines:[{text:"",size:14,align:"left",bold:true,italic:false,color:"#18324d"}];
  lines.forEach(addTextLine);

  deleteEventBtn.classList.toggle("hidden",!ev);
  eventModal.classList.remove("hidden");
}

function closeEvent(){
  eventModal.classList.add("hidden");
}

addEventBtn.onclick=()=>openEventModal();
closeEventModal.onclick=cancelEventBtn.onclick=closeEvent;
eventModal.onclick=e=>{if(e.target===eventModal)closeEvent()};

eventForm.onsubmit=e=>{
  e.preventDefault();

  const oldId=eventId.value.trim();
  const id=oldId||crypto.randomUUID();

  const obj=normalizeRichEvent({
    id,
    date:eventDate.value,
    color:eventColor.value,
    start:eventStart.value,
    end:eventEnd.value,
    title:eventTitle.value.trim(),
    titleSize:Number(eventTitleSize.value)||18,
    titleAlign:eventTitleAlign.value,
    titleBold:eventTitleBold.checked,
    titleItalic:eventTitleItalic.checked,
    titleColor:eventTitleColor.value,
    lines:collectTextLines()
  });

  if(!obj.date){
    alert("請選擇日期。");
    return;
  }

  // 標題改為非必填；只要標題或至少一行內容有文字，就可儲存。
  if(!obj.title && !obj.lines.length){
    alert("行程標題可以留空，但請至少輸入一行行程內容。");
    return;
  }

  if(obj.start&&obj.end&&obj.end<obj.start){
    alert("結束時間不能早於開始時間。");
    return;
  }

  const idx=state.events.findIndex(x=>x.id===oldId);
  if(idx>=0)state.events[idx]=obj;
  else state.events.push(obj);

  saveEvents();
  render();
  closeEvent();
};

deleteEventBtn.onclick=()=>{
  const id=eventId.value;
  if(id&&confirm("確定要刪除此行程嗎？")){
    state.events=state.events.filter(e=>e.id!==id);
    saveEvents();
    render();
    closeEvent();
  }
};

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
