// Temporary spike file for chrome.cookies API exploration
// This file will demonstrate basic usage and message passing.

console.log('Cookies Spike: Initializing...');

// Example function to remove a cookie (from web search result)
async function removeMyCookie(url, name) {
  try {
    const removedCookie = await chrome.cookies.remove({ url: url, name: name });
    console.log(`Cookies Spike: Removing cookie "${name}" from "${url}":`, removedCookie);
    return removedCookie;
  } catch (error) {
    console.error(`Cookies Spike: Error removing cookie "${name}":`, error);
    return null;
  }
}

// Listen for messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener(async (message, sender, _sendResponse) => {
  console.log('Cookies Spike: Received message:', message);

  if (message.action === 'spikeGetCookie') {
    const { url, name } = message;
    try {
      const cookie = await chrome.cookies.get({ url, name });
      console.log(`Cookies Spike: Got cookie "${name}" from "${url}":`, cookie);
      _sendResponse({ status: 'success', cookie });
    } catch (_error) { // Prefix error
      console.error(`Cookies Spike: Error getting cookie "${name}":`, _error);
      _sendResponse({ status: 'error', error: _error.message });
    }
    return true; // Asynchronous response
  }

  if (message.action === 'spikeSetCookie') {
    const { url, name, value, expirationDate } = message;
    try {
      const cookie = await chrome.cookies.set({
        url,
        name,
        value,
        expirationDate,
        secure: url.startsWith('https://'),
        httpOnly: false,
        sameSite: 'no_restriction', // Example for cross-site compatibility
      });
      console.log(`Cookies Spike: Set cookie "${name}" for "${url}":`, cookie);
      _sendResponse({ status: 'success', cookie });
    } catch (_error) { // Prefix error
      console.error(`Cookies Spike: Error setting cookie "${name}":`, _error);
      _sendResponse({ status: 'error', error: _error.message });
    }
    return true; // Asynchronous response
  }

  if (message.action === 'spikeRemoveCookie') {
    const { url, name } = message;
    try {
      const removedCookie = await removeMyCookie(url, name);
      _sendResponse({ status: 'success', removedCookie });
    } catch (_error) { // Prefix error
      console.error(`Cookies Spike: Error removing cookie "${name}":`, _error);
      _sendResponse({ status: 'error', error: _error.message });
    }
    return true;
  }

  // Example: Listen for changes in cookies (optional, for observation)
  chrome.cookies.onChanged.addListener((changeInfo) => {
    console.log('Cookies Spike: Cookie change detected:', changeInfo);
  });
});

console.log('Cookies Spike: Ready to receive messages.');