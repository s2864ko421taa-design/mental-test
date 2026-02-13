// js/stats.js
const KEY = "your_stats_key";

// axis: { UO:{percentMain...}, MC:{...}, HL:{...}, DS:{...}, RX:{...} } を想定
export function recordResult(code, axis) {
  const data = loadStats();

  data.count += 1;

  // タイプ別出現回数
  data.codes[code] = (data.codes[code] || 0) + 1;

  // 軸の平均（percentMain を平均化）
  const axes = ["UO", "MC", "HL", "DS", "RX"];
  for (const k of axes) {
    const v = axis?.[k]?.percentMain;
    if (typeof v === "number" && !Number.isNaN(v)) {
      const prev = data.avg[k];
      // 逐次平均: newAvg = oldAvg + (x-oldAvg)/n
      data.avg[k] = prev + (v - prev) / data.count;
    }
  }

  saveStats(data);
  return data;
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initStats();
    const parsed = JSON.parse(raw);

    // 最低限の形を保証
    if (!parsed || typeof parsed !== "object") return initStats();
    if (typeof parsed.count !== "number") parsed.count = 0;
    if (!parsed.codes || typeof parsed.codes !== "object") parsed.codes = {};
    if (!parsed.avg || typeof parsed.avg !== "object") parsed.avg = initStats().avg;

    for (const k of ["UO", "MC", "HL", "DS", "RX"]) {
      if (typeof parsed.avg[k] !== "number") parsed.avg[k] = 0;
    }
    return parsed;
  } catch {
    return initStats();
  }
}

export function resetStats() {
  localStorage.removeItem(KEY);
}

function saveStats(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

function initStats() {
  return {
    count: 0,
    codes: {},
    avg: { UO: 0, MC: 0, HL: 0, DS: 0, RX: 0 },
  };
}
