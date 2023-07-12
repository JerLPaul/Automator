
window.addEventListener("load",() => {
    chrome.storage.local.get(["state"], (result) => {
        if (result.state == 1) {
            switchName(document.getElementById("rec"));
        }
    });
      
    document.getElementById("rec").addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (switchName(document.getElementById("rec"))) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "rec", state: 1 });
                chrome.storage.local.set({state: 1})
            } else {
                chrome.tabs.sendMessage(tabs[0].id, { type: "rec", state: 0});
                chrome.storage.local.set({state: 0})
            }
          });
    });

    document.getElementById("run").addEventListener('change', (event) => {
        const file = event.target.files[0];
        // Send the file to the background script
        chrome.runtime.sendMessage({ type: "load", name: file.name });
      });
});

function switchName(bt) {
    if (bt.innerHTML === "Record") {
        bt.innerHTML = "Stop";
        return 1;
    } else {
        bt.innerHTML = "Record";
        return 0;
    }
}