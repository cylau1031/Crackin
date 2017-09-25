/* global chrome */

const port = chrome.runtime.connect({name: 'APIreq'})
let apiSource = 'MDN'
let sources = ['MDN', 'Stack Overflow', 'Hacker News', 'Wikipedia']


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
	//info container
	if (!document.getElementById('info-container')) {
		let $container = $(`<div id="info-container"><div id="search-term"><span class='let-dec'>let</span> <span class="var-dec">searchTerm</span> = <span class="string-var">'${window.getSelection().toString()}'</span></div></div>`)
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
		$('body').append($container)
	} else {
		$('#search-term').html(`<div><span class='let-dec'>let</span> <span class="var-dec">searchTerm</span> = <span class="string-var">'${window.getSelection().toString()}'</span></div>`)
	}

	//source-selector
	if(!document.getElementById('source-selector')) {
		let $sourceSelector = $(`<div><span class='let-dec'>let</span> <span class="var-dec">source</span> = <select id="source-selector"><select><div>`)
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
	//		'line-height': '105%',
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
		$('#info-container').append('<div><br><span class="function-call">crackin</span>(<span class="parameter">searchTerm</span>)<br>> Array</div>')
		// $('#info-container').append('<br>')
	}

	//infobox
	if (!document.getElementById('info-box')) {
		let $infoBox = $('<div id="info-box"></div>')
		$infoBox.css({
			margin: 'auto',
			'background-color': '#2b303b',
			width: '385px',
			height: '200px',
			'z-index': '500',
			'word-wrap': 'break-word',
			'overflow': 'auto',
		})
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
}

const shapeDataForDisplay = (data) => {
	console.log('in shape data')
	let resultElements = []
	switch (apiSource) {
		case 'MDN':
			data.documents.forEach((dataPoint, ind) => {
				let tags = dataPoint.slug.split('/').join(', ')
				if (ind === 0) {
					resultElements.push($(`<div>[{<div class="string-var">title: ${dataPoint.title}<br>tags: ${tags}<br>url: <a href="${dataPoint.url}" target="_blank">${dataPoint.url}</a></div>},</div>`))
				} else if (ind === data.documents.length - 1) {
					resultElements.push($(`<div>{<div class="string-var">title: ${dataPoint.title}<br>tags: ${tags}<br>url: <a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></div>}]</div>`))
				} else {
					resultElements.push($(`<div>{<div class="string-var">title: ${dataPoint.title}<br>tags: ${tags}<br>url: <a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></div>},</div>`))
				}
			})
			break
		case 'Stack Overflow':
			data.items.forEach((dataPoint, ind) => {
				let tags = dataPoint.tags.join(', ')
				if (ind === 0) {
					resultElements.push($(`<div>[{<div><span class="string-var">title: ${dataPoint.title}<br>tags: ${tags}<br>url: </span><a href="${dataPoint.link}" target="_blank">${dataPoint.link}</a></div>}</div>`))
				} else if (ind === data.items.length - 1) {
					resultElements.push($(`<div>{<div><span class="string-var">title: ${dataPoint.title}<br>tags: ${tags}<br>url: </span><a href="${dataPoint.link}" target="_blank">${dataPoint.link}</a></div>}]</div>`))
				} else {
					resultElements.push($(`<div>{<div><span class="string-var">title: ${dataPoint.title}<br>tags: ${tags}<br>url: </span><a href="${dataPoint.link}" target="_blank">${dataPoint.link}}</a></div>}</div>`))
				}
			})
			break
		case 'Hacker News':
			data.hits.forEach((dataPoint, ind) => {
				if (ind === 0) {
					resultElements.push($(`<div>[{<div><span class="string-var">title: ${dataPoint.title}<br>url: </span><a href="${dataPoint.url}" target="_blank">${dataPoint.url}</a><div>},</div>`))
				} else if (ind === data.hits.length - 1) {
					resultElements.push($(`<div>{<div class="string-var">title: ${dataPoint.title}<br>url: <a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></div>}]</div>`))
				} else {
					resultElements.push($(`<div>{<div class="string-var">title: ${dataPoint.title}<br>url: <a href="${dataPoint.url}" target="_blank">${dataPoint.url}}</a></div>},</div>`))
				}
			})
			break
		case 'Wikipedia':
			data[1].forEach((dataPoint, ind) => {
				if (ind === 0) {
					resultElements.push($(`<div>[{<div><span class="string-var">title: ${dataPoint}<br>description: ${data[2][ind]}<br>url: </span><a href="${data[3][ind]}" target="_blank">${data[3][ind]}</a><div>},</div>`))
				} else if (ind === data[1].length - 1) {
					resultElements.push($(`<div>{<div class="string-var">title: ${dataPoint}<br>description: ${data[2][ind]}<br>url: <a href="${data[3][ind]}" target="_blank">${data[3][ind]}}</a></div>}]</div>`))
				} else {
					resultElements.push($(`<div>{<div class="string-var">title: ${dataPoint}<br>description: ${data[2][ind]}<br>url: <a href="${data[3][ind]}" target="_blank">${data[3][ind]}}</a></div>},</div>`))
				}
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
	if (msg.type === 'displayInfo' && window.getSelection().toString !== '') runApp()
	$('#info-container').click(function(e){
		console.log( 'clicked on div' );
		e.stopPropagation(); // Prevent bubbling
	});

	$('#exit-btn').click(function(e){
		console.log( 'clicked on div' );
		e.stopPropagation(); // Prevent bubbling
	});
	$('#hide-btn').click(function(e){
		console.log( 'clicked on div' );
		e.stopPropagation(); // Prevent bubbling
	});
	$('#nextPage-btn').click(function(e){
		console.log( 'clicked on div' );
		e.stopPropagation(); // Prevent bubbling
	});
	$('#prevPage-btn').click(function(e){
		console.log( 'clicked on div' );
		e.stopPropagation(); // Prevent bubbling
	});

	$('body').click((evt) => {
		if (!document.getElementById('#info-container').contains(evt.target) && window.getSelection().toString() === ''){
			console.log('click inside')
		} else {
			console.log('click outside')
		}
		// window.getSelection().toString() === '') {
		// 	$('#info-container').remove()
		// 	$('#exit-btn').remove()
		// 	$('#hide-btn').remove()
		// 	$('#nextPage-btn').remove()
		// 	$('#prevPage-btn').remove()
		// }
	})
})

