// TODO: move debug to config file
const DEBUG = false;
if (DEBUG) console.log("--- BACKGROUND.JS: DEBUG MODE IS ON ---")


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getList") {
    if (DEBUG) console.log("BACKGROUND.JS: 'getList' function called")
    chrome.storage.sync.get(['list'], function(result) {
      sendResponse({ list: result.list || [] });
    });
    return true; 
  }

  if (request.action === "addItemToList") {
    if (DEBUG) console.log("BACKGROUND.JS: 'addItemToList' function called")
    chrome.storage.sync.get(['list'], function(result) {
      let currentList = result.list || [];
      if (currentList.includes(request.item)) {
        if (debug.DEBUG) console.log("BACKGROUND.JS: item already added to list")
        return false;
      }
      currentList.push(request.item);
      chrome.storage.sync.set({ list: currentList });
    });
    return true; 
  }

  if (request.action === "removeItemFromList") {
    if (DEBUG) console.log("BACKGROUND.JS: 'removeItemFromList' function called");
    chrome.storage.sync.get(['list'], function(result) {
      let currentList = result.list || [];
      currentList.splice(request.removedIndex, 1); 
      chrome.storage.sync.set({ list: currentList }, function() {
        sendResponse({ list: currentList });
      });
    });
    
    // Relay this message to content script to update the UI
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (DEBUG) console.log("BACKGROUND.JS: Sending message to content script to update UI");
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "anItemHasBeenRemovedFromPopupList", removedIndex: request.removedIndex });
      }
    });
    return true; 
  }
});



  