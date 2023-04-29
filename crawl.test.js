const {normalizeURL, getURLsFromHTML} = require('./crawl.js')
const {test, expect} = require('@jest/globals')

test('normalizeURL strip protocol', () => {
    const input = "https://blog.boot.dev/path"
    const actual = normalizeURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test('normalizeURL trim trailing slash', () => {
    const input = "https://blog.boot.dev/path/"
    const actual = normalizeURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test('normalizeURL captials', () => {
    const input = "https://BLOG.boot.dev/path/"
    const actual = normalizeURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
    const input = "http://blog.boot.dev/path/"
    const actual = normalizeURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute URLs ', () => {
    const htmlInput = `
    <html>
        <body>
            <a href="https://blog.boot.dev/">
                blog.boot.dev
            </a>
        </body>
    </html>            
    `
    const baseURLInput = "https://blog.boot.dev"

    const actual = getURLsFromHTML(htmlInput, baseURLInput)
    const expected = ["https://blog.boot.dev/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative URLs ', () => {
    const htmlInput = `
    <html>
        <body>
            <a href="/path/">
                blog.boot.dev
            </a>
        </body>
    </html>            
    `
    const baseURLInput = "https://blog.boot.dev"

    const actual = getURLsFromHTML(htmlInput, baseURLInput)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML both URLs ', () => {
    const htmlInput = `
    <html>
        <body>
            <a href="/path/">
                blog.boot.dev
            </a>
            <a href="https://blog.boot.dev/">
                blog.boot.dev
            </a>
        </body>
    </html>            
    `
    const baseURLInput = "https://blog.boot.dev"

    const actual = getURLsFromHTML(htmlInput, baseURLInput)
    const expected = ["https://blog.boot.dev/path/","https://blog.boot.dev/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML bad URL ', () => {
    const htmlInput = `
    <html>
        <body>
            <a href="invalid">
                invalid url
            </a>
        </body>
    </html>            
    `
    const baseURLInput = "https://blog.boot.dev"

    const actual = getURLsFromHTML(htmlInput, baseURLInput)
    const expected = []
    expect(actual).toEqual(expected)
})