let blacklist
let minites = document.getElementById('minites');
let block = document.getElementById('block');
let remainDiv = document.getElementById('remainDiv');
let remain = document.getElementById('remain');
// let blockFlag = false;

// time -> remain time.
// sites -> blocked sites. 
// defaultTime -> remeber the time length 
chrome.storage.sync.get(['time', 'sites', 'defaultTime'], function (element) {
  blacklist = new Set(element.sites); // this is an Set(); 

  minites.value = element.defaultTime;
  if (element.time > 0) {
    remainDiv.style.visibility = 'visible';
    remain.textContent = element.time;
  }
  // 向event page 发送消息保存blacklist
  // chrome.runtime.sendMessage({ todo: "blacklist", sites: Array.from(blacklist) });

})

// keep track of the remain time. 
chrome.storage.onChanged.addListener(function (changes, storageName) {
  remain.textContent = changes.time.newValue.toString();
})



block.onclick = function (element) {
  // add the current url 
  chrome.tabs.query({ active: true }, tabs => {
    let curUrl = new URL(tabs[0].url);
    // alert(url);
    // alert(url.host);
    // alert(curUrl.hostname);
    blacklist.add(curUrl.hostname);
    chrome.storage.sync.set({ 'sites': Array.from(blacklist) })
  })

  // 向event page 发送消息保存blacklist
  chrome.runtime.sendMessage({ todo: "blacklist", sites: Array.from(blacklist) });

  getblock();
};

function getblock() {
  chrome.tabs.query({}, function (tabs) {
    blockTabs(tabs);
  })
}

// pass tab to a function which can access blacklist 
function blockTabs(tabs) {
  for (const site of blacklist) {
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
}



let unblock = document.getElementById('unblock');

unblock.onclick = function (element) {
  getUnblock();
  // 记录默认时间    
  chrome.storage.sync.set({ 'defaultTime': minites.value });
  // 在eventPage 处理定时任务。 
  chrome.runtime.sendMessage({ todo: "start timer", time: minites.value });

  //显示隐藏块
  let time = minites.value;
  remain.textContent = time;
  remainDiv.style.visibility = 'visible';

};





function getUnblock() {
  chrome.tabs.query({}, function (tabs) {
    unblockTabs(tabs);
  })
}

function unblockTabs(tabs) {
  for (const site of blacklist) {
    let regex = new RegExp(site + '.*');
    // alert(regex);
    for (tab of tabs) {
      // alert(tab.url);
      if (regex.test(tab.url)) {
        chrome.tabs.update(
          tab.id,
          { url: tab.url });
      }
    }
  }

}






















// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };