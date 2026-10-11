'use strict';
(() => {
  const canvas = document.querySelector('#portrait-sequence');
  const hero = document.querySelector('.cinema-hero');
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d', {alpha:false});
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  const button = document.querySelector('#motion-toggle');
  const cache = new Map();
  const pending = new Map();
  let paused = Boolean(saveData), requested = 0, raf = 0, lastDrawn = -1;
  const clamp = n => Math.min(1,Math.max(0,n));
  function loadSheet(index) {
    if (index < 0 || index > 7 || cache.has(index) || pending.has(index)) return;
    const img = new Image(); pending.set(index,img);
    img.onload = () => {
      pending.delete(index); cache.set(index,img);
      // Keep only the current neighbourhood decoded, rather than all 80 frames.
      const active = Math.floor(requested / 10);
      for (const key of cache.keys()) if (Math.abs(key-active)>1) cache.delete(key);
      if (index===active) schedule();
    };
    img.onerror = () => {pending.delete(index);};
    img.src = `assets/sequence/sheet-${index}.webp`;
  }
  function draw(frame) {
    const sheet = Math.floor(frame/10), img = cache.get(sheet);
    loadSheet(sheet);
    if (!img) return; // Retain the last good frame / initial poster while loading.
    if (lastDrawn===frame) return;
    const width=innerWidth,height=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5);
    if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)) {canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
    const scale=Math.max(canvas.width/800,canvas.height/450);
    ctx.drawImage(img,0,(frame%10)*450,800,450,(canvas.width-800*scale)/2,(canvas.height-450*scale)/2,800*scale,450*scale);
    canvas.style.opacity='1';lastDrawn=frame;
    if(!saveData){loadSheet(sheet+1);loadSheet(sheet-1);}
  }
  function update() {
    raf=0;
    const distance=Math.max(1,hero.offsetHeight-innerHeight);
    const p=clamp(scrollY/distance);
    const exit=clamp((p-.18)/.22), second=clamp((p-.43)/.24);
    hero.style.setProperty('--intro-exit',String(exit));
    hero.style.setProperty('--intro-visibility',exit===1?'hidden':'visible');
    hero.style.setProperty('--second-opacity',String(second));
    hero.style.setProperty('--second-visibility',second>0?'visible':'hidden');
    hero.style.setProperty('--second-events',second>.5?'auto':'none');
    if(reduced.matches || paused) return;
    const tail=clamp((scrollY-distance)/Math.max(1,document.documentElement.scrollHeight-innerHeight-distance));
    requested=Math.round((p*.7+tail*.3)*79);draw(requested);
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(update);}
  button.hidden=false;
  function updateButton(){button.textContent=paused?'Enable motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));button.hidden=reduced.matches;}
  button.addEventListener('click',()=>{paused=!paused;updateButton();schedule();});
  reduced.addEventListener('change',()=>{updateButton();schedule();});
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',()=>{lastDrawn=-1;schedule();},{passive:true});
  canvas.style.opacity='0';updateButton();schedule();
})();
