const {JSDOM} = require('jsdom')

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
    getURLsFromHTML
}