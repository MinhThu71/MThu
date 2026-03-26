/**
 * engine.js – Luật chơi, quản lý vòng/loạt trận, tính điểm
 * Mô-đun thuần túy, không phụ thuộc DOM.
 */

// ─── Hằng số lựa chọn ────────────────────────────────────────────────────────
export const CHOICES = {
  ROCK: 'rock',
  PAPER: 'paper',
  SCISSORS: 'scissors',
};

// ─── Hằng số kết quả ─────────────────────────────────────────────────────────
export const RESULTS = {
  WIN: 'win',
  LOSE: 'lose',
  DRAW: 'draw',
};

// ─── Chế độ chơi ─────────────────────────────────────────────────────────────
export const MODES = {
  SINGLE: 'single',   // Chơi nhanh – 1 ván
  BO3: 'bo3',         // Best of 3
  BO5: 'bo5',         // Best of 5
  FIRST_TO_N: 'firstToN', // Ai chạm N trước thắng
};

/**
 * Xác định kết quả một lượt chơi.
 * @param {string} playerChoice – Lựa chọn của người chơi (CHOICES.*)
 * @param {string} aiChoice     – Lựa chọn của AI (CHOICES.*)
 * @returns {string} RESULTS.WIN | RESULTS.LOSE | RESULTS.DRAW
 */
export function evaluateRound(playerChoice, aiChoice) {
  if (playerChoice === aiChoice) return RESULTS.DRAW;

  const winMap = {
    [CHOICES.SCISSORS]: CHOICES.PAPER,   // Kéo thắng Bao
    [CHOICES.PAPER]:    CHOICES.ROCK,    // Bao thắng Búa
    [CHOICES.ROCK]:     CHOICES.SCISSORS, // Búa thắng Kéo
  };

  return winMap[playerChoice] === aiChoice ? RESULTS.WIN : RESULTS.LOSE;
}

/**
 * Tạo trạng thái ban đầu của một loạt trận.
 * @param {string} mode  – Chế độ chơi (MODES.*)
 * @param {number} n     – Mục tiêu điểm khi mode === FIRST_TO_N
 * @returns {object}     – Đối tượng state loạt trận
 */
export function createMatchState(mode = MODES.SINGLE, n = 3) {
  // Xác định số vòng tối đa
  let maxRounds = 1;
  if (mode === MODES.BO3) maxRounds = 3;
  else if (mode === MODES.BO5) maxRounds = 5;
  else if (mode === MODES.FIRST_TO_N) maxRounds = n * 2 - 1; // tối đa

  return {
    mode,
    targetScore: mode === MODES.FIRST_TO_N ? n : Math.ceil(maxRounds / 2),
    maxRounds,
    playerScore: 0,
    aiScore: 0,
    roundsPlayed: 0,
    rounds: [],      // Mảng kết quả từng vòng
    finished: false,
    winner: null,    // 'player' | 'ai' | 'draw'
  };
}

/**
 * Ghi nhận kết quả một vòng vào state và kiểm tra kết thúc loạt.
 * @param {object} state         – Trạng thái loạt trận
 * @param {string} playerChoice  – Lựa chọn người chơi
 * @param {string} aiChoice      – Lựa chọn AI
 * @returns {{ state: object, result: string }} – State cập nhật và kết quả vòng
 */
export function playRound(state, playerChoice, aiChoice) {
  const result = evaluateRound(playerChoice, aiChoice);

  // Cập nhật điểm số
  if (result === RESULTS.WIN)  state.playerScore += 1;
  if (result === RESULTS.LOSE) state.aiScore += 1;
  state.roundsPlayed += 1;

  // Ghi lại lịch sử vòng
  state.rounds.push({ playerChoice, aiChoice, result });

  // Kiểm tra kết thúc loạt
  if (state.mode === MODES.SINGLE) {
    state.finished = true;
    state.winner = result === RESULTS.WIN ? 'player'
                 : result === RESULTS.LOSE ? 'ai' : 'draw';
  } else {
    const { playerScore, aiScore, targetScore, maxRounds, roundsPlayed } = state;
    if (playerScore >= targetScore) {
      state.finished = true;
      state.winner = 'player';
    } else if (aiScore >= targetScore) {
      state.finished = true;
      state.winner = 'ai';
    } else if (roundsPlayed >= maxRounds) {
      state.finished = true;
      state.winner = playerScore > aiScore ? 'player'
                   : aiScore > playerScore ? 'ai' : 'draw';
    }
  }

  return { state, result };
}

/**
 * Trả về số vòng còn lại của loạt trận.
 * @param {object} state
 * @returns {number}
 */
export function roundsRemaining(state) {
  if (state.mode === MODES.SINGLE) return state.finished ? 0 : 1;
  return Math.max(0, state.maxRounds - state.roundsPlayed);
}
