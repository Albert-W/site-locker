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
    getblock();
  }
})


// logic of message 
var time
var blacklist
var newlist

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.todo == "start timer") {
    // alert(request.time);
    time = request.time;
    var timer = setInterval(function () {
      time -= 1;
      chrome.storage.sync.set({ 'time': time });

      chrome.browserAction.setBadgeText({
        "text": time.toString()
      });
      if (time <= 0) {
        clearInterval(timer);
        getblock();
      }

    }, 1000 * 60)
  }

  // 保存blacklist
  if (request.todo == "blacklist") {
    blacklist = request.sites;
    // alert(blacklist);
    requestBlock(blacklist);

  }
})

function requestBlock(blacklist){
  newlist = blacklist.map(i => "*://" + i + "/*");
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
