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

function mkDirP(dir) {
  this.addDependency(dir)
  const baseDir = "/"
  dir.split(path.sep).reduce((parent, child) => {
    const full = path.resolve(baseDir, parent, child)
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full)
    }
    return full
  })
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
  const outputPath = path.join(options.baseDir, options.publicDir, fileName)
  const outputDir = path.dirname(outputPath)

  mkDirP.call(this, outputDir)

  this.addDependency(outputDir)
  this.addDependency(outputPath)

  fs.writeFile(outputPath, contents, (err) => {
    if (err) {
      return callback(err)
    }
    callback(null, `module.exports = chrome.extension.getURL('${relativeDir}/${fileName}')`)
  })
}
