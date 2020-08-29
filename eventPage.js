// logic of contextMenu
var contextMenuItem = {
  'id': 'block',
  'title': 'block it',
  'contexts': ['page']
}
chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClicked.addListener(function (element) {
  if (element.menuItemId == "block") {

      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let curUrl = new URL(tabs[0].url);
        // alert(url);
        // alert(url.host);
        // alert(curUrl.hostname);
        addurl(curUrl.hostname);
        // getblock(); // do it during the call back function 
        // refresh_current();
        chrome.tabs.update(
          tabs[0].id,
          { url: tabs[0].url });  
      })
  }
})

function addurl(url){
  chrome.storage.sync.get(['sites'], function (element) {
    var blacklist = new Set(element.sites);
    // console.log(blacklist);
    blacklist.add(url);
    chrome.storage.sync.set({ 'sites': Array.from(blacklist) });
    requestBlock(Array.from(blacklist));
    // chrome.tabs.query({}, function (tabs) {
    //   blockTabs(tabs,Array.from(blacklist));
    // })
  })
}

function refresh_current(){
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.update(
      tabs[0].id,
      { url: tabs[0].url });   
  })
}

// pass tab to a function which can access blacklist 
// let blacklist
function refresh_Tabs(tabs, blacklist) {
  for (let site of blacklist) {
    let regex = new RegExp(site + '.*');
    // alert(regex);
    for (tab of tabs) {
      // alert(tab.url);
      if (regex.test(tab.url)) {
        // chrome.tabs.executeScript(
        //   tab.id,
        //   { code: 'document.body.style.visibility =  "hidden"' });
        chrome.tabs.update(
          tab.id,
          { url: tab.url });          
      }
    }
  }
}

function refresh_all(){
  chrome.tabs.query({}, function (tabs) {
    chrome.storage.sync.get(['sites'],function(element){
      refresh_Tabs(tabs,element.sites);
    }) 
  })
}

// logic of message 
var time
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // to block all
  if(request.todo == "time2zero"){
    time = 0;
    refresh_all();
    chrome.browserAction.setBadgeText({
      "text": 0
    });
  }
  // to unblock one;
  if (request.todo == "start timer") {
    time = request.time;
    startTimer();
    if(time <= 0){
      refresh_current();
    }
  }

})

function startTimer(){
    //如果处于屏蔽状态，就刷新
    // if(time == null || time <= 0){
    //   refresh_current();
    // } else{
    //   clearInterval(timer);
    // }
    clearInterval(timer);
    // time = request.time;
    chrome.browserAction.setBadgeText({
      "text": time.toString()
    });
    var timer = setInterval(function () {
      time -= 1;
      chrome.browserAction.setBadgeText({
        "text": Math.max(time,0).toString()
      });
      if (time <= 0 ) {
        clearInterval(timer);
        // to block all();
        refresh_all();
      }
      chrome.storage.sync.set({ 'time': time });
    }, 1000 * 60)
}


var blockthem
function requestBlock(blacklist){
  // it is needed to remove previous listener. 
  chrome.webRequest.onBeforeRequest.removeListener(blockthem);
  blockthem =  function (details) {

    if (time == null || time <= 0) {
      url = new URL(details.url);

      for(site of blacklist){
        if(url.hostname == site){
          return {cancel: true};
        }
      }
      return { cancel: false };

    } else {
      return { cancel: false };
    }
  }
  
  chrome.webRequest.onBeforeRequest.addListener(
    blockthem,
    // {urls: ["*://www.zhihu.com/*"]},
    // { urls: newlist },
    {urls: ['<all_urls>']},
    ["blocking"]);  
  // let newlist = blacklist.map(i => "*://" + i + "/*");
  // alert(newlist)

}



// 每次启动时生效。
chrome.storage.sync.get(['sites','time'],function(element){
  // chrome.runtime.sendMessage({todo:"blacklist", sites:element.sites});  
  // alert(element.sites)
  requestBlock(element.sites);
  if (element.time > 0) {
    // chrome.browserAction.setBadgeText({
    //   "text": element.time.toString()
    // });
    // chrome.runtime.sendMessage({ todo: "start timer", time: element.time });
    time = element.time;
    startTimer();
  }
})

// keep track of the blacklist. 
chrome.storage.onChanged.addListener(function (changes, storageName) {
  if(changes.sites){
    // console.log("sites onChanged " + changes.sites.newValue);
    requestBlock(changes.sites.newValue);
    refresh_all();
    // remain.textContent = changes.time.newValue.toString();
  }

})

// 安装时生效，重启时不生效
// chrome.runtime.onInstalled.addListener(function() {

//   chrome.storage.sync.get(['sites'],function(element){
//     chrome.runtime.sendMessage({todo:"blacklist", sites:element.sites});  
//     alert(element.sites)
//   })
// })