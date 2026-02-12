// js/boot.js
try {
  await import("./index.js"); // js/index.js を読み込む
} catch (e) {
  alert("起動に失敗: " + (e?.message || e));
  console.error(e);
}
