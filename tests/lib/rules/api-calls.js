/**
 * @fileoverview Check if API calls comply with v3 requirements
 * @author liujilong
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/api-calls"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("api-call", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "chrome.tabs.executeScript()",
      errors: [{ messageId: "Fill me in.", type: "Me too" }],
    },
  ],
});
