function printReport(pages) {
     console.log(`============`)
     console.log(`Report`)
     console.log(`============`)
     const sortedPages = sortPages(pages)
     for(const sortedPage of sortedPages) {
        const url = sortedPage[0]
        const hits = sortedPage[1]
        console.log(`found ${hits} links to page ${url}`)
     }
     console.log(`============`)
     console.log(`End report`)
     console.log(`============`)
}

function sortPages(pages) {

    const pagesArr = Object.entries(pages)
    pagesArr.sort((a,b) => {
        const aHits = a[1]
        const bHits = b[1]
        return bHits - aHits
    })
    return pagesArr
}

module.exports = {
    sortPages,
    printReport
}