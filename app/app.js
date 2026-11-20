// Leonida Trophy Guide — a checklist and tracker for the 55 GTA VI trophies.
// Progress and the spoiler setting save in localStorage; export and import
// move the progress to a file and back. No network requests at run time:
// the only fetch is the trophy data file that ships with the app.
const STORE_KEY = 'leonida-trophy-guide-v1';
const listEl = document.getElementById('trophyList');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('gradeFilter');
const hideEarnedEl = document.getElementById('hideEarned');
const spoilerEl = document.getElementById('spoilerToggle');
const earnedCountEl = document.getElementById('earnedCount');
const progressFillEl = document.getElementById('progressFill');
const progressNoteEl = document.getElementById('progressNote');
const onlineNoteEl = document.getElementById('onlineNote');
const emptyNoteEl = document.getElementById('emptyNote');
const missableCalloutEl = document.getElementById('missableCallout');

const params = new URLSearchParams(location.search);
let trophies = [];
let earned = new Set();
let spoiler = false;
let kindFilter = 'all';
let expanded = new Set();

function loadStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    earned = new Set(Array.isArray(raw.earned) ? raw.earned : []);
    spoiler = raw.spoiler === true;
  } catch (e) {
    earned = new Set();
    spoiler = false;
  }
}

function saveStore() {
  // Screenshot states (?demo=…) are in-memory only and must never be saved.
  if (params.get('demo')) return;
  localStorage.setItem(STORE_KEY, JSON.stringify({ earned: [...earned], spoiler }));
}

function isSpoilerHidden(t) {
  return spoiler && t.kind === 'story' && t.id !== 1 && !earned.has(t.id);
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function renderCard(t) {
  const card = el('article', 'card' + (earned.has(t.id) ? ' earned' : ''));
  const head = el('div', 'card-head');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'card-check';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    saveStore();
    render();
  });
  head.append(box);
  const title = el('div', 'card-title');
  const hidden = isSpoilerHidden(t);
  const name = el('h3', 'card-name', hidden ? 'Hidden story trophy' : t.name);
  const badge = el('span', 'grade-badge grade-' + t.grade, t.grade);
  name.append(badge);
  title.append(name);
  title.append(el('p', 'card-desc', hidden ? 'Earn this trophy to reveal its name and description.' : t.description));
  head.append(title);
  card.append(head);
  const tags = el('div', 'card-tags');
  tags.append(el('span', 'tag', t.kind));
  if (t.count) tags.append(el('span', 'tag', 'Count: ' + t.count));
  tags.append(el('span', 'tag', 'Roadmap stage ' + t.stage));
  if (t.missable) tags.append(el('span', 'tag missable', 'Possibly missable'));
  if (t.hidden) tags.append(el('span', 'tag', 'Hidden on PlayStation'));
  if (!t.confirmed) tags.append(el('span', 'tag unconfirmed', 'Unconfirmed — see guide'));
  card.append(tags);
  const toggle = el('button', 'guide-toggle', expanded.has(t.id) ? 'Hide the guide ▲' : 'How to unlock it ▼');
  toggle.type = 'button';
  toggle.addEventListener('click', () => {
    if (expanded.has(t.id)) expanded.delete(t.id);
    else expanded.add(t.id);
    render();
  });
  card.append(toggle);
  if (expanded.has(t.id)) {
    const body = el('div', 'guide-body');
    body.append(el('p', null, t.guide));
    const src = el('p', 'guide-source', 'Source: ');
    const a = document.createElement('a');
    a.href = t.source.url;
    a.textContent = t.source.name;
    a.target = '_blank';
    a.rel = 'noopener';
    src.append(a);
    body.append(src);
    if (t.steps && t.steps.length) {
      const ol = el('ol', 'guide-steps');
      for (const s of t.steps) ol.append(el('li', null, s));
      body.append(ol);
    }
    card.append(body);
  }
  return card;
}

function currentList() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kindFilter === 'online') return false;
    if (kindFilter !== 'all' && t.kind !== kindFilter) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (hideEarnedEl.checked && earned.has(t.id)) return false;
    if (q) {
      const hay = (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function render() {
  listEl.replaceChildren();
  const shown = currentList();
  // Screenshot states only: put the expanded trophy's guide first, so the
  // cover shot shows the header, the filters and the open guide together.
  if (params.get('demo')) {
    shown.sort((a, b) => (expanded.has(b.id) ? 1 : 0) - (expanded.has(a.id) ? 1 : 0));
  }
  onlineNoteEl.hidden = kindFilter !== 'online';
  emptyNoteEl.hidden = kindFilter === 'online' || shown.length > 0;
  missableCalloutEl.hidden = kindFilter === 'online';
  for (const t of shown) listEl.append(renderCard(t));
  earnedCountEl.textContent = String(earned.size);
  progressFillEl.style.width = (earned.size / trophies.length * 100).toFixed(1) + '%';
  progressNoteEl.textContent = earned.size === trophies.length
    ? 'Platinum earned — Vice Got a Price!'
    : 'Platinum: Vice Got a Price! (' + (trophies.length - earned.size) + ' to go)';
  spoilerEl.checked = spoiler;
}

function showView(view) {
  document.querySelectorAll('.view-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  document.getElementById('view-list').hidden = view !== 'list';
  document.getElementById('view-roadmap').hidden = view !== 'roadmap';
}

function applyDemo(mode) {
  // Screenshot states only: pre-tick trophies in memory, never in storage.
  if (mode === 'cover') {
    earned = new Set([2, 3, 8, 15, 35, 42]);
    expanded = new Set([28]);
  } else if (mode === 'progress') {
    earned = new Set([2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 28, 32, 35, 42, 52, 53]);
    expanded = new Set([14]);
  }
}

async function init() {
  const doc = await (await fetch('data/trophies.json')).json();
  trophies = doc.trophies;
  loadStore();
  if (params.get('view') === 'roadmap') showView('roadmap');
  if (params.get('filter')) {
    kindFilter = params.get('filter');
    document.querySelectorAll('#kindChips .chip').forEach((c) => {
      c.classList.toggle('active', c.dataset.kind === kindFilter);
    });
  }
  if (params.get('spoiler') === 'on') spoiler = true;
  if (params.get('expand')) expanded = new Set([Number(params.get('expand'))]);
  if (params.get('demo')) applyDemo(params.get('demo'));
  document.querySelectorAll('.view-btn').forEach((b) => {
    b.addEventListener('click', () => showView(b.dataset.view));
  });
  document.querySelectorAll('#kindChips .chip').forEach((c) => {
    c.addEventListener('click', () => {
      kindFilter = c.dataset.kind;
      document.querySelectorAll('#kindChips .chip').forEach((x) => {
        x.classList.toggle('active', x === c);
      });
      render();
    });
  });
  searchEl.addEventListener('input', render);
  gradeEl.addEventListener('change', render);
  hideEarnedEl.addEventListener('change', render);
  spoilerEl.addEventListener('change', () => {
    spoiler = spoilerEl.checked;
    saveStore();
    render();
  });
  document.getElementById('exportBtn').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(
      [JSON.stringify({ earned: [...earned].sort((x, y) => x - y), spoiler }, null, 2)],
      { type: 'application/json' }));
    a.download = 'leonida-trophy-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text());
      const ids = Array.isArray(raw) ? raw : raw.earned;
      const next = new Set((ids || []).filter((n) => trophies.some((t) => t.id === n)));
      earned = next;
      if (typeof raw.spoiler === 'boolean') spoiler = raw.spoiler;
      saveStore();
      render();
    } catch (err) {
      document.getElementById('savedNote').textContent = 'That file could not be imported — it is not a progress file from this guide.';
    }
    e.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    earned = new Set();
    saveStore();
    render();
  });
  render();
}

init();
