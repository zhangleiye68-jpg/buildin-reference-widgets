import {pad, calendarModel, progressModel, rangeModel, countdownModel, greetingModel, holidayModel, TimerModel} from './models.mjs';
import {readConfig, safeImageURL, sourceSundayFirst} from './config.mjs';

const root = document.querySelector('#widget');
const query = new URLSearchParams(location.search);
const mode = query.get('widget') || 'timer';
const words = {year:'Год',month:'Месяц',week:'Неделя'};
const weekdays = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
let config;
const element = (tag, className, text) => { const node = document.createElement(tag); if(className)node.className=className; if(text!==undefined)node.textContent=text; return node; };
const color = value => { if(typeof value!=='string')return null; const v=/^[a-f0-9]{6}$/i.test(value)?'#'+value:value; return CSS.supports('color',v)?v:null; };
const eventName = () => String(config.ru_name || config.name || 'Этот год');
const dayNoun = n => n%100>=11&&n%100<=14?'дней':n%10===1?'день':n%10>=2&&n%10<=4?'дня':'дней';
const dateText = now => now.toLocaleDateString('ru-RU',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
const refresh = (render, milliseconds) => { render(); if(milliseconds)setInterval(render,milliseconds); };
function mountTimer() {
  document.title='Таймер';
  const state=new TimerModel(), panel=element('section','timer'), digits=element('div','digits'), input=element('input'), button=element('button','', 'Старт');
  input.type='number'; input.min='0.01'; input.step='any'; input.placeholder='Время, мин'; input.setAttribute('aria-label','Продолжительность в минутах'); button.type='button';
  panel.append(digits,input,button); root.append(panel);
  const render=()=>{state.tick(Date.now());digits.textContent=state.text();button.textContent=state.running?'Стоп':'Старт';panel.dataset.running=String(state.running);panel.dataset.remaining=String(state.remaining);input.disabled=state.running;};
  button.onclick=()=>{if(state.running){state.stop();input.value='';}else{try{state.start(Date.now(),input.value);input.value='';}catch{input.setCustomValidity('Введите положительное число минут.');input.reportValidity();return;}}input.setCustomValidity('');render();};
  input.oninput=()=>input.setCustomValidity(''); refresh(render,100);
}
function mountClock() {
  document.title='Дата и время'; const panel=element('section','clock'), greeting=element('div','greeting'), date=element('div','date'), time=element('time');panel.append(greeting,date,time);root.append(panel);
  refresh(()=>{const now=new Date(), model=greetingModel(now);greeting.textContent=model.greeting;date.textContent=dateText(now);time.replaceChildren(document.createTextNode(model.time+' '),element('span','period',model.period));time.dateTime=now.toISOString();panel.dataset.hour12='true';},1000);
}
function calendarContent(now, purple=false) {
  const model=calendarModel(now,sourceSundayFirst(config)), panel=element('section','calendar'+(purple?' purple':''));
  const month=now.toLocaleDateString('ru-RU',{month:'long'});panel.append(element('h2','',month[0].toUpperCase()+month.slice(1)));
  const week=element('div','week'), dates=element('div','dates'), first=model.sunday?0:1;
  for(let i=0;i<7;i++)week.append(element('span','',weekdays[(i+first)%7]));
  const activeWeek=Math.floor((model.today+model.offset-1)/7);
  for(let index=0;index<42;index++) {const day=index-model.offset+1, valid=day>0&&day<=model.days;let classes=valid&&day===model.today?'today':'';if(purple&&Math.floor(index/7)===activeWeek)classes+=' active-week';const cell=element('span',classes,valid?day:'');if(valid)cell.dataset.day=String(day);dates.append(cell);}
  panel.append(week,dates);panel.dataset.sunday=String(model.sunday);panel.dataset.today=String(model.today);return panel;
}
function mountCalendar(purple) {
  document.title=purple?'Календарь настроения':'Календарь';
  const render=()=>{const now=new Date();root.replaceChildren();if(purple)root.append(calendarContent(now,true));else{const card=element('section','background-calendar'), big=element('div','big-date');big.append(element('div','weekday',now.toLocaleDateString('ru-RU',{weekday:'long'})),element('strong','',now.getDate()));card.append(big,calendarContent(now));root.append(card);}};refresh(render,30000);
}
function mountProgress(vertical=false) {
  document.title='Прогресс времени'; const panel=element('section',vertical?'vertical-progress':'time-progress');root.append(panel);
  const render=()=>{const now=new Date();panel.replaceChildren();for(const row of progressModel(now)){if(vertical){const item=element('div'), track=element('div','vtrack'),fill=element('div','vfill');fill.style.height=(row.value*100)+'%';track.append(fill);item.append(element('div','',words[row.id]),track,element('div','vnumber',`${row.current}/${row.total}`));panel.append(item);}else{const item=element('div','progress-row'),track=element('div','track'),fill=element('div','fill');fill.style.width=(row.value*100)+'%';track.append(fill);item.append(element('div','',words[row.id]),track,element('div','progress-number',`${row.current}/${row.total}`));panel.append(item);}}if(!vertical)panel.append(element('div','live-time',`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`));};refresh(render,1000);
}
function mountRange() {
  document.title='Прогресс периода';const panel=element('section','range');root.append(panel);
  refresh(()=>{const model=rangeModel(new Date(),config.start||config.date_range?.[0],config.end||config.date_range?.[1]);const track=element('div','track'), fill=element('div','fill');fill.style.width=(model.percent*100).toFixed(0)+'%';track.append(fill);const named=Boolean(config.name||config.ru_name),label=model.state==='before'?(named?`«${eventName()}»: период ещё не начался.`:'Год ещё не начался.'):model.state==='after'?(named?`«${eventName()}»: период завершён.`:'Год завершён.'):(named?`До конца периода «${eventName()}»: ${model.days} дн. ${model.hours} ч.`:`До конца года: ${model.days} дн. ${model.hours} ч.`);panel.replaceChildren(track,element('div','range-percent',(model.percent*100).toFixed(0)+'%'),element('p','',label));panel.dataset.state=model.state;},1000);
}
function mountCountdown() {
  document.title='Обратный отсчёт';const panel=element('section','countdown'),bg=color(config.bg_color),ink=color(config.font_color);if(bg)panel.style.setProperty('--card-background',bg);if(ink)panel.style.setProperty('--card-ink',ink);const background=String(config.background||'');if(/^[1-9][0-9]?$/.test(background)){const url=safeImageURL(`https://httishere.github.io/notion-widget/assets/days-card/card-bg-${background}.jpg`);if(url)panel.style.backgroundImage=`url("${url}")`;}root.append(panel);
  refresh(()=>{const day=String(config.day||`${new Date().getFullYear()}/12/31`),model=countdownModel(new Date(),day),noun=dayNoun(model.days),label=model.state==='future'?`${noun} ${noun==='день'?'остался':'осталось'}`:model.state==='past'?`${noun} ${noun==='день'?'прошёл':'прошло'}`:'';panel.replaceChildren(element('div','number',model.state==='today'?'Сегодня':model.days),element('div','days-label',label),element('div','event',eventName()),element('div','event-date',day));panel.dataset.state=model.state;panel.dataset.targetDay=day;},1000);
}
function mountDay() {
  document.title='Сегодня';const panel=element('section','day-clock');root.append(panel);refresh(()=>{const now=new Date(),track=element('div','track'),fill=element('div','fill');fill.style.width=((now.getHours()*3600+now.getMinutes()*60+now.getSeconds())/864)+'%';track.append(fill);panel.replaceChildren(element('div','kicker','Сейчас'),element('div','digits',`${pad(now.getHours())} ${pad(now.getMinutes())}`),element('div','date',`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${now.toLocaleDateString('ru-RU',{weekday:'long'})}`),track);},1000);
}
function mountWeek() {
  document.title='Дни недели';const panel=element('section','weekday-cells');root.append(panel);refresh(()=>{const day=new Date().getDay()||7;panel.replaceChildren();for(let i=1;i<=7;i++)panel.append(element('span',i<=day?'active':'',weekdays[i%7]));panel.dataset.activeDays=String(day);},30000);
}
function mountHolidays() {
  document.title='Праздники — 2025';const panel=element('section','holidays');root.append(panel);refresh(()=>{const rows=holidayModel(new Date()),head=element('div','holiday-heading'),grid=element('div','holiday-grid');head.append(element('span','','Праздники'),element('span','','2025'));for(const row of rows){const item=element('article',row.state);item.append(element('span','',row.name),element('em','',row.state==='past'?'✅':row.state==='active'?'Идёт':`через ${row.days} дн.`));grid.append(item);}const next=rows.find(r=>r.state==='future');panel.replaceChildren(head,grid);if(next)panel.append(element('p','holiday-next',`Следующий праздник через ${next.days} дн.`));panel.dataset.sourceYear='2025';},30000);
}
try {
  config=await readConfig(location.search);
  const requestedDark=query.get('dd')||(config.black?1:0);
  if(requestedDark===1||requestedDark==='1')document.documentElement.dataset.theme='dark';
  const ink=color(config.font_color);if(ink){document.documentElement.style.setProperty('--ink',ink);document.documentElement.style.setProperty('--accent',ink);}
  document.documentElement.dataset.widget=mode;
  const mounts={timer:mountTimer,clock:mountClock,'calendar-purple':()=>mountCalendar(true),'calendar-background':()=>mountCalendar(false),progress:()=>mountProgress(false),'progress-vertical':()=>mountProgress(true),range:mountRange,countdown:mountCountdown,day:mountDay,week:mountWeek,holidays:mountHolidays};
  if(!mounts[mode])throw Error('unknown_widget_mode');mounts[mode]();document.documentElement.dataset.ready='true';
}catch(error){root.replaceChildren(element('p','error','Не удалось прочитать настройки виджета. Исходные даты и параметры не заменены.'));document.documentElement.dataset.ready='error';document.documentElement.dataset.error=String(error.message||'configuration_error').replace(/[^a-z_]/g,'').slice(0,70);}
