# eslint-plugin-crx-v3

Detect the v3 version of Chrome Extension

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-crx-v3`:

```sh
npm install eslint-plugin-crx-v3 --save-dev
```

## Usage

### Configuration (eslint.config.js)

> Use eslint.config.js file to configure rules. This is the default in `ESLint v9`, but can be used starting from ESLint v8.57.0. See also: https://eslint.org/docs/latest/use/configure/configuration-files-new

Example `eslint.config.js`

```js

import eslintPluginCrxV3 from 'eslint-plugin-crx-v3'

export default [
  ...eslintPluginCrxV3.configs['flat/recommended'],
  {
    rules: {
        // override/add rules settings here, such as:
        // 'crx-v3/api-calls': 'warn'
    }
  }
]

```

### Configuration (.eslintrc)

> Use .eslintrc.* file to configure rules in `ESLint < v9`. See also: https://eslint.org/docs/latest/use/configure/.

Example `.eslintrc.js`:

```js
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:crx-v3/recommended'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'crx-v3/api-calls': 'warn'
  }
}
```

### tips
> **You need to explicitly include the JSON file when use Eslint to lint your project**

Example `package.json`

```json
"scripts": {
    "lint": "eslint . --ext .js,.json"
  },
```


## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                           | Description                                    | 💼 | 🔧 |
| :--------------------------------------------- | :--------------------------------------------- | :- | :- |
| [api-calls](docs/rules/api-calls.md)           | Check if API calls comply with v3 requirements | ✅  |    |
| [check-manifest](docs/rules/check-manifest.md) | check crx menifest.json for v3                 | ✅  | 🔧 |

<!-- end auto-generated rules list -->


