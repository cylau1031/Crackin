/* global chrome */

const port = chrome.runtime.connect({name: 'APIreq'})
let apiSource = 'MDN'
let sources = ['MDN', 'Stack Overflow', 'Hacker News', 'Wikipedia']

const getApiUrl = (txt) => {
	console.log('in get url')
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
			z: '100',
			color: 'white'
		})
		$button.click(clickHandler)
		return $button
	}
	const $exitButton = makeButton('exit', 'X', '26', () => {
		$('#info-container').remove()
		$('#exit-btn').remove()
		$('#hide-btn').remove()
		$('#nextPage-btn').remove()
		$('#prevPage-btn').remove()
	})
	const $hideButton = makeButton('hide', '>>', '18', (evt) => {
		const btn = evt.target
		if (btn.textContent === '>>') {
			btn.innerHTML = '<<'
			$('#info-container').animate({right: '-50%'})
		} else {
			btn.innerHTML = '>>'
			$('#info-container').animate({right: '6%'})
		}
	})
	const $prevPageButton = makeButton('prevPage', '<', '10', () => {
		console.log('move to previous page')
	})
	const $nextPageButton = makeButton('nextPage', '>', '2', () => {
		console.log('move to next page')
	})
	$('body').append($exitButton)
	$('body').append($hideButton)
	$('body').append($prevPageButton)
	$('body').append($nextPageButton)
}

const fullSetup = () => {
	console.log('in setup')
	//info container
	if (!document.getElementById('info-container')) {
		let $container = $(`<div id="info-container"><p id="search-term"><span class='let-dec'>let</span> <span class="var-dec">searchTerm</span> = <span class="string-var">'${window.getSelection().toString()}'</span></p></div>`)
		$container.css({
			position: 'fixed',
			bottom: '2%',
			right: '-20%',
			width: '400px',
			height: '375px',
			opacity: '0.6',
			padding: '10px 17px',
			'background-color': '#2b303b',
			'word-wrap': 'break-word',
			z: '99',
			'line-height': '100%',
			overflow: 'hidden',
			'border-radius': '3%',
			'font-family': 'Inconsolata, Monaco, Consolas, "Courier New", Courier',
			color: 'white',
		})
		$('body').append($container)
	} else {
		//console.log('search term', $('#search-term').html)
		$('#search-term').html(`<span class='let-dec'>let</span> <span class="var-dec">searchTerm</span> = <span class="string-var">'${window.getSelection().toString()}'</span>`)
	}

	//source-selector
	if(!document.getElementById('source-selector')) {
		let $sourceSelector = $(`<p><span class='let-dec'>let</span> <span class="var-dec">source</span> = <select id="source-selector"><select></p>`)
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
			'line-height': '105%',
			'background-color': '#2b303b',
			color: '#d68e13',
			'font-family': 'Inconsolata, Monaco, Consolas, "Courier New", Courier'
		})
		sources.forEach(el => {
			let $source = $(`<option value="${el}">${el}</option>`)
			$('#source-selector').append($source)
		})
		$('#source-selector').change((evt) => {
			apiSource = evt.target.value
			runApp()
		})
		$('#info-container').append('<hr>')
		$('#info-container').append('<p><span class="function-call">crackin</span>(<span class="parameter">searchTerm</span>)</p><p class="result">> Array</p>')
	}

	//infobox
	if (!document.getElementById('info-box')) {
		let $infoBox = $('<div id="info-box"></div>')
		$infoBox.css({
			margin: 'auto',
			//padding: '5px',
			'background-color': '#2b303b',
			width: '385px',
			height: '210px',
			z: '100',
			'word-wrap': 'break-word',
			'overflow': 'auto'
		})
		$('#info-container').append($infoBox)
		if (!document.getElementById('exit-btn')) {
			setupButton()
		}
	} else {
		$('#info-box').empty()
	}

	$('.let-dec').css({
		color: '#1453ba'
	})
	$('.var-dec').css({
		color: '#77d8ff'
	})
	$('.string-var').css({
		color: '#d68e13'
	})
	$('.function-call').css({
		color: '#f8f99d'
	})
	$('.parameter').css({
		color: '#77d8ff'
	})
	$('ext-description').css({
		color: '#d68e13'
	})
}


const displayInfo = (info) => {
	console.log('in display message')
	//each line of info
	if(!document.getElementById('info-container')) {
		fullSetup()
		console.log('in display message new container')
		$('#info-box').append('<p>[</p>')
		info.forEach(el => $('#info-box').append(el))
		$('#info-container').animate({right: '6%', opacity: '1'})
		$('#info-box').append('<p>]</p>')
	} else {
		fullSetup()
		console.log('in display message old container')
		let $infoBox = $('#info-box')
		$('#info-box').append('<p>[</p>')
		info.forEach(el => $infoBox.append(el))
		$('#info-box').append('<p>]</p>')
	}
}

const shapeDataForDisplay = (data) => {
	console.log('in shape data')
	let resultElements = []
	switch (apiSource) {
		case 'MDN':
			data.documents.forEach(dataPoint => {
				let tags = dataPoint.slug.split('/').join(', ')
				resultElements.push($(`<div>{<p class="ext-description">${dataPoint.title}</p><p class="ext-decription">tags: ${tags}</p><a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></p>},</div>`))
			})
			break
		case 'Stack Overflow':
			data.items.forEach(dataPoint => {
				let tags = dataPoint.tags.join(', ')
				resultElements.push($(`<div><p class="ext-description">${dataPoint.title}</p><p class="ext-decription">tags: ${tags}</p><a href="${dataPoint.link}" target="_blank">${dataPoint.link}}</a></p></div>`))
			})
			break
		case 'Hacker News':
			data.hits.forEach(dataPoint => {
				resultElements.push($(`<div><p class="ext-description">${dataPoint.title}</p><a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></p></div>`))
			})
			break
		case 'Wikipedia':
			data[1].forEach((dataPoint, ind) => {
				resultElements.push($(`<div><p class="ext-description">${dataPoint}</p><p class="ext-decription">${data[2][ind]}</p><a href="${data[3][ind]}" target="_blank">${data[3][ind]}</a></p></div>`))
			})
			break
		default:
			break
	}
	return resultElements
}

const runApp = () => {
	let selectedText = window.getSelection().toString().split(' ').join('%20')
	let url = getApiUrl(selectedText)
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
	if (msg.type === 'displayInfo') {
		runApp()
	}
})




//Youtube - doesnt work
// port.onMessage.addListener(function(msg) {
// 	function start() {
// 		console.log('hello start')
// 		// 2. Initialize the JavaScript client library.
// 		window.gapi.client.init({
// 			'apiKey': 'AIzaSyCUq_crJCrzz0oytP6gatLOVTsC7iSoesM',
// 			// Your API key will be automatically added to the Discovery Document URLs.
// 			'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
// 			// clientId and scope are optional if auth is not required
// 		}).then(function() {
// 			console.log('I am in!')
// 			// 3. Initialize and make the API request.
// 			return gapi.client.youtube.search.list({
// 				q: 'React.js',
// 				type: '',
// 				part: 'snippet',
// 				maxResults: '10'
// 			});
// 		}).then(function(response) {
// 			console.log('YOUTUBE', response.result);
// 		}, function(reason) {
// 			console.log('Error: ' + reason.result.error.message);
// 		});
// 	}
// 	if (msg.type === 'getSelectedText'){
// 		let selectedText = window.getSelection().toString().split(' ').join('%20')
// 		// 1. Load the JavaScript client library.
// 		window.gapi.load('client', start);
// 	}
// });
