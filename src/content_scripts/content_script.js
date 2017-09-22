/* global chrome */

const port = chrome.runtime.connect({name: 'APIreq'})

port.onMessage.addListener(function(msg) {
	console.log(msg.type)
	if (msg.type === 'getSelectedText'){
		let selectedText = window.getSelection().toString()
		port.postMessage({type: 'selection', selectedText});
	}
  else if (msg.type === 'display') {
		displayMessage(msg.info)
	}
});

function displayMessage(info) {
	let $messageBox = $(`<div id="messageBox">${info}</div>`)
	$('body').append($messageBox)
	$messageBox.css({
		position: 'fixed',
		bottom: '2%',
		right: '-20%',
		width: '400px',
		height: '250px',
		opacity: '0.6',
		'background-color': '#73AD21',
		'border-radius': '25px',
		padding: '15px',
		'word-wrap': 'break-word'
	})
	let $exitButton = $('<button id="close-btn">Close</button>')
	$exitButton.css({
		'background-color': 'red'
	})
	$messageBox.animate({right: '2%', opacity: '1'})
	$('#messageBox').append($exitButton)
	$exitButton.click(function() {
		$('#messageBox').remove()
	})
}

