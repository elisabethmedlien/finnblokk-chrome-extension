

function updateListDisplay(list) {
    const listContainer = document.getElementById('listContainer'); // Ensure you have this element in your popup.html
    listContainer.innerHTML = ''; // Clear the existing contents

    if (list.length > 0) {
        list.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');
        
            // Create a span to hold the list item text
            const itemText = document.createElement('span');
            itemText.textContent = item;
            listItem.appendChild(itemText);
        
            // Create a remove button for each item
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Fjern';
            removeButton.classList.add('remove-btn');
            removeButton.addEventListener('click', function() {
                removeItem(index); 
            });
        
            listItem.appendChild(removeButton);
            listContainer.appendChild(listItem);
        });
    } else {
        // If the list is empty, display a message
        listContainer.innerHTML = 'Ingen blokkerte annonser';
    }
}

function fetchList() {
    // Fetch the list from storage
    chrome.runtime.sendMessage({ action: "getList" }, function(response) {
        if (response && response.list) {
            if (DEBUG) console.log("POPUP.JS: List fetched from storage: ", response.list)
            // Update the UI in the popup window
            updateListDisplay(response.list);
        }
    });
}

// Remove an item from the list and update the UI
function removeItem(index) {
    if (DEBUG) console.log("POPUP.JS: Removing finnkode "+index+" from list..");
    chrome.runtime.sendMessage({ action: "removeItemFromList", removedIndex: index }, function(response) {
        if (response && response.list) {
            // Update the UI in the popup window
            updateListDisplay(response.list);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Fetch the list from storage and update the UI on popup load
    fetchList();
});