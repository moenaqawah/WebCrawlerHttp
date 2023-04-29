const {JSDOM} = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizedURL = normalizeURL(currentURL)
    if(pages[normalizedURL] > 0) {
        pages[normalizedURL] = pages[normalizedURL] + 1
        return pages
    }

    pages[normalizedURL] = 1

    console.log(`activily crawling: ${currentURL}`)

    try {
    const response = await fetch(currentURL)
    const contentType = response.headers.get("content-type")

    if(!contentType.includes("text/html")) {
        console.log(`error in fetch: reason wrong content type ${contentType} on page ${currentURL}`)
        return pages
    }

    if(response.status > 399) {
        console.log(`error in fetch with status code ${response.status} on page ${currentURL}`)
        return pages
    }

    const htmlBody = await response.text()
    const urlsFromBody = getURLsFromHTML(htmlBody, baseURL)

    console.log(urlsFromBody.length)
    for (const url of urlsFromBody) {
        pages = await crawlPage(baseURL, url, pages)
    }
    } catch (error) {
        console.log(`error in fetch: ${error.message} on page ${currentURL}`)
    }

    return pages
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls= []
    const dom = new JSDOM(htmlBody)
    const linkedElements = dom.window.document.querySelectorAll("a")
    for (const linkedElement of linkedElements) {
        if (linkedElement.href.slice(0, 1) === '/') {
            //relative URL
            try {
            const urlObj = new URL(`${baseURL}${linkedElement.href}`)
            urls.push(urlObj.href)
            } catch(error) {
                console.log(`error with relative url: ${error.message}`)
            }
        } else{
            // absolute URL
            try {
                const urlObj = new URL(linkedElement.href)
                urls.push(urlObj.href)
                } catch(error) {
                    console.log(`error with absolute url: ${error.message}`)
                }
        }
    }
    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)

    const hostPath = urlObj.hostname + urlObj.pathname
    if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath.toLowerCase()
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}