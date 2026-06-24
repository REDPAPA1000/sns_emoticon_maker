let provider = 'ollama';
let quality   = 'l';
let activeJobId = null;   // 현재 검토 모달에 열린 job

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
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Step 1: 시나리오 생성 ── */
function startGenerate() {
  const topic = document.getElementById('topicInput').value.trim();
  if (!topic) { showToast('주제를 입력해주세요'); return; }

  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  document.getElementById('btnText').textContent = '생성 중...';

  const card = addCard(topic, 'generating');
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
      pollForPreview(card, data.job_id, topic);
    })
    .catch(err => setCardError(card, err.message))
    .finally(() => {
      btn.disabled = false;
      document.getElementById('btnText').textContent = '시나리오 생성';
    });
}

/* 코드가 준비될 때까지 폴링 */
function pollForPreview(card, jobId, topic) {
  updateCardStatus(card, 'generating', 'AI가 코드를 생성하고 있습니다...');
  const iv = setInterval(async () => {
    try {
      const res  = await fetch('/status/' + jobId);
      const data = await res.json();

      if (data.status === 'preview') {
        clearInterval(iv);
        updateCardStatus(card, 'preview', '코드 검토 준비 완료 — 클릭하여 확인');
        card.style.cursor = 'pointer';
        card.onclick = () => openModal(jobId, topic, data.code);
        showToast('코드가 준비됐습니다. 카드를 클릭해 검토하세요.');
      } else if (data.status === 'error') {
        clearInterval(iv);
        setCardError(card, data.error || '코드 생성 실패');
      }
    } catch (e) {
      clearInterval(iv);
      setCardError(card, '서버 연결 오류');
    }
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

      // 카드 상태를 렌더링 중으로 변경
      const card = document.getElementById('card-' + jobId);
      if (card) {
        card.style.cursor = 'default';
        card.onclick = null;
        updateCardStatus(card, 'rendering', 'Manim 렌더링 중...');
        pollForVideo(card, jobId);
      }
    })
    .catch(err => {
      showToast('서버 오류: ' + err.message);
      renderBtn.disabled = false;
    });
}

/* 영상 완료까지 폴링 */
function pollForVideo(card, jobId) {
  const iv = setInterval(async () => {
    try {
      const res  = await fetch('/status/' + jobId);
      const data = await res.json();
      if (data.status === 'done') {
        clearInterval(iv);
        setCardDone(card, jobId);
        showToast('영상 생성 완료!');
      } else if (data.status === 'error') {
        clearInterval(iv);
        setCardError(card, data.error || '렌더링 실패');
      }
    } catch (e) {
      clearInterval(iv);
      setCardError(card, '서버 연결 오류');
    }
  }, 2000);
}

/* ── 카드 UI 헬퍼 ── */
function addCard(topic, status) {
  const id   = Math.random().toString(36).slice(2, 8);
  const card = document.createElement('div');
  card.className = 'video-card';
  card.id = 'card-' + id;
  card.innerHTML = `
    <div class="card-video-wrap">
      <div class="card-status">
        <div class="spinner"></div>
        <span class="card-status-text">AI가 코드를 생성하고 있습니다...</span>
      </div>
    </div>
    <div class="card-info">
      <span class="card-topic">${escHtml(topic)}</span>
      <span class="card-meta">${provider.toUpperCase()} <span class="step-badge ${status}">${statusLabel(status)}</span></span>
    </div>`;
  document.getElementById('videoGrid').prepend(card);
  // job_id가 정해지기 전이라 임시 id 사용; pollForPreview 에서 data-job 세팅
  return card;
}

// 카드 id 기반 재조회를 위해 job_id → card 매핑은 pollForPreview 호출 전에 data-job 속성으로 고정
function pollForPreview(card, jobId, topic) {
  card.id = 'card-' + jobId;
  updateCardStatus(card, 'generating', 'AI가 코드를 생성하고 있습니다...');
  const iv = setInterval(async () => {
    try {
      const res  = await fetch('/status/' + jobId);
      const data = await res.json();
      if (data.status === 'preview') {
        clearInterval(iv);
        updateCardStatus(card, 'preview', '▶ 클릭하여 코드 검토 후 영상 제작');
        card.style.cursor = 'pointer';
        card.onclick = () => openModal(jobId, topic, data.code);
        showToast('코드 준비 완료 — 카드를 클릭해 검토하세요.');
      } else if (data.status === 'error') {
        clearInterval(iv);
        setCardError(card, data.error || '코드 생성 실패');
      }
    } catch (e) {
      clearInterval(iv);
      setCardError(card, '서버 연결 오류');
    }
  }, 2000);
}

function updateCardStatus(card, status, msg) {
  const wrap = card.querySelector('.card-video-wrap');
  const spinnerHtml = (status === 'generating' || status === 'rendering')
    ? '<div class="spinner"></div>' : '';
  wrap.innerHTML = `
    <div class="card-status">
      ${spinnerHtml}
      <span class="card-status-text">${escHtml(msg)}</span>
    </div>`;
  const badge = card.querySelector('.step-badge');
  if (badge) { badge.className = `step-badge ${status}`; badge.textContent = statusLabel(status); }
}

function setCardDone(card, jobId) {
  const wrap = card.querySelector('.card-video-wrap');
  wrap.innerHTML = `<video controls loop src="/video/${jobId}"></video>`;
  const badge = card.querySelector('.step-badge');
  if (badge) { badge.className = 'step-badge done'; badge.textContent = '완료'; }
  const info = card.querySelector('.card-info');
  const dl = document.createElement('a');
  dl.href = `/download/${jobId}`;
  dl.download = '';
  dl.innerHTML = '<button class="download-btn">⬇ 저장</button>';
  info.appendChild(dl);
}

function setCardError(card, msg) {
  const wrap = card.querySelector('.card-video-wrap');
  wrap.innerHTML = `
    <div class="card-status">
      <span class="status-error">⚠ 오류</span>
      <span style="font-size:11px;padding:0 14px;text-align:center">${escHtml((msg || '').slice(0, 200))}</span>
    </div>`;
  const badge = card.querySelector('.step-badge');
  if (badge) { badge.className = 'step-badge error'; badge.textContent = '오류'; }
}

function statusLabel(s) {
  return { generating:'생성중', preview:'검토대기', rendering:'렌더링', done:'완료', error:'오류' }[s] || s;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── 단축키 ── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('topicInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); startGenerate(); }
  });
  // Escape 키로 모달 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
  // 모달 배경 클릭으로 닫기
  document.getElementById('codeModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
});
