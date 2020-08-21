let blacklist
let minutes = document.getElementById('minutes');
let block = document.getElementById('block');
let remainDiv = document.getElementById('remainDiv');
let remain = document.getElementById('remain');

// let blockFlag = false;

// time -> remain time.
// sites -> blocked sites. 
// defaultTime -> remeber the time length 
chrome.storage.sync.get(['time', 'sites', 'defaultTime'], function (element) {
  blacklist = new Set(element.sites); 

  if(element.defaultTime > 0){
    minutes.value = element.defaultTime;
  }
  if (element.time > 0) {
    remainDiv.style.visibility = 'visible';
    remain.textContent = element.time;
  }
})

// keep track of the remain time. 
chrome.storage.onChanged.addListener(function (changes, storageName) {
  if(changes.time){
    remain.textContent = Math.max(changes.time.newValue,0).toString();
    remainDiv.style.visibility = 'visible';
  }
})

block.onclick = function (element) {
  // set time to zero
  chrome.storage.sync.set({ 'time':0 });
  
  // add the current url 
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    let curUrl = new URL(tabs[0].url);

    blacklist.add(curUrl.hostname);
    chrome.storage.sync.set({ 'sites': Array.from(blacklist) })
  })
  // message to block()
  chrome.runtime.sendMessage({ todo: "time2zero"});

};


let unblock = document.getElementById('unblock');

unblock.onclick = function (element) {
  // getUnblock();
  // 记录默认时间    
  chrome.storage.sync.set({ 'defaultTime': minutes.value });
  // 在eventPage 处理定时任务。 
  // message to unblock; 
  chrome.runtime.sendMessage({ todo: "start timer", time: minutes.value });

  //显示隐藏块
  let time = minutes.value;
  remain.textContent = time;
  remainDiv.style.visibility = 'visible';

};

// Execute a function when the user releases a key on the keyboard
minutes.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    unblock.click();
  }
});