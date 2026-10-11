'use strict';
(() => {
  const home = document.body.dataset.home || './';
  document.querySelectorAll('.nav-tools').forEach(el => el.hidden = false);
  const themeButtons = document.querySelectorAll('.theme-toggle');
  function updateThemeButtons() {
    const light = document.documentElement.dataset.theme === 'light';
    themeButtons.forEach(button => {
      button.innerHTML = light ? '☾ <span>Dark</span>' : '☀ <span>Light</span>';
      button.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f5f7f2' : '#0c1416');
  }
  themeButtons.forEach(button => button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('aflah-theme', theme); } catch {}
    updateThemeButtons();
  }));
  updateThemeButtons();

  const toolbar = document.querySelector('.project-toolbar');
  const catalog = document.querySelector('.project-catalog');
  if (toolbar && catalog) {
    toolbar.hidden = false;
    const cards = [...catalog.querySelectorAll('.project-card')];
    toolbar.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      toolbar.querySelectorAll('[data-filter]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      let count = 0;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
        if (show) { count++; card.classList.add('is-visible'); }
      });
      catalog.classList.toggle('is-filtered', filter !== 'all');
      toolbar.querySelector('.result-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
    }));
  }

  const shell = document.querySelector('.demo-shell');
  if (shell) {
    const plants = [
      {id:'tulsi',name:'Tulsi',scientific:'Ocimum tenuiflorum',type:'Herb',description:'An aromatic plant often grown in home gardens. This record shows how a labelled plant can connect to a simple digital learning page.',identification:'Opposite leaves, gently toothed edges and small flower spikes.'},
      {id:'neem',name:'Neem',scientific:'Azadirachta indica',type:'Tree',description:'A tree with compound leaves. A visitor can use a plant-label code to jump directly to the matching record in the collection.',identification:'Several narrow, toothed leaflets arranged along a central stalk.'},
      {id:'aloe-vera',name:'Aloe vera',scientific:'Aloe vera',type:'Succulent',description:'A succulent with thick leaves arranged in a rosette. The explorer keeps identification notes and a plant code together in one place.',identification:'Thick, fleshy leaves with small teeth along their edges.'}
    ];
    let selected = 'tulsi';
    const search = document.querySelector('#plant-search');
    const list = document.querySelector('#plant-list');
    function selectPlant(plant) {
      selected = plant.id;
      const values = {'plant-title':plant.name,'plant-scientific':plant.scientific,'plant-type':plant.type,'plant-description':plant.description,'plant-identification':plant.identification,'plant-code':`HERBIQ:${plant.id}`};
      Object.entries(values).forEach(([id,value])=>document.getElementById(id).textContent = value);
      list.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed', String(button.dataset.plant === selected)));
    }
    function renderPlants() {
      const query = search.value.trim().toLowerCase();
      const matches = plants.filter(p=>`${p.name} ${p.scientific} HERBIQ:${p.id} ${p.type}`.toLowerCase().includes(query));
      list.replaceChildren();
      matches.forEach(plant=>{
        const button = document.createElement('button');button.type='button';button.dataset.plant=plant.id;
        const name=document.createElement('strong');name.textContent=plant.name;
        const type=document.createElement('span');type.textContent=plant.type;
        button.append(name,type);button.setAttribute('aria-pressed',String(selected===plant.id));
        button.addEventListener('click',()=>selectPlant(plant));list.append(button);
      });
      document.querySelector('#plant-count').textContent = matches.length ? `${matches.length} ${matches.length===1?'plant':'plants'} found` : 'No matches. Try Tulsi, Neem or Aloe vera.';
      if (matches.length && !matches.some(p=>p.id===selected)) selectPlant(matches[0]);
      document.querySelector('.plant-detail').hidden = matches.length === 0;
    }
    search.addEventListener('input',renderPlants);
    document.querySelector('.demo-reset').addEventListener('click',()=>{search.value='';selected='tulsi';renderPlants();selectPlant(plants[0]);search.focus();});
    shell.hidden=false;renderPlants();selectPlant(plants[0]);
  }

  // A native modal keeps keyboard focus inside and handles Escape consistently.
  const commands = [
    ['Home','Section',`${home}#home`],['About Aflah','Section',`${home}#about`],['Projects','Section',`${home}#projects`],
    ['Skills','Section',`${home}#skills`],['Achievements','Section',`${home}#achievements`],['Journey','Section',`${home}#journey`],
    ['Contact','Section',`${home}#contact`],['Plant explorer demo','Interactive',`${home}#playground`],
    ['HerbiQ case study','Robotics',`${home}projects/herbiq.html`],['Kerala Routes case study','Games',`${home}projects/kerala-routes.html`],
    ['Kerala Sky Runner case study','Games',`${home}projects/sky-runner.html`],
    ['Email Aflah','Contact','mailto:aflahmanningal.afi@gmail.com'],['GitHub profile','External','https://github.com/AFLAHAFI'],
    ['HerbiQ website','External','https://herbiq-site.vercel.app/']
  ];
  const dialog=document.createElement('dialog');dialog.className='command-dialog';dialog.setAttribute('aria-labelledby','command-title');
  dialog.innerHTML='<div class="command-top"><h2 id="command-title">Where would you like to go?</h2><button type="button" class="command-close" aria-label="Close search">Esc</button></div><label class="sr-only" for="command-search">Search projects and sections</label><input id="command-search" type="search" placeholder="Search projects, sections, contact…" autocomplete="off"><p class="command-count" role="status" aria-live="polite"></p><ul class="command-results" aria-label="Search results"></ul><p class="command-help">↑ ↓ to move · Enter to open · Esc to close</p>';
  document.body.append(dialog);
  const input=dialog.querySelector('input'),results=dialog.querySelector('ul');
  let returnFocus=null;
  function renderCommands(){
    results.replaceChildren();
    const query=input.value.trim().toLowerCase();const matches=commands.filter(c=>`${c[0]} ${c[1]}`.toLowerCase().includes(query));
    matches.forEach(([label,type,url])=>{const li=document.createElement('li');const a=document.createElement('a');a.href=url;const title=document.createElement('span');title.textContent=label;const tag=document.createElement('small');tag.textContent=type;a.append(title,tag);a.addEventListener('click',()=>dialog.close());li.append(a);results.append(li)});
    dialog.querySelector('.command-count').textContent=matches.length?`${matches.length} results`:'No results. Try a project name or “contact”.';
  }
  function openCommands(){if(dialog.open)return;returnFocus=document.activeElement;input.value='';renderCommands();dialog.showModal();input.focus();}
  document.querySelectorAll('.command-trigger').forEach(b=>b.addEventListener('click',openCommands));
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();dialog.open?dialog.close():openCommands();}});
  dialog.querySelector('.command-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  input.addEventListener('input',renderCommands);
  dialog.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();dialog.close();return;}
    const anchors=[...results.querySelectorAll('a')],index=anchors.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();(anchors[Math.min(index+1,anchors.length-1)]||input).focus();}
    if(e.key==='ArrowUp'){e.preventDefault();(index<=0?input:anchors[index-1]).focus();}
    if(e.key==='Enter'&&document.activeElement===input&&anchors.length){e.preventDefault();anchors[0].click();}
  });

  // Split heading lines at their actual rendered positions, including mobile wraps.
  const headings=[...document.querySelectorAll('.section-heading h2, .about-copy h2, .journey-grid h2, .contact-section h2, .case-hero h1')];
  const originals=new Map(headings.map(h=>[h,h.innerHTML]));
  function splitHeadings(){
    headings.forEach(heading=>{
      heading.innerHTML=originals.get(heading);
      if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      const text=heading.innerText.trim();heading.setAttribute('aria-label',text);
      const chunks=heading.innerHTML.split(/(<br\s*\/?>)/i);heading.replaceChildren();
      chunks.forEach(chunk=>{
        if(/^<br/i.test(chunk)){heading.append(document.createElement('br'));return;}
        const temp=document.createElement('span');temp.innerHTML=chunk;
        temp.textContent.split(/\s+/).filter(Boolean).forEach(word=>{const span=document.createElement('span');span.className='heading-word';span.textContent=word;span.setAttribute('aria-hidden','true');heading.append(span,document.createTextNode(' '));});
      });
      const words=[...heading.querySelectorAll('.heading-word')];const tops=[];
      words.forEach(word=>{const top=word.offsetTop;if(!tops.some(t=>Math.abs(t-top)<3))tops.push(top);word.style.setProperty('--line-delay',`${tops.findIndex(t=>Math.abs(t-top)<3)*100}ms`);});
    });
  }
  splitHeadings();
  let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(splitHeadings,180);});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',splitHeadings);
})();
