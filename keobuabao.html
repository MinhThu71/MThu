/**
 * dom.js – Query selector, render helpers, quản lý i18n
 * Không chứa logic game, chỉ thao tác DOM và chuỗi UI.
 */

// ─── i18n strings ─────────────────────────────────────────────────────────────
export const i18n = {
  vi: {
    title:          'Kéo – Búa – Bao',
    rock:           'Búa',
    paper:          'Bao',
    scissors:       'Kéo',
    win:            'Bạn thắng! 🎉',
    lose:           'Bạn thua! 😢',
    draw:           'Hòa! 🤝',
    playerScore:    'Người chơi',
    aiScore:        'Máy',
    roundsLeft:     'Vòng còn lại',
    roundsPlayed:   'Vòng đã chơi',
    history:        'Lịch sử',
    mode:           'Chế độ',
    modeSingle:     'Chơi nhanh',
    modeBo3:        'Bo3',
    modeBo5:        'Bo5',
    modeFirstToN:   'First to N',
    difficulty:     'Độ khó',
    easy:           'Dễ',
    medium:         'Vừa',
    hard:           'Khó',
    replay:         'Chơi lại vòng',
    reset:          'Đặt lại',
    resetConfirm:   'Đặt lại toàn bộ điểm và lịch sử? Hành động này không thể hoàn tác.',
    sound:          'Âm thanh',
    animations:     'Hiệu ứng',
    theme:          'Chủ đề',
    themeDark:      'Tối',
    themeLight:     'Sáng',
    lang:           'Ngôn ngữ',
    targetN:        'Mục tiêu N điểm',
    countdown3:     '3',
    countdown2:     '2',
    countdown1:     '1',
    countdownGo:    'Chọn!',
    matchWin:       'Bạn thắng loạt! 🏆',
    matchLose:      'Máy thắng loạt! 🤖',
    matchDraw:      'Loạt hòa! 🤝',
    progress:       'Tiến độ',
    shortcuts:      'Phím tắt',
    shortcutsDesc:  '1=Búa  2=Bao  3=Kéo  R=Chơi lại  M=Âm thanh  T=Đổi theme',
    help:           '?',
    version:        'v1.0.0',
    author:         'Rock–Paper–Scissors Game',
    close:          'Đóng',
    vs:             'vs',
    choose:         'Chọn của bạn',
    waiting:        'Đang chờ...',
    playerLabel:    'Bạn',
    aiLabel:        'Máy',
  },
  en: {
    title:          'Rock – Paper – Scissors',
    rock:           'Rock',
    paper:          'Paper',
    scissors:       'Scissors',
    win:            'You Win! 🎉',
    lose:           'You Lose! 😢',
    draw:           "It's a Draw! 🤝",
    playerScore:    'Player',
    aiScore:        'AI',
    roundsLeft:     'Rounds Left',
    roundsPlayed:   'Rounds Played',
    history:        'History',
    mode:           'Mode',
    modeSingle:     'Quick Play',
    modeBo3:        'Best of 3',
    modeBo5:        'Best of 5',
    modeFirstToN:   'First to N',
    difficulty:     'Difficulty',
    easy:           'Easy',
    medium:         'Medium',
    hard:           'Hard',
    replay:         'Play Again',
    reset:          'Reset',
    resetConfirm:   'Reset all scores and history? This cannot be undone.',
    sound:          'Sound',
    animations:     'Effects',
    theme:          'Theme',
    themeDark:      'Dark',
    themeLight:     'Light',
    lang:           'Language',
    targetN:        'Target N points',
    countdown3:     '3',
    countdown2:     '2',
    countdown1:     '1',
    countdownGo:    'Go!',
    matchWin:       'You Win the Match! 🏆',
    matchLose:      'AI Wins the Match! 🤖',
    matchDraw:      "Match Draw! 🤝",
    progress:       'Progress',
    shortcuts:      'Shortcuts',
    shortcutsDesc:  '1=Rock  2=Paper  3=Scissors  R=Replay  M=Sound  T=Theme',
    help:           '?',
    version:        'v1.0.0',
    author:         'Rock–Paper–Scissors Game',
    close:          'Close',
    vs:             'vs',
    choose:         'Make your choice',
    waiting:        'Waiting...',
    playerLabel:    'You',
    aiLabel:        'AI',
  },
};

// Ngôn ngữ hiện tại
let currentLang = 'vi';

/**
 * Đặt ngôn ngữ hiện tại.
 * @param {'vi'|'en'} lang
 */
export function setLang(lang) {
  if (i18n[lang]) currentLang = lang;
}

/**
 * Lấy chuỗi dịch theo khoá.
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  return (i18n[currentLang] || i18n.vi)[key] || key;
}

// ─── Query helpers ────────────────────────────────────────────────────────────

/**
 * Shortcut querySelector.
 * @param {string} selector
 * @param {Element} [root=document]
 * @returns {Element|null}
 */
export function $(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * Shortcut querySelectorAll trả về Array.
 * @param {string} selector
 * @param {Element} [root=document]
 * @returns {Element[]}
 */
export function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

// ─── Render helpers ───────────────────────────────────────────────────────────

/**
 * Thiết lập text cho element theo data-i18n.
 * Cập nhật toàn bộ phần tử có thuộc tính [data-i18n] trên trang.
 */
export function renderI18n() {
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    // Cập nhật nội dung hoặc aria-label
    if (el.dataset.i18nAttr) {
      el.setAttribute(el.dataset.i18nAttr, t(key));
    } else if (el.tagName === 'INPUT' && el.type === 'button') {
      el.value = t(key);
    } else {
      el.textContent = t(key);
    }
  });
}

/**
 * Tạo phần tử HTML đơn giản.
 * @param {string} tag
 * @param {object} attrs
 * @param {string|Element[]} [children]
 * @returns {Element}
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else el.setAttribute(k, v);
  }
  if (typeof children === 'string') {
    el.textContent = children;
  } else {
    children.forEach(c => el.appendChild(c));
  }
  return el;
}

/**
 * Render icon SVG use từ sprite.
 * @param {string} id – ID của symbol trong assets/icons.svg
 * @param {string} [cls] – class CSS
 * @returns {SVGElement}
 */
export function svgIcon(id, cls = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', `icon ${cls}`);
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `assets/icons.svg#${id}`);
  svg.appendChild(use);
  return svg;
}

/**
 * Render dòng lịch sử một lượt.
 * @param {{ playerChoice, aiChoice, result }} entry
 * @param {number} idx
 * @returns {Element}
 */
export function renderHistoryRow(entry, idx) {
  const { playerChoice, aiChoice, result } = entry;
  const resultClass = result === 'win' ? 'win' : result === 'lose' ? 'lose' : 'draw';
  const resultEmoji = result === 'win' ? '✓' : result === 'lose' ? '✗' : '=';

  const row = createElement('div', { class: `history-row ${resultClass}` });
  row.innerHTML = `
    <span class="hist-idx">#${idx + 1}</span>
    <svg class="icon sm" aria-hidden="true"><use href="assets/icons.svg#${playerChoice}"></use></svg>
    <span class="hist-vs">vs</span>
    <svg class="icon sm" aria-hidden="true"><use href="assets/icons.svg#${aiChoice}"></use></svg>
    <span class="hist-result ${resultClass}">${resultEmoji}</span>
  `;
  return row;
}

/**
 * Cập nhật thanh tiến trình.
 * @param {Element} barEl      – Phần tử thanh tiến trình fill
 * @param {number}  value      – Giá trị hiện tại
 * @param {number}  max        – Giá trị tối đa
 * @param {string}  [color]    – Màu CSS
 */
export function updateProgressBar(barEl, value, max, color) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  barEl.style.width = `${pct}%`;
  if (color) barEl.style.background = color;
}
