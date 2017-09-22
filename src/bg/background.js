/* global chrome */
// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });



chrome.contextMenus.create({
  id: `Kraken`,
  title: 'Kraken this',
  contexts: ['selection'],
});
chrome.runtime.onConnect.addListener(function(port) {
    console.log(port)
    console.assert(port.name === 'APIreq')
    const getSelectedText = function() {
      port.postMessage({type: 'getSelectedText'})
    }()
    chrome.contextMenus.onClicked.addListener(getSelectedText)
    port.onMessage.addListener(function(msg) {
      console.log(msg)
      if (msg.type === 'selection') {
        //use API here to get info, use dummy data for now:
        let info = 'What in the world is all of this craziness?!?'
        port.postMessage({type: 'display', info})
      }
  })
})

