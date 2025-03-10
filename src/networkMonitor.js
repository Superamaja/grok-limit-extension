(function () {
  "use strict";

  let lastRequest = null;
  let lastResponse = null;

  // Function to communicate with content script
  function sendToContentScript(action, data) {
    window.dispatchEvent(
      new CustomEvent("GROK_RATE_LIMIT", {
        detail: { action, data },
      })
    );
  }

  function updateRateLimitDisplay(
    remainingQueries,
    totalQueries,
    windowSizeSeconds
  ) {
    sendToContentScript("updateRateLimit", {
      remainingQueries,
      totalQueries,
      windowSizeSeconds,
    });
  }

  function parseRateLimitResponse(responseText) {
    try {
      const data = JSON.parse(responseText);
      if (
        data &&
        data.remainingQueries !== undefined &&
        data.totalQueries !== undefined
      ) {
        return {
          remainingQueries: data.remainingQueries,
          totalQueries: data.totalQueries,
          windowSizeSeconds: data.windowSizeSeconds,
        };
      } else if (data) {
        // Handle different response formats if needed
        for (const key in data) {
          if (data[key] && typeof data[key] === "object") {
            if (
              data[key].remaining !== undefined &&
              data[key].limit !== undefined
            ) {
              return {
                remainingQueries: data[key].remaining,
                totalQueries: data[key].limit,
                windowSizeSeconds:
                  data[key].windowSizeSeconds || data.windowSizeSeconds,
              };
            }
          }
        }
      }
    } catch (e) {
      console.error("Error parsing rate limit response:", e);
    }
    return null;
  }

  // Override the native fetch function
  const originalFetch = window.fetch;
  window.fetch = function () {
    const url = arguments[0];
    const options = arguments[1] || {};
    const fetchPromise = originalFetch.apply(this, arguments);

    if (typeof url === "string" && url.includes("rate-limits")) {
      lastRequest = { url, options };

      fetchPromise
        .then((response) => {
          const clone = response.clone();
          return clone.text().then((text) => ({ response, text }));
        })
        .then(({ response, text }) => {
          console.log("Rate-limits request detected:", {
            url: url,
            time: new Date().toISOString(),
            response: text,
            options: options,
          });

          lastResponse = text;
          const limits = parseRateLimitResponse(text);
          if (limits) {
            updateRateLimitDisplay(
              limits.remainingQueries,
              limits.totalQueries,
              limits.windowSizeSeconds
            );
          }
        })
        .catch((error) => console.error("Error getting response:", error));
    }

    return fetchPromise;
  };

  // Override XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    const url = arguments[1];
    const method = arguments[0];

    if (typeof url === "string" && url.includes("rate-limits")) {
      const xhr = this;
      const originalOnLoad = xhr.onload;

      xhr.onload = function () {
        console.log("Rate-limits XHR request detected:", {
          url: url,
          time: new Date().toISOString(),
          response: xhr.responseText,
          method: method,
        });

        lastRequest = {
          url,
          options: {
            method: method,
            headers: xhr.getAllResponseHeaders(),
          },
        };

        lastResponse = xhr.responseText;
        const limits = parseRateLimitResponse(xhr.responseText);
        if (limits) {
          updateRateLimitDisplay(
            limits.remainingQueries,
            limits.totalQueries,
            limits.windowSizeSeconds
          );
        }

        if (originalOnLoad) originalOnLoad.apply(this, arguments);
      };
    }
    return originalOpen.apply(this, arguments);
  };

  console.log("Rate Limits Monitor started at:", new Date().toISOString());
})();
