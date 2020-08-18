let blacklist = /www.zhihu.com*/;
let minites = document.getElementById('minites');
let block = document.getElementById('block');
let remainDiv = document.getElementById('remainDiv');
let remain = document.getElementById('remain');
// let blockFlag = false;

// time -> remain time.
// sites -> blocked sites. 
chrome.storage.sync.get(['time','sites','defaultTime'],function(element){
    // blacklist = element.sites; // this is an array; 
    
    minites.value = element.defaultTime;
    if(element.time > 0){
      remainDiv.style.visibility = 'visible';
      remain.textContent = element.time;
    }
  
})

// keep track of the remain time. 
chrome.storage.onChanged.addListener(function(changes,storageName){
  remain.textContent = changes.time.newValue.toString();
})



block.onclick = function(element){
  
  getblock(); 
};


let unblock = document.getElementById('unblock');

unblock.onclick = function(element){
  getUnblock();
  // 记录默认时间    
  chrome.storage.sync.set({'defaultTime': minites.value});
  // 在eventPage 处理定时任务。 
  chrome.runtime.sendMessage({todo:"start timer", time:minites.value});

  //显示隐藏块
  let time = minites.value;
  remain.textContent = time;
  remainDiv.style.visibility = 'visible';
 
};

function getblock(){
  chrome.tabs.query({}, function(tabs) {
    let blacklist = /www.zhihu.com*/;
    for(tab of tabs){
      console.log(tab.url);
      if( blacklist.test(tab.url)){
        chrome.tabs.executeScript(
          tab.id,
          {code: 'document.body.style.visibility =  "hidden"'});
      }
    }

  })
}

function getUnblock(){
  chrome.tabs.query({}, function(tabs) {
    for(tab of tabs){
      // console.log(tab.url);
      if( blacklist.test(tab.url)){
        chrome.tabs.update(
          tab.id,
          {url: tab.url});

      }
    }

  })
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