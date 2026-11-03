const $=selector=>document.querySelector(selector);
const labels={ready:'可用',sample:'含示例内容','needs-review':'待复核',retired:'已停用参考',unavailable:'当前不可用',reference:'占位素材'};
const owners={self:'自制 · GitHub',community:'社区源码',external:'公开服务引用'};
let registry,entries=[];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=value=>/^https:\/\//.test(value||'')?esc(value):'#';
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),1800);}
function card(item){
  const inactive=['retired','unavailable','reference'].includes(item.status),dark=item.tags.includes('深色模板');
  const replacement=entries.find(e=>e.id===item.replacement_id);
  const aliases=item.aliases.filter(u=>u!==item.embed_url);
  const params=Object.entries(item.parameters).map(([key,value])=>`<p><code>${esc(key)}</code> = ${esc(value.example)} · ${esc(value.description)}</p>`).join('');
  const picture=item.preview?`<img src="${esc(item.preview)}" alt="${esc(item.name)}的${item.status==='retired'?'失效页面参考':'默认状态预览'}" loading="lazy" decoding="async" data-dark="${dark}">`:'<span>预览待补充</span>';
  return `<article class="card" id="${esc(item.id)}" data-id="${esc(item.id)}"><div class="preview">${picture}<span class="preview-label">${item.status==='retired'?'旧链接当前返回页面':item.kind==='asset'?'素材原图':'默认状态预览'}</span></div><div class="card-body"><div class="meta"><span>${esc(item.category)}</span><span class="badge ${esc(item.status)}">${labels[item.status]||'待复核'}</span><span>${owners[item.ownership]}</span></div><h2>${esc(item.name)}</h2><p class="desc">${esc(item.description)}</p><p class="size">${esc(item.language)} · 建议 ${item.recommended_size.width} × ${item.recommended_size.height} px</p>${item.notes.length?`<ul class="notes">${item.notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`:''}<div class="actions"><button type="button" data-copy="${esc(item.id)}" ${inactive?'disabled':''}>${inactive?'仅供参考':item.kind==='asset'?'复制素材链接':'复制嵌入链接'}</button><a href="${safe(item.embed_url)}" target="_blank" rel="noopener">${inactive?'打开参考':'打开'+(item.kind==='asset'?'素材':'组件')} ↗</a>${replacement?`<a href="#${esc(replacement.id)}" data-replacement="${esc(replacement.id)}">查看替代组件</a>`:''}</div><details class="details"><summary>来源、参数与使用说明</summary><div class="link-line">${item.code_url?`<a href="${safe(item.code_url)}" target="_blank" rel="noopener">查看源码</a>`:''}<a href="${safe(item.source_url)}" target="_blank" rel="noopener">原始来源</a>${item.license.url?`<a href="${safe(item.license.url)}" target="_blank" rel="noopener">许可与归属</a>`:''}</div><p>${esc(item.license.label)}</p>${item.dependencies.length?`<p>依赖：${item.dependencies.map(esc).join('、')}</p>`:'<p>不依赖第三方服务接口。</p>'}${params||'<p>使用完整地址即可；暂无额外参数说明。</p>'}${aliases.length?`<p>其他已收录版本／参数：</p>${aliases.map(u=>`<p><a href="${safe(u)}" target="_blank" rel="noopener">${esc(u)}</a></p>`).join('')}`:''}<p>检查：${esc(item.checked_at||registry.updated_at)} · ${esc(item.verification.level==='functional'?'含功能验收记录':item.verification.level==='preview'?'已检查页面预览':'参考条目，请按需复核')}</p></details><div class="catalog-id">${esc(item.id)}</div></div></article>`;
}
function render(){
  const query=$('#search').value.trim().toLowerCase();
  const result=entries.filter(item=>{
    if($('#category').value&&item.category!==$('#category').value)return false;
    if($('#kind').value&&item.kind!==$('#kind').value)return false;
    if($('#owner').value&&item.ownership!==$('#owner').value)return false;
    if($('#status').value&&item.status!==$('#status').value)return false;
    const haystack=[item.id,item.name,item.category,item.language,item.description,owners[item.ownership],labels[item.status],item.license.label,...item.tags,...item.notes].join(' ').toLowerCase();
    return !query||query.split(/\s+/).every(term=>haystack.includes(term));
  });
  $('#grid').innerHTML=result.map(card).join('');$('#result-count').textContent=`显示 ${result.length} / ${entries.length} 条`;$('#empty').hidden=result.length>0;
}
$('#filters').addEventListener('input',render);
$('#clear-filters').addEventListener('click',()=>{$('#filters').reset();render();});
$('#grid').addEventListener('click',async event=>{
  const copy=event.target.closest('[data-copy]');
  if(copy){const item=entries.find(e=>e.id===copy.dataset.copy);try{await navigator.clipboard.writeText(item.embed_url);toast('已复制完整地址');}catch{toast('复制暂不可用，请打开组件后复制地址');}return;}
  const replacement=event.target.closest('[data-replacement]');
  if(replacement){event.preventDefault();$('#filters').reset();render();document.getElementById(replacement.dataset.replacement)?.scrollIntoView({behavior:'smooth',block:'start'});}
});
(async()=>{try{
  const response=await fetch('./components.json');if(!response.ok)throw Error('目录加载失败');registry=await response.json();entries=[...registry.components,...registry.assets];
  $('#stats').innerHTML=`<span><b>${registry.components.length}</b>组件</span><span><b>${registry.assets.length}</b>素材</span><span>更新 ${esc(registry.updated_at)}</span>`;
  [...new Set(entries.map(e=>e.category))].forEach(category=>{const option=document.createElement('option');option.value=category;option.textContent=category;$('#category').append(option);});render();
}catch(error){$('#error').hidden=false;$('#error').textContent='组件目录暂时无法读取，请从 GitHub 仓库中的 docs/catalog/components.json 查看。';$('#stats').textContent='目录未加载';}})();
