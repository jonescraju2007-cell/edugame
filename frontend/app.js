/* ---------- EduGame Core (shared) ---------- */

export const WORLD_ORDER = ["w1","w2","w3","w4","w5","w6","w7"];
export const WORLD_FILES = {
  w1: "data/world1.json",
  w2: "data/world2.json",
  w3: "data/world3.json",
  w4: "data/world4.json",
  w5: "data/world5.json",
  w6: "data/world6.json",
  w7: "data/world7.json"
};
export const WORLD_TITLES_CACHE = {};

/* ---- storage ---- */
const STORAGE_KEY = "rixProgress:v4";
export function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
export function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

export function markLessonDone(world) {
  const p = loadProgress(); p[world] = p[world] || {}; p[world].lessonDone = true; saveProgress(p);
}
export function markQuizDone(world, scorePct) {
  const p = loadProgress(); p[world] = p[world] || {}; 
  p[world].quizDone = true; 
  p[world].scorePct = scorePct; 
  // XP: scaled by score (e.g., 80% -> +8 XP)
  p.xp = (p.xp||0) + Math.round(scorePct/10);
  saveProgress(p);
}
export function saveAttempt(world, idx, answer) {
  const p = loadProgress();
  p[world] = p[world] || {};
  p[world].attempts = p[world].attempts || {};
  p[world].attempts[idx] = answer;
  saveProgress(p);
}
export function getAttempt(world, idx) {
  const p = loadProgress();
  return p[world]?.attempts?.[idx] || null;
}

export function isWorldUnlocked(world) {
  const idx = WORLD_ORDER.indexOf(world);
  if (idx <= 0) return true;
  const prev = WORLD_ORDER[idx-1]; const p = loadProgress();
  return !!(p[prev] && p[prev].quizDone);
}

/* ---- XP & level ---- */
export function calcLevel(xp) {
  xp = xp||0;
  const level = Math.floor(xp/50)+1; // every 50xp = level up
  const cur = xp % 50; const needed=50;
  return {level, cur, needed, percent:cur/needed};
}

/* ---- fetch world ---- */
export async function loadWorld(worldId) {
  const url = WORLD_FILES[worldId];
  if (!url) throw new Error("Unknown world id: "+worldId);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed loading "+url);
  const data = await res.json();
  WORLD_TITLES_CACHE[worldId] = data?.meta?.title || ("World "+worldId.toUpperCase());
  return data;
}

/* ---- utils ---- */
export const qs = (s, r=document)=>r.querySelector(s);
export const qsa = (s, r=document)=>[...r.querySelectorAll(s)];
export const getParam = name => new URL(location.href).searchParams.get(name);
export const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));

/* ---- confetti ---- */
export function confettiBurst() {
  if(loadProgress().mute) return;
  const c = document.createElement('canvas'); c.className='confetti';
  c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const parts = Array.from({length: 120}, () => ({
    x: Math.random()*c.width, y: -20 - Math.random()*100,
    s: 4+Math.random()*6, v: 2+Math.random()*4,
    r: Math.random()*Math.PI, vr: (Math.random()-0.5)*0.2
  }));
  const t0 = performance.now();
  (function draw(t){
    ctx.clearRect(0,0,c.width,c.height);
    parts.forEach(p=>{
      p.y+=p.v; p.r+=p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
      ctx.fillStyle=`hsl(${(p.x+p.y)%360} 90% 60%)`; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s);
      ctx.restore();
    });
    (t-t0<2400)?requestAnimationFrame(draw):c.remove();
  })(t0);
}

/* ---- sounds ---- */
let audioCtx;
export function blip(ok=true){
  if(loadProgress().mute) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.type="sine"; o.frequency.value = ok? 880: 220; g.gain.value=.05; o.connect(g); g.connect(audioCtx.destination);
    o.start(); setTimeout(()=>{o.stop();}, ok?120:180);
  }catch{}
}
export function toggleMute(){
  const p = loadProgress(); p.mute = !p.mute; saveProgress(p); return !p.mute;
}
export function isMuted(){ return !!loadProgress().mute; }

/* ---- mentor ---- */
export async function askMentor(question, context) {
  try {
    const res = await fetch('/api/mentor', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ question, context })
    });
    if (!res.ok) throw new Error("Mentor API "+res.status);
    const data = await res.json();
    if (typeof data.reply === 'string') return { text: data.reply };
    const text = [data.hint, data.explanation].filter(Boolean).join("\n\n");
    return { text: text || "I'm thinking…" };
  } catch {
    return { text: "Mentor is offline. Check server.js and your API key." };
  }
}

/* ---- toast ---- */
export function toast(msg) {
  const el = document.createElement('div'); el.className='toast'; el.textContent=msg;
  document.body.appendChild(el); setTimeout(()=>el.classList.add('show'),10);
  setTimeout(()=>el.classList.remove('show'),2200); setTimeout(()=>el.remove(),2800);
}

/* ---- theme (dark / light) ---- */
const THEME_KEY = "rixTheme";
export function loadTheme(){ return localStorage.getItem(THEME_KEY)||"dark"; }
export function saveTheme(t){ localStorage.setItem(THEME_KEY,t); }
export function applyTheme(t=loadTheme()){ document.documentElement.setAttribute("data-theme",t); }
export function toggleTheme(){ const next=loadTheme()==="dark"?"light":"dark"; saveTheme(next); applyTheme(next); return next; }

