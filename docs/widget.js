const app=document.getElementById('app');
const params=new URLSearchParams(location.search);
const view=params.get('view')||'timer';
const lang=params.get('lang')==='ru'?'ru':'en';
if(params.get('dashboard')==='1')document.body.classList.add('dashboard-embed');
document.documentElement.lang=lang;
const russian={
  'Pomodoro':'Помодоро','Short Break':'Короткий перерыв','Long Break':'Длинный перерыв',
  'Start':'Старт','Pause':'Пауза','Reset timer':'Сбросить таймер','Timer settings':'Настройки таймера',
  'Close':'Закрыть','DURATIONS IN MINUTES':'ДЛИТЕЛЬНОСТЬ В МИНУТАХ','Save settings':'Сохранить настройки',
  'Sky photo: Jeffrey Betts · CC0':'Фото неба: Jeffrey Betts · CC0',
  'Study for 1 hour':'Учёба: 1 час','PROGRESS WIDGET':'ПРОГРЕСС','BREAK WIDGET':'ПЕРЕРЫВ',
  'Open reading progress':'Открыть прогресс чтения','Read 20 pages':'Прочитать 20 страниц',
  'Decrease reading':'Уменьшить счётчик чтения','Add reading':'Добавить страницу',
  '25 minutes break':'Перерыв: 25 минут','Start break':'Начать перерыв','Pause break':'Пауза перерыва',
  'Tap the reading card for details. + / − saves instantly.':'Нажмите на карточку чтения, чтобы увидеть детали. Изменения сохраняются сразу.',
  'LOG PROGRESS':'ЗАПИСАТЬ ПРОГРЕСС','Pages read today':'Прочитано страниц сегодня',
  'Track a small win in your reading goal.':'Отмечайте каждый шаг к цели по чтению.',
  'Minus one':'Минус одна','Plus one':'Плюс одна','Pages read':'Прочитано страниц',
  'Goal: 20 pages':'Цель: 20 страниц','Changes save automatically':'Изменения сохраняются автоматически'
};
const t=(value)=>lang==='ru'?(russian[value]||value):value;
const storageSuffix=lang==='ru'?'-ru':'';
const readKey='buildin-reference-read-pages'+storageSuffix;
const timerKey='buildin-reference-pomodoro'+storageSuffix;
const studyKey='buildin-reference-study'+storageSuffix;
const breakKey='buildin-reference-break'+storageSuffix;
const safeGet=(key,defaultValue)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):defaultValue}catch{return defaultValue}};
const safeSet=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const mmss=(seconds)=>{const s=Math.max(0,Math.ceil(seconds));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const hhmmss=(seconds)=>{const s=Math.max(0,Math.ceil(seconds));return String(Math.floor(s/3600)).padStart(2,'0')+':'+mmss(s%3600)};
const remaining=(state)=>state.running?Math.max(0,Math.ceil((state.endAt-Date.now())/1000)):state.remaining;

function mountTimer(){
  const defaultSettings={focus:25,short:5,long:15};
  let state=safeGet(timerKey,{mode:'focus',running:false,remaining:1500,endAt:null,settings:defaultSettings});
  state.settings={...defaultSettings,...(state.settings||{})};
  const names={focus:t('Pomodoro'),short:t('Short Break'),long:t('Long Break')};
  const duration=mode=>state.settings[mode]*60;
  const save=()=>safeSet(timerKey,state);
  const modal=(content)=>{
    const back=document.createElement('div');back.className='backdrop';back.innerHTML=content;
    back.addEventListener('click',e=>{if(e.target===back||e.target.closest('[data-close]'))back.remove()});
    document.body.append(back);return back;
  };
  const render=()=>{
    if(remaining(state)<=0&&state.running){state.running=false;state.remaining=duration(state.mode);state.endAt=null;save()}
    app.innerHTML=`<section class="timer-page"><div class="timer"><div class="timer-inner">
      <div class="modes">${Object.entries(names).map(([id,label])=>`<button class="mode ${state.mode===id?'active':''}" data-mode="${id}">${label}</button>`).join('')}</div>
      <div class="time" aria-live="off">${mmss(remaining(state))}</div>
      <div class="controls"><button class="main-control ${state.running?'running':''}" id="start">${t(state.running?'Pause':'Start')}</button>
      <button class="icon-control" id="reset" aria-label="${t('Reset timer')}">↻</button>
      <button class="icon-control" id="settings" aria-label="${t('Timer settings')}">⚙</button></div>
      </div><span class="credit">${t('Sky photo: Jeffrey Betts · CC0')}</span></div></section>`;
    app.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{
      state.mode=b.dataset.mode;state.running=false;state.remaining=duration(state.mode);state.endAt=null;save();render()
    });
    app.querySelector('#start').onclick=()=>{
      if(state.running){state.remaining=remaining(state);state.running=false;state.endAt=null}
      else{state.running=true;state.endAt=Date.now()+state.remaining*1000}
      save();render()
    };
    app.querySelector('#reset').onclick=()=>{state.running=false;state.remaining=duration(state.mode);state.endAt=null;save();render()};
    app.querySelector('#settings').onclick=()=>{
      const back=modal(`<div class="modal" role="dialog" aria-modal="true" aria-label="${t('Timer settings')}">
        <div class="modal-head"><h2>${t('Timer settings')}</h2><button class="close" data-close aria-label="${t('Close')}">×</button></div>
        <div class="overline">${t('DURATIONS IN MINUTES')}</div><div class="settings-grid">
        ${Object.entries(names).map(([id,label])=>`<label>${label}<input type="number" min="1" max="180" name="${id}" value="${state.settings[id]}"></label>`).join('')}</div>
        <button class="save" id="save-settings">${t('Save settings')}</button></div>`);
      back.querySelector('#save-settings').onclick=()=>{
        for(const id of Object.keys(names))state.settings[id]=clamp(Number(back.querySelector('[name="'+id+'"]').value)||defaultSettings[id],1,180);
        state.running=false;state.remaining=duration(state.mode);state.endAt=null;save();back.remove();render()
      };
    };
  };
  render();
  setInterval(()=>{if(state.running){const t=app.querySelector('.time');if(t)t.textContent=mmss(remaining(state));if(remaining(state)<=0)render()}},500);
}

function mountProgress(){
  let read=clamp(Number(safeGet(readKey,0))||0,0,20);
  let study=safeGet(studyKey,{running:false,remaining:3620,endAt:null});
  let rest=safeGet(breakKey,{running:false,remaining:1500,endAt:null});
  let popIndex=0;
  const showChange=(delta,button)=>{
    const bounds=button.getBoundingClientRect();
    const pop=document.createElement('span');
    pop.className='change-pop';
    pop.textContent=delta>0?'+1':'−1';
    pop.setAttribute('aria-hidden','true');
    pop.style.left=`${bounds.left+bounds.width/2+(popIndex++%3-1)*8}px`;
    pop.style.top=`${bounds.top+bounds.height/2}px`;
    document.body.append(pop);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frames=reduced
      ? [{opacity:1},{opacity:0}]
      : [
          {transform:'translate(-50%,-20%) scale(.75)',opacity:0},
          {transform:'translate(-50%,-65%) scale(1.15)',opacity:1,offset:.18},
          {transform:'translate(-50%,calc(-50% - 52px)) scale(1)',opacity:0}
        ];
    const animation=pop.animate(frames,{duration:reduced?160:650,easing:'cubic-bezier(.18,.67,.2,1)',fill:'forwards'});
    animation.addEventListener('finish',()=>pop.remove(),{once:true});
  };
  const setRead=(value,button)=>{
    const next=clamp(Number(value)||0,0,20);
    if(next===read){
      const amount=document.querySelector('.backdrop #amount');
      if(amount)amount.value=read;
      return;
    }
    const delta=next-read;
    read=next;
    safeSet(readKey,read);
    const number=app.querySelector('.small-number');
    const progress=app.querySelector('.reading-progress');
    if(number)number.textContent=`${read} / 20`;
    if(progress)progress.style.width=`${read*5}%`;
    const amount=document.querySelector('.backdrop #amount');
    const fill=document.querySelector('.backdrop #fill');
    if(amount)amount.value=read;
    if(fill)fill.style.width=`${read*5}%`;
    if(button&&Math.abs(delta)===1)showChange(delta,button);
  };
  const modal=(content)=>{
    const back=document.createElement('div');back.className='backdrop';back.innerHTML=content;
    back.addEventListener('click',e=>{if(e.target===back||e.target.closest('[data-close]'))back.remove()});
    document.body.append(back);return back;
  };
  const toggle=(which)=>{
    const state=which==='study'?study:rest,key=which==='study'?studyKey:breakKey;
    if(state.running){state.remaining=remaining(state);state.running=false;state.endAt=null}
    else{state.running=true;state.endAt=Date.now()+state.remaining*1000}
    safeSet(key,state);render()
  };
  const render=()=>{
    app.innerHTML=`<section class="progress-page"><div class="widget-grid">
      <div class="study"><div class="study-time">${hhmmss(remaining(study))}</div><div class="study-label">${t('Study for 1 hour')}</div>
      <button class="study-toggle" id="study-toggle">${t(study.running?'Pause':'Start')}</button>
      <div class="study-land"></div><div class="panda" aria-hidden="true">🐼</div><div class="study-footer">${hhmmss(remaining(study))}</div></div>
      <div class="small-group"><div><p class="byline">${t('PROGRESS WIDGET')}</p><div class="small-card reading" id="reading" role="button" tabindex="0" aria-label="${t('Open reading progress')}">
        <div class="reading-progress" style="width:${read*5}%"></div>
        <div class="small-icon">📖</div><div class="small-body"><div class="small-number" aria-live="polite" aria-atomic="true">${read} / 20</div><div class="small-label">${t('Read 20 pages')}</div></div>
        <div class="small-actions"><button class="mini-button" id="read-minus" aria-label="${t('Decrease reading')}">−</button><button class="mini-button" id="read-plus" aria-label="${t('Add reading')}">+</button></div>
      </div></div><div><p class="byline">${t('BREAK WIDGET')}</p><div class="small-card"><div class="small-icon">🍩</div>
        <div class="small-body"><div class="small-number" id="break-time">${mmss(remaining(rest))}</div><div class="small-label">${t('25 minutes break')}</div></div>
        <button class="play-button ${rest.running?'running':''}" id="break-toggle" aria-label="${t(rest.running?'Pause break':'Start break')}">${rest.running?'Ⅱ':'▶'}</button>
      </div></div><div class="widget-caption">${t('Tap the reading card for details. + / − saves instantly.')}</div></div>
    </div></section>`;
    const openRead=()=>{
      const back=modal(`<div class="modal" role="dialog" aria-modal="true" aria-label="${t('Read 20 pages')}">
        <div class="modal-head"><h2>${t('Read 20 pages')}</h2><button class="close" data-close aria-label="${t('Close')}">×</button></div>
        <div class="overline">${t('LOG PROGRESS')}</div><div class="modal-label">${t('Pages read today')}</div>
        <div class="help">${t('Track a small win in your reading goal.')}</div>
        <div class="stepper"><button id="minus" aria-label="${t('Minus one')}">−</button><input id="amount" type="number" min="0" max="20" value="${read}" aria-label="${t('Pages read')}"><button id="plus" aria-label="${t('Plus one')}">+</button></div>
        <div class="goal-line">${t('Goal: 20 pages')}</div><div class="progress-track"><div class="progress-fill" id="fill" style="width:${read*5}%"></div></div>
        <p class="autosave-note">${t('Changes save automatically')}</p></div>`);
      const amount=back.querySelector('#amount');
      back.querySelector('#minus').onclick=e=>setRead(read-1,e.currentTarget);
      back.querySelector('#plus').onclick=e=>setRead(read+1,e.currentTarget);
      amount.onchange=()=>setRead(amount.value);
      amount.onkeydown=e=>{if(e.key==='Enter')amount.blur()};
      amount.focus();
    };
    app.querySelector('#reading').onclick=()=>openRead();
    app.querySelector('#reading').onkeydown=e=>{if(e.target===e.currentTarget&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openRead()}};
    app.querySelector('#read-minus').onclick=e=>{e.stopPropagation();setRead(read-1,e.currentTarget)};
    app.querySelector('#read-plus').onclick=e=>{e.stopPropagation();setRead(read+1,e.currentTarget)};
    app.querySelector('#break-toggle').onclick=()=>toggle('break');
    app.querySelector('#study-toggle').onclick=()=>toggle('study');
  };
  render();
  setInterval(()=>{
    if(study.running){if(remaining(study)<=0){study.running=false;study.remaining=3620;safeSet(studyKey,study);render()}else{const x=hhmmss(remaining(study));const a=app.querySelector('.study-time'),b=app.querySelector('.study-footer');if(a)a.textContent=x;if(b)b.textContent=x}}
    if(rest.running){if(remaining(rest)<=0){rest.running=false;rest.remaining=1500;safeSet(breakKey,rest);render()}else{const b=app.querySelector('#break-time');if(b)b.textContent=mmss(remaining(rest))}}
  },500);
}

if(view==='progress')mountProgress();else mountTimer();
