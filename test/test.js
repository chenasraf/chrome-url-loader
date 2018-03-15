const compiler = require('./compiler.js')

test('Inserts file path to output properly', (done) => {
  compiler('test.svg').then((stats) => {
    const output = stats.toJson().modules[0].source
    expect(output).toBe(`module.exports = chrome.extension.getURL('static/svg/test.svg')`)
    done()
  })
})
