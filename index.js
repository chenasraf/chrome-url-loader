"use strict"

const { validate } = require("schema-utils")
const fs = require("fs")
const path = require("path")

const schema = {
  type: "object",
  properties: {
    publicDir: {
      type: "string",
    },
    baseDir: {
      type: "string",
    },
  },
}

module.exports = function chromeUrlLoader(contents) {
  const options = this.getOptions() || {}
  const callback = this.async()
  validate(schema, options, {
    name: "Chrome URL Loader",
    baseDataPath: "options",
  })

  options.baseDir = options.baseDir || process.cwd()
  options.baseDir = options.baseDir.endsWith("/") ? options.baseDir.slice(0, -1) : options.baseDir
  options.publicDir = options.publicDir || ""
  options.publicDir = options.publicDir.endsWith("/")
    ? options.publicDir.slice(0, -1)
    : options.publicDir

  const relativeFilePath = this.resourcePath.replace(options.baseDir + "/", "")
  if (relativeFilePath === this.resourcePath) {
    callback(null, `module.exports = '${this.resourcePath}'`)
    return
  }

  const fileName = path.basename(relativeFilePath)
  const relativeDir = options.publicDir.split(path.sep).slice(1).join(path.sep)
  const outputPath = path.join(options.publicDir, fileName)
  const outputDir = path.dirname(outputPath)

  this.emitFile(outputPath, contents, null)
  callback(null, `module.exports = chrome.runtime.getURL('${relativeDir}/${fileName}')`)
}

module.exports.raw = true;