/* global extensionTheme apiSource */

const getApiUrl = (txt) => {
	const apiURL = {
		'MDN': `https://developer.mozilla.org/en-US/search.json?locale=en-US&q=${txt}`,
		'Stack Overflow': `https://api.stackexchange.com/2.2/search/advanced?pagesize=10&order=desc&sort=relevance&q=${txt}&site=stackoverflow`,
		'Hacker News': `https://hn.algolia.com/api/v1/search?tags=story&query=${txt}`,
		'Wikipedia': `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${txt}`
	}
	return apiURL[apiSource];
}

const shapeDataForDisplay = (data) => {
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

const makeButton = (type, HTMLtext, bottomPosition, clickHandler) => {
  let $button = $(`<button class="extension-btn" id="extension-${type}-btn">${HTMLtext}</button>`)
  $button.click(clickHandler)
  return $button
}
