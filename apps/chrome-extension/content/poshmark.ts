console.log('Crosslist: Poshmark Content Script Active');

const checkPoshmarkLogin = () => {
  // Look for user profile image in header or dropdown
  const userProfile = document.querySelector('.header-user-profile-img') || document.querySelector('.user-image');
  if (userProfile) {
    return true;
  }
  return false;
};

if (checkPoshmarkLogin()) {
  console.log('Crosslist: Poshmark Session Detected. Requesting capture...');
  chrome.runtime.sendMessage({
    type: 'CAPTURE_MARKETPLACE_SESSION',
    payload: { marketplace: 'poshmark' }
  });
}