console.log('Crosslist: eBay Content Script Active');

const checkEbayLogin = () => {
  // Check global header for user greeting (gh-ug is standard eBay ID for user greeting)
  const userGreeting = document.getElementById('gh-ug');
  // "Sign in" or "Register" text usually indicates logged out
  if (userGreeting && !userGreeting.innerText.includes('Sign in') && !userGreeting.innerText.includes('register')) {
    return true;
  }
  return false;
};

const captureParams = new URLSearchParams(window.location.search);
// Optional: Only capture if specifically requested via URL param OR if we just want to be aggressive
// For "Connect" flow, the user clicks "Connect" which opens ebay.com.
if (checkEbayLogin()) {
  console.log('Crosslist: eBay Session Detected. Requesting capture...');
  chrome.runtime.sendMessage({
    type: 'CAPTURE_MARKETPLACE_SESSION',
    payload: { marketplace: 'ebay' }
  });
}