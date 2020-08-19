let sites = document.getElementById('sites');


chrome.storage.sync.get('sites',function(element){
  // sites.value = [ 1, 2, 3, 4, 5, 6 ].join('\n')
  sites.value = element.sites.join('\n')
})

let save = document.getElementById('saveSites');
save.onclick = function(element){
  chrome.storage.sync.set({'sites': sites.value.trim().split('\n')}, function(){
    var saveNote = {
      type:'basic',
      iconUrl:'images\\get_started48.png',
      title:'Sites saved',
      message:"your sites are successfully saved. Great."
    };
    chrome.notifications.create('savaNote',saveNote);
  });
}

let reset = document.getElementById('resetSites');
reset.onclick = function(element){
  chrome.storage.sync.set({'sites': []});
  sites.value = "";
  var resetNote = {
    type:'basic',
    iconUrl:'images\\get_started48.png',
    title:'Sites reset',
    message:"your sites are successfully reseted. Great."
  };
  chrome.notifications.create('resetNote',resetNote);
}








// let page = document.getElementById('buttonDiv');
// const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
// function constructOptions(kButtonColors) {
//   for (let item of kButtonColors) {
//     let button = document.createElement('button');
//     button.style.backgroundColor = item;
//     button.addEventListener('click', function() {
//       chrome.storage.sync.set({color: item}, function() {
//         console.log('color is ' + item);
//       })
//     });
//     page.appendChild(button);
//   }
// }
// constructOptions(kButtonColors);