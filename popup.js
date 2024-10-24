// Initialize content for the popup
chrome.runtime.sendMessage({ request: "getStats" }, (response) => {
    if (response.canvasTabCounter !== undefined) {
        document.getElementById("canvasTabCounter").innerHTML = response.canvasTabCounter;
    }

    if (response.extensionStatus !== undefined) {
        document.getElementById("extensionStatus").innerHTML = response.extensionStatus;
    }

    console.log("Received response in popup:", response);
});

// Listen for updates from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updatePopup") {
        if (message.canvasTabCounter !== undefined) {
            document.getElementById("canvasTabCounter").innerHTML = message.canvasTabCounter;
        }

        if (message.extensionStatus !== undefined) {
            document.getElementById("extensionStatus").innerHTML = message.extensionStatus;
        }
    }
});

// Manual "Stay Alive" button click event
document.getElementById('manual-canvas-stay-alive-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'canvasStayAlive' });
});

// Notify the background script when the popup opens
chrome.runtime.sendMessage({ action: 'popupOpened' });

// Notify the background script when the popup closes
window.addEventListener('beforeunload', () => {
    chrome.runtime.sendMessage({ action: 'popupClosed' });
});
