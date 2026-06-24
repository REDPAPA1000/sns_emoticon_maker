let provider = 'ollama';
let quality = 'l';

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

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function generate() {
  const topic = document.getElementById('topicInput').value.trim();
  if (!topic) { showToast('주제를 입력해주세요'); return; }

  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  document.getElementById('btnText').textContent = '생성 중...';

  // 카드 추가
  const card = addCard(topic);
  document.getElementById('emptyState')?.remove();

  fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, provider, quality }),
  })
    .then(r => r.json())
    .then(data => {
      if (data.error) { setCardError(card, data.error); return; }
      pollStatus(card, data.job_id);
      document.getElementById('topicInput').value = '';
    })
    .catch(err => setCardError(card, err.message))
    .finally(() => {
      btn.disabled = false;
      document.getElementById('btnText').textContent = '영상 생성';
    });
}

function addCard(topic) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.innerHTML = `
    <div class="card-video-wrap">
      <div class="card-status">
        <div class="spinner"></div>
        <span id="statusText-${card.id}">AI가 코드를 생성하고 있습니다...</span>
      </div>
    </div>
    <div class="card-info">
      <span class="card-topic">${escHtml(topic)}</span>
      <span class="card-meta">${provider.toUpperCase()}</span>
    </div>`;
  card.id = 'card-' + Math.random().toString(36).slice(2, 8);
  document.getElementById('videoGrid').prepend(card);
  return card;
}

function pollStatus(card, jobId) {
  const interval = setInterval(async () => {
    try {
      const res = await fetch('/status/' + jobId);
      const data = await res.json();
      const statusEl = card.querySelector('[id^="statusText"]');
      if (statusEl) {
        const msgs = {
          running: 'AI가 코드를 생성·렌더링 중입니다...',
          pending: '대기 중...',
        };
        statusEl.textContent = msgs[data.status] || '처리 중...';
      }
      if (data.status === 'done') {
        clearInterval(interval);
        setCardDone(card, jobId, data);
        showToast('영상 생성 완료!');
      } else if (data.status === 'error') {
        clearInterval(interval);
        setCardError(card, data.error || '렌더링 실패');
      }
    } catch (e) {
      clearInterval(interval);
      setCardError(card, '서버 연결 오류');
    }
  }, 2000);
}

function setCardDone(card, jobId, data) {
  const wrap = card.querySelector('.card-video-wrap');
  wrap.innerHTML = `<video controls loop src="/video/${jobId}"></video>`;

  const info = card.querySelector('.card-info');
  const dlBtn = document.createElement('a');
  dlBtn.href = `/download/${jobId}`;
  dlBtn.download = '';
  dlBtn.innerHTML = '<button class="download-btn">⬇ 저장</button>';
  info.appendChild(dlBtn);
}

function setCardError(card, msg) {
  const wrap = card.querySelector('.card-video-wrap');
  wrap.innerHTML = `<div class="card-status"><span class="status-error">⚠ 오류</span><span style="font-size:11px;padding:0 12px;text-align:center">${escHtml(msg?.slice(0, 150) || '')}</span></div>`;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// 엔터키로 생성
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('topicInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate(); }
  });
});
