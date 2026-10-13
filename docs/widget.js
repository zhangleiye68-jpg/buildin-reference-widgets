const app=document.getElementById('app');
const params=new URLSearchParams(location.search);
const view=window.__widgetView||params.get('view')||'timer';
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
  'Goal: 20 pages':'Цель: 20 страниц','Changes save automatically':'Изменения сохраняются автоматически',
  'HOUR':'ЧАС','MINUTE':'МИНУТА',
  'Sounds':'Звуки','Favorites':'Избранное','About':'О проекте','Links':'Ссылки',
  'A SOFT':'ТИХИЙ','MURMUR':'ШЁПОТ',
  'Ambient sounds to wash away distraction.':'Фоновые звуки, которые помогают сосредоточиться.',
  'Download':'Скачать','Play ambient sounds':'Включить фоновые звуки',
  'Pause ambient sounds':'Поставить фоновые звуки на паузу','Timer':'Таймер',
  'Rain':'Дождь','Waves':'Волны','Fire':'Огонь'
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

function mountFlipClock(){
  const render=()=>{
    const now=new Date();
    const hour=String(now.getHours()).padStart(2,'0');
    const minute=String(now.getMinutes()).padStart(2,'0');
    const weekday=now.toLocaleDateString(lang==='ru'?'ru-RU':'en-US',{weekday:'long'});
    const date=now.toLocaleDateString(lang==='ru'?'ru-RU':'en-US',{month:'long',day:'numeric'});
    app.innerHTML=`<section class="flip-page"><div class="flip-clock" aria-label="${hour}:${minute}">
      <div class="flip-unit"><strong>${hour}</strong><span>${t('HOUR')}</span></div>
      <div class="flip-unit"><strong>${minute}</strong><span>${t('MINUTE')}</span></div>
      <div class="flip-meta"><b>${weekday}</b><span>${date}</span></div>
    </div></section>`;
  };
  render();
  setInterval(render,1000);
}

function mountAmbient(){
  let audioContext=null;
  let master=null;
  let playing=false;
  const selected=new Set(['rain']);
  const activeNodes=new Map();
  const ensureAudio=()=>{
    if(audioContext)return;
    audioContext=new (window.AudioContext||window.webkitAudioContext)();
    master=audioContext.createGain();
    master.gain.value=.22;
    master.connect(audioContext.destination);
  };
  const noiseBuffer=()=>{
    const length=audioContext.sampleRate*2;
    const buffer=audioContext.createBuffer(1,length,audioContext.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<length;i++)data[i]=Math.random()*2-1;
    return buffer;
  };
  const startSound=(name)=>{
    if(activeNodes.has(name))return;
    ensureAudio();
    const source=audioContext.createBufferSource();
    source.buffer=noiseBuffer();
    source.loop=true;
    const filter=audioContext.createBiquadFilter();
    const gain=audioContext.createGain();
    if(name==='rain'){
      filter.type='highpass';filter.frequency.value=1200;gain.gain.value=.7;
    }else if(name==='waves'){
      filter.type='lowpass';filter.frequency.value=420;gain.gain.value=.8;
      const lfo=audioContext.createOscillator();const lfoGain=audioContext.createGain();
      lfo.frequency.value=.12;lfoGain.gain.value=.42;lfo.connect(lfoGain);lfoGain.connect(gain.gain);lfo.start();
      activeNodes.set(name,{source,lfo});
    }else{
      filter.type='bandpass';filter.frequency.value=520;filter.Q.value=.65;gain.gain.value=.55;
    }
    source.connect(filter);filter.connect(gain);gain.connect(master);source.start();
    if(!activeNodes.has(name))activeNodes.set(name,{source});
  };
  const stopSound=(name)=>{
    const node=activeNodes.get(name);if(!node)return;
    try{node.source.stop()}catch{};try{node.lfo&&node.lfo.stop()}catch{};activeNodes.delete(name);
  };
  const sync=()=>{
    ['rain','waves','fire'].forEach(name=>playing&&selected.has(name)?startSound(name):stopSound(name));
    document.querySelectorAll('[data-sound]').forEach(button=>button.classList.toggle('active',selected.has(button.dataset.sound)));
    const play=app.querySelector('#ambient-play');
    if(play){play.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',t(playing?'Pause ambient sounds':'Play ambient sounds'))}
  };
  app.innerHTML=`<section class="ambient-page"><div class="ambient-player">
    <div class="ambient-nav"><span>${t('Sounds')}</span><span>${t('Favorites')}</span><span>${t('About')}</span><span>${t('Links')}</span></div>
    <h1>${t('A SOFT')}<br>${t('MURMUR')}</h1><p>${t('Ambient sounds to wash away distraction.')}</p>
    <div class="ambient-controls"><button class="ambient-round" aria-label="${t('Download')}">↓</button><button class="ambient-play" id="ambient-play" aria-label="${t('Play ambient sounds')}">▶</button><button class="ambient-round" aria-label="${t('Timer')}">◷</button></div>
    <div class="ambient-sounds"><button data-sound="rain">${t('Rain')}</button><button data-sound="waves">${t('Waves')}</button><button data-sound="fire">${t('Fire')}</button></div>
  </div></section>`;
  app.querySelector('#ambient-play').onclick=async()=>{ensureAudio();await audioContext.resume();playing=!playing;sync()};
  app.querySelectorAll('[data-sound]').forEach(button=>button.onclick=async()=>{
    ensureAudio();await audioContext.resume();const name=button.dataset.sound;
    selected.has(name)?selected.delete(name):selected.add(name);sync();
  });
  sync();
}

function mountMedClock(){
  const render=()=>{
    const now=new Date();
    const parts=[now.getHours(),now.getMinutes(),now.getSeconds()].map(value=>String(value).padStart(2,'0'));
    const weekday=now.toLocaleDateString('ru-RU',{weekday:'long'});
    const fullDate=now.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
    app.innerHTML=`<section class="med-clock-page"><div class="med-clock-card">
      <div class="med-clock-kicker"><span>Прекрасного дня!</span><span class="med-sun" aria-hidden="true">☀</span></div>
      <div class="med-clock-digits" aria-label="${parts.join(':')}">${parts.map((part,index)=>`${index?'<i>:</i>':''}<strong>${part}</strong>`).join('')}</div>
      <div class="med-clock-date"><b>${weekday}</b><span>${fullDate}</span></div>
      <div class="med-clock-leaf" aria-hidden="true">🍋</div>
    </div></section>`;
  };
  render();
  setInterval(render,1000);
}

function mountMedProgress(){
  const key='buildin-mediterranean-progress-v1';
  let state=safeGet(key,{week:68,reading:7,tasks:4});
  const save=()=>safeSet(key,state);
  const render=()=>{
    const rows=[
      {id:'week',icon:'☀',label:'Учёба на неделе',value:state.week,max:100,suffix:'%'},
      {id:'reading',icon:'📖',label:'Прочитано страниц',value:state.reading,max:20,suffix:'/20'},
      {id:'tasks',icon:'✓',label:'Завершено задач',value:state.tasks,max:6,suffix:'/6'}
    ];
    app.innerHTML=`<section class="med-progress-page"><div class="med-progress-card">
      <header><div><span class="med-eyebrow">МОЙ ПРОГРЕСС</span><h1>Спокойно к цели</h1></div><span class="med-lemon" aria-hidden="true">🍋</span></header>
      <div class="med-progress-list">${rows.map(row=>`<div class="med-progress-row">
        <div class="med-progress-line"><span><i>${row.icon}</i>${row.label}</span><b>${row.value}${row.suffix}</b></div>
        <div class="med-progress-track"><span style="width:${clamp(row.value/row.max*100,0,100)}%"></span></div>
        ${row.id==='week'?'':`<div class="med-progress-actions"><button data-id="${row.id}" data-delta="-1" aria-label="Уменьшить">−</button><button data-id="${row.id}" data-delta="1" aria-label="Увеличить">+</button></div>`}
      </div>`).join('')}</div>
      <p>Маленькие шаги ведут к большим горизонтам</p>
    </div></section>`;
    app.querySelectorAll('[data-id]').forEach(button=>button.onclick=()=>{
      const id=button.dataset.id;
      const max=id==='reading'?20:6;
      state[id]=clamp(Number(state[id])+Number(button.dataset.delta),0,max);
      save();render();
    });
  };
  render();
}

function mountMedCalendar(){
  let cursor=new Date(2026,8,1);
  const events={
    '2026-09-01':['Прочитать гл. 3'],
    '2026-09-03':['Лаб. отчёт'],
    '2026-09-05':['День на пляже'],
    '2026-09-08':['План эссе'],
    '2026-09-11':['Учебная группа'],
    '2026-09-14':['Подготовка к сессии'],
    '2026-09-18':['Встреча группы'],
    '2026-09-22':['Анализ статьи'],
    '2026-09-25':['День библиотеки'],
    '2026-09-29':['Черновик проекта']
  };
  const pad=value=>String(value).padStart(2,'0');
  const render=()=>{
    const year=cursor.getFullYear(),month=cursor.getMonth();
    const first=(new Date(year,month,1).getDay()+6)%7;
    const total=new Date(year,month+1,0).getDate();
    const previous=new Date(year,month,0).getDate();
    const cells=[];
    for(let i=0;i<42;i++){
      const day=i-first+1;
      let date,muted=false;
      if(day<1){date=previous+day;muted=true}else if(day>total){date=day-total;muted=true}else date=day;
      const key=muted?'':`${year}-${pad(month+1)}-${pad(date)}`;
      const labels=events[key]||[];
      cells.push(`<div class="med-cal-cell ${muted?'muted':''}"><span>${date}</span>${labels.slice(0,1).map(label=>`<b>${label}</b>`).join('')}</div>`);
    }
    const title=cursor.toLocaleDateString('ru-RU',{month:'long',year:'numeric'});
    app.innerHTML=`<section class="med-calendar-page"><div class="med-calendar">
      <header><button id="med-prev" aria-label="Предыдущий месяц">‹</button><h1>${title}</h1><button id="med-next" aria-label="Следующий месяц">›</button></header>
      <div class="med-cal-week">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(day=>`<b>${day}</b>`).join('')}</div>
      <div class="med-cal-grid">${cells.join('')}</div>
      <footer><span>● Учёба</span><span>● Личное</span><span>● Проекты</span></footer>
    </div></section>`;
    app.querySelector('#med-prev').onclick=()=>{cursor=new Date(year,month-1,1);render()};
    app.querySelector('#med-next').onclick=()=>{cursor=new Date(year,month+1,1);render()};
  };
  render();
}

function mountMedMusic(){
  let playing=false;
  let startedAt=0;
  let elapsed=32;
  let audioContext=null;
  let master=null;
  let timer=null;
  const duration=201;
  const fmt=seconds=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
  const startSound=()=>{
    audioContext=new (window.AudioContext||window.webkitAudioContext)();
    master=audioContext.createGain();master.gain.value=.055;master.connect(audioContext.destination);
    const notes=[261.63,329.63,392,493.88];
    notes.forEach((frequency,index)=>{
      const osc=audioContext.createOscillator();
      const gain=audioContext.createGain();
      osc.type=index%2?'sine':'triangle';osc.frequency.value=frequency/2;
      gain.gain.value=index===0?.38:.16;
      osc.connect(gain);gain.connect(master);osc.start();
    });
  };
  const stopSound=()=>{if(audioContext){audioContext.close();audioContext=null;master=null}};
  const update=()=>{
    if(playing)elapsed=Math.min(duration,elapsed+(Date.now()-startedAt)/1000),startedAt=Date.now();
    const fill=app.querySelector('.med-music-fill');
    const current=app.querySelector('#med-current');
    if(fill)fill.style.width=`${elapsed/duration*100}%`;
    if(current)current.textContent=fmt(elapsed);
    if(elapsed>=duration){playing=false;elapsed=0;stopSound();render()}
  };
  const render=()=>{
    app.innerHTML=`<section class="med-music-page"><div class="med-music-card">
      <div class="med-music-top"><span>Сейчас играет</span><span aria-hidden="true">⋯</span></div>
      <div class="med-music-main"><div class="med-album" aria-hidden="true"><span>☀</span><i>≈</i></div><div class="med-track"><h1>Солнечный день</h1><p>Береговой ансамбль</p></div><button class="med-heart" aria-label="Добавить в избранное">♡</button></div>
      <div class="med-music-progress" id="med-seek"><span class="med-music-fill" style="width:${elapsed/duration*100}%"></span></div>
      <div class="med-music-time"><span id="med-current">${fmt(elapsed)}</span><span>${fmt(duration)}</span></div>
      <div class="med-music-controls"><button aria-label="Перемешать">⌁</button><button id="med-prev-track" aria-label="Предыдущая">◀</button><button class="med-play" id="med-play" aria-label="${playing?'Пауза':'Воспроизвести'}">${playing?'Ⅱ':'▶'}</button><button id="med-next-track" aria-label="Следующая">▶</button><button aria-label="Повтор">↻</button></div>
    </div></section>`;
    app.querySelector('#med-play').onclick=()=>{
      update();playing=!playing;
      if(playing){startedAt=Date.now();startSound();timer=setInterval(update,500)}
      else{clearInterval(timer);stopSound()}
      render();
    };
    const restart=()=>{elapsed=0;startedAt=Date.now();update()};
    app.querySelector('#med-prev-track').onclick=restart;
    app.querySelector('#med-next-track').onclick=restart;
    app.querySelector('#med-seek').onclick=event=>{
      const box=event.currentTarget.getBoundingClientRect();elapsed=clamp((event.clientX-box.left)/box.width*duration,0,duration);startedAt=Date.now();update();
    };
  };
  render();
}

if(view==='med-clock')mountMedClock();
else if(view==='med-progress')mountMedProgress();
else if(view==='med-calendar')mountMedCalendar();
else if(view==='med-music')mountMedMusic();
else if(view==='progress')mountProgress();
else if(view==='flipclock')mountFlipClock();
else if(view==='ambient')mountAmbient();
else mountTimer();
