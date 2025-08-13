(function () {
  const scriptTag = document.currentScript;
  const BOT_ID = scriptTag.getAttribute("data-bot-id") || "DEFAULT_BOT_ID";
  const IFRAME_URL = `http://localhost:5173/embed/${BOT_ID}`;

  // Create toggle button
  const button = document.createElement("div");
  button.innerHTML = "💬";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.width = "60px";
  button.style.height = "60px";
  button.style.background = "#4f46e5"; // purple
  button.style.color = "#fff";
  button.style.borderRadius = "50%";
  button.style.display = "flex";
  button.style.justifyContent = "center";
  button.style.alignItems = "center";
  button.style.fontSize = "28px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  button.style.zIndex = "999999";
  button.style.transition = "all 0.3s ease";

  // Create iframe container (hidden initially)
  const iframeContainer = document.createElement("div");
  iframeContainer.style.position = "fixed";
  iframeContainer.style.bottom = "90px";
  iframeContainer.style.right = "20px";
  iframeContainer.style.width = "350px";
  iframeContainer.style.height = "500px";
  iframeContainer.style.border = "none";
  iframeContainer.style.borderRadius = "8px";
  iframeContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  iframeContainer.style.overflow = "hidden";
  iframeContainer.style.display = "none";
  iframeContainer.style.zIndex = "999999";

  const iframe = document.createElement("iframe");
  iframe.src = IFRAME_URL;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";

  iframeContainer.appendChild(iframe);

  // Toggle logic
  let isOpen = false;
  button.addEventListener("click", () => {
    isOpen = !isOpen;
    iframeContainer.style.display = isOpen ? "block" : "none";
    button.innerHTML = isOpen ? "✖" : "💬";
  });

  document.body.appendChild(button);
  document.body.appendChild(iframeContainer);
})();
