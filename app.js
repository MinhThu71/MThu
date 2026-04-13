/**
 * app.js – Điểm vào chính, khởi tạo game, gắn sự kiện UI
 * Import các mô-đun game/ và ui/; không chứa logic game thuần túy.
 */

// ─── Import mô-đun ────────────────────────────────────────────────────────────
import { CHOICES, MODES, createMatchState, playRound, roundsRemaining } from './game/engine.js';
import { aiChoose }         from './game/ai.js';
import { getConfig, saveConfig, getStats, updateStats, addHistory, getHistory, clearAll } from './game/storage.js';
import { $, $$, t, setLang, renderI18n, svgIcon, renderHistoryRow, updateProgressBar } from './ui/dom.js';
import { setAnimationsEnabled, isAnimationsEnabled, animateWin, animateLose, animateDraw, runCountdown, launchConfetti, flipReveal } from './ui/animations.js';
import { setSoundEnabled, isSoundEnabled, playClick, playWin, playLose, playDraw, playCountdown } from './ui/sounds.js';

// ─── Trạng thái toàn cục ─────────────────────────────────────────────────────
let config       = {};       // Cấu hình từ storage
let matchState   = null;     // Trạng thái loạt trận hiện tại
let playerHistory = [];      // Lịch sử lựa chọn của người chơi (dùng cho AI)
let roundHistory  = [];      // Lịch sử vòng (dùng cho AI fairness check)
let isPlaying    = false;    // Đang trong lượt chơi (khoá nút)

// ─── Tham chiếu DOM ──────────────────────────────────────────────────────────
const DOM = {};

// ─── Khởi tạo ─────────────────────────────────────────────────────────────────

/**
 * Khởi tạo toàn bộ ứng dụng khi DOM sẵn sàng.
 */
function init() {
  // Lấy cấu hình đã lưu
  config = getConfig();

  // Áp dụng theme
  applyTheme(config.theme);

  // Đặt ngôn ngữ
  setLang(config.language);

  // Đặt trạng thái âm thanh & hiệu ứng
  setSoundEnabled(config.sound);
  setAnimationsEnabled(config.animations);

  // Query DOM
  queryDOM();

  // Gắn sự kiện
  bindEvents();

  // Render giao diện lần đầu
  renderI18n();
  renderControls();
  syncControlUI();
  startNewMatch();
  renderHistory();
  renderStats();

  // Phím tắt bàn phím
  document.addEventListener('keydown', handleKeydown);

  // Responsive: đồng bộ canvas confetti
  window.addEventListener('resize', () => {
    if (DOM.confettiCanvas) {
      DOM.confettiCanvas.width  = window.innerWidth;
      DOM.confettiCanvas.height = window.innerHeight;
    }
  });
}

// ─── Query DOM ────────────────────────────────────────────────────────────────
function queryDOM() {
  // Header
  DOM.btnTheme    = $('#btn-theme');
  DOM.btnLang     = $('#btn-lang');
  DOM.btnHelp     = $('#btn-help');

  // Play area
  DOM.roundInfo   = $('#round-info');
  DOM.roundNum    = $('#round-num');
  DOM.roundLeft   = $('#round-left');
  DOM.countdown   = $('#countdown');
  DOM.choiceBtns  = $$('.choice-btn');
  DOM.battlePlayer = $('#battle-player');
  DOM.battleAI    = $('#battle-ai');
  DOM.playerIcon  = $('#player-icon');
  DOM.aiIcon      = $('#ai-icon');
  DOM.playerName  = $('#player-choice-name');
  DOM.aiName      = $('#ai-choice-name');
  DOM.resultBanner = $('#result-banner');

  // Scoreboard
  DOM.playerScoreVal = $('#player-score-val');
  DOM.aiScoreVal     = $('#ai-score-val');
  DOM.roundsPlayedVal = $('#rounds-played-val');
  DOM.progressFillPlayer = $('#progress-fill-player');
  DOM.progressFillAI     = $('#progress-fill-ai');
  DOM.progressLabelPlayer = $('#progress-label-player');
  DOM.progressLabelAI    = $('#progress-label-ai');

  // History
  DOM.historyList = $('#history-list');

  // Controls
  DOM.modeSelect       = $('#mode-select');
  DOM.diffSelect       = $('#diff-select');
  DOM.nTargetRow       = $('#n-target-row');
  DOM.nTargetInput     = $('#n-target');
  DOM.toggleSound      = $('#toggle-sound');
  DOM.toggleAnimations = $('#toggle-animations');
  DOM.btnReplay        = $('#btn-replay');
  DOM.btnReset         = $('#btn-reset');

  // Modals
  DOM.helpModal        = $('#help-modal');
  DOM.resetModal       = $('#reset-modal');
  DOM.matchResultOverlay = $('#match-result-overlay');
  DOM.matchResultTitle   = $('#match-result-title');
  DOM.matchResultScore   = $('#match-result-score');
  DOM.btnMatchReplay     = $('#btn-match-replay');
  DOM.btnConfirmReset    = $('#btn-confirm-reset');
  DOM.btnCancelReset     = $('#btn-cancel-reset');
  DOM.btnCloseHelp       = $('#btn-close-help');
  DOM.btnCloseMatchResult = $('#btn-close-match-result');

  // Canvas & live region
  DOM.confettiCanvas  = $('#confetti-canvas');
  DOM.liveRegion      = $('#live-region');
}

// ─── Gắn sự kiện ─────────────────────────────────────────────────────────────
function bindEvents() {
  // Nút lựa chọn Búa/Bao/Kéo
  DOM.choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isPlaying) return;
      playClick();
      handlePlayerChoice(btn.dataset.choice);
    });
  });

  // Theme toggle
  DOM.btnTheme?.addEventListener('click', () => {
    config.theme = config.theme === 'dark' ? 'light' : 'dark';
    saveConfig({ theme: config.theme });
    applyTheme(config.theme);
    updateThemeBtn();
  });

  // Language toggle
  DOM.btnLang?.addEventListener('click', () => {
    config.language = config.language === 'vi' ? 'en' : 'vi';
    saveConfig({ language: config.language });
    setLang(config.language);
    renderI18n();
    renderControls();
    syncControlUI();
    renderHistory();
    renderStats();
    updateLangBtn();
  });

  // Help modal
  DOM.btnHelp?.addEventListener('click', () => openModal(DOM.helpModal));
  DOM.btnCloseHelp?.addEventListener('click', () => closeModal(DOM.helpModal));
  DOM.helpModal?.addEventListener('click', e => { if (e.target === DOM.helpModal) closeModal(DOM.helpModal); });

  // Mode select
  DOM.modeSelect?.addEventListener('change', () => {
    config.mode = DOM.modeSelect.value;
    saveConfig({ mode: config.mode });
    toggleNTargetRow();
    startNewMatch();
  });

  // Difficulty select
  DOM.diffSelect?.addEventListener('change', () => {
    config.difficulty = DOM.diffSelect.value;
    saveConfig({ difficulty: config.difficulty });
  });

  // N target input
  DOM.nTargetInput?.addEventListener('change', () => {
    const val = parseInt(DOM.nTargetInput.value, 10);
    config.targetN = Math.min(10, Math.max(3, isNaN(val) ? 3 : val));
    DOM.nTargetInput.value = config.targetN;
    saveConfig({ targetN: config.targetN });
    startNewMatch();
  });

  // Sound toggle
  DOM.toggleSound?.addEventListener('change', () => {
    config.sound = DOM.toggleSound.checked;
    saveConfig({ sound: config.sound });
    setSoundEnabled(config.sound);
  });

  // Animations toggle
  DOM.toggleAnimations?.addEventListener('change', () => {
    config.animations = DOM.toggleAnimations.checked;
    saveConfig({ animations: config.animations });
    setAnimationsEnabled(config.animations);
  });

  // Replay round
  DOM.btnReplay?.addEventListener('click', () => {
    playClick();
    startNewMatch();
  });

  // Reset (mở modal xác nhận)
  DOM.btnReset?.addEventListener('click', () => {
    playClick();
    openModal(DOM.resetModal);
  });

  // Xác nhận reset
  DOM.btnConfirmReset?.addEventListener('click', () => {
    clearAll();
    config = getConfig();
    playerHistory = [];
    roundHistory  = [];
    setLang(config.language);
    renderI18n();
    syncControlUI();
    startNewMatch();
    renderHistory();
    renderStats();
    closeModal(DOM.resetModal);
  });

  // Huỷ reset
  DOM.btnCancelReset?.addEventListener('click', () => closeModal(DOM.resetModal));
  DOM.resetModal?.addEventListener('click', e => { if (e.target === DOM.resetModal) closeModal(DOM.resetModal); });

  // Match result overlay
  DOM.btnMatchReplay?.addEventListener('click', () => {
    closeModal(DOM.matchResultOverlay);
    startNewMatch();
  });

  DOM.btnCloseMatchResult?.addEventListener('click', () => {
    closeModal(DOM.matchResultOverlay);
    startNewMatch();
  });

  DOM.matchResultOverlay?.addEventListener('click', e => {
    if (e.target === DOM.matchResultOverlay) {
      closeModal(DOM.matchResultOverlay);
      startNewMatch();
    }
  });
}

// ─── Xử lý lựa chọn người chơi ───────────────────────────────────────────────

/**
 * Bắt đầu flow đếm ngược + xử lý lượt khi người chơi chọn.
 * @param {string} choice – CHOICES.*
 */
function handlePlayerChoice(choice) {
  if (isPlaying || matchState?.finished) return;
  isPlaying = true;
  setChoiceButtonsDisabled(true);

  // Đếm ngược
  const steps = [t('countdown3'), t('countdown2'), t('countdown1'), t('countdownGo')];
  runCountdown(DOM.countdown, steps, () => {
    // Sau khi đếm xong → xử lý vòng
    processRound(choice);
  });
}

/**
 * Xử lý một vòng: gọi AI, tính kết quả, cập nhật UI.
 * @param {string} playerChoice
 */
function processRound(playerChoice) {
  // AI chọn
  const aiChoice = aiChoose(playerHistory, roundHistory, config.difficulty);

  // Tính kết quả
  const { state, result } = playRound(matchState, playerChoice, aiChoice);
  matchState = state;

  // Cập nhật lịch sử dùng cho AI
  playerHistory.push(playerChoice);
  if (playerHistory.length > 20) playerHistory.shift();
  roundHistory.push({ result }); // 'win'|'lose'|'draw' từ góc nhìn người chơi
  if (roundHistory.length > 20) roundHistory.shift();

  // Lưu vào storage
  updateStats(result);
  addHistory({ playerChoice, aiChoice, result });

  // Cập nhật UI
  flipReveal(DOM.battlePlayer, () => updateBattleCard('player', playerChoice));
  flipReveal(DOM.battleAI,     () => updateBattleCard('ai',     aiChoice));

  // Hiệu ứng & âm thanh
  setTimeout(() => {
    showResult(result, playerChoice, aiChoice);
    isPlaying = false;

    // Nếu loạt kết thúc
    if (matchState.finished) {
      setTimeout(() => showMatchResult(), 800);
    } else {
      setChoiceButtonsDisabled(false);
    }

    renderStats();
    renderHistory();
  }, 300);
}

/**
 * Hiển thị kết quả vòng (banner + animation + âm).
 */
function showResult(result, playerChoice, aiChoice) {
  // Banner
  DOM.resultBanner.className = `result-banner ${result} slide-in`;
  DOM.resultBanner.textContent = t(result);

  // Animation trên card
  if (result === 'win') {
    animateWin(DOM.battlePlayer);
    animateLose(DOM.battleAI);
    playWin();
    launchConfetti(DOM.confettiCanvas);
  } else if (result === 'lose') {
    animateLose(DOM.battlePlayer);
    animateWin(DOM.battleAI);
    playLose();
  } else {
    animateDraw(DOM.battlePlayer);
    animateDraw(DOM.battleAI);
    playDraw();
  }

  // Live region cho screen reader
  announce(t(result));

  // Cập nhật scoreboard
  DOM.playerScoreVal.textContent = matchState.playerScore;
  DOM.aiScoreVal.textContent     = matchState.aiScore;
  DOM.roundsPlayedVal.textContent = matchState.roundsPlayed;
  updateProgressBars();
}

/**
 * Hiển thị kết quả loạt trận.
 */
function showMatchResult() {
  const { winner, playerScore, aiScore } = matchState;
  let titleKey = 'matchDraw';
  if (winner === 'player') titleKey = 'matchWin';
  if (winner === 'ai')     titleKey = 'matchLose';

  DOM.matchResultTitle.textContent = t(titleKey);
  DOM.matchResultScore.textContent = `${playerScore} – ${aiScore}`;

  // Thêm class màu
  DOM.matchResultOverlay.querySelector('.match-result-card').className =
    `match-result-card glass ${winner === 'player' ? 'win' : winner === 'ai' ? 'lose' : 'draw'}`;

  openModal(DOM.matchResultOverlay);
}

// ─── Hiển thị card trận đấu ───────────────────────────────────────────────────

/**
 * Cập nhật card hiển thị lựa chọn.
 * @param {'player'|'ai'} who
 * @param {string} choice
 */
function updateBattleCard(who, choice) {
  const iconEl = who === 'player' ? DOM.playerIcon  : DOM.aiIcon;
  const nameEl = who === 'player' ? DOM.playerName  : DOM.aiName;
  if (!iconEl || !nameEl) return;

  // Xoá icon cũ, thêm icon mới
  iconEl.innerHTML = '';
  const svg = svgIcon(choice, 'xl');
  iconEl.appendChild(svg);
  nameEl.textContent = t(choice);
}

// ─── Bắt đầu loạt mới ────────────────────────────────────────────────────────
function startNewMatch() {
  const mode = config.mode || 'single';
  const n    = parseInt(config.targetN, 10) || 3;
  matchState   = createMatchState(mode, n);
  playerHistory = [];
  roundHistory  = [];
  isPlaying     = false;

  // Reset UI
  setChoiceButtonsDisabled(false);
  DOM.resultBanner.className   = 'result-banner';
  DOM.resultBanner.textContent = '';
  DOM.countdown.textContent    = '';

  // Reset cards
  resetBattleCard(DOM.battlePlayer, t('playerLabel'));
  resetBattleCard(DOM.battleAI,     t('aiLabel'));

  // Cập nhật scores
  DOM.playerScoreVal.textContent  = 0;
  DOM.aiScoreVal.textContent      = 0;
  DOM.roundsPlayedVal.textContent = 0;
  updateRoundInfo();
  updateProgressBars();
}

/**
 * Đặt lại card trận đấu về trạng thái rỗng.
 */
function resetBattleCard(cardEl, label) {
  if (!cardEl) return;
  const iconEl = cardEl.querySelector('.choice-icon');
  const nameEl = cardEl.querySelector('.choice-name');
  if (iconEl) iconEl.innerHTML = `<span style="font-size:2.5rem;opacity:0.2">?</span>`;
  if (nameEl) nameEl.textContent = '—';
}

// ─── Cập nhật UI helpers ─────────────────────────────────────────────────────

function updateRoundInfo() {
  if (!matchState) return;
  const left = roundsRemaining(matchState);
  if (DOM.roundNum)  DOM.roundNum.textContent  = matchState.roundsPlayed + 1;
  if (DOM.roundLeft) DOM.roundLeft.textContent = left;
}

function updateProgressBars() {
  if (!matchState) return;
  const target = matchState.targetScore;
  updateProgressBar(DOM.progressFillPlayer, matchState.playerScore, target, null);
  updateProgressBar(DOM.progressFillAI,     matchState.aiScore,     target, null);
  if (DOM.progressLabelPlayer) DOM.progressLabelPlayer.textContent = `${matchState.playerScore}/${target}`;
  if (DOM.progressLabelAI)     DOM.progressLabelAI.textContent     = `${matchState.aiScore}/${target}`;
}

function setChoiceButtonsDisabled(disabled) {
  DOM.choiceBtns.forEach(btn => { btn.disabled = disabled; });
}

/** Render lịch sử lượt */
function renderHistory() {
  if (!DOM.historyList) return;
  const history = getHistory();
  DOM.historyList.innerHTML = '';
  const recent = history.slice(-10).reverse();
  recent.forEach((entry, idx) => {
    const row = renderHistoryRow(entry, history.length - 1 - idx);
    DOM.historyList.appendChild(row);
  });
}

/** Render thống kê tổng */
function renderStats() {
  const stats = getStats();
  const totalEl = $('#total-rounds');
  const winsEl  = $('#total-wins');
  const losesEl = $('#total-loses');
  const drawsEl = $('#total-draws');
  if (totalEl) totalEl.textContent = stats.totalRounds;
  if (winsEl)  winsEl.textContent  = stats.totalWins;
  if (losesEl) losesEl.textContent = stats.totalLoses;
  if (drawsEl) drawsEl.textContent = stats.totalDraws;
}

/** Render các nhãn control theo i18n */
function renderControls() {
  // Mode options
  if (DOM.modeSelect) {
    const opts = DOM.modeSelect.querySelectorAll('option');
    opts.forEach(opt => {
      const key = opt.dataset.i18n;
      if (key) opt.textContent = t(key);
    });
  }
  // Diff options
  if (DOM.diffSelect) {
    const opts = DOM.diffSelect.querySelectorAll('option');
    opts.forEach(opt => {
      const key = opt.dataset.i18n;
      if (key) opt.textContent = t(key);
    });
  }
}

/** Đồng bộ giá trị control từ config */
function syncControlUI() {
  if (DOM.modeSelect) DOM.modeSelect.value  = config.mode       || 'single';
  if (DOM.diffSelect) DOM.diffSelect.value  = config.difficulty || 'medium';
  if (DOM.nTargetInput) DOM.nTargetInput.value = config.targetN || 3;
  if (DOM.toggleSound)      DOM.toggleSound.checked      = config.sound      !== false;
  if (DOM.toggleAnimations) DOM.toggleAnimations.checked = config.animations !== false;
  toggleNTargetRow();
  updateThemeBtn();
  updateLangBtn();
}

function toggleNTargetRow() {
  if (!DOM.nTargetRow) return;
  DOM.nTargetRow.classList.toggle('hidden', config.mode !== 'firstToN');
}

function updateThemeBtn() {
  if (!DOM.btnTheme) return;
  const isDark = config.theme !== 'light';
  DOM.btnTheme.innerHTML = '';
  DOM.btnTheme.appendChild(svgIcon(isDark ? 'sun' : 'moon'));
  DOM.btnTheme.setAttribute('aria-label', isDark ? t('themeLight') : t('themeDark'));
  DOM.btnTheme.title = isDark ? t('themeLight') : t('themeDark');
}

function updateLangBtn() {
  if (!DOM.btnLang) return;
  DOM.btnLang.textContent = config.language === 'vi' ? 'EN' : 'VI';
  DOM.btnLang.setAttribute('aria-label', t('lang'));
}

// ─── Theme ────────────────────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
}

// ─── Modal helpers ────────────────────────────────────────────────────────────
function openModal(el) {
  if (!el) return;
  el.classList.add('open');
  // Focus trap: focus nút đầu tiên
  const first = el.querySelector('button');
  if (first) setTimeout(() => first.focus(), 50);
}

function closeModal(el) {
  if (!el) return;
  el.classList.remove('open');
}

// ─── Live region ──────────────────────────────────────────────────────────────
function announce(msg) {
  if (!DOM.liveRegion) return;
  DOM.liveRegion.textContent = '';
  setTimeout(() => { DOM.liveRegion.textContent = msg; }, 50);
}

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────
function handleKeydown(e) {
  // Bỏ qua khi đang gõ vào input
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  // Bỏ qua khi modal đang mở
  if (DOM.helpModal?.classList.contains('open')  ||
      DOM.resetModal?.classList.contains('open') ||
      DOM.matchResultOverlay?.classList.contains('open')) {
    if (e.key === 'Escape') {
      closeModal(DOM.helpModal);
      closeModal(DOM.resetModal);
      closeModal(DOM.matchResultOverlay);
    }
    return;
  }

  switch (e.key) {
    case '1': handlePlayerChoice(CHOICES.ROCK);     break; // 1 = Búa
    case '2': handlePlayerChoice(CHOICES.PAPER);    break; // 2 = Bao
    case '3': handlePlayerChoice(CHOICES.SCISSORS); break; // 3 = Kéo
    case 'r': case 'R': startNewMatch(); break;
    case 'm': case 'M':
      config.sound = !config.sound;
      saveConfig({ sound: config.sound });
      setSoundEnabled(config.sound);
      if (DOM.toggleSound) DOM.toggleSound.checked = config.sound;
      break;
    case 't': case 'T':
      config.theme = config.theme === 'dark' ? 'light' : 'dark';
      saveConfig({ theme: config.theme });
      applyTheme(config.theme);
      updateThemeBtn();
      break;
    case '?':
      openModal(DOM.helpModal);
      break;
  }
}

// ─── Đăng ký Service Worker (PWA offline) ────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW không bắt buộc – bỏ qua lỗi
    });
  });
}

// ─── Khởi chạy ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
