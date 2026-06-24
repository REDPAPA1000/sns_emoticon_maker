let provider   = 'ollama';
let quality    = 'l';
let activeJobId = null;
let selectedGrade = '중학교';

/* ── 앱 시작 시 설정 로드 ── */
document.addEventListener('DOMContentLoaded', () => {
  fetch('/config').then(r => r.json()).then(cfg => {
    if (cfg.vault_path) document.getElementById('vaultPath').value = cfg.vault_path;
    if (cfg.grade)      setGradeByValue(cfg.grade);
  });

  document.getElementById('topicInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); startGenerate(); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
  document.getElementById('codeModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
});

/* ── 설정 패널 ── */
function toggleSettings() {
  document.getElementById('settingsPanel').classList.toggle('open');
}

function setGrade(btn) {
  document.querySelectorAll('[data-grade]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedGrade = btn.dataset.grade;
}

function setGradeByValue(val) {
  const btn = document.querySelector(`[data-grade="${val}"]`);
  if (btn) setGrade(btn);
  else selectedGrade = val;
}

function saveConfig() {
  const vault_path = document.getElementById('vaultPath').value.trim();
  fetch('/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vault_path, grade: selectedGrade }),
  }).then(() => {
    showToast('설정 저장 완료');
    document.getElementById('settingsPanel').classList.remove('open');
  });
}

/* ── 옵션 선택 ── */
function setProvider(btn) {
  document.querySelectorAll('[data-provider]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  provider = btn.dataset.provider;
  document.getElementById('providerBadge').textContent =
    { ollama: 'Ollama', gemini: 'Gemini', claude: 'Claude' }[provider];
}

function setQuality(btn) {
  document.querySelectorAll('[data-quality]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  quality = btn.dataset.quality;
}

/* ── 토스트 ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ── Step 1: 시나리오 생성 ── */
function startGenerate() {
  const topic = document.getElementById('topicInput').value.trim();
  if (!topic) { showToast('주제를 입력해주세요'); return; }

  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  document.getElementById('btnText').textContent = '생성 중...';

  const card = addCard(topic);
  document.getElementById('emptyState')?.remove();

  fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, provider }),
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) { setCardError(card, data.error); return; }
      document.getElementById('topicInput').value = '';
      card.id = 'card-' + data.job_id;
      pollForPreview(card, data.job_id, topic);
    })
    .catch(err => setCardError(card, err.message))
    .finally(() => {
      btn.disabled = false;
      document.getElementById('btnText').textContent = '시나리오 생성';
    });
}

/* ── 코드 준비 폴링 ── */
function pollForPreview(card, jobId, topic) {
  updateCardStatus(card, 'generating', 'AI가 코드를 생성하고 있습니다...');
  const iv = setInterval(async () => {
    try {
      const data = await fetch('/status/' + jobId).then(r => r.json());
      if (data.status === 'preview') {
        clearInterval(iv);
        updateCardStatus(card, 'preview', '▶ 클릭하여 코드 검토 후 영상 제작');
        card.style.cursor = 'pointer';
        card.onclick = () => openModal(jobId, topic, data.code);
        showToast('코드 준비 완료 — 카드를 클릭해 검토하세요');
      } else if (data.status === 'error') {
        clearInterval(iv);
        setCardError(card, data.error || '코드 생성 실패');
      }
    } catch { clearInterval(iv); setCardError(card, '서버 연결 오류'); }
  }, 2000);
}

/* ── Step 2: 코드 검토 모달 ── */
function openModal(jobId, topic, code) {
  activeJobId = jobId;
  document.getElementById('modalTopic').textContent = topic;
  document.getElementById('codeEditor').value = code;
  document.getElementById('renderBtnText').textContent = '이 코드로 영상 제작';
  document.getElementById('renderBtn').disabled = false;
  document.getElementById('codeModal').classList.add('open');
}

function closeModal() {
  document.getElementById('codeModal').classList.remove('open');
  activeJobId = null;
}

/* ── Step 3: 렌더링 ── */
function startRender() {
  if (!activeJobId) return;
  const code = document.getElementById('codeEditor').value.trim();
  if (!code) { showToast('코드가 비어 있습니다'); return; }

  const jobId = activeJobId;
  const renderBtn = document.getElementById('renderBtn');
  renderBtn.disabled = true;
  document.getElementById('renderBtnText').textContent = '렌더링 시작 중...';

  fetch('/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_id: jobId, code, quality }),
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) { showToast('오류: ' + data.error); renderBtn.disabled = false; return; }
      closeModal();
      const card = document.getElementById('card-' + jobId);
      if (card) {
        card.style.cursor = 'default';
        card.onclick = null;
        updateCardStatus(card, 'rendering', 'Manim 렌더링 중...');
        pollForVideo(card, jobId);
      }
    })
    .catch(err => { showToast('서버 오류: ' + err.message); renderBtn.disabled = false; });
}

/* ── 영상 완료 폴링 ── */
function pollForVideo(card, jobId) {
  const iv = setInterval(async () => {
    try {
      const data = await fetch('/status/' + jobId).then(r => r.json());
      if (data.status === 'done') {
        clearInterval(iv);
        setCardDone(card, jobId, data);
      } else if (data.status === 'error') {
        clearInterval(iv);
        setCardError(card, data.error || '렌더링 실패');
      }
    } catch { clearInterval(iv); setCardError(card, '서버 연결 오류'); }
  }, 2000);
}

/* ── 카드 UI ── */
function addCard(topic) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.id = 'card-tmp-' + Math.random().toString(36).slice(2, 8);
  card.innerHTML = `
    <div class="card-video-wrap">
      <div class="card-status">
        <div class="spinner"></div>
        <span class="card-status-text">AI가 코드를 생성하고 있습니다...</span>
      </div>
    </div>
    <div class="card-info">
      <span class="card-topic">${escHtml(topic)}</span>
      <span class="card-meta">${provider.toUpperCase()} <span class="step-badge generating">생성중</span></span>
    </div>`;
  document.getElementById('videoGrid').prepend(card);
  return card;
}

function updateCardStatus(card, status, msg) {
  const wrap = card.querySelector('.card-video-wrap');
  const spin = (status === 'generating' || status === 'rendering') ? '<div class="spinner"></div>' : '';
  wrap.innerHTML = `<div class="card-status">${spin}<span class="card-status-text">${escHtml(msg)}</span></div>`;
  const badge = card.querySelector('.step-badge');
  if (badge) { badge.className = `step-badge ${status}`; badge.textContent = statusLabel(status); }
}

function setCardDone(card, jobId, data) {
  const wrap = card.querySelector('.card-video-wrap');
  wrap.innerHTML = `<video controls loop src="/video/${jobId}"></video>`;
  const badge = card.querySelector('.step-badge');
  if (badge) { badge.className = 'step-badge done'; badge.textContent = '완료'; }

  const info = card.querySelector('.card-info');

  // Vault 저장 완료 배지
  if (data.vault_saved) {
    const vb = document.createElement('div');
    vb.className = 'vault-badge';
    vb.textContent = '✓ Obsidian에 저장됨';
    info.parentNode.insertBefore(vb, info.nextSibling);
    showToast('Obsidian Vault에 자동 저장됐습니다!');
  } else {
    showToast('영상 생성 완료!');
  }

  // 다운로드 버튼
  const dl = document.createElement('a');
  dl.href = `/download/${jobId}`;
  dl.download = '';
  dl.innerHTML = '<button class="download-btn">⬇ 저장</button>';
  info.appendChild(dl);
}

function setCardError(card, msg) {
  const wrap = card.querySelector('.card-video-wrap');
  wrap.innerHTML = `<div class="card-status"><span class="status-error">⚠ 오류</span><span style="font-size:11px;padding:0 14px;text-align:center">${escHtml((msg||'').slice(0,200))}</span></div>`;
  const badge = card.querySelector('.step-badge');
  if (badge) { badge.className = 'step-badge error'; badge.textContent = '오류'; }
}

function statusLabel(s) {
  return { generating:'생성중', preview:'검토대기', rendering:'렌더링', done:'완료', error:'오류' }[s] || s;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
