'use strict'

const loaderUtils = require('loader-utils')
const validateOptions = require('schema-utils')
const fs = require('fs')
const path = require('path')

const schema = {
  type: 'object',
  properties: {
    publicDir: {
      type: 'string'
    },
    baseDir: {
      type: 'string'
    }
  }
}

function mkDirP(dir) {
  const baseDir = '/'
  dir.split(path.sep).reduce((parent, child) => {
    const full = path.resolve(baseDir, parent, child)
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full)
    }
    return full
  })
}

module.exports = function chromeUrlLoader(contents) {
  const options = loaderUtils.getOptions(this) || {}
  validateOptions(schema, options, 'Chrome URL Loader')

  options.baseDir = options.baseDir || ''
  options.baseDir = options.baseDir.endsWith('/') ? options.baseDir.slice(0, -1) : options.baseDir
  options.publicDir = options.publicDir || ''
  options.publicDir = options.publicDir.endsWith('/') ? options.publicDir.slice(0, -1) : options.publicDir

  const relativeFilePath = this.resourcePath.replace(options.baseDir + '/', '')

  if (relativeFilePath === this.resourcePath) {
    return `module.exports = '${relativeFilePath}'`
  }

  const fileName = path.basename(relativeFilePath)
  const outputDir = path.join(this.options.context, options.publicDir)
  const outputPath = path.join(outputDir, fileName)
  const relativeDir = options.publicDir.split(path.sep).slice(1).join(path.sep)

  mkDirP(outputDir)

  fs.writeFileSync(outputPath, contents)

  return `module.exports = chrome.extension.getURL('${relativeDir}/${fileName}')`
}
