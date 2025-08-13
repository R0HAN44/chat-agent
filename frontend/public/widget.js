(function () {
  const scriptTag = document.currentScript;
  const BOT_ID = scriptTag.getAttribute("data-bot-id") || "DEFAULT_BOT_ID";
  const IFRAME_URL = `https://localhost:5173/embed/${BOT_ID}`;

  const iframe = document.createElement("iframe");
  iframe.src = IFRAME_URL;
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "350px";
  iframe.style.height = "500px";
  iframe.style.border = "none";
  iframe.style.borderRadius = "8px";
  iframe.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  iframe.style.zIndex = "999999";

  document.body.appendChild(iframe);
})();
