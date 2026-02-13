// /js/stats.js
const KEY = "your_stats_key";

export function recordResult(code, axis) {
  const raw = localStorage.getItem(KEY);
  const data = raw ? JSON.parse(raw) : { total: 0, byCode: {} };

  if (!data.byCode[code]) {
    data.byCode[code] = {
      count: 0,
      sum: { UO: 0, MC: 0, HL: 0, DS: 0, RX: 0 }, // pL の合計（平均取りやすい）
    };
  }

  const item = data.byCode[code];
  item.count += 1;
  data.total += 1;

  // pL を代表値として加算（必要なら pR も別で持てる）
  item.sum.UO += axis?.UO?.pL ?? 0;
  item.sum.MC += axis?.MC?.pL ?? 0;
  item.sum.HL += axis?.HL?.pL ?? 0;
  item.sum.DS += axis?.DS?.pL ?? 0;
  item.sum.RX += axis?.RX?.pL ?? 0;

  localStorage.setItem(KEY, JSON.stringify(data));

  // ✅「記録できてるか確認」
  console.log("stats:", localStorage.getItem(KEY));
}

export function getStats() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearStats() {
  localStorage.removeItem(KEY);
}
