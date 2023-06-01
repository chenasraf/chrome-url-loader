import compiler from "./compiler.js"

test("Inserts file path to output properly", async () => {
  const stats = await compiler("test.svg")
  const output = stats.toJson({ source: true }).modules[0].source
  expect(output).toBe(`module.exports = chrome.runtime.getURL('static/svg/test.svg')`)
})
