// js/boot.js
(async () => {
  try {
    await import(new URL("./index.js", import.meta.url));
    window.__APP_READY__ = true;
  } catch (e) {
    console.error(e);
    alert("起動に失敗: " + (e?.message || e));
  }
})();
