/* global chrome getApiUrl shapeDataForDisplay makeButton */
'use strict'

const port = chrome.runtime.connect({name: 'APIreq'})
let apiSource = 'MDN'
let sources = ['MDN', 'Stack Overflow', 'Hacker News', 'Wikipedia']
let selectedText = ''
let extensionTheme = ''

chrome.storage.sync.get('theme', (obj) => {
	if (obj.hasOwnProperty('theme')) {
		extensionTheme = obj.theme;
	} else {
		chrome.storage.sync.set({theme: 'normal'}, () => {});
		extensionTheme = 'normal';
	}
})


const setupButton = () => {
	const exitClickHandler = () => {
		selectedText = ''
		$('#info-container').remove()
		$('#exit-btn').remove()
		$('#hide-btn').remove()
	}
	const hideClickHandler = (evt) => {
		const btn = evt.target
		if (btn.textContent === '>>') {
			btn.innerHTML = '<<'
			$('#info-container').animate({right: '-50%'})
		} else {
			btn.innerHTML = '>>'
			$('#info-container').animate({right: '6%'})
		}
	}
	const $exitButton = makeButton('exit', 'X', '2', exitClickHandler)
	const $hideButton = makeButton('hide', '>>', '10', hideClickHandler)
	$('body').append($exitButton)
	$('body').append($hideButton)
}

const fullSetup = () => {
	//info container
	if (!document.getElementById('info-container')) {
		let $container = '';
		$container = $(`<div id="info-container"><div id="search-term">Search Term: ${selectedText}</div></div>`)
		$('body').append($container)
	} else {
		$('#search-term').html(`Search Term: ${selectedText}`)
	}

	//source-selector
	if (!document.getElementById('source-selector')) {
		let $sourceSelector = ''
		$sourceSelector = $(`<div>Source: <select id="source-selector"></select></div>`)
		$('#info-container').append($sourceSelector)
		sources.forEach(el => {
			let $source = $(`<option value="${el}">${el}</option>`)
			$('#source-selector').append($source)
		})
		$('#source-selector').change((evt) => {
			apiSource = evt.target.value
			runApp()
		})
		$('#info-container').append('<hr>')

		//function call
		$('#info-container').append('<br>')
	}

	//infobox
	if (!document.getElementById('info-box')) {
		let $infoBox = ''
		$infoBox = $('<div id="info-box"></div>')
		$('#info-container').append($infoBox)
		if (!document.getElementById('exit-btn')) {
			setupButton()
		}
	} else {
		$('#info-box').empty()
	}
}


const displayInfo = (info) => {
	//each line of info
	if (!document.getElementById('info-container')) {
		fullSetup()
		info.forEach(el => $('#info-box').append(el))
		$('#info-container').animate({right: '6%', opacity: '1'})
	} else {
		fullSetup()
		let $infoBox = $('#info-box')
		info.forEach(el => $infoBox.append(el))
	}
}

const runApp = () => {
	if (selectedText !== window.getSelection().toString()) {
		selectedText = window.getSelection().toString()
	}
	let txt = selectedText.split(' ').join('%20')
	let url = getApiUrl(txt, apiSource);
	fetch(url)
	.then(res => res.json())
	.then(data => shapeDataForDisplay(data))
	.then(newData => displayInfo(newData))
	.catch(err => {
		console.log('Request for infomation failed.', err.stack)
	})
}

port.onMessage.addListener(msg => {
	if (msg.type === 'displayInfo') runApp()
	$('body').click((evt) => {
		if ($('#info-container').length && !$.contains(document.getElementById('info-container'), evt.target) && window.getSelection().toString() === '') {
			console.log('Inside the string reset')
			selectedText = ''
			$('#info-container').remove()
			$('#exit-btn').remove()
			$('#hide-btn').remove()
		}
	})
})

