(function () {
  function injectRateLimitDisplay() {
    const targetDiv = document.querySelector(
      "div.flex.grow.gap-1\\.5.max-w-full"
    );

    if (!targetDiv) {
      // Retry after a delay
      setTimeout(injectRateLimitDisplay, 500);
      return;
    }

    // Check if our rate limit display element already exists
    const existingRateLimit = document.querySelector(".rate-limit-container");
    if (existingRateLimit) {
      return;
    }

    // Load the HTML content
    const rateLimitDiv = document.createElement("div");
    fetch(chrome.runtime.getURL("rateLimitDisplay.html"))
      .then((response) => response.text())
      .then((html) => {
        // Set the HTML content - parse as DOM to remove script tags
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = html;

        // Remove all script tags from the HTML content
        const scriptsToProcess = Array.from(
          tempContainer.querySelectorAll("script")
        );
        scriptsToProcess.forEach((script) => {
          // If script has a src attribute, we'll load it properly
          if (script.src) {
            const scriptSrc = script.src;
            const newScript = document.createElement("script");
            newScript.src = scriptSrc;
            document.head.appendChild(newScript);
          } else {
            // For inline scripts, we need to handle them differently
            // Store script content as data attribute to process after insertion
            const scriptContent = script.textContent;
            const scriptPlaceholder = document.createElement("div");
            scriptPlaceholder.className = "script-placeholder";
            scriptPlaceholder.dataset.script = scriptContent;
            script.parentNode.replaceChild(scriptPlaceholder, script);
          }
        });

        // Now add the HTML without inline scripts
        rateLimitDiv.innerHTML = tempContainer.innerHTML;

        // Insert as the second item
        const firstChild = targetDiv.firstChild;
        if (firstChild) {
          targetDiv.insertBefore(rateLimitDiv, firstChild.nextSibling);
        } else {
          // If there are no children, just append it
          targetDiv.appendChild(rateLimitDiv);
        }

        // Process any script placeholders by sending them to background script
        const scriptPlaceholders = rateLimitDiv.querySelectorAll(
          ".script-placeholder"
        );
        scriptPlaceholders.forEach((placeholder) => {
          if (placeholder.dataset.script) {
            // Send message to background script to execute this script
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

  // Execute the function when DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectRateLimitDisplay);
  } else {
    injectRateLimitDisplay();
  }

  // Track current URL to detect changes
  let currentUrl = window.location.href;

  // Create a MutationObserver to detect URL changes
  const urlObserver = new MutationObserver(() => {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      console.log("URL changed to:", currentUrl);
      // Run the injection function when URL changes
      setTimeout(injectRateLimitDisplay, 300); // Small delay to allow DOM to update
    }
  });

  // Observe the whole document for changes
  urlObserver.observe(document, {
    subtree: true,
    childList: true,
  });
})();
