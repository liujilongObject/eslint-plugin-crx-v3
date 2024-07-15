const pkg = require('../../package.json')

function preprocess(text) {
  const menifest = JSON.parse(text)
  if (menifest.manifest_version === 2) {
    throw new Error('the key "manifest_version" must be 3 with in manifest.json')
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
