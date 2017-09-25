/* global chrome */
// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


chrome.contextMenus.create({
  id: `Crackin`,
  title: 'Let\'s get Crackin\'!',
  contexts: ['selection'],
})

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === 'APIreq')

  chrome.contextMenus.onClicked.addListener(() => {
    port.postMessage({type: 'displayInfo'})
    //check if port exists because if can be disconnected
  })
})

