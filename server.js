const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL is missing'); process.exit(1); }

const pool = new Pool({ connectionString: DATABASE_URL, max: 5, idleTimeoutMillis: 30000 });
const ADMIN_USER = process.env.ADMIN_USER || 'Featera';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'featera168';
const DJ_USER = process.env.DJ_USER || 'featera_dj';
const DJ_PASSWORD = process.env.DJ_PASSWORD || 'featera168';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256').update(DATABASE_URL).digest('hex');

app.use(express.json({ limit: '12mb' }));

function parseCookies(req){return Object.fromEntries((req.headers.cookie||'').split(';').filter(Boolean).map(v=>{const i=v.indexOf('=');return [v.slice(0,i).trim(),decodeURIComponent(v.slice(i+1))]}))}
function sign(data){return crypto.createHmac('sha256',SESSION_SECRET).update(data).digest('hex')}
function makeToken(role){const exp=Date.now()+12*60*60*1000;const data=`${role}.${exp}`;return `${data}.${sign(data)}`}
function getRole(req){const t=parseCookies(req).featera_session;if(!t)return null;const p=t.split('.');if(p.length!==3)return null;const data=`${p[0]}.${p[1]}`;const a=Buffer.from(sign(data)),b=Buffer.from(p[2]);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;if(Number(p[1])<=Date.now())return null;return ['admin','dj'].includes(p[0])?p[0]:null}
function safeEqual(a,b){const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&crypto.timingSafeEqual(x,y)}
function setSession(res,role){res.setHeader('Set-Cookie',`featera_session=${makeToken(role)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200${process.env.RAILWAY_ENVIRONMENT?'; Secure':''}`)}

app.post('/api/login',(req,res)=>{
  const {user='',pass=''}=req.body||{};
  if(String(user).toLowerCase()===String(ADMIN_USER).toLowerCase()&&safeEqual(pass,ADMIN_PASSWORD)){
    setSession(res,'admin');return res.json({ok:true,role:'admin'});
  }
  if(String(user).toLowerCase()===String(DJ_USER).toLowerCase()&&safeEqual(pass,DJ_PASSWORD)){
    setSession(res,'dj');return res.json({ok:true,role:'dj'});
  }
  res.status(401).json({error:'帳號或密碼錯誤'});
});
app.post('/api/logout',(req,res)=>{res.setHeader('Set-Cookie','featera_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');res.json({ok:true})});

app.get('/api/state',async(req,res)=>{try{const q=await pool.query("SELECT payload, updated_at FROM featera_calendar_state WHERE id='main'");res.json(q.rows[0]||{payload:null})}catch(e){console.error(e);res.status(500).json({error:'資料庫讀取失敗'})}});
app.put('/api/state',async(req,res)=>{if(getRole(req)!=='admin')return res.status(401).json({error:'需要管理員登入'});const payload=req.body?.payload;if(!payload||typeof payload!=='object')return res.status(400).json({error:'資料格式錯誤'});try{await pool.query("INSERT INTO featera_calendar_state(id,payload,updated_at) VALUES('main',$1,NOW()) ON CONFLICT(id) DO UPDATE SET payload=EXCLUDED.payload,updated_at=NOW()",[payload]);res.json({ok:true,updated_at:new Date().toISOString()})}catch(e){console.error(e);res.status(500).json({error:'資料庫儲存失敗'})}});

app.get('/api/audio-state',async(req,res)=>{
  try{
    const [audio,main]=await Promise.all([
      pool.query("SELECT payload, updated_at FROM featera_calendar_state WHERE id='audio'"),
      pool.query("SELECT payload FROM featera_calendar_state WHERE id='main'")
    ]);
    const mainPayload=main.rows[0]?.payload||{};
    res.json({payload:audio.rows[0]?.payload||null,updated_at:audio.rows[0]?.updated_at||null,events:mainPayload.events||[],hosts:mainPayload.staff?.hosts||[]});
  }catch(e){console.error(e);res.status(500).json({error:'音控資料讀取失敗'})}
});
app.put('/api/audio-state',async(req,res)=>{
  const role=getRole(req);if(!['admin','dj'].includes(role))return res.status(401).json({error:'需要音控或管理員登入'});
  const payload=req.body?.payload;if(!payload||typeof payload!=='object')return res.status(400).json({error:'資料格式錯誤'});
  const safePayload={schedule:Array.isArray(payload.schedule)?payload.schedule:[],staff:Array.isArray(payload.staff)?payload.staff:[],meta:payload.meta&&typeof payload.meta==='object'?payload.meta:{}};
  try{await pool.query("INSERT INTO featera_calendar_state(id,payload,updated_at) VALUES('audio',$1,NOW()) ON CONFLICT(id) DO UPDATE SET payload=EXCLUDED.payload,updated_at=NOW()",[safePayload]);res.json({ok:true,role,updated_at:new Date().toISOString()})}catch(e){console.error(e);res.status(500).json({error:'音控資料儲存失敗'})}
});

app.get('/api/health',async(req,res)=>{try{await pool.query('SELECT 1');res.json({ok:true,database:true})}catch(e){res.status(500).json({ok:false,database:false})}});

app.use((req,res,next)=>{
  if (!req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma','no-cache');
    res.setHeader('Expires','0');
    res.setHeader('Surrogate-Control','no-store');
  }
  next();
});
app.use(express.static(__dirname,{extensions:['html'],etag:false,lastModified:false,maxAge:0}));
app.use((req,res)=>res.sendFile(path.join(__dirname,'index.html')));

async function init(){
  await pool.query(`CREATE TABLE IF NOT EXISTS featera_calendar_state (
    id TEXT PRIMARY KEY,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  app.listen(PORT,'0.0.0.0',()=>console.log(`FEATERA Calendar PostgreSQL edition v9 running on port ${PORT}`));
}
init().catch(e=>{console.error('Database initialization failed:',e);process.exit(1)});
