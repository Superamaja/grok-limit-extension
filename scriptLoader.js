const script = document.createElement("script");
script.src = chrome.runtime.getURL("grokRateLimitDetector.js");
script.type = "text/javascript";
document.head.appendChild(script);
