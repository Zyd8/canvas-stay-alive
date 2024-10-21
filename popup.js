
chrome.runtime.sendMessage({ request: "getStatus" }, (response) => {
    if (response.canvasTabCounter !== undefined) {
        document.getElementById("canvasTabCounter").innerHTML = response.canvasTabCounter;
    }

    if (response.extensionStatus !== undefined) {
        document.getElementById("extensionStatus").innerHTML = response.extensionStatus;
    }

    console.log("Received response in popup:", response);
});


