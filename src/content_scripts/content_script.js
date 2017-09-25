/* global chrome */

const port = chrome.runtime.connect({name: 'APIreq'})
let apiSource = 'MDN'
let sources = ['MDN', 'Stack Overflow', 'Hacker News', 'Wikipedia']
let selectedText = ''
let extensionTheme = ''

chrome.storage.sync.get("theme", (obj) => {
	if (obj.hasOwnProperty("theme")) {
		extensionTheme = obj.theme
	} else {
		chrome.storage.sync.set({"theme": "normal"}, () => {})
		extensionTheme = "normal"
	}
})


const getApiUrl = (txt) => {
	switch (apiSource) {
		case 'MDN':
			return `https://developer.mozilla.org/en-US/search.json?locale=en-US&q=${txt}`
		case 'Stack Overflow':
			return `https://api.stackexchange.com/2.2/search/advanced?pagesize=10&order=desc&sort=relevance&q=${txt}&site=stackoverflow`
		case 'Hacker News':
			return `https://hn.algolia.com/api/v1/search?tags=story&query=${txt}`
		case 'Wikipedia':
			return `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${txt}`
		default:
			return `https://developer.mozilla.org/en-US/search.json?locale=en-US&q=${txt}`
	}
}

const setupButton = () => {
	const makeButton = (type, HTMLtext, bottomPosition, clickHandler) => {
		let $button = $(`<button id="${type}-btn">${HTMLtext}</button>`)
		$button.css({
			'background-color': '#2b303b',
			position: 'fixed',
			right: '1.5%',
			bottom: `${bottomPosition}%`,
			height: '40px',
			width: '40px',
			'border-radius': '50%',
			'z-index': '500',
			color: 'white',
			'font-size': '12px'
		})
		$button.click(clickHandler)
		return $button
	}
	const $exitButton = makeButton('exit', 'X', '2', () => {
		selectedText = ''
		$('#info-container').remove()
		$('#exit-btn').remove()
		$('#hide-btn').remove()
	})
	const $hideButton = makeButton('hide', '>>', '10', (evt) => {
		const btn = evt.target
		if (btn.textContent === '>>') {
			btn.innerHTML = '<<'
			$('#info-container').animate({right: '-50%'})
		} else {
			btn.innerHTML = '>>'
			$('#info-container').animate({right: '6%'})
		}
	})
	$('body').append($exitButton)
	$('body').append($hideButton)
}

const fullSetup = () => {
	//info container
	if (!document.getElementById('info-container')) {
		let $container = ''
		if (extensionTheme === 'code') {
			$container = $(`<div id="info-container"><div id="search-term"><span class='let-dec'>let</span> <span class="var-dec">searchTerm</span> = <span class="string-var">'${selectedText}'</span></div></div>`)
			$container.css({
			position: 'fixed',
			bottom: '2%',
			right: '-20%',
			width: '400px',
			height: '325px',
			opacity: '0.6',
			padding: '17px',
			'background-color': '#2b303b',
			'word-wrap': 'break-word',
			'z-index': '600',
	  	'line-height': '20px',
			overflow: 'hidden',
			'border-radius': '3%',
			'font-family': 'Inconsolata, Monaco, Consolas, "Courier New", Courier',
			color: 'white',
			'font-size': '12px'
			})
		} else {
			$container = $(`<div id="info-container"><div id="search-term">Search Term: ${selectedText}</div></div>`)
			$container.css({
				position: 'fixed',
				bottom: '2%',
				right: '-20%',
				width: '400px',
				height: '325px',
				opacity: '0.6',
				padding: '17px',
				'background-color': '#2b303b',
				'word-wrap': 'break-word',
				'z-index': '600',
				'line-height': '20px',
				overflow: 'hidden',
				'border-radius': '3%',
				'font-family': 'Arial',
				color: 'white',
				'font-size': '12px'
				})
		}
		$('body').append($container)
	} else {
		if (extensionTheme === 'code') {
			$('#search-term').html(`<div><span class='let-dec'>let</span> <span class="var-dec">searchTerm</span> = <span class="string-var">'${selectedText}'</span></div>`)
		} else {
			$('#search-term').html(`Search Term: ${selectedText}`)
		}
	}

	//source-selector
	if(!document.getElementById('source-selector')) {
		let $sourceSelector = ''
		if (extensionTheme === 'code') {
			$sourceSelector = $(`<div><span class='let-dec'>let</span> <span class="var-dec">source</span> = <select id="source-selector"></select></div>`)
			$('#info-container').append($sourceSelector)
			$('#source-selector').css({
				background: 'transparent',
				overflow: 'hidden',
				'border-radius': '5%',
				border: 'none',
				'font-size': '12px',
				height: '26px',
				padding: '5px',
				width: '175px',
				'background-color': '#2b303b',
				color: '#d68e13',
				'font-family': 'Inconsolata, Monaco, Consolas, "Courier New", Courier'
			})
		}	else {
			$sourceSelector = $(`<div>Source: <select id="source-selector"></select></div>`)
			$('#info-container').append($sourceSelector)
			$('#source-selector').css({
				background: 'transparent',
				overflow: 'hidden',
				'border-radius': '5%',
				border: 'none',
				'font-size': '12px',
				height: '26px',
				padding: '5px',
				width: '175px',
				'background-color': '#2b303b',
				color: 'white',
				'font-family': 'Arial'
			})
		}
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
		if (extensionTheme === 'code') {
			$('#info-container').append('<div><br><span class="function-call">crackin</span>(<span class="parameter">searchTerm</span>)<br>> Array</div>')
		} else {
			$('#info-container').append('<br>')
		}
	}

	//infobox
	if (!document.getElementById('info-box')) {
		let $infoBox = ''
		if (extensionTheme === 'code') {
			$infoBox = $('<div id="info-box"></div>')
			$infoBox.css({
				margin: 'auto',
				'background-color': '#2b303b',
				width: '385px',
				height: '200px',
				'z-index': '500',
				'word-wrap': 'break-word',
				overflow: 'auto'
			})
		} else {
			$infoBox = $('<div id="info-box"></div>')
			$infoBox.css({
				margin: 'auto',
				'background-color': '#2b303b',
				width: '385px',
				height: '250px',
				'z-index': '500',
				'word-wrap': 'break-word',
				overflow: 'auto'
			})
		}
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
	if (extensionTheme === 'code') {
		$('.let-dec').css({
			color: '#1453ba'
		})
		$('.var-dec').css({
			color: '#77d8ff'
		})
		$('.string-var').css({
			color: '#d68e13',
			'padding': '0px 20px'
		})
		$('.function-call').css({
			color: '#f8f99d'
		})
		$('.parameter').css({
			color: '#77d8ff'
		})
		$('.ext-colon').css({
			color: 'white'
		})
	} else {
		$('.extension-title').css({
			color: '#d68e13'
		})
		$('.extension-indent').css({
			'padding': '0px 15px'
		})
	}
}

const shapeDataForDisplay = (data) => {
	console.log('in shape data')
	let resultElements = []
	if (extensionTheme === 'code') {
		switch (apiSource) {
			case 'MDN':
				data.documents.forEach((dataPoint, ind) => {
					let tags = dataPoint.slug.split('/').join(', ')
					if (ind === 0) {
						resultElements.push($(`<div>[{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>tags<span class="ext-colon">:</span> ${tags}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.url}" target="_blank">${dataPoint.url}</a></div>},</div>`))
					} else if (ind === data.documents.length - 1) {
						resultElements.push($(`<div>{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>tags<span class="ext-colon">:</span> ${tags}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></div>}]</div>`))
					} else {
						resultElements.push($(`<div>{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>tags<span class="ext-colon">:</span> ${tags}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></div>},</div>`))
					}
				})
				break
			case 'Stack Overflow':
				data.items.forEach((dataPoint, ind) => {
					let tags = dataPoint.tags.join(', ')
					if (ind === 0) {
						resultElements.push($(`<div>[{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>tags<span class="ext-colon">:</span> ${tags}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.link}" target="_blank">${dataPoint.link}</a></div>}</div>`))
					} else if (ind === data.items.length - 1) {
						resultElements.push($(`<div>{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>tags<span class="ext-colon">:</span> ${tags}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.link}" target="_blank">${dataPoint.link}</a></div>}]</div>`))
					} else {
						resultElements.push($(`<div>{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>tags<span class="ext-colon">:</span> ${tags}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.link}" target="_blank">${dataPoint.link}}</a></div>}</div>`))
					}
				})
				break
			case 'Hacker News':
				data.hits.forEach((dataPoint, ind) => {
					if (ind === 0) {
						resultElements.push($(`<div>[{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.url}" target="_blank">${dataPoint.url}</a><div>},</div>`))
					} else if (ind === data.hits.length - 1) {
						resultElements.push($(`<div>{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></div>}]</div>`))
					} else {
						resultElements.push($(`<div>{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint.title}<br>url<span class="ext-colon">:</span> <a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></div>},</div>`))
					}
				})
				break
			case 'Wikipedia':
				data[1].forEach((dataPoint, ind) => {
					if (ind === 0) {
						resultElements.push($(`<div>[{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint}<br>description<span class="ext-colon">:</span> ${data[2][ind]}<br>url<span class="ext-colon">:</span> <a href="${data[3][ind]}" target="_blank">${data[3][ind]}</a><div>},</div>`))
					} else if (ind === data[1].length - 1) {
						resultElements.push($(`<div>{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint}<br>description<span class="ext-colon">:</span> ${data[2][ind]}<br>url<span class="ext-colon">:</span> <a href="${data[3][ind]}" target="_blank">${data[3][ind]}}</a></div>}]</div>`))
					} else {
						resultElements.push($(`<div>{<div class="string-var">title<span class="ext-colon">:</span> ${dataPoint}<br>description<span class="ext-colon">:</span> ${data[2][ind]}<br>url<span class="ext-colon">:</span> <a href="${data[3][ind]}" target="_blank">${data[3][ind]}}</a></div>},</div>`))
					}
				})
				break
			default:
				break
		}
	} else {
		switch (apiSource) {
			case 'MDN':
				data.documents.forEach((dataPoint, ind) => {
					let tags = dataPoint.slug.split('/').join(', ')
					resultElements.push($(`<div><span class="extension-title">>>> ${dataPoint.title}</span><div class="extension-indent">Tags: ${tags}<br>URL: <a href="${dataPoint.url}" target="_blank">${dataPoint.url}</a></div><br></div>`))
				})
				break
			case 'Stack Overflow':
				data.items.forEach((dataPoint, ind) => {
					let tags = dataPoint.tags.join(', ')
					resultElements.push($(`<div><span class="extension-title">>>> ${dataPoint.title}</span><div class="extension-indent">Tags: ${tags}<br>URL: <a href="${dataPoint.link}" target="_blank">${dataPoint.link}</a></div><br></div>`))
				})
				break
			case 'Hacker News':
				data.hits.forEach((dataPoint, ind) => {
					resultElements.push($(`<div><span class="extension-title">>>> ${dataPoint.title}</span><div class="extension-indent">URL: <a href="${dataPoint.url}" target="_blank">${dataPoint.url}</a></div><br></div>`))
				})
				break
			case 'Wikipedia':
				data[1].forEach((dataPoint, ind) => {
					resultElements.push($(`<div><span class="extension-title">>>> ${dataPoint}</span><div class="extension-indent">Description: ${data[2][ind]}<br>URL: <a href="${data[3][ind]}" target="_blank">${data[3][ind]}</a></div><br></div>`))
				})
				break
			default:
				break
		}
	}
	return resultElements
}

const runApp = () => {
	if (selectedText !== window.getSelection().toString()) {
		selectedText = window.getSelection().toString()
	}
	let txt = selectedText.split(' ').join('%20')
	let url = getApiUrl(txt)
	$.ajax({
		url,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		success: (data) => {
			console.log('in run app')
			console.log(data)
			let newData = shapeDataForDisplay(data)
			displayInfo(newData)
		}
	})
	.done(() => {
		console.log('Request for information successful')
	})
	.fail(() => {
		console.log('Request for infomation failed.')
	})
}

port.onMessage.addListener((msg) => {
	if (msg.type === 'displayInfo') runApp()
	$('body').click((evt) => {
		if ($('#info-container').length && !$.contains(document.getElementById('info-container'), evt.target) && window.getSelection().toString() === '') {
			selectedText = ''
			$('#info-container').remove()
			$('#exit-btn').remove()
			$('#hide-btn').remove()
		}
	})
})

