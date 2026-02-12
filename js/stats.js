// /js/stats.js
const KEY = "mentalTest_stats_v1";

/**
 * stats構造:
 * {
 *   total: number,
 *   byCode: {
 *     [code]: {
 *       n: number,
 *       sum: { U:number, O:number, M:number, C:number, H:number, L:number, D:number, S:number, R:number, X:number }
 *     }
 *   }
 * }
 */

function loadStats() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { total: 0, byCode: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { total: 0, byCode: {} };
    if (!parsed.byCode || typeof parsed.byCode !== "object") parsed.byCode = {};
    if (typeof parsed.total !== "number") parsed.total = 0;
    return parsed;
  } catch {
    return { total: 0, byCode: {} };
  }
}

function saveStats(stats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

function clamp01to100(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

/**
 * axis は scoring.js の calculateResult が返すやつ想定
 * 例: axis.UO.pL / axis.UO.pR のように percent が入ってるならそれを使う
 */
export function recordResult(code, axis) {
  if (!code) return;

  // ここが超重要：あなたの axis のプロパティ名に合わせる
  // 今のUIでゲージ表示に使ってる値をそのまま保存するのが正解。
  const U = clamp01to100(axis?.UO?.pL ?? axis?.UO?.percentMain); // U側%
  const O = clamp01to100(axis?.UO?.pR ?? axis?.UO?.percentAlt);  // O側%
  const M = clamp01to100(axis?.MC?.pL ?? axis?.MC?.percentMain);
  const C = clamp01to100(axis?.MC?.pR ?? axis?.MC?.percentAlt);
  const H = clamp01to100(axis?.HL?.pL ?? axis?.HL?.percentMain);
  const L = clamp01to100(axis?.HL?.pR ?? axis?.HL?.percentAlt);
  const D = clamp01to100(axis?.DS?.pL ?? axis?.DS?.percentMain);
  const S = clamp01to100(axis?.DS?.pR ?? axis?.DS?.percentAlt);
  const R = clamp01to100(axis?.RX?.pL ?? axis?.RX?.percentMain);
  const X = clamp01to100(axis?.RX?.pR ?? axis?.RX?.percentAlt);

  const stats = loadStats();

  if (!stats.byCode[code]) {
    stats.byCode[code] = {
      n: 0,
      sum: { U: 0, O: 0, M: 0, C: 0, H: 0, L: 0, D: 0, S: 0, R: 0, X: 0 },
    };
  }

  const bucket = stats.byCode[code];
  bucket.n += 1;
  stats.total += 1;

  bucket.sum.U += U;
  bucket.sum.O += O;
  bucket.sum.M += M;
  bucket.sum.C += C;
  bucket.sum.H += H;
  bucket.sum.L += L;
  bucket.sum.D += D;
  bucket.sum.S += S;
  bucket.sum.R += R;
  bucket.sum.X += X;

  saveStats(stats);
}

/**
 * 平均を取得したい時用（表示したくなったら使える）
 */
export function getAverages(code) {
  const stats = loadStats();
  const bucket = stats.byCode?.[code];
  if (!bucket || !bucket.n) return null;

  const n = bucket.n;
  const avg = {};
  for (const k of Object.keys(bucket.sum)) {
    avg[k] = Math.round((bucket.sum[k] / n) * 10) / 10; // 小数1桁
  }
  return { n, avg };
}

export function resetAllStats() {
  localStorage.removeItem(KEY);
}
