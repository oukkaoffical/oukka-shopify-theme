/* Interactive design preview. No checkout, remote subscription or repair request is submitted.
   Replace the three video URLs with approved Shopify-hosted files on integration. */
const MEDIA = {
  hero: { src: 'assets/mountain-motion.mp4', poster: 'assets/phase0-landscape.png' },
  campaign: { src: 'assets/coast-motion.mp4', poster: 'assets/phase0-coast.png' },
  product: { src: 'assets/coast-motion.mp4', poster: 'assets/phase0-coast.png' },
};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
document.documentElement.classList.add('js');

document.body.insertAdjacentHTML('beforeend', `
  <dialog class="menu-dialog" id="menu-dialog" aria-labelledby="menu-title">
    <div class="dialog-head"><h2 id="menu-title">OUKKA</h2><button type="button" data-dialog-close>CLOSE ×</button></div>
    <nav class="menu-links" aria-label="行動版導覽"><a href="index.html#objects">OBJECTS</a><a href="index.html#phase-zero">PHASE 0</a><a href="index.html#repair">REPAIR</a><a href="index.html#journal">JOURNAL</a></nav><p>QUIET UTILITY.<br>LONGER LIFE.</p>
  </dialog>
  <dialog class="cart-dialog" id="cart-dialog" aria-labelledby="cart-title">
    <div class="dialog-head"><h2 id="cart-title">YOUR BAG / PREVIEW</h2><button type="button" data-dialog-close>CLOSE ×</button></div><div class="cart-content" data-cart-content></div>
  </dialog>
  <dialog class="film-dialog" id="film-dialog" aria-labelledby="film-title">
    <div class="dialog-head"><h2 id="film-title">OUKKA / OUTSIDE, EVERY DAY.</h2><button type="button" data-dialog-close>CLOSE ×</button></div>
    <video controls playsinline preload="none" poster="assets/phase0-coast.png" data-film-video aria-label="OUKKA 概念影片"><source src="assets/coast-motion.mp4" type="video/mp4"></video>
    <p class="media-note" data-film-message aria-live="polite">目前播放的是概念圖動態示意，並非正式實拍。此區可替換為品牌 Campaign 或商品展示影片。</p>
    <div class="media-upload"><button type="button" class="text-link" data-import-video>用自己的影片預覽 ↗</button><input type="file" accept="video/mp4,video/webm,video/quicktime" data-video-file aria-label="選擇本機影片"><span>只在此裝置播放，不會上傳。</span></div>
  </dialog>
  <dialog class="zoom-dialog" id="zoom-dialog" aria-labelledby="zoom-title"><div class="dialog-head"><h2 id="zoom-title">OU4232 / PRODUCT IMAGE</h2><button type="button" data-dialog-close>CLOSE ×</button></div><img src="assets/ou4232-white-cutout.png" alt="OU4232 放大商品圖片" data-zoom-image></dialog>
  <dialog class="content-dialog" id="repair-dialog" aria-labelledby="repair-title"><div class="dialog-head"><h2 id="repair-title">LIFETIME REPAIR</h2><button type="button" data-dialog-close>CLOSE ×</button></div><div class="dialog-content"><h3>Keep the object.<br>Continue the story.</h3><p>OUKKA 的修補理念，是讓值得留下的產品繼續使用。Phase 0 會把產品資訊、保養方式與修補入口放在同一份紀錄中。</p><p>正式的服務範圍、費用、送修地區與流程尚待確認。此頁是品牌與服務體驗的設計示範，不等同免費終身保固承諾，也尚未接受送修申請。</p><a href="record.html#repair">查看產品履歷中的修補資訊 ↗</a></div></dialog>
  <dialog class="content-dialog" id="preview-dialog" aria-labelledby="preview-title"><div class="dialog-head"><h2 id="preview-title">ABOUT THIS PREVIEW</h2><button type="button" data-dialog-close>CLOSE ×</button></div><div class="dialog-content"><h3>A complete visual direction.<br>Ready for your content.</h3><p>目前可體驗首頁、商品頁、Phase 0 履歷、色款切換、雙面展示、圖片放大、影片播放與本機購物袋。</p><p>首屏背景、Campaign Film、商品圖庫都有獨立影片位置。現有片段是概念圖動態示意；播放器可選取自己的影片做本機預覽，不會上傳。</p><p>這是可互動設計模板，尚未安裝到 Shopify。售價、庫存、規格、結帳、訂阅寄送、售後條款與正式 QR 網址需在正式整合時設定。</p><p>QR 圖樣目前為概念標籤，不可當作正式產品 QR 印刷；點擊標籤即可開啟履歷示範頁。</p></div></dialog>
  <div class="toast" role="status" hidden data-toast></div>
`);

const dialogs = $$('dialog');
function openDialog(id) {
  const target = document.getElementById(id);
  dialogs.forEach(dialog => { if (dialog.open && dialog !== target) dialog.close(); });
  if (!target.open) target.showModal();
}
dialogs.forEach(dialog => {
  $('[data-dialog-close]', dialog)?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  $$('a', dialog).forEach(link => link.addEventListener('click', () => dialog.close()));
});
$$('[data-menu-open]').forEach(button => {
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'menu-dialog');
  button.addEventListener('click', () => openDialog('menu-dialog'));
});
$$('[data-repair-open]').forEach(button => button.addEventListener('click', () => openDialog('repair-dialog')));
$$('[data-preview-open]').forEach(button => button.addEventListener('click', () => openDialog('preview-dialog')));

let toastTimer;
function notify(message) {
  const toast = $('[data-toast]');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

// Local-only demo bag; do not use for production order or pricing state.
const BAG_KEY = 'oukka-preview-bag-v2';
let bag = {};
try {
  const stored = JSON.parse(localStorage.getItem(BAG_KEY) || '{}');
  ['white', 'black'].forEach(colour => {
    if (Number.isInteger(stored[colour]) && stored[colour] > 0 && stored[colour] <= 99) bag[colour] = stored[colour];
  });
} catch { bag = {}; }
function saveBag() {
  try { localStorage.setItem(BAG_KEY, JSON.stringify(bag)); } catch { /* Memory-only fallback. */ }
  renderBag();
}
function renderBag() {
  const entries = Object.entries(bag).filter(([, quantity]) => quantity > 0);
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  $$('[data-cart-count]').forEach(node => { node.textContent = '(' + count + ')'; });
  const container = $('[data-cart-content]');
  if (!entries.length) {
    container.innerHTML = '<div class="cart-empty"><p>Your bag is empty.</p><a class="button button-dark" href="product.html">EXPLORE OU4232 ↗</a></div><p class="cart-note">此為本機購物袋示範。未建立訂單或付款。</p>';
    return;
  }
  container.innerHTML = entries.map(([colour, quantity]) => `
    <article class="cart-item"><img src="assets/ou4232-${colour}-cutout.png" alt="OU4232 ${colour}">
      <div><h3>OU4232</h3><p>${colour.toUpperCase()} / PRICE ON RELEASE</p>
        <div class="cart-quantity"><button type="button" data-quantity="-1" data-colour="${colour}" aria-label="減少 ${colour} 數量">−</button><span aria-label="數量">${quantity}</span><button type="button" data-quantity="1" data-colour="${colour}" aria-label="增加 ${colour} 數量" ${quantity >= 99 ? 'disabled' : ''}>+</button></div>
        <button type="button" class="cart-remove" data-remove="${colour}">REMOVE</button>
      </div>
    </article>`).join('') + '<p class="cart-note">已加入本機預覽購物袋。正式售價與庫存尚未設定，不會建立訂單或收取款項。</p><button class="button button-dark cart-checkout" type="button" disabled>CHECKOUT / NOT LIVE</button>';
}
$('[data-cart-content]').addEventListener('click', event => {
  const quantity = event.target.closest('[data-quantity]');
  const remove = event.target.closest('[data-remove]');
  if (quantity) {
    const colour = quantity.dataset.colour;
    bag[colour] = Math.min(99, Math.max(0, (bag[colour] || 0) + Number(quantity.dataset.quantity)));
    if (!bag[colour]) delete bag[colour];
    saveBag();
    const restored = $('[data-quantity="' + quantity.dataset.quantity + '"][data-colour="' + colour + '"]');
    (restored || $('[data-dialog-close]', $('#cart-dialog'))).focus();
  } else if (remove) {
    delete bag[remove.dataset.remove]; saveBag();
    $('[data-dialog-close]', $('#cart-dialog')).focus();
  }
});
$$('[data-cart-open]').forEach(button => button.addEventListener('click', () => { renderBag(); openDialog('cart-dialog'); }));
renderBag();

const hero = $('.hero');
const header = $('[data-header]');
if (hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => header.classList.toggle('is-scrolled', !entry.isIntersecting), { rootMargin: '-72px 0px 0px 0px' }).observe(hero);
}
const revealNodes = $$('.reveal');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target);
  }), { threshold: 0.08 });
  revealNodes.forEach(node => revealObserver.observe(node));
} else revealNodes.forEach(node => node.classList.add('is-visible'));

const ambient = $('[data-ambient-video]');
const motionToggle = $('[data-motion-toggle]');
let userPausedMotion = motionPreference.matches || Boolean(navigator.connection?.saveData);
let heroVisible = true;
function syncMotionButton() {
  if (!ambient || !motionToggle) return;
  const paused = ambient.paused;
  motionToggle.innerHTML = paused ? 'PLAY MOTION <span aria-hidden="true">▷</span>' : 'PAUSE MOTION <span aria-hidden="true">Ⅱ</span>';
  motionToggle.setAttribute('aria-label', paused ? '播放背景影片' : '暫停背景影片');
  motionToggle.setAttribute('aria-pressed', String(!paused));
}
async function updateAmbient() {
  if (!ambient) return;
  if (userPausedMotion || !heroVisible || document.hidden || $('#film-dialog').open) ambient.pause();
  else { try { await ambient.play(); } catch { /* Autoplay blocked: poster + explicit play remain. */ } }
  syncMotionButton();
}
if (ambient) {
  ambient.addEventListener('play', syncMotionButton); ambient.addEventListener('pause', syncMotionButton);
  ambient.addEventListener('error', () => { motionToggle.hidden = true; });
  motionToggle.addEventListener('click', () => { userPausedMotion = !ambient.paused; updateAmbient(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; updateAmbient(); }).observe(hero);
  else updateAmbient();
}
motionPreference.addEventListener('change', event => {
  userPausedMotion = event.matches; updateAmbient();
  if (event.matches) revealNodes.forEach(node => node.classList.add('is-visible'));
});
document.addEventListener('visibilitychange', updateAmbient);

const film = $('[data-film-video]');
const filmDialog = $('#film-dialog');
const filmMessage = $('[data-film-message]');
const demoFilmMessage = '目前播放的是概念圖動態示意，並非正式實拍。此區可替換為品牌 Campaign 或商品展示影片。';
let localFilmURL = null;
$$('[data-film-open]').forEach(button => button.addEventListener('click', async () => {
  const slot = button.dataset.filmSlot || 'campaign';
  const media = MEDIA[slot] || MEDIA.campaign;
  if (!localFilmURL) {
    film.src = media.src; film.poster = media.poster; filmMessage.textContent = demoFilmMessage;
  }
  openDialog('film-dialog'); ambient?.pause();
  try { await film.play(); } catch { filmMessage.textContent = '請按播放器的播放鍵開始。' + (localFilmURL ? '目前影片只在此裝置預覽。' : demoFilmMessage); }
}));
filmDialog.addEventListener('close', () => { film.pause(); updateAmbient(); });
film.addEventListener('error', () => { filmMessage.textContent = '影片無法播放，請改用 MP4（H.264）或 WebM。頁面仍保留封面圖片。'; });
$('[data-import-video]').addEventListener('click', () => $('[data-video-file]').click());
$('[data-video-file]').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) { filmMessage.textContent = '請選擇影片檔案。'; return; }
  if (localFilmURL) URL.revokeObjectURL(localFilmURL);
  localFilmURL = URL.createObjectURL(file); film.src = localFilmURL;
  filmMessage.textContent = '正在預覽你選取的影片。檔案只在本機讀取，沒有上傳或儲存到網站。';
  try { await film.play(); } catch { filmMessage.textContent = '影片已載入，請按播放鍵。若仍無法播放，請使用 MP4（H.264）。'; }
});
window.addEventListener('pagehide', () => { if (localFilmURL) URL.revokeObjectURL(localFilmURL); });

const imageRequests = new WeakMap();
async function replaceImage(image, src, alt, wrap) {
  const request = (imageRequests.get(image) || 0) + 1;
  imageRequests.set(image, request);
  wrap?.classList.add('is-changing');
  try {
    await new Promise((resolve, reject) => { const preload = new Image(); preload.onload = resolve; preload.onerror = reject; preload.src = src; });
    if (request !== imageRequests.get(image)) return false;
    image.src = src; image.alt = alt;
    return true;
  } catch { notify('圖片暫時無法載入，請再試一次。'); return false; }
  finally { if (request === imageRequests.get(image)) wrap?.classList.remove('is-changing'); }
}
$$('[data-home-color]').forEach(button => button.addEventListener('click', async () => {
  const colour = button.dataset.homeColor;
  const loaded = await replaceImage($('[data-product-image]'), 'assets/ou4232-' + colour + '-cutout.png', 'OU4232 ' + colour + ' 機能面', $('[data-product-stage]'));
  if (!loaded) return;
  $$('[data-home-color]').forEach(item => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  $$('.product-editorial a').forEach(link => { link.href = 'product.html?colour=' + colour; });
}));

let selectedColour = new URLSearchParams(location.search).get('colour') === 'black' ? 'black' : 'white';
let galleryView = 'front';
function galleryData() {
  if (galleryView === 'canvas') return { src:'assets/ou4232-canvas-upright.png', alt:'白色 OU4232 帆布面樣品', label:'WHITE SAMPLE / CANVAS' };
  if (galleryView === 'detail') return { src:'assets/ou4232-white-alt-source.png', alt:'白色 OU4232 機能面結構樣品', label:'WHITE SAMPLE / DETAIL' };
  return { src:'assets/ou4232-' + selectedColour + '-cutout.png', alt:'OU4232 ' + selectedColour + ' 機能面', label:selectedColour.toUpperCase() + ' / TECHNICAL' };
}
async function renderGallery() {
  if (!$('[data-gallery-image]')) return;
  const data = galleryData();
  const ok = await replaceImage($('[data-gallery-image]'), data.src, data.alt, $('[data-gallery]'));
  if (!ok) return;
  $('[data-gallery-caption]').textContent = data.label;
  $$('[data-gallery-view]').forEach(button => { const active = button.dataset.galleryView === galleryView; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
  $$('[data-pdp-color]').forEach(button => { const active = button.dataset.pdpColor === selectedColour; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
  $('[data-color-name]').textContent = selectedColour.toUpperCase();
}
$$('[data-pdp-color]').forEach(button => button.addEventListener('click', () => {
  selectedColour = button.dataset.pdpColor; galleryView = 'front';
  const url = new URL(location.href); url.searchParams.set('colour', selectedColour); history.replaceState(null, '', url);
  renderGallery();
}));
$$('[data-gallery-view]').forEach(button => button.addEventListener('click', () => { galleryView = button.dataset.galleryView; renderGallery(); }));
$('[data-add-to-bag]')?.addEventListener('click', () => {
  bag[selectedColour] = Math.min(99, (bag[selectedColour] || 0) + 1); saveBag(); openDialog('cart-dialog');
});
$$('[data-zoom-open]').forEach(button => button.addEventListener('click', () => {
  const source = $('[data-gallery-image]'); const zoom = $('[data-zoom-image]');
  zoom.src = source.src; zoom.alt = source.alt; openDialog('zoom-dialog');
}));
$$('[data-side]').forEach(button => button.addEventListener('click', async () => {
  const canvas = button.dataset.side === 'canvas';
  const ok = await replaceImage($('[data-reversible-image]'), canvas ? 'assets/ou4232-canvas-upright.png' : 'assets/ou4232-white-cutout.png', canvas ? '白色 OU4232 帆布面' : '白色 OU4232 機能面', $('[data-reversible-wrap]'));
  if (!ok) return;
  $$('[data-side]').forEach(item => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  $('[data-side-description]').textContent = canvas ? '帆布面的自然手感，延續簡單直接的日常攜帶。' : '外置分區口袋與束口調節，讓常用物件留在手邊。';
}));
if ($('[data-gallery]')) renderGallery();

$$('[data-signup-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const email = $('input[type="email"]', form); const message = $('.form-message', form);
  const valid = email.validity.valid;
  email.setAttribute('aria-invalid', String(!valid));
  message.classList.toggle('is-error', !valid); message.classList.toggle('is-success', valid);
  if (!valid) { message.textContent = '請輸入有效的 email 地址。'; email.focus(); return; }
  message.textContent = '訂閱流程示範完成。你的 email 未被送出或儲存。正式版將連接 Shopify 訂閱服務。';
  form.reset();
}));
