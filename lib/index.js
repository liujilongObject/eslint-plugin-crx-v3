/**
 * @fileoverview Detect the v3 version of CRX
 * @author       liujilong
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
const rules = requireIndex(__dirname + "/rules")

const { version, name } = require('../package.json')

const plugin = {
  meta: {
    name,
    version
  },
  rules,
  configs: {
    recommended: {
      overrides: [
        {
          files: [
            "*.json",
            "**/*.json"
          ],
          parser: require.resolve("jsonc-eslint-parser"),
          rules: {
            // ESLint core rules known to cause problems with JSON.
            strict: "off",
            "no-unused-expressions": "off",
            "no-unused-vars": "off",
          }
        }
      ],
      plugins: ['crx-v3'],
      rules: {
        'crx-v3/check-manifest': 'error',
        'crx-v3/api-calls': 'error'
      }
    },
  },
  
}

plugin.configs['flat/recommended'] = [
  {
    files: [
      "*.json",
      "**/*.json"
    ],
    languageOptions: {
      parser: require("jsonc-eslint-parser"),
    },
    rules: {
      // ESLint core rules known to cause problems with JSON.
      strict: "off",
      "no-unused-expressions": "off",
      "no-unused-vars": "off",
    },
  },
  {
    ignores: ["**/package*.json", "eslint.config.js"]
  },
  {
      plugins: {
        'crx-v3': plugin
      },
      rules: {
        'crx-v3/check-manifest': 'error',
        'crx-v3/api-calls': 'error'
      }
  }
]

module.exports = plugin
