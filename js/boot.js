// /js/boot.js
const showFatal = (msg) => alert(`起動に失敗: ${msg}`);

(async () => {
  try {
    // index.js の存在チェック（GitHub Pages でHTMLが返る事故も検知）
    const url = new URL("./index.js", import.meta.url);
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    if (!res.ok) {
      throw new Error(`index.js が見つからない (${res.status})\n${url.href}`);
    }
    if (text.trim().toLowerCase().startsWith("<!doctype") || text.trim().toLowerCase().startsWith("<html")) {
      throw new Error(`index.js 取得がHTMLになってる\n${url.href}`);
    }

    // 本import（ここで失敗したら catch に落ちる）
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
