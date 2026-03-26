/**
 * ai.js – AI thích nghi: đếm tần suất lựa chọn + trọng số ngẫu nhiên
 * Chiến lược: phân tích cửa sổ lượt gần nhất để dự đoán nước đi → chọn nước khắc chế.
 */

import { CHOICES } from './engine.js';

// Kích thước cửa sổ quan sát lịch sử người chơi
const WINDOW_SIZE = 10;

// Tỉ lệ theo dự đoán theo từng độ khó
const DIFFICULTY_WEIGHTS = {
  easy:   0.50,
  medium: 0.70,
  hard:   0.85,
};

// Nước khắc chế từng lựa chọn
const COUNTER = {
  [CHOICES.SCISSORS]: CHOICES.ROCK,   // Búa thắng Kéo
  [CHOICES.PAPER]:    CHOICES.SCISSORS, // Kéo thắng Bao
  [CHOICES.ROCK]:     CHOICES.PAPER,  // Bao thắng Búa
};

const ALL_CHOICES = Object.values(CHOICES);

/**
 * Chọn ngẫu nhiên từ mảng.
 * @param {Array} arr
 * @returns {*}
 */
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Tính tần suất từng lựa chọn trong cửa sổ lịch sử.
 * @param {string[]} history – Mảng lựa chọn của người chơi (mới nhất ở cuối)
 * @returns {object} – { rock: n, paper: n, scissors: n }
 */
function calcFrequency(history) {
  const freq = { rock: 0, paper: 0, scissors: 0 };
  const window = history.slice(-WINDOW_SIZE);
  for (const c of window) {
    if (freq[c] !== undefined) freq[c]++;
  }
  return freq;
}

/**
 * Dự đoán lựa chọn có khả năng cao nhất của người chơi.
 * @param {object} freq – { rock, paper, scissors }
 * @returns {string} – CHOICES.*
 */
function predictPlayerChoice(freq) {
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Tính tỉ lệ thắng của AI trong N lượt gần nhất.
 * @param {Array<{result: string}>} rounds
 * @param {number} n
 * @returns {number} 0–1
 */
function aiWinRate(rounds, n = 10) {
  const recent = rounds.slice(-n);
  if (!recent.length) return 0;
  const wins = recent.filter(r => r.result === 'lose').length; // 'lose' = người chơi thua = AI thắng
  return wins / recent.length;
}

/**
 * Chọn nước đi cho AI.
 * @param {string[]} playerHistory  – Lịch sử lựa chọn của người chơi
 * @param {Array}    roundHistory   – Lịch sử vòng (có .result)
 * @param {string}   difficulty     – 'easy' | 'medium' | 'hard'
 * @returns {string} CHOICES.*
 */
export function aiChoose(playerHistory, roundHistory, difficulty = 'medium') {
  // Nếu chưa có dữ liệu, chọn ngẫu nhiên
  if (!playerHistory.length) return randomFrom(ALL_CHOICES);

  let weight = DIFFICULTY_WEIGHTS[difficulty] ?? DIFFICULTY_WEIGHTS.medium;

  // Yếu tố công bằng: nếu AI thắng >70% trong 10 lượt gần nhất, giảm 10% trọng số
  if (aiWinRate(roundHistory, 10) > 0.7) {
    weight = Math.max(0, weight - 0.1);
  }

  // Tính xác suất sử dụng dự đoán
  const usePredict = Math.random() < weight;

  if (usePredict) {
    const freq = calcFrequency(playerHistory);
    const predicted = predictPlayerChoice(freq);
    return COUNTER[predicted]; // nước khắc chế
  }

  // Ngẫu nhiên
  return randomFrom(ALL_CHOICES);
}
