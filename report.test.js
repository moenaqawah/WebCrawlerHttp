const {sortPages} = require('./report.js')
const {test, expect} = require('@jest/globals')

test('sortPages', () => {
    const input = {
        "https:wagslane.dev": 3,
        "https:wagslane.dev/paths": 1
    }

    const actual = sortPages(input)
    const expected = [
        ["https:wagslane.dev", 3],
        ["https:wagslane.dev/paths", 1]
    ]
    expect(actual).toEqual(expected)
})