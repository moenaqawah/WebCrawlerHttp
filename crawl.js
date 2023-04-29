const {JSDOM} = require('jsdom')

async function crawlPage(currentURL) {
    console.log(`activily crawling: ${currentURL}`)

    try {
    const response = await fetch(currentURL)
    const contentType = response.headers.get("content-type")

    if(!contentType.includes("text/html")) {
        console.log(`error in fetch: reason wrong content type ${contentType} on page ${currentURL}`)
        return
    }

    if(response.status > 399) {
        console.log(`error in fetch with status code ${response.status} on page ${currentURL}`)
        return
    }

    console.log(await response.text())
    } catch (error) {
        console.log(`error in fetch: ${error.message} on page ${currentURL}`)
    }
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