// Return the finnkode from the current URL
function getCurrentFinnkode() {
  var currentURL = new URL(window.location.href);
  var finnkode = currentURL.searchParams.get("finnkode") || "";
  return finnkode;
}

// show the banner on the UI
function showBanner() {
  const banner = document.createElement('div');
  banner.id = 'mybanner';
  const text = document.createElement('p');
  text.style = "margin: 0;"
  text.innerText = 'Denne annonsen er blokkert';
  banner.style = `
    width: 100%; 
    position: fixed; 
    bottom: 10px; 
    z-index: 1000; 
    background-color: #F44336; 
    color: white; 
    border: none; 
    padding: 15px 32px; 
    text-align: center; 
    text-decoration: none; 
    display: inline-block; 
    font-size: 16px;
  `;
  banner.appendChild(text);
  document.body.appendChild(banner);
}

// Remove the banner from the UI if it exists
function removeBanner() {
  const banner = document.querySelector('#mybanner');

  if (banner) {
    banner.remove();
  }
}

// Remove the button from the UI if it exists
function removeButton() {
  const button = document.querySelector('#mybutton');

  if (button) {
    button.remove();
  }
}

// show the button on the UI
function showButton() {
  const button = document.createElement('button');
  button.id = 'mybutton';
  button.innerText = 'FinnBlokk denne annonsen';
  button.style = `
      position: fixed; 
      bottom: 10px; 
      right: 10px; 
      z-index: 1000; 
      background-color: #F44336; 
      color: white; 
      border: none; 
      padding: 15px 32px; 
      text-align: center; 
      text-decoration: none; 
      display: inline-block; 
      font-size: 16px;
    `;
  button.addEventListener("click", function (e) {
    removeButton();
    const finnkode = getCurrentFinnkode(); 
    chrome.runtime.sendMessage({ action: "addItemToList", item: finnkode })
    showBanner()
  });
  document.body.appendChild(button);
}

function checkCurrentFinnkodeAgainstList() {
  // Get the current URL
  const currentFinnkode = getCurrentFinnkode()

  // Retrieve the list from storage
  chrome.storage.sync.get(['list'], function(result) {
    const list = result.list || [];

    // Check if the current URL is in the list
    if (list.includes(currentFinnkode)) {
      if (DEBUG) console.log("CONTENT.JS: Current Finnkode is in the list.");
      removeButton()
      showBanner()
    } else {
      if (DEBUG) console.log("CONTENT.JS: Current Finnkode is not in the list.");
      removeBanner()
      showButton();
    }
  });
}

// function runs when an item has been removed from the list in the popup window
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "anItemHasBeenRemovedFromPopupList") {
    if (DEBUG) console.log("CONTENT.JS: Finnkode removed from list: ", request.removedIndex);
    // Check if the current Finnkode is still in the list
    checkCurrentFinnkodeAgainstList();
  }
});

checkCurrentFinnkodeAgainstList();