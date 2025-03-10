(function () {
  // Inject the network monitor script into the page context
  function injectScript() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("networkMonitor.js");
    document.head.appendChild(script);
    console.log("Injected network monitor script");
  }

  // Handle UI updates from the injected script
  function listenForEvents() {
    window.addEventListener("GROK_RATE_LIMIT", function (event) {
      const { action, data } = event.detail;

      if (action === "updateRateLimit") {
        const { remainingQueries, totalQueries, windowSizeSeconds } = data;
        updateRateLimitDisplay(
          remainingQueries,
          totalQueries,
          windowSizeSeconds
        );
      }
    });
  }

  function formatTimeRemaining(seconds) {
    if (!seconds || isNaN(seconds)) return "Unknown reset time";

    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  // Update the UI with rate limit information
  function updateRateLimitDisplay(
    remainingQueries,
    totalQueries,
    windowSizeSeconds
  ) {
    const display = document.getElementById("rate-limit-remaining");
    if (display) {
      display.textContent = `${remainingQueries}/${totalQueries}`;

      // Update tooltip with reset time information
      const tooltipText = document.getElementById("rate-limit-tooltip-text");
      if (tooltipText && windowSizeSeconds) {
        const resetTime = formatTimeRemaining(windowSizeSeconds);
        tooltipText.textContent = `Resets in: ${resetTime}`;
      }

      // Change color based on remaining percentage
      const percentage = (remainingQueries / totalQueries) * 100;
      if (percentage <= 10) {
        display.style.color = "rgba(255, 50, 50, 0.9)"; // Red when low
      } else if (percentage <= 30) {
        display.style.color = "rgba(255, 165, 0, 0.9)"; // Orange when medium
      } else {
        display.style.color = "rgba(255, 255, 255, 0.8)"; // Default color
      }
    }
  }

  // Inject the HTML display
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
        rateLimitDiv.innerHTML = html;

        // Insert as the second item in the target div
        const firstChild = targetDiv.firstChild;
        if (firstChild) {
          targetDiv.insertBefore(rateLimitDiv, firstChild.nextSibling);
        } else {
          targetDiv.appendChild(rateLimitDiv);
        }
      })
      .catch((error) => {
        console.error("Failed to load rate limit display:", error);
      });
  }

  // Check if display exists and reinject if missing
  function checkDisplayExists() {
    const targetDiv = document.querySelector(
      "div.flex.grow.gap-1\\.5.max-w-full"
    );
    const existingRateLimit = document.querySelector(".rate-limit-container");

    if (targetDiv && !existingRateLimit) {
      console.log("Rate limit display missing, reinjecting...");
      injectRateLimitDisplay();
    }
  }

  // Display check interval reference
  let displayCheckInterval;

  function startDisplayCheck() {
    if (!displayCheckInterval) {
      displayCheckInterval = setInterval(checkDisplayExists, 1500);
    }
  }

  function stopDisplayCheck() {
    if (displayCheckInterval) {
      clearInterval(displayCheckInterval);
      displayCheckInterval = null;
    }
  }

  // Initialize everything
  function initialize() {
    injectScript();
    listenForEvents();
    injectRateLimitDisplay();
    startDisplayCheck(); // Start periodic monitoring
  }

  // Run on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  // Handle SPA navigation by tracking URL changes
  let currentUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      setTimeout(() => {
        initialize();
        // Ensure we're checking for the display after navigation
        startDisplayCheck();
      }, 300);
    }
  });

  urlObserver.observe(document, {
    subtree: true,
    childList: true,
  });

  // Clean up when the page is unloaded
  window.addEventListener("unload", stopDisplayCheck);
})();
