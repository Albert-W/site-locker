var contextMenuItem = {
  'id':'block',
  'title':'block it',
  'contexts':['page']

}
chrome.contextMenus.create(contextMenuItem);














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
let minites = document.getElementById('minites');
alert(minites.value);