/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { BridgeMessage, isBridgeMessage } from "@crosslist/shared";

console.log("Crosslist Bridge Content Script Loaded");

// Flag to indicate extension is ready (wait for body to exist)
if (document.body) {
  document.body.setAttribute(
    "data-crosslist-extension-installed",
    chrome.runtime.getManifest().version,
  );
} else {
  // Body doesn't exist yet, set it when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      document.body?.setAttribute(
        "data-crosslist-extension-installed",
        chrome.runtime.getManifest().version,
      );
    });
  }
}

// 1. Listen for messages from the Web App (window)
window.addEventListener("message", async (event) => {
  // Security: Only accept messages from the same window (content script and page share the window object)
  if (event.source !== window) return;

  const message = event.data;

  // Validate it's a known bridge message
  if (!isBridgeMessage(message)) return;

  // Filter out messages that are clearly meant for the EXTENSION (requests)
  // We don't want to infinite loop on our own responses if we posted them back to window
  if (
    message.type === "AUTH_STATE_SYNCED" ||
    message.type === "EXTENSION_STATUS_RESPONSE"
  ) {
    return;
  }

  console.log("Bridge: Forwarding message to background:", message);

  try {
    // 2. Forward to Background Script
    const response = await chrome.runtime.sendMessage(message);

    // 3. Send Response back to Web App
    if (response) {
      console.log("Bridge: Received response from background:", response);
      window.postMessage(response, window.location.origin);
    }
  } catch (error) {
    console.error("Bridge: Error communicating with background:", error);
  }
});

// 4. Listen for messages from Background Script (relayed from other parts of extension)
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (isBridgeMessage(message)) {
    console.log("Bridge: Received message from background:", message);
    // Forward to Web App
    window.postMessage(message, window.location.origin);
  }
});
