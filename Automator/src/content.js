//const chrome = import('chrome.scripting');

var queue = [];
var t = 0;

chrome.runtime.onMessage.addListener((message,sender,response) => {
  if (message.type === "rec") {
    if (message.state == 1) {
      record();
    }
    else if (message.state == 0) {
      createScript();
    }
  }
});

// const input = document.getElementById("run");

// input.addEventListener("change", function(e) {
//   const file = e.target.files[0];

//   if (!(file.name.split(".").pop() === "js")) {
//     return;
//   }

//   const reader = new FileReader();

//   reader.onload = function(e) {

//     const content = e.target.result;

//     const blob = new Blob([content], {
//       type: "application/javascript"
//     });
//     const url = URL.createObjectURL(blob);
//     const worker = new Worker(url);
//   }
// });



function record(e) {
  t = Date.now();

  //window.addEventListener("mousemove", recMouseMove);

  window.addEventListener("mousedown", recMouseDown);

  window.addEventListener("click", recClick);

  window.addEventListener("keydown", recKeyDown);

  window.addEventListener("keypress", recKeypress);

  window.addEventListener("input", recInput);
}

function recMouseMove(e) {
  const time = Date.now();

  queue.push({
    type: "mousemove",
    time: time - t,
    value: e
  });
  console.log("mousemove");
}

function recMouseDown(e) {
  const time = Date.now();

  queue.push({
    type: "mousedown",
    time: time - t,
    value: e
  });

  window.addEventListener("mouseup", recMouseUp);
  console.log("Mouse down");
}

function recMouseUp(e) {
  const delay = Date.now()
  //use date to find difference
  queue.push({
    type: "mouseup",
    time: delay - t,
    value: e
  });

  console.log("Mouse up affecting" + document.elementFromPoint(e.clientX, e.clientY));
}

function recClick(e) {
  const time = Date.now();

  queue.push({
    type: "click",
    time: time - t,
    value: e
  });

  console.log("click");
}
function recKeyDown(e) {
  const time = Date.now();

  queue.push({
    type: "keydown",
    time: time - t,
    value: e
  });

  window.addEventListener("keyup", recKeyUp);
  console.log("keyDown");
}

function recKeyUp(e) {
  //use date to find difference
  const delay = Date.now();

  queue.push({
    type: "keyup",
    time: delay - t,
    value: e
  });
  console.log("Key up");
}

function recKeypress(e) {
  const time = Date.now();

  queue.push({
    type: "keypress",
    time: time - t,
    value: e
  });

  console.log("keypress");
}

function recInput(e) {
  const time = Date.now();

  queue.push({
    type: "input",
    time: time - t,
    value: e
  });

  console.log("input");
}

function createScript(e) {
  //to stop the recording

  //window.removeEventListener("mousemove", recMouseMove);
  window.removeEventListener("keydown", recKeyDown);
  window.removeEventListener("keyup", recKeyUp);
  window.removeEventListener("keypress", recKeypress);
  window.removeEventListener("mousedown", recMouseDown);
  window.removeEventListener("mouseup", recMouseUp);
  window.removeEventListener("click", recClick);
  window.removeEventListener("click", recInput);

  //Make the mouse events change the curr Element to dispatch the keyboard
  //events properly
  var input = "var currElement;";
  var element = queue.shift();
  var len = queue.length;
  var lastElement = element;
  while (len >= 0) {
    //element stuff
    if (element && (element.type.startsWith("mouse") || element.type === "click")) {
      var script = `
             currElement = document.elementFromPoint(x.clientX, x.clientY);
              if (currElement) {
                  currElement.dispatchEvent(x);
              }
              `;

      input += `

      setTimeout(function() {
        var x = new MouseEvent("${element.type}", {
          clientX: ${element.value.clientX},
          clientY: ${element.value.clientY},
          button: ${element.value.button}
        });

        ${script}
      }, ${element.time});
      `;
    } else if (element.type === "input") {
      input += `
      setTimeout(function() {
        var x = new InputEvent("${element.type}", {
          data: "${element.value.data}",
          isComposing: ${element.value.isComposing} 
        });
        if (currElement) {
          currElement.dispatchEvent(x);
        }
      }, ${element.time});
      `;
    } else {
      input += `
      setTimeout(function() {
        var x = new KeyboardEvent("${element.type}", {
          key: "${element.value.key}",
          ctrlKey: ${element.value.ctrlKey},
          altKey: ${element.value.altKey},
          shiftKey: ${element.value.shiftKey},
          metaKey: ${element.value.metaKey},
          repeat: ${element.value.repeat},
          bubbles: true
        });
        if (currElement) {
          currElement.dispatchEvent(x);
        }
      }, ${element.time});
      `;
    }
    len--;
    lastElement = element;
    element = queue.shift();
  }

  console.log(input);
  download(input);
  // chrome.runtime.sendMessage({
  //   type: "script", 
  //   script: input
  // });
  
  //const tabId = getTab()
  //.then(() =>
}

function getTab() {
  const tabId = chrome.tabs.query({active: true, currentWindow: true});
  return tabId;
}

function download(input) {
  var text = new Blob([input], {
    type: "text/javascript"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(text);
  link.download = "recording";

  link.click();
}
