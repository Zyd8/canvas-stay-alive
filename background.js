const CHECK_INTERVAL = 5; 
const TARGET_URL = 'https://ue.instructure.com';
let canvasTabCounter = 0;
let extensionStatus = "Loading...";
let activeTabId;


function focusCanvasTabs() {
    extensionStatus = "extension running!";

    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {

        if (activeTabs.length > 0) {
            activeTabId = activeTabs[0].id; 
        }

        let inactiveTabsCtr = 0

        chrome.tabs.query({ url: "*://*.instructure.com/*" }, function(tabs) {
            canvasTabCounter = tabs.length; 
            if (tabs.length > 0) {
                console.log("Found", canvasTabCounter, "tabs with URL matching 'ue.instructure.com'.");

                tabs.forEach(tab => {
                    const isActiveTab = activeTabId === tab.id; 
                    if (!isActiveTab) {
                        chrome.tabs.reload(tab.id);
                        inactiveTabsCtr += 1 
                    }

                });
                console.log(inactiveTabsCtr, "inactive tabs reloaded ");
            } else {
                console.log("No tabs with URL matching 'ue.instructure.com' were found.");
            }
        });
    });
}


// Create an alarm when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("Canvas, Stay Alive! extension installed.");
    focusCanvasTabs();
    chrome.alarms.create("checkCanvasTabs", { periodInMinutes: CHECK_INTERVAL });
});


// Handle the alarm event
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkCanvasTabs") {
        focusCanvasTabs(); 
    }
});


// Fired when the extension on chrome startup 
chrome.runtime.onStartup.addListener(() => {
    console.log("Chrome has started, running Canvas, Stay Alive! extension.");
    focusCanvasTabs();
    chrome.alarms.create("checkCanvasTabs", { periodInMinutes: CHECK_INTERVAL });
});


// Listener for messages to get status
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.request === "getStatus") {
        sendResponse({
            canvasTabCounter: canvasTabCounter,
            extensionStatus: extensionStatus
        });
    }
});
