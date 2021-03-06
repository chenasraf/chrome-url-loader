const path = require('path')
const webpack = require('webpack')
const memoryfs = require('memory-fs')

module.exports = (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [{
        test: /\.svg$/,
        use: {
          loader: path.resolve(__dirname, '../index.js'),
          options: {
            publicDir: 'build/static/svg'
          }
        }
      }]
    },
  })

  compiler.outputFileSystem = new memoryfs()

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)

      resolve(stats)
    })
  })
}
