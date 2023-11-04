document.addEventListener('DOMContentLoaded', function() {
  var toggleCheckbox = document.getElementById('toggleExtension');

  // Load current extension state from local storage
  var isEnabled = true;

  // Send a message to content.js script to get the current extension state
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, { action: 'getState' }, function(response) {
      if (response && response.enabled !== undefined) {
        isEnabled = response.enabled;
        toggleCheckbox.checked = isEnabled;
      }

      toggleCheckbox.addEventListener('change', function() {
        var isEnabled = toggleCheckbox.checked;

        // Send a message to content.js script to enable/disable the extension
        chrome.tabs.sendMessage(tab.id, { action: 'toggle', enabled: isEnabled }, function(response) {
          console.log('Message sent to content script');
        });
        
        // Save the extension state to the local storage
        chrome.storage.local.set({ 'enabled': isEnabled }, function() {
          console.log('Extension state saved.');
        });
      });
    });
  });
});
