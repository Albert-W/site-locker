// logic of contextMenu
var contextMenuItem = {
  'id': 'block',
  'title': 'block it',
  'contexts': ['page']
}
chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function (element) {
  if (element.menuItemId == "block") {
    // alert("This website should be blocked");
      // add the current url 

      chrome.tabs.query({ active: true }, tabs => {
        let curUrl = new URL(tabs[0].url);
        // alert(url);
        // alert(url.host);
        // alert(curUrl.hostname);
        addurl(curUrl.hostname);
        getblock(); // do it during the call back function 
      })

  }
})

function addurl(url){
  chrome.storage.sync.get(['sites'], function (element) {
    var blacklist = new Set(element.sites);
    console.log(blacklist);
    blacklist.add(url);
    chrome.storage.sync.set({ 'sites': Array.from(blacklist) })
  })
}


// logic of message 
var time
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.todo == "start timer") {
    // alert(request.time);
    time = request.time;
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
        getblock();
      }
      chrome.storage.sync.set({ 'time': time });

    }, 1000 * 60 )
  }

  // 保存blacklist
  if (request.todo == "blacklist") {
    time = 0;
    blacklist = request.sites;
    // alert(blacklist);
    requestBlock(blacklist);

  }
})

function requestBlock(blacklist){
  let newlist = blacklist.map(i => "*://" + i + "/*");
  // alert(newlist)
  chrome.webRequest.onBeforeRequest.addListener(

    function (details) {
      //alert(time)
      if (time == null || time == 0) {
        return { cancel: true };

      } else {
        return { cancel: false };
      }

    },
    // {urls: ["*://www.zhihu.com/*"]},
    { urls: newlist },
    ["blocking"]);  
}


function getblock() {
  chrome.tabs.query({}, function (tabs) {
    blockTabs(tabs);
  })
}




// pass tab to a function which can access blacklist 
// let blacklist
function blockTabs(tabs) {
  chrome.storage.sync.get(['sites'], function (element) {
    let blacklist = element.sites;
    console.log(blacklist);
    for (let site of blacklist) {
      let regex = new RegExp(site + '.*');
      // alert(regex);
      for (tab of tabs) {
        // alert(tab.url);
        if (regex.test(tab.url)) {
          chrome.tabs.executeScript(
            tab.id,
            { code: 'document.body.style.visibility =  "hidden"' });
        }
      }
    }
  })
}


// 安装时生效，重启时不生效
// chrome.runtime.onInstalled.addListener(function() {

//   chrome.storage.sync.get(['sites'],function(element){
//     chrome.runtime.sendMessage({todo:"blacklist", sites:element.sites});  
//     alert(element.sites)
//   })
// })

// 每次启动时生效。
chrome.storage.sync.get(['sites'],function(element){
  chrome.runtime.sendMessage({todo:"blacklist", sites:element.sites});  
  // alert(element.sites)
  requestBlock(element.sites);
})


// chrome.storage.onChanged.addListener(function(changes,storageName){
//   blacklist = changes.sites.newValue;
// })

// alert(blacklist)

// block all request to blocklist
// refresh 也屏蔽
// chrome.storage.sync.get(['time','sites','defaultTime'],function(element){
//   let blacklist = element.sites; 



  // alert(time)














// chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log("The color is green.");
//     });

//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         chrome.declarativeContent.onPageChanged.addRules([{
//           conditions: [new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: {hostEquals: 'developer.chrome.com'},
//           })
//           ],
//               actions: [new chrome.declarativeContent.ShowPageAction()]
//         }]);
//       });

//   });

// chrome.runtime.onSuspend.addListener(function() {
//   chrome.storage.sync.set({
//     time: time
//   });
// });  
// let minites = document.getElementById('minites');
