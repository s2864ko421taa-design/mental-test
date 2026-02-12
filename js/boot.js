// js/boot.js
(async () => {
  try {
    const mod = await import("./index.js");
    if (!mod || typeof mod.init !== "function") {
      throw new Error("index.js に export init() がありません");
    }
    mod.init();
  } catch (e) {
    console.error(e);
    alert("起動に失敗: " + (e?.message || String(e)));
  }
})();
