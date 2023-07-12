chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    if (message.type === "script") {
        // const activeTabId = await getActiveTabId();
        // chrome.scripting.executeScript({
        //     target: {tabId: activeTabId},
        //     func: new Function(message.script)
        //   });
    }
    else if (message.type === "load") {
      console.log(message.name);
      await getActiveTabId()
      .then((activeTabId) => {
        chrome.scripting.executeScript({
          target: {tabId: activeTabId},
          files: ["recordings/" + message.name]
        });
      });
    }
});

function download(input) {
    var text = new Blob([input], {
      type: "text/javascript"
    });
    script = URL.createObjectURL(text);
    // link.download = "recording";
  
    // link.click();
  
    return script;
  }

  async function getActiveTabId() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      const activeTabId = tabs[0].id;
      return activeTabId;
    }
  }