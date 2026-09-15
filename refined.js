/* Local bilingual design preview. No checkout or remote submission. */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const query=new URLSearchParams(location.search);
let storedLanguage;try{storedLanguage=localStorage.getItem('oukka-language')}catch{}
const lang=(query.get('lang')||storedLanguage)==='en'?'en':'zh';
const tr=(zh,en)=>lang==='en'?en:zh;
document.documentElement.lang=lang==='en'?'en':'zh-Hans';
try{localStorage.setItem('oukka-language',lang)}catch{}
const localLink=(href)=>{const u=new URL(href,location.href);u.searchParams.set('lang',lang);return u.pathname+u.search+u.hash};
$$('[data-en]').forEach(node=>{if(lang==='en')node.innerHTML=node.dataset.en});
$$('[data-alt-en]').forEach(node=>{if(lang==='en')node.alt=node.dataset.altEn});
$('.gallery-expand')?.setAttribute('aria-label',tr('打开完整图片','Open full image'));
$('.gallery-thumbs')?.setAttribute('aria-label',tr('商品图片','Product images'));
$('.language-nav')?.setAttribute('aria-label',tr('语言','Language'));
if(lang==='en')$('meta[name=description]')?.setAttribute('content','OUKKA is a design brand that rethinks everyday objects.');
$$('a[href]').forEach(a=>{
 const raw=a.getAttribute('href');
 if(a.hasAttribute('data-language')){
  const u=new URL(location.href);u.searchParams.set('lang',a.dataset.language);a.href=u.pathname+u.search+u.hash;
  if(a.dataset.language===lang)a.setAttribute('aria-current','true');
 }else if(raw&&!raw.startsWith('#')&&new URL(raw,location.href).origin===location.origin)a.href=localLink(raw);
});
function refreshLanguageLinks(){
 $$('[data-language]').forEach(a=>{const u=new URL(location.href);u.searchParams.set('lang',a.dataset.language);a.href=u.pathname+u.search+u.hash});
}
window.addEventListener('hashchange',refreshLanguageLinks);
refreshLanguageLinks();
$$('.desktop-nav a').forEach(a=>{const path=location.pathname;const active=a.pathname===path||(path.includes('refined-ou4')&&a.pathname.endsWith('refined-shop.html'));if(active)a.setAttribute('aria-current','page')});
const menuLinks=$('.desktop-nav').innerHTML;
const closeLabel=tr('关闭','Close');
document.body.insertAdjacentHTML('beforeend',`
<dialog class="menu-dialog" id="menu-dialog" aria-labelledby="menu-title"><div class="dialog-head"><h2 id="menu-title"><img class="official-wordmark" src="assets/oukka-approved-wordmark.jpg" width="416" height="416" alt="OUKKA"></h2><button type="button" data-close>${closeLabel} ×</button></div><nav class="menu-links" aria-label="${tr('主导航','Main navigation')}">${menuLinks}</nav><p>${tr('日常用品<br>重新设计','Everyday objects<br>reconsidered')}</p></dialog>
<dialog class="cart-dialog" id="cart-dialog" aria-labelledby="cart-title"><div class="dialog-head"><h2 id="cart-title">${tr('购物袋','Your bag')}</h2><button type="button" data-close>${closeLabel} ×</button></div><div class="cart-content"></div></dialog>
<dialog class="film-dialog" id="film-dialog" aria-labelledby="film-title"><div class="dialog-head"><h2 id="film-title">${tr('生活不只一面','Life has more than one side')}</h2><button type="button" data-close>${closeLabel} ×</button></div><video controls playsinline preload="none" poster="assets/oukka-city-20260908.webp"><source src="assets/oukka-life-sequence-20260908.mp4" type="video/mp4"></video><p class="media-note">${tr('AI 概念摄影序列 由三张静态影像剪辑 并非实拍动态影片','An AI photographic study edited from three stills, not live-action footage.')} <a href="${localLink('refined-life.html#credits')}">${tr('素材说明','Image credits')} ↗</a></p></dialog>
<dialog class="zoom-dialog" id="zoom-dialog" aria-labelledby="zoom-title"><div class="dialog-head"><h2 id="zoom-title"></h2><div class="zoom-controls"><button type="button" data-zoom-step="-1" aria-label="${tr('上一张','Previous image')}">←</button><button type="button" data-zoom-step="1" aria-label="${tr('下一张','Next image')}">→</button><button type="button" data-zoom-scale="1" aria-pressed="true">1×</button><button type="button" data-zoom-scale="2" aria-pressed="false">2×</button><button type="button" data-close>${closeLabel} ×</button></div></div><div class="zoom-viewport" tabindex="0" aria-label="${tr('放大图片 可拖动或滑动查看','Zoomed image. Drag or scroll to explore.')}"><div class="zoom-canvas"><img alt="" draggable="false"></div></div></dialog>
<dialog class="content-dialog" id="preview-dialog" aria-labelledby="preview-title"><div class="dialog-head"><h2 id="preview-title">${tr('设计预览说明','About this preview')}</h2><button type="button" data-close>${closeLabel} ×</button></div><div class="dialog-content"><h3>Design What<br>Deserves to Stay</h3><p>${tr('目前以设计确认与中英文阅读体验为重点。购物袋为本机演示，不接收订单或付款。Shopify 串接与正式交付将在设计确认后处理。','This preview focuses on design and the Chinese and English reading experience. The bag is a local demonstration. Orders, payments and email subscriptions are not active. Shopify integration follows design approval.')}</p><p>${tr('产品图片为现有样品。OU4100 价格与已确认规格来自现有产品资料；可售库存、配送与退换条件仍须在销售前确认。PHASE 04 - TOTE 的规格与 ¥992 标价已按产品资料更新，正式发售与库存待确认。','Product photographs show current samples. OU4100 pricing and confirmed specifications follow the product brief. Stock, delivery and returns require confirmation before sales open. PHASE 04 - TOTE specifications and its CNY 992 price follow product records. Release and stock are pending confirmation.')}</p><p>${tr('Phase 0 只使用已选定的桌子与展厅照片。正式产品 QR 会在档案与网址核准后生成。','Phase 0 uses only the approved table and showroom photographs. Final product QR codes follow approval of the records and URLs.')}</p><p>${tr('Instagram 与 Facebook 已加入页脚版面，正式账号网址提供后再启用外部链接。','Instagram and Facebook are placed in the footer. External links will be activated when the official account URLs are provided.')}</p></div></dialog><div class="toast" role="status" hidden></div>`);
let toastTimer;
function notify(message){
 clearTimeout(toastTimer);
 const active=$('dialog[open]');let region=active?.querySelector('.dialog-status');
 if(active&&!region){region=document.createElement('p');region.className='dialog-status';region.setAttribute('role','status');active.append(region)}
 if(active){region.textContent=message;region.hidden=false;return}
 $('.toast').textContent=message;$('.toast').hidden=false;toastTimer=setTimeout(()=>$('.toast').hidden=true,4000);
}
const dialogs=$$('dialog'),ambient=$('[data-ambient-video]'),film=$('#film-dialog video'),lifeVideo=$('[data-life-video]');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let userPaused=!!ambient?.hasAttribute('data-start-paused')||reduced.matches||!!navigator.connection?.saveData,heroVisible=true;
function syncMotion(){
 const button=$('[data-motion-toggle]');if(!button||!ambient)return;
 button.textContent=ambient.paused?tr('播放摄影序列 ▷','Play sequence ▷'):tr('暂停摄影序列 Ⅱ','Pause sequence Ⅱ');
 button.setAttribute('aria-pressed',String(!ambient.paused));
 ambient.classList.toggle('is-playing',!ambient.paused);
}
async function updateAmbient(){
 if(!ambient)return;
 if(userPaused||!heroVisible||document.hidden||dialogs.some(d=>d.open)){ambient.pause();syncMotion();return}
 try{await ambient.play()}catch{}syncMotion();
}
const returnFocus=new WeakMap();
function openDialog(id){
 const dialog=document.getElementById(id);if(!dialog)return;
 returnFocus.set(dialog,document.activeElement);
 dialogs.forEach(d=>{if(d.open&&d!==dialog)d.close()});
 if(!dialog.open)dialog.showModal();
 if(id==='menu-dialog')$$('[data-menu-open]').forEach(b=>b.setAttribute('aria-expanded','true'));
 const status=$('.dialog-status',dialog);if(status)status.hidden=true;
 updateAmbient();
}
dialogs.forEach(d=>{
 $('[data-close]',d).addEventListener('click',()=>d.close());
 d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()});
 d.addEventListener('close',()=>{if(d.id==='menu-dialog')$$('[data-menu-open]').forEach(b=>b.setAttribute('aria-expanded','false'));if(d.id==='film-dialog')film.pause();returnFocus.get(d)?.focus();updateAmbient()});
});
$$('[data-menu-open]').forEach(b=>{b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-controls','menu-dialog');b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>openDialog('menu-dialog'))});
const footerBottom=$('.footer-bottom');
if(footerBottom&&!$('.footer-social',footerBottom))footerBottom.insertAdjacentHTML('beforeend',`<nav class="footer-social" aria-label="Social"><button type="button" data-preview-open>Instagram</button><button type="button" data-preview-open>Facebook</button></nav>`);
$$('[data-preview-open]').forEach(b=>b.addEventListener('click',()=>openDialog('preview-dialog')));
if(ambient){
 // Keep each portrait framed on narrow screens without changing the film itself.
 ambient.addEventListener('timeupdate',()=>{ambient.style.setProperty('--film-focus',ambient.currentTime>=4&&ambient.currentTime<8?'40%':'63%')});
 ambient.addEventListener('play',syncMotion);ambient.addEventListener('pause',syncMotion);
 ambient.addEventListener('error',()=>{userPaused=true;syncMotion()});
 $('[data-motion-toggle]').addEventListener('click',()=>{userPaused=!ambient.paused;updateAmbient()});
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{heroVisible=e.isIntersecting;updateAmbient();$('[data-header]').classList.toggle('is-scrolled',!e.isIntersecting)},{rootMargin:'-76px 0px 0px'}).observe($('.hero'));else updateAmbient();
}
reduced.addEventListener('change',e=>{if(e.matches)userPaused=true;updateAmbient()});
document.addEventListener('visibilitychange',()=>{updateAmbient();if(document.hidden){film.pause();lifeVideo?.pause()}});
$$('[data-film-open]').forEach(b=>b.addEventListener('click',async()=>{openDialog('film-dialog');lifeVideo?.pause();try{await film.play()}catch{}}));
film.addEventListener('error',()=>notify(tr('影片暂时无法播放','This film could not be played')));
const gallery4100ByColour={"black":[["edition-20260912/tote00-black-front.webp","黑色 圆点面","Black dot-print face"],["edition-20260912/tote00-black-angle.webp","黑色 字标面","Black wordmark face"],["edition-20260912/t00-canvas.webp","黑色 帆布织标","Black canvas and label"],["edition-20260912/t00-interior.webp","黑色 现有样品内部","Black current sample interior"],["edition-20260912/t00-handle.webp","黑色 提把","Black handles"]],"navy":[["edition-20260912/tote00-navy-front.webp","藏青色 圆点面","Navy dot-print face"],["edition-20260912/tote00-navy-angle.webp","藏青色 字标面","Navy wordmark face"]],"green":[["edition-20260912/tote00-green-front.webp","绿色 圆点面","Green dot-print face"],["edition-20260912/tote00-green-angle.webp","绿色 字标面","Green wordmark face"]],"yellow":[["edition-20260912/tote00-yellow-front.webp","黄色 圆点面","Yellow dot-print face"],["edition-20260912/tote00-yellow-angle.webp","黄色 字标面","Yellow wordmark face"]],"purple":[["edition-20260912/tote00-purple-front.webp","紫色 圆点面","Purple dot-print face"],["edition-20260912/tote00-purple-angle.webp","紫色 字标面","Purple wordmark face"]],"red":[["edition-20260912/tote00-red-front.webp","红色 圆点面","Red dot-print face"],["edition-20260912/tote00-red-angle.webp","红色 字标面","Red wordmark face"]]},gallery4232=[["edition-20260912/p04-shadow3.webp","白色帆布面","White canvas face"],["edition-20260912/p04-shadow13.webp","白色 X-PAC 面","White X-PAC face"],["edition-20260912/p04-shadow14.webp","白色 X-PAC 侧面","White X-PAC side view"],["edition-20260912/p04-detail4.webp","白色帆布与刺绣","White canvas and embroidery"],["edition-20260912/p04-detail6.webp","X-PAC 纹理","X-PAC texture"]],gallery4232Black=[["edition-20260912/p04-shadow9.webp","黑色帆布面","Black canvas face"],["edition-20260912/p04-shadow0.webp","黑色 X-PAC 面","Black X-PAC face"]];
const model=document.body.dataset.model;
const modelColours=model==='ou4100'?Object.keys(gallery4100ByColour):['white','black'];
const requestedColour=modelColours.includes(query.get('colour'))?query.get('colour'):(model==='ou4100'?'black':'white');
let colour=requestedColour;
const galleryArea=$('[data-gallery]'),mainImage=$('.gallery-zoom img'),thumbs=$('.gallery-thumbs'),zoomDialog=$('#zoom-dialog'),zoomImage=$('.zoom-canvas img'),zoomViewport=$('.zoom-viewport');
let images=model==='ou4100'?gallery4100ByColour[colour]:(colour==='black'?gallery4232Black:gallery4232);
const defaultView=0;
const requestedIndex=Math.max(0,Math.min(images.length-1,Number.parseInt(query.get('view')??String(defaultView),10)||0));
let selectedIndex=defaultView;
let imageRequest=0,hasLoadedImage=false,failedImageSelection=null;
const altOf=item=>item[lang==='en'?2:1];
const colourLabels={black:['黑色 001','BLACK 001'],navy:['藏青色 440','NAVY 440'],green:['绿色 331','GREEN 331'],yellow:['黄色 771','YELLOW 771'],purple:['紫色 550','PURPLE 550'],red:['红色 660','RED 660'],white:['白色','WHITE']};
const colourName=(name,product=model)=>product==='ou4232'?tr(name==='black'?'黑色':'白色',name==='black'?'Black':'White'):tr(...(colourLabels[name]||[name,name.toUpperCase()]));
function renderThumbs(){
 if(!thumbs)return;
 thumbs.innerHTML=images.map((item,i)=>`<button type="button" data-gallery-index="${i}" aria-pressed="${i===selectedIndex}"><img src="assets/${item[0]}" alt="${altOf(item)}" loading="lazy" decoding="async"></button>`).join('');
}
function updateProductURL(){
 const u=new URL(location.href);u.searchParams.set('colour',colour);u.searchParams.set('view',selectedIndex);history.replaceState(null,'',u);
 refreshLanguageLinks();
}
function resetHover(){const area=$('.gallery-zoom');area?.classList.remove('is-zoomed');area?.style.removeProperty('--zoom-x');area?.style.removeProperty('--zoom-y')}
function setGalleryBusy(busy){
 if(busy)galleryArea.setAttribute('aria-busy','true');else galleryArea.removeAttribute('aria-busy');
 const add=$('[data-add-to-bag]');if(add)add.disabled=busy||!hasLoadedImage;
 $$('[data-zoom-open]').forEach(b=>{b.disabled=!hasLoadedImage;b.setAttribute('aria-disabled',String(busy||!hasLoadedImage))});
}
async function selectImage(index,scrollThumb=true,pending=null){
 if(!galleryArea)return;
 const nextImages=pending?.images||images,nextColour=pending?.colour||colour;
 const next=(index+nextImages.length)%nextImages.length,item=nextImages[next],request=++imageRequest;
 setGalleryBusy(true);
 try{
  await new Promise((resolve,reject)=>{const pre=new Image();pre.onload=resolve;pre.onerror=reject;pre.src='assets/'+item[0]});
  if(request!==imageRequest)return false;
  hasLoadedImage=true;failedImageSelection=null;const status=$('[data-gallery-status]');if(status)status.hidden=true;const zoomStatus=$('.dialog-status',zoomDialog);if(zoomStatus)zoomStatus.remove();
  images=nextImages;colour=nextColour;selectedIndex=next;resetHover();mainImage.src='assets/'+item[0];mainImage.alt=altOf(item);mainImage.width=1493;mainImage.height=2000;
  if(pending){renderThumbs();$$('[data-pdp-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pdpColor===colour)));if($('[data-color-name]'))$('[data-color-name]').textContent=colourName(colour)}
  $$('[data-gallery-index]',thumbs).forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.galleryIndex)===next)));
  const active=$('[data-gallery-index="'+next+'"]',thumbs);
  if(scrollThumb&&active){const left=active.offsetLeft-thumbs.offsetLeft;thumbs.scrollTo({left:Math.max(0,left-(thumbs.clientWidth-active.offsetWidth)/2),behavior:reduced.matches?'instant':'smooth'})}
  updateProductURL();
  if(zoomDialog.open){zoomImage.src=mainImage.src;zoomImage.alt=mainImage.alt;scale=1;updateZoomTitle();if(zoomImage.complete)layoutZoom()}
  return true;
 }catch{if(request===imageRequest){failedImageSelection={index,scrollThumb,pending};const status=$('[data-gallery-status]');if(status){status.hidden=false;status.querySelector('span').textContent=tr(hasLoadedImage?'未能载入这张图片 已保留上一张':'图片暂时无法载入',hasLoadedImage?'This image could not be loaded. The previous image is still shown.':'The product image could not be loaded.')}notify(tr('图片无法载入 请重试','Image unavailable. Please try again.'));updateProductURL()}return false}
 finally{if(request===imageRequest)setGalleryBusy(false)}
}
function setColour(next){
 if(!modelColours.includes(next))return Promise.resolve(false);
 const nextImages=model==='ou4100'?gallery4100ByColour[next]:(next==='black'?gallery4232Black:gallery4232);
 return selectImage(0,false,{colour:next,images:nextImages});
}
if(galleryArea){
 galleryArea.insertAdjacentHTML('beforeend',`<p class="gallery-status" data-gallery-status role="status" hidden><span></span><button type="button" data-image-retry>${tr('重新载入','Try again')}</button></p>`);
 $('[data-image-retry]').addEventListener('click',()=>{const retry=failedImageSelection;if(retry)selectImage(retry.index,retry.scrollThumb,retry.pending)});
 renderThumbs();
 $$('[data-pdp-color]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.pdpColor===colour));b.addEventListener('click',()=>setColour(b.dataset.pdpColor))});
 $('[data-color-name]').textContent=colourName(colour);
 thumbs.addEventListener('click',e=>{const b=e.target.closest('[data-gallery-index]');if(b)selectImage(Number(b.dataset.galleryIndex))});
 const area=$('.gallery-zoom'),fine=matchMedia('(hover:hover) and (pointer:fine)');
 area.setAttribute('aria-label',tr('放大商品图片','Enlarge product image'));
 area.addEventListener('pointermove',e=>{
  if(!fine.matches||e.pointerType==='touch'||galleryArea.hasAttribute('aria-busy'))return;
  const r=area.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  const fit=Math.min(r.width/mainImage.naturalWidth,r.height/mainImage.naturalHeight);
  const w=mainImage.naturalWidth*fit,h=mainImage.naturalHeight*fit;
  if(x<(r.width-w)/2||x>(r.width+w)/2||y<(r.height-h)/2||y>(r.height+h)/2){resetHover();return}
  area.style.setProperty('--zoom-x',x/r.width*100+'%');area.style.setProperty('--zoom-y',y/r.height*100+'%');area.classList.add('is-zoomed');
 });
 area.addEventListener('pointerleave',resetHover);
 area.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();if(!hasLoadedImage||galleryArea.hasAttribute('aria-busy'))return;selectImage(selectedIndex+(e.key==='ArrowRight'?1:-1))}});
 let touchStart=null;
 area.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')touchStart={x:e.clientX,y:e.clientY}});
 area.addEventListener('pointerup',e=>{
  if(!touchStart)return;
  const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){lastSwipe=Date.now();selectImage(selectedIndex+(dx<0?1:-1))}
 });
 area.addEventListener('pointercancel',()=>touchStart=null);
 selectImage(requestedIndex,false);
}
let scale=1,lastSwipe=0;
function updateZoomTitle(){$('#zoom-title').textContent=(model==='ou4100'?'TOTE 00':'PHASE 04 - TOTE');$$('[data-zoom-step]').forEach(b=>b.disabled=images.length===1)}
function layoutZoom(focus){
 if(!zoomDialog.open||!zoomImage.naturalWidth)return;
 const width=zoomViewport.clientWidth,height=zoomViewport.clientHeight;
 const fit=Math.min(width/zoomImage.naturalWidth,height/zoomImage.naturalHeight);
 zoomImage.style.width=zoomImage.naturalWidth*fit*scale+'px';zoomImage.style.height=zoomImage.naturalHeight*fit*scale+'px';
 zoomViewport.classList.toggle('is-magnified',scale===2);
 $$('[data-zoom-scale]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.zoomScale)===scale)));
 if(focus){zoomViewport.scrollLeft=focus.x*zoomViewport.scrollWidth-width/2;zoomViewport.scrollTop=focus.y*zoomViewport.scrollHeight-height/2}
}
zoomImage.addEventListener('load',()=>layoutZoom({x:.5,y:.5}));
$$('[data-zoom-open]').forEach(b=>b.addEventListener('click',()=>{
 if(!hasLoadedImage||galleryArea?.hasAttribute('aria-busy')||Date.now()-lastSwipe<400)return;resetHover();scale=1;zoomImage.src=mainImage.src;zoomImage.alt=mainImage.alt;
 openDialog('zoom-dialog');updateZoomTitle();layoutZoom({x:.5,y:.5});
}));
$$('[data-zoom-scale]').forEach(b=>b.addEventListener('click',()=>{scale=Number(b.dataset.zoomScale);layoutZoom({x:.5,y:.5})}));
$$('[data-zoom-step]').forEach(b=>b.addEventListener('click',()=>selectImage(selectedIndex+Number(b.dataset.zoomStep))));
zoomDialog.addEventListener('keydown',e=>{
 if(scale===2&&e.target===zoomViewport&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
  e.preventDefault();const amount=80;
  if(e.key==='ArrowLeft')zoomViewport.scrollLeft-=amount;if(e.key==='ArrowRight')zoomViewport.scrollLeft+=amount;
  if(e.key==='ArrowUp')zoomViewport.scrollTop-=amount;if(e.key==='ArrowDown')zoomViewport.scrollTop+=amount;
  return;
 }
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();selectImage(selectedIndex+(e.key==='ArrowRight'?1:-1))}
});
let drag=null,wasDrag=false;
zoomViewport.addEventListener('pointerdown',e=>{
 if(scale!==2||e.pointerType!=='mouse'||e.button!==0)return;
 drag={x:e.clientX,y:e.clientY,left:zoomViewport.scrollLeft,top:zoomViewport.scrollTop};wasDrag=false;
 zoomViewport.setPointerCapture(e.pointerId);zoomViewport.classList.add('is-dragging');
});
zoomViewport.addEventListener('pointermove',e=>{
 if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
 if(Math.abs(dx)+Math.abs(dy)>4)wasDrag=true;
 zoomViewport.scrollLeft=drag.left-dx;zoomViewport.scrollTop=drag.top-dy;
});
function stopDrag(){drag=null;zoomViewport.classList.remove('is-dragging')}
zoomViewport.addEventListener('pointerup',stopDrag);zoomViewport.addEventListener('pointercancel',stopDrag);
zoomViewport.addEventListener('click',e=>{
 if(wasDrag){wasDrag=false;return}
 const r=zoomImage.getBoundingClientRect();const focus={x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};
 scale=scale===1?2:1;layoutZoom(focus);
});
window.addEventListener('resize',()=>{resetHover();layoutZoom({x:.5,y:.5})});

const BAG_KEY='oukka-refined-preview-bag-v1',validKeys=['ou4100-black','ou4100-navy','ou4100-green','ou4100-yellow','ou4100-purple','ou4100-red','ou4232-white','ou4232-black'];
let bag={};try{const saved=JSON.parse(localStorage.getItem(BAG_KEY)||'{}');validKeys.forEach(k=>{if(Number.isInteger(saved[k])&&saved[k]>0&&saved[k]<=99)bag[k]=saved[k]})}catch{}
function renderBag(){
 const entries=Object.entries(bag).filter(([,n])=>n>0),count=entries.reduce((s,[,n])=>s+n,0);
 $$('[data-cart-count]').forEach(n=>n.textContent='('+count+')');
 const note=tr('本机购物袋演示 不接收订单或付款','Local bag demonstration. No orders or payments are accepted.');
 $('.cart-content').innerHTML=(entries.length?entries.map(([key,n])=>{
  const [m,c]=key.split('-'),src=m==='ou4100'?gallery4100ByColour[c][0][0]:(c==='white'?gallery4232:gallery4232Black)[0][0];
  return `<article class="cart-item"><a href="${localLink('refined-'+m+'.html?colour='+c)}"><img src="assets/${src}" alt="${m.toUpperCase()} ${c}"></a><div><h3>${m==='ou4100'?'PHASE 04 - TOTE 00':'PHASE 04 - TOTE'}</h3><p>${colourName(c,m)} / ${m==='ou4100'?'¥188':'¥992'}</p><div class="cart-quantity"><button type="button" data-quantity="-1" data-key="${key}" aria-label="${tr('减少数量','Decrease quantity')}">−</button><span>${n}</span><button type="button" data-quantity="1" data-key="${key}" aria-label="${tr('增加数量','Increase quantity')}" ${n>=99?'disabled':''}>+</button></div><button type="button" class="cart-remove" data-remove="${key}">${tr('移除','Remove')}</button></div></article>`
 }).join(''):`<div class="cart-empty"><p>${tr('购物袋还是空的','Your bag is empty')}</p><a class="button" href="${localLink('refined-shop.html')}">${tr('探索产品','Explore the objects')} ↗</a></div>`)+`<p class="cart-note">${note}</p>`+(entries.length?`<p class="cart-total"><span>${tr('商品小计','Subtotal')}</span><span>¥${entries.reduce((sum,[key,n])=>sum+n*(key.startsWith('ou4100')?188:992),0)} CNY</span></p><button type="button" class="button cart-checkout" disabled>${tr('结账尚未开放','Checkout is not active')}</button>`:'');
}
function saveBag(){try{localStorage.setItem(BAG_KEY,JSON.stringify(bag))}catch{}renderBag()}
$('.cart-content').addEventListener('click',e=>{
 const q=e.target.closest('[data-quantity]'),remove=e.target.closest('[data-remove]');
 if(q){const key=q.dataset.key;if(!validKeys.includes(key))return;bag[key]=Math.min(99,Math.max(0,(bag[key]||0)+Number(q.dataset.quantity)));if(!bag[key])delete bag[key];saveBag();($('.cart-content [data-key="'+key+'"][data-quantity="'+q.dataset.quantity+'"]')||$('#cart-dialog [data-close]')).focus()}
 if(remove){delete bag[remove.dataset.remove];saveBag();$('#cart-dialog [data-close]').focus()}
});
$$('[data-cart-open]').forEach(b=>b.addEventListener('click',()=>{renderBag();openDialog('cart-dialog')}));
$('[data-add-to-bag]')?.addEventListener('click',()=>{if(galleryArea&&(!hasLoadedImage||galleryArea.hasAttribute('aria-busy')))return;const key=model+'-'+colour;if(!validKeys.includes(key))return;bag[key]=Math.min(99,(bag[key]||0)+1);saveBag();openDialog('cart-dialog')});
renderBag();
$$('[data-signup-form]').forEach(form=>form.addEventListener('submit',e=>{
 e.preventDefault();const input=$('input',form),message=$('.form-message',form),valid=input.validity.valid;
 input.setAttribute('aria-invalid',String(!valid));message.classList.toggle('is-error',!valid);
 message.textContent=valid?tr('预览完成 邮箱未发送或保存','Preview complete. Your email was not sent or saved.'):tr('请输入有效的邮箱地址','Please enter a valid email address');
 if(!valid)input.focus();else form.reset();
}));
const category=['canvas','reversible'].includes(query.get('category'))?query.get('category'):'all';
$$('[data-category]').forEach(a=>{if(a.dataset.category===category)a.setAttribute('aria-current','page')});
let visible=0;$$('[data-category-card]').forEach(a=>{a.hidden=category!=='all'&&a.dataset.categoryCard!==category;if(!a.hidden)visible++});
if($('[data-collection-count]'))$('[data-collection-count]').textContent=lang==='en'?visible+' colourways':visible+' 款配色';
const recordNav=$$('.record-nav a');
function markRecord(id){recordNav.forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}
if(recordNav.length){markRecord(location.hash.slice(1)||'about');window.addEventListener('hashchange',()=>markRecord(location.hash.slice(1)));if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)markRecord(e.target.id)}),{rootMargin:'-20% 0px -55% 0px'});$$('.record-content section').forEach(s=>observer.observe(s))}}

// Keep existing routes while applying one shared navigation state.

$$('[data-pdp-color]').forEach(b=>{const name=colourName(b.dataset.pdpColor);b.setAttribute('aria-label',name);b.title=name});
if(location.pathname.endsWith('refined-record.html')&&query.get('model')==='ou4100'&&!location.hash)location.replace(localLink('refined-record.html?model=ou4100#tote00'));

// 2026.09.15 lookbook integration: keep the homepage focused on a few strong lifestyle images.
if(location.pathname.endsWith('refined.html')){
 const hero=$('.campaign-look img');
 if(hero){hero.src='assets/lookbook-20260915/hf_20260915_081130_ed19649c-8c1d-428d-b581-df426f4bea83.png';hero.alt='OUKKA by the waterfront';hero.dataset.altEn='OUKKA by the waterfront';}
}
$$('.footer-social a, .footer-social button').forEach(el=>{if((el.textContent||'').trim().toLowerCase()==='instagram'){el.outerHTML='<a href="https://www.instagram.com/oukka.official/" target="_blank" rel="noopener">Instagram</a>'}});
