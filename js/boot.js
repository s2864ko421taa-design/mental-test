// js/boot.js
const showFatal = (msg) => {
  alert("起動に失敗: " + msg);
};

(async () => {
  try {
    // まず index.js が「取れる」か確認（404/HTML返却を潰す）
    const url = new URL("./index.js", import.meta.url);
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    if (!res.ok) {
      throw new Error(`index.js が見つからない (${res.status})\n${url.href}`);
    }
    // GitHub Pages で 404 のときHTMLが返ることがあるので検知
    if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<html")) {
      throw new Error(`index.js 取得に失敗（HTMLが返ってきた）\n${url.href}`);
    }

    // ここで初めて import（失敗したら catch に落ちる）
    const mod = await import("./index.js");
    if (!mod || typeof mod.init !== "function") {
      throw new Error("index.js に init() がない（export忘れ）");
    }
    mod.init();
  } catch (e) {
    console.error(e);
    showFatal(e?.message || String(e));
  }
})();
