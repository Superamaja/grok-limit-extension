(function () {
    "use strict";

    let lastRequest = null;

    function addReplayButton(url) {
        const targetDiv = document.querySelector(
            "body > div > div > main > div:nth-child(1) > div > div:nth-child(3)"
        );
        if (!targetDiv) {
            console.log(
                "Target container not found - selector might need adjustment"
            );
            return;
        }

        const button = document.createElement("button");
        button.className =
            "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 text-primary hover:bg-button-ghost-hover h-10 w-10 rounded-full";
        button.type = "button";
        button.setAttribute("data-state", "closed");

        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-[2]" stroke-width="2">
                <path d="M14 5L19 10L14 15" stroke="currentColor" stroke-linecap="square"></path>
                <path d="M19 10H7C4.79086 10 3 11.7909 3 14V16" stroke="currentColor" stroke-linecap="square"></path>
            </svg>
        `;

        button.addEventListener("click", () => {
            if (lastRequest) {
                fetch(lastRequest.url, lastRequest.options)
                    .then((response) => response.text())
                    .then((data) => console.log("Replay response:", data))
                    .catch((error) => console.error("Replay error:", error));
            }
        });

        const existingButton = targetDiv.querySelector(".replay-rate-limits");
        if (existingButton) existingButton.remove();

        button.classList.add("replay-rate-limits");

        // Insert the button as the first child instead of appending it
        if (targetDiv.firstChild) {
            targetDiv.insertBefore(button, targetDiv.firstChild);
        } else {
            targetDiv.appendChild(button);
        }
    }

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
                    addReplayButton(url);
                })
                .catch((error) =>
                    console.error("Error getting response:", error)
                );
        }

        return fetchPromise;
    };

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
                addReplayButton(url);

                if (originalOnLoad) originalOnLoad.apply(this, arguments);
            };
        }
        return originalOpen.apply(this, arguments);
    };

    console.log("Rate Limits Monitor started at:", new Date().toISOString());

    setInterval(() => {
        console.log("Monitoring for rate-limits requests...");
    }, 5000);
})();
