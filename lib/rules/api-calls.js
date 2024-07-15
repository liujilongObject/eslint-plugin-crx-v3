/**
 * @fileoverview Check if API calls comply with v3 requirements
 * @author liujilong
 */
"use strict";

const { reportRuleError } = require('../utils')
const { bgRed, bgGreen } = require('chalk')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Check if API calls comply with v3 requirements",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {}, // Add messageId and message
  },

  create(context) {

    const getParentNode = node => node?.parent || {}
    const getAncestorNode = node => getParentNode(node)?.parent || {}
    
    /**
     * api检测配置项
     * [prop]: {
     *    needReplace: 需要替换的api列表，如果是'all'则表示所有api都需要替换
     * }
     */
    const API_MAP = {
      tabs: {
        needReplace: ['getAllInWindow', 'getSelected', 'onActiveChanged', 'onHighlightChanged', 'onSelectionChanged', 'executeScript', 'insertCSS', 'removeCSS', 'sendRequest'],
      },
      action: {
        needReplace: 'all'
      },
      extension: {
        needReplace: ['connect', 'connectNative', 'getExtensionTabs', 'getURL', 'lastError', 'onConnect', 'onConnectExternal', 'onMessage', 'onRequest', 'onRequestExternal', 'sendMessage', 'sendNativeMessage', 'sendRequest']
      },
      runtime: {
        needReplace: ['onSuspend']
      }
    }
    const getNeedReplaceApi = prop => API_MAP?.[prop]?.needReplace

    const API_USAGE_DOC = 'https://developer.chrome.com/docs/extensions/develop/migrate/api-calls?hl=zh-cn#replace-unsupported-apis'

    // v3 api 更新 https://developer.chrome.com/docs/extensions/develop/migrate/api-calls?hl=zh-cn#replace-executescript

    return {
      'MemberExpression > Identifier'(node) {
        // api分类属性名，e.g. chrome.[prop]
        let chromePropName = ''
        // 具体调用的api名称，e.g. chrome.[prop].[api]()
        let calledApiName = ''
        // 匹配 chrome.xx
        if (node.name === 'chrome') {
          chromePropName = getParentNode(node).property.name
          calledApiName = getAncestorNode(node).property.name

          // 匹配 window.chrome.xx 调用
          if (getParentNode(node).object.name === 'window') {
            chromePropName = getAncestorNode(node).property.name
            calledApiName = getAncestorNode(getParentNode(node)).property.name
          }
        }

        const onHitTabs = (propName, apiName) => {
          if (getNeedReplaceApi('tabs').includes(apiName)) {
            reportRuleError(context, {
              node,
              message: `The ${bgRed(`${propName}.${apiName}`)} API has been removed, You need to use a new API`,
            })
          }
        }

        const onHitAction = (propName, apiName) => {
          if (getNeedReplaceApi('action') === 'all') {
            reportRuleError(context, {
              node,
              message: `The ${bgRed(`${propName}.${apiName}`)} API has been removed, You need to use ${bgGreen(`action.${apiName}`)}`,
            })
          }
        }

        const onHitExtension = (propName, apiName) => {
          if (getNeedReplaceApi('extension').includes(apiName)) {
            reportRuleError(context, {
              node,
              message: `The ${bgRed(`${propName}.${apiName}`)} API has been removed, You need to use a new API`,
            })
          }
        }

        const onHitRuntime = (propName, apiName) => {
          if (getNeedReplaceApi('runtime').includes(apiName)) {
            reportRuleError(context, {
              node,
              message: `The ${bgRed(`${propName}.${apiName}`)} API has been removed, You need to use a new API`,
            })
          }
        }

        // 匹配需要检测的 chrome 的属性名，e.g. chrome.[prop]
        const chromePropEventMap = {
          tabs: onHitTabs,
          browserAction: onHitAction,
          pageAction: onHitAction,
          extension: onHitExtension,
          runtime: onHitRuntime
        }
        chromePropEventMap[chromePropName]?.(chromePropName, calledApiName)
      }
    }
  }
}
