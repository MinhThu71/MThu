/**
 * animations.js – Hiệu ứng thắng/thua/hòa, confetti, các animation helper
 * Sử dụng CSS class + canvas confetti thuần JS, không thư viện ngoài.
 */

// ─── Trạng thái toggle hiệu ứng ──────────────────────────────────────────────
let animationsEnabled = true;

/**
 * Bật/tắt hiệu ứng.
 * @param {boolean} enabled
 */
export function setAnimationsEnabled(enabled) {
  animationsEnabled = enabled;
}

/**
 * Kiểm tra trạng thái hiệu ứng.
 * @returns {boolean}
 */
export function isAnimationsEnabled() {
  return animationsEnabled;
}

// ─── Card animations ─────────────────────────────────────────────────────────

/**
 * Áp dụng animation thắng lên card.
 * @param {Element} el
 */
export function animateWin(el) {
  if (!animationsEnabled || !el) return;
  el.classList.remove('anim-shake', 'anim-pulse', 'anim-glow');
  void el.offsetWidth; // reflow để reset animation
  el.classList.add('anim-glow');
  el.addEventListener('animationend', () => el.classList.remove('anim-glow'), { once: true });
}

/**
 * Áp dụng animation thua lên card.
 * @param {Element} el
 */
export function animateLose(el) {
  if (!animationsEnabled || !el) return;
  el.classList.remove('anim-shake', 'anim-pulse', 'anim-glow');
  void el.offsetWidth;
  el.classList.add('anim-shake');
  el.addEventListener('animationend', () => el.classList.remove('anim-shake'), { once: true });
}

/**
 * Áp dụng animation hòa lên card.
 * @param {Element} el
 */
export function animateDraw(el) {
  if (!animationsEnabled || !el) return;
  el.classList.remove('anim-shake', 'anim-pulse', 'anim-glow');
  void el.offsetWidth;
  el.classList.add('anim-pulse');
  el.addEventListener('animationend', () => el.classList.remove('anim-pulse'), { once: true });
}

// ─── Countdown animation ─────────────────────────────────────────────────────

/**
 * Hiển thị đếm ngược 3-2-1 rồi gọi callback.
 * @param {Element} el     – Element hiển thị đếm ngược
 * @param {string[]} steps – Mảng các bước ('3','2','1','Go!')
 * @param {Function} done  – Callback sau khi xong
 */
export function runCountdown(el, steps, done) {
  if (!animationsEnabled) {
    done();
    return;
  }

  let i = 0;
  el.classList.add('countdown-active');

  function tick() {
    if (i >= steps.length) {
      el.textContent = '';
      el.classList.remove('countdown-active');
      done();
      return;
    }
    el.textContent = steps[i++];
    el.classList.remove('countdown-pop');
    void el.offsetWidth;
    el.classList.add('countdown-pop');
    setTimeout(tick, 500);
  }

  tick();
}

// ─── Confetti ────────────────────────────────────────────────────────────────

/**
 * Phát hiệu ứng confetti đơn giản bằng canvas (tối đa 1.5s).
 * @param {HTMLCanvasElement} canvas
 */
export function launchConfetti(canvas) {
  if (!animationsEnabled || !canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const COLORS = ['#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#f472b6'];
  const PIECES  = 80;
  const pieces  = Array.from({ length: PIECES }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height * 0.3 - canvas.height * 0.3,
    vx:    (Math.random() - 0.5) * 4,
    vy:    Math.random() * 3 + 2,
    w:     Math.random() * 10 + 5,
    h:     Math.random() * 6 + 3,
    angle: Math.random() * Math.PI * 2,
    spin:  (Math.random() - 0.5) * 0.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 1,
  }));

  let startTime = null;
  const DURATION = 1500;

  function draw(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // trọng lực
      p.angle += p.spin;
      p.alpha = Math.max(0, 1 - elapsed / DURATION);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (elapsed < DURATION) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }

  requestAnimationFrame(draw);
}

// ─── Flip card reveal ────────────────────────────────────────────────────────

/**
 * Hiệu ứng lật bài reveal kết quả.
 * @param {Element} el
 * @param {Function} updateContent – Callback cập nhật nội dung khi đang flip
 */
export function flipReveal(el, updateContent) {
  if (!animationsEnabled || !el) {
    updateContent();
    return;
  }

  el.classList.add('flipping');
  setTimeout(() => {
    updateContent();
    el.classList.remove('flipping');
  }, 150);
}
