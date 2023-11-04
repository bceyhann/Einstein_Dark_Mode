// content.js

var isEnabled = false;

function applyStyles(isEnabled) {
  var style = document.getElementById('customStyles');
  
  if (isEnabled) {
    if (!style) {
      style = document.createElement('style');
      style.id = 'customStyles';
      document.head.appendChild(style);
    }
    style.textContent = `
      *, *::before, *::after {
        color: #ebebeb !important;
	background: #161616 !important;
      }
    `;
  } else {
    if (style) {
      style.remove();
    }
  }
}

// Listen for messages from the popup.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggle') {
    isEnabled = message.enabled;
    applyStyles(isEnabled);
    sendResponse({ success: true });
    
    // Save the extension state to local storage
    chrome.storage.local.set({ 'enabled': isEnabled }, function() {
      console.log('Extension state saved.');
    });
  } else if (message.action === 'getState') {
    sendResponse({ enabled: isEnabled });
  }
});

// Apply styles initially based on the stored state
chrome.storage.local.get('enabled', function(data) {
  isEnabled = data.enabled !== undefined ? data.enabled : true;
  applyStyles(isEnabled);
});
