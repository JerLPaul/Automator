
var rec;
var start = 0;
var time = 0;
var e1;
var e2;

document.addEventListener('DOMContentLoaded', function()
{
    document.getElementById('recOrStop').addEventListener("click", function()
    {
        rec = document.getElementById('recOrStop');
        record()
    });
    document.getElementById('run').addEventListener("click", run())
});
function record()
{
    changeBtn();
    window.addEventListener("keydown", function(e)
    {
        e1 = e;
        getHoldTime("key");
    });
    
    window.addEventListener("mousedown", function(e)
    {
        e2 = e
        getHoldTime("click");
    });

}
function run()
{
    FileSystem.readFile()
}
function changeBtn()
{
    if (rec.innerText === "Record")
    {
        rec.innerText = "Stop";
    }
    else
    {
        rec.innerText = "Record";
    }
}
function addInfoToFile(event, time)
{
    var f = new File([""], temp.js)
    if (event.screenX == 0 && event.screenY == 0)
    {
        window.dispatchEvent(new KeyboardEvent("keydown", e1));
        setTimeout(() =>
        {
            window.dispatchEvent(new KeyboardEvent("keyup", event));
        }, time);

        window.removeEventListener("keyup", getTime);
    }
    else
    {
        window.dispatchEvent(new MouseEvent("mousedown", e2));
        setTimeout(function(event)
        {
            window.dispatchEvent(new MouseEvent("mouseup", event))
        }, time);
        window.removeEventListener("mouseup", getTime);
    }
    
}
function getHoldTime(type)
{
    var start = performance.now();
    if (type == "key")
    {
        
        window.addEventListener("keyup", getTime);
    }
    else
    {
        window.addEventListener("mouseup", getTime);
    }
    //use event.key event.ctrlKey and timer and x y coord
    //let keyEvent = new KeyboardEvent("keypress", {key: event.key, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey});
}
function getTime(e)
{
	console.log(performance.now());
    time = performance.now() - start;
    
    console.log(time);
   	addInfoToFile(e, time);
}