let blacklist = /www.zhihu.com*/;
let minites = document.getElementById('minites');
let block = document.getElementById('block');
let blockFlag = false;

chrome.storage.sync.get(['time','sites'],function(element){
    blacklist = element.sites; // this is an array; 
    minites.value = element.time;
  
})

chrome.storage.sync.get('blockFlag',function(element){
  if(element.blockFlag == ture){
    minites.value = element.time;
  }
})



block.onclick = function(element){
  

  // store the time you need to block
  // chrome.storage.sync.set({'time': minites.value}, function() {
  //   console.log("The time is stored");
  // });


  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if( blacklist.test(tabs[0].url)){
      alert("you should be blocked");
      chrome.tabs.executeScript(
          tabs[0].id,
          // {code: 'document.body.innerHTML = "' + 'This is blocked!' + '";'});
          {code: 'document.body.style.visibility =  "hidden"'});

    } else {
      alert("this website is granted");
    }
  });  
};


let unblock = document.getElementById('unblock');

unblock.onclick = function(element){
  //alert(time);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if( blacklist.test(tabs[0].url)){
      alert("This web is unblocked");
      chrome.tabs.executeScript(
          tabs[0].id,
          // {code: 'document.body.innerHTML = "' + 'This is blocked!' + '";'});
          {code: 'document.body.style.visibility =  "visible"'});
      
          
      //开始记时：
      let time = minites.value;
      var timer = setInterval(function(){
          time -= 1;
          minites.value = time;
          chrome.storage.sync.set({'time': time});
          // store the time


          chrome.storage.sync.get('time',function(element){
            if(element.time == 0){
              clearInterval(timer);
              chrome.tabs.executeScript(
                tabs[0].id,
                {code: 'document.body.style.visibility =  "hidden"'});
            }
          })
          // if(time == 0){
          //   clearInterval(timer);
          //   chrome.tabs.executeScript(
          //     tabs[0].id,
          //     {code: 'document.body.style.visibility =  "hidden"'});
    
          // }    
        }, 1000)
      
          
    } else {
      // alert("this website is granted");
    }
  });  
};



// start to unblock for 1min. 
// after that block again. 
// use setTimeout()























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