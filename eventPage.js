
// logic of contextMenu
var contextMenuItem = {
  'id':'block',
  'title':'block it',
  'contexts':['page']

}
chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(element){
  if(element.menuItemId == "block"){
    alert("This website should be blocked");
  }
})

// chrome.storage.onChanged.addListener(function(changes,storageName){
//   // logic of Badge
//   chrome.browserAction.setBadgeText({
//     "text":changes.time.newValue.toString()
//   });
//   // logic of block
//   if(changes.time.newValue == 0){
//     getblock();
//   }
// })

// logic of message 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if(request.todo == "start timer"){
    // alert(request.time);
    let time = request.time;
    var timer = setInterval(function(){
      time -= 1;
      chrome.storage.sync.set({'time': time});

      chrome.browserAction.setBadgeText({
        "text":time.toString()
      });  
      if(time == 0){
        clearInterval(timer);
        getblock();
      }
       
    }, 1000)
  }
  
})


function getblock(){
  chrome.tabs.query({}, function(tabs) {
    let blacklist = /www.zhihu.com*/;
    for(tab of tabs){
      // console.log(tab.url);
      if( blacklist.test(tab.url)){
        chrome.tabs.executeScript(
          tab.id,
          {code: 'document.body.style.visibility =  "hidden"'});
      }
    }

  })
}









chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'developer.chrome.com'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });

  });

// chrome.runtime.onSuspend.addListener(function() {
//   chrome.storage.sync.set({
//     time: time
//   });
// });  
// let minites = document.getElementById('minites');
