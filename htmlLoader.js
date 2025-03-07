(function () {
  function injectRateLimitDisplay() {
    const targetDiv = document.querySelector(
      "div.flex.grow.gap-1\\.5.max-w-full"
    );

    if (!targetDiv) {
      setTimeout(injectRateLimitDisplay, 500);
      return;
    }

    const existingRateLimit = document.querySelector(".rate-limit-container");
    if (existingRateLimit) {
      return;
    }

    const rateLimitDiv = document.createElement("div");
    fetch(chrome.runtime.getURL("rateLimitDisplay.html"))
      .then((response) => response.text())
      .then((html) => {
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = html;

        // Process scripts separately for security
        const scriptsToProcess = Array.from(
          tempContainer.querySelectorAll("script")
        );
        scriptsToProcess.forEach((script) => {
          if (script.src) {
            const newScript = document.createElement("script");
            newScript.src = script.src;
            document.head.appendChild(newScript);
          } else {
            // Store inline scripts as data attributes for later execution
            const scriptContent = script.textContent;
            const scriptPlaceholder = document.createElement("div");
            scriptPlaceholder.className = "script-placeholder";
            scriptPlaceholder.dataset.script = scriptContent;
            script.parentNode.replaceChild(scriptPlaceholder, script);
          }
        });

        rateLimitDiv.innerHTML = tempContainer.innerHTML;

        // Insert as the second item in the target div
        const firstChild = targetDiv.firstChild;
        if (firstChild) {
          targetDiv.insertBefore(rateLimitDiv, firstChild.nextSibling);
        } else {
          targetDiv.appendChild(rateLimitDiv);
        }

        // Execute any inline scripts via background script
        const scriptPlaceholders = rateLimitDiv.querySelectorAll(
          ".script-placeholder"
        );
        scriptPlaceholders.forEach((placeholder) => {
          if (placeholder.dataset.script) {
            chrome.runtime.sendMessage({
              action: "executeScript",
              script: placeholder.dataset.script,
            });
          }
        });
      })
      .catch((error) => {
        console.error("Failed to load rate limit display:", error);
      });
  }

  // Run on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectRateLimitDisplay);
  } else {
    injectRateLimitDisplay();
  }

  // Handle SPA navigation by tracking URL changes
  let currentUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      setTimeout(injectRateLimitDisplay, 300);
    }
  });

  urlObserver.observe(document, {
    subtree: true,
    childList: true,
  });
})();
