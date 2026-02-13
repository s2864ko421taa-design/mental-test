// js/stats.js
const KEY = "mental_test_stats_v1";

export function getStats() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function resetStats() {
  localStorage.removeItem(KEY);
}

export function recordResult(code, axis) {
  // axis: calculateResult の戻り（UO/MC/HL/DS/RX）
  const now = Date.now();
  const next = getStats() ?? {
    count: 0,
    last: null,
    avg: {
      UO: { pL: 50, pR: 50 },
      MC: { pL: 50, pR: 50 },
      HL: { pL: 50, pR: 50 },
      DS: { pL: 50, pR: 50 },
      RX: { pL: 50, pR: 50 },
    },
    history: [],
  };

  next.count += 1;
  next.last = { code, at: now };

  // 平均更新（left/right % を平均する）
  for (const k of ["UO","MC","HL","DS","RX"]) {
    const prev = next.avg[k];
    const curL = Number(axis?.[k]?.pL ?? 50);
    const curR = Number(axis?.[k]?.pR ?? 50);

    prev.pL = round1(((prev.pL * (next.count - 1)) + curL) / next.count);
    prev.pR = round1(((prev.pR * (next.count - 1)) + curR) / next.count);
  }

  // 履歴は重いなら切ってOK（ここは最新50件に制限）
  next.history.unshift({
    code,
    at: now,
    axis: pickAxis(axis),
  });
  next.history = next.history.slice(0, 50);

  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

function pickAxis(axis) {
  const out = {};
  for (const k of ["UO","MC","HL","DS","RX"]) {
    out[k] = {
      main: axis?.[k]?.main,
      alt: axis?.[k]?.alt,
      pL: axis?.[k]?.pL,
      pR: axis?.[k]?.pR,
      percentMain: axis?.[k]?.percentMain,
      percentAlt: axis?.[k]?.percentAlt,
    };
  }
  return out;
}

function round1(x){ return Math.round(x * 10) / 10; }
