let sites = document.getElementById('sites');
let hour = document.getElementById('hour');
//alert(hour.value);
// if(hour.value == null){
//   hour.value = 13;
// }

// 安装时生效，重启时不生效
// 刷新options page时不生效
// 只是eventpage生效。 
// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({'hour':hour.value },function(){
//     // alert(hour.value);
//     chrome.storage.sync.get(['hour'],function(element){
//       // sites.value = [ 1, 2, 3, 4, 5, 6 ].join('\n')
//       // alert(element.hour);
//       hour.value = element.hour;
      
//     })
    
//   });
// })

chrome.storage.sync.get(['sites','hour'],function(element){
  // sites.value = [ 1, 2, 3, 4, 5, 6 ].join('\n')
  sites.value = element.sites.join('\n');
  hour.value = element.hour;
  
})



let save = document.getElementById('saveSites');
save.onclick = function(element){
  chrome.storage.sync.set({'sites': sites.value.trim().split('\n')}, function(){

  });
}

let reset = document.getElementById('resetSites');
reset.onclick = function(element){
  chrome.storage.sync.set({'sites': []});

}

let setHour = document.getElementById('setHour');
setHour.onclick = function(element){
  
  let timeout = 1000 * 60 * 60 * 24;
  alert(hour.value + " will be stored after 24 hours");
  setTimeout(() => {
    chrome.storage.sync.set({'hour': hour.value}, function(){
    });
    
  }, timeout);
}

