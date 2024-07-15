const pkg = require('../../package.json')
const chalk = require('chalk')

function preprocess(text, filename) {
  const menifest = JSON.parse(text)
  if (menifest.manifest_version === 2) {
    console.log(chalk.red('the key "manifest_version" must be 3 with in manifest.json'), filename)
    process.exit(1)
  } else {
    return []
  }
}

module.exports = {
  meta: {
      name: pkg.name,
      version: pkg.version
  },
  preprocess
}
