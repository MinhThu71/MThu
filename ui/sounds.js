/**
 * sounds.js – Quản lý âm thanh: click, thắng, thua, hòa
 * Dùng Web Audio API tổng hợp âm thanh đơn giản (không cần file .mp3 ngoài).
 * Có thể thay bằng file .mp3 thực khi cần.
 */

// Trạng thái bật/tắt âm
let soundEnabled = true;

// AudioContext dùng chung (khởi tạo lazily sau gesture người dùng)
let audioCtx = null;

/**
 * Lấy AudioContext, tạo mới nếu chưa có.
 * @returns {AudioContext|null}
 */
function getCtx() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume nếu bị suspend (chính sách autoplay)
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch (e) {
    return null;
  }
}

/**
 * Phát âm thanh tổng hợp.
 * @param {object} opts – { frequency, type, duration, gain }
 */
function playTone({ frequency = 440, type = 'sine', duration = 0.15, gain = 0.3 }) {
  if (!soundEnabled) return;
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  // Fade out để tránh click khi kết thúc
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

/**
 * Bật/tắt âm thanh.
 * @param {boolean} enabled
 */
export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
}

/**
 * Kiểm tra trạng thái âm thanh.
 * @returns {boolean}
 */
export function isSoundEnabled() {
  return soundEnabled;
}

// ─── Các loại âm thanh ───────────────────────────────────────────────────────

/** Âm click khi nhấn nút chọn */
export function playClick() {
  playTone({ frequency: 600, type: 'sine', duration: 0.08, gain: 0.2 });
}

/** Âm thắng – nốt nhạc vui */
export function playWin() {
  playTone({ frequency: 523, type: 'sine', duration: 0.1, gain: 0.3 });
  setTimeout(() => playTone({ frequency: 659, type: 'sine', duration: 0.1, gain: 0.3 }), 100);
  setTimeout(() => playTone({ frequency: 784, type: 'sine', duration: 0.2, gain: 0.35 }), 200);
}

/** Âm thua – nốt nhạc buồn */
export function playLose() {
  playTone({ frequency: 330, type: 'triangle', duration: 0.15, gain: 0.3 });
  setTimeout(() => playTone({ frequency: 261, type: 'triangle', duration: 0.25, gain: 0.25 }), 150);
}

/** Âm hòa – nốt trung tính */
export function playDraw() {
  playTone({ frequency: 440, type: 'sine', duration: 0.2, gain: 0.25 });
}

/** Âm đếm ngược */
export function playCountdown() {
  playTone({ frequency: 800, type: 'square', duration: 0.08, gain: 0.15 });
}
