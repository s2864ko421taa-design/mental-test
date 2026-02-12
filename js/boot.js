// js/boot.js
const box = document.createElement("div");
box.style.cssText = `
  position:fixed; left:12px; right:12px; bottom:12px;
  background:rgba(0,0,0,.55); color:#fff; padding:12px 14px;
  border-radius:14px; font-size:12px; line-height:1.5;
  z-index:99999; white-space:pre-wrap; display:none;
`;
document.body.appendChild(box);

function show(msg){
  box.style.display = "block";
  box.textContent = msg;
}

function isHtml(text){
  return /^\s*</.test(text) && /<html|<!doctype/i.test(text);
}

async function check(url){
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  if (!res.ok) throw new Error(`404/NG: ${url} (${res.status})`);
  if (isHtml(text)) throw new Error(`HTML返ってきてる: ${url}（パス間違い）`);
  return true;
}

(async () => {
  try {
    // boot.js から見た “確実な場所” でチェック
    const indexUrl = new URL("./index.js", import.meta.url).href;
    const qUrl     = new URL("./questions.js", import.meta.url).href;
    const sUrl     = new URL("./storage.js", import.meta.url).href;

    await check(indexUrl);
    await check(qUrl);
    await check(sUrl);

    await import(indexUrl);
    window.__APP_READY__ = true;
  } catch (e) {
    console.error(e);
    show(
      "起動に失敗しました。\n" +
      "原因: " + (e?.message || e) + "\n\n" +
      "まず確認：\n" +
      "1) /js/index.js ある？\n" +
      "2) /js/questions.js ある？\n" +
      "3) /js/storage.js ある？\n" +
      "4) 大文字小文字一致してる？\n"
    );
  }
})();
