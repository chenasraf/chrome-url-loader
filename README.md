# chrome-url-loader
Chrome Extension URL loader for webpack.

This loader links to the file appropriately, using `chrome.extension.getURL` and also creates
the file for you in the specified output dir.

### Usage

Use the loader as you would any other one, specify the test files and options:

```javascript
{
  loader: require.resolve('chrome-url-loader'),
  test: /\.(png|svg|jpe?g|bmp|gif)/i,
  options: {
    publicDir: 'build/static/images',
    baseDir: paths.appSrc
  }
}
```

### Options
- baseDir - Your absolute source root directory (e.g. `/path/to/src`)
- publicDir - The output dir to save the file to (e.g. `build/static/media`)

