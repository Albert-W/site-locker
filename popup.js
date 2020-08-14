let blacklist = /www.zhihu.com*/;
let block = document.getElementById('block');
block.onclick = function(element){
  // console.log("you should be blocked");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if( blacklist.test(tabs[0].url)){
      alert("you should be blocked");
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.innerHTML = "' + 'This is blocked!' + '";'});

    } else {
      alert("this website is granted");
    }

  });  

};

let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
};