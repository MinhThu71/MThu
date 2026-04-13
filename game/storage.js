/**
 * storage.js – Quản lý lưu trữ LocalStorage
 * Ghi/đọc điểm tổng, lịch sử lượt, cấu hình game.
 * Có fallback an toàn khi localStorage bị chặn.
 */

const KEYS = {
  STATS:   'rps_stats',
  HISTORY: 'rps_history',
  CONFIG:  'rps_config',
};

// Số lượt lịch sử lưu tối đa
const MAX_HISTORY = 20;

// Cấu hình mặc định
const DEFAULT_CONFIG = {
  theme:      'dark',
  sound:      true,
  animations: true,
  language:   'vi',
  difficulty: 'medium',
  mode:       'single',
  targetN:    3,
};

// Thống kê mặc định
const DEFAULT_STATS = {
  totalWins:   0,
  totalLoses:  0,
  totalDraws:  0,
  totalRounds: 0,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Lưu an toàn vào localStorage.
 * @param {string} key
 * @param {*} value
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // localStorage bị chặn hoặc đầy – bỏ qua
  }
}

/**
 * Đọc an toàn từ localStorage.
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

// ─── Thống kê ────────────────────────────────────────────────────────────────

/**
 * Lấy thống kê tổng.
 * @returns {object}
 */
export function getStats() {
  return safeGet(KEYS.STATS, { ...DEFAULT_STATS });
}

/**
 * Cập nhật thống kê sau một vòng.
 * @param {string} result – 'win' | 'lose' | 'draw'
 */
export function updateStats(result) {
  const stats = getStats();
  stats.totalRounds++;
  if (result === 'win')  stats.totalWins++;
  if (result === 'lose') stats.totalLoses++;
  if (result === 'draw') stats.totalDraws++;
  safeSet(KEYS.STATS, stats);
}

/**
 * Xóa sạch thống kê.
 */
export function clearStats() {
  safeSet(KEYS.STATS, { ...DEFAULT_STATS });
}

// ─── Lịch sử ─────────────────────────────────────────────────────────────────

/**
 * Lấy lịch sử lượt.
 * @returns {Array<{playerChoice, aiChoice, result}>}
 */
export function getHistory() {
  return safeGet(KEYS.HISTORY, []);
}

/**
 * Thêm một lượt vào lịch sử, giới hạn MAX_HISTORY.
 * @param {{ playerChoice: string, aiChoice: string, result: string }} entry
 */
export function addHistory(entry) {
  const history = getHistory();
  history.push(entry);
  if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
  safeSet(KEYS.HISTORY, history);
}

/**
 * Xóa toàn bộ lịch sử.
 */
export function clearHistory() {
  safeSet(KEYS.HISTORY, []);
}

// ─── Cấu hình ────────────────────────────────────────────────────────────────

/**
 * Lấy cấu hình (merge với mặc định).
 * @returns {object}
 */
export function getConfig() {
  const saved = safeGet(KEYS.CONFIG, {});
  return { ...DEFAULT_CONFIG, ...saved };
}

/**
 * Lưu một hoặc nhiều khoá cấu hình.
 * @param {object} partial – Các khoá cần cập nhật
 */
export function saveConfig(partial) {
  const config = getConfig();
  safeSet(KEYS.CONFIG, { ...config, ...partial });
}

/**
 * Xóa toàn bộ cấu hình (reset về mặc định).
 */
export function clearConfig() {
  safeSet(KEYS.CONFIG, { ...DEFAULT_CONFIG });
}

/**
 * Xóa tất cả dữ liệu game.
 */
export function clearAll() {
  clearStats();
  clearHistory();
  clearConfig();
}
