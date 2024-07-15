/**
 * @fileoverview check crx menifest.json for v3
 * @author       liujilong
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
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "check crx menifest.json for v3",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [],
    messages: {
      manifestVersion: `The value of "${bgRed('manifest_version')}" must be 3.`,
      permissions: `The value of "${bgRed('{{key}}')}" contains invalid fields "{{name}}". {{extraDesc}}`,
      action: `Replace the "${bgRed('browser_action')}" and "${bgRed('page_action')}" fields with the "${bgGreen('action')}" field`,
      webAccessibleResources: `The value of "${bgRed('web_accessible_resources')}" must be an object array that conforms to a fixed pattern.`,
      background: `The value of "${bgRed('background')}" must be an object that contains fields "service_worker" with a string value`,
      contentSecurityPolicy: `The value of "${bgRed('content_security_policy')}" must be an object that conforms to a fixed pattern.`
    }, // Add messageId and message
  },

  create(context) {
    // 仅生效于 manifest.json
    // if (!context.filename.indexOf('manifest.json')) return {}

    const getJSONNodeKey = node => node?.key?.value || ''
    const getJSONNodeValue = node => node?.value?.value || ''
    const getJSONChildNode = node => (node?.value?.properties || node?.value?.elements) ?? []

    const isHttpProtocolReg = /^https?:/

    return {
      /* 访问 JSON AST , 解析 https://ota-meshi.github.io/jsonc-eslint-parser/ */
      JSONProperty(node) {
        /**
         * 检测 manifest.json 是否符合v3版本要求 
         * 更新list https://developer.chrome.com/docs/extensions/develop/migrate/manifest?hl=zh-cn#change-version
         */

        const onHitManifestVersion = node => {
          if (getJSONNodeValue(node) !== 3) {
            reportRuleError(context, {
              node,
              messageId: 'manifestVersion',
              // 自动修复错误
              fix(fixer) {
                return fixer.replaceText(node.value, 3)
              }
            })
          }
        }

        const onHitPermissions = node => {
          const permissionsElements = getJSONChildNode(node)
          let actualNode
          let extraDesc = ''
          // host
          const hasHostValue = permissionsElements.some(n => {
            if (isHttpProtocolReg.test(n.value)) {
              actualNode = n
              return true
            }
            return false
          })
          // webRequest
          const hasWebRequest = permissionsElements.some(n => {
            if (['webRequest', 'webRequestBlocking'].includes(n.value)) {
              actualNode = n
              extraDesc = `You should use the "${bgGreen('declarativeNetRequest')}" or "${bgGreen('declarativeNetRequestWithHostAccess')}" field`
              return true
            }
            return false
          })
          if (hasHostValue || hasWebRequest) {
            reportRuleError(context, {
              node: actualNode || node,
              messageId: 'permissions',
              data: {
                key: getJSONNodeKey(node),
                name: actualNode.value,
                extraDesc
              }
            })
          }
        }

        // https://developer.chrome.com/docs/extensions/develop/migrate/api-calls?hl=zh-cn#replace_browser_action_and_page_action_with_action
        const onHitAction = node => {
          reportRuleError(context, {
            node,
            messageId: 'action',
            fix(fixer) {
              return fixer.replaceText(node.key, 'action')
            }
          })
        }

        // https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources?hl=zh-cn
        const onHitWebAccessibleResources = node => {
          const webAccessibleResourcesValue = getJSONChildNode(node)
          const passed = webAccessibleResourcesValue.every(n => {
            try {
              const keys = n.properties.map(p => getJSONNodeKey(p))
              const hasValidProp = keys.includes('resources') && keys.some(k => ['matches', 'extension_ids'].includes(k))
              return hasValidProp
            } catch {
              return false
            }
          })
          if (!passed) {
            reportRuleError(context, {
              node: node,
              messageId: 'webAccessibleResources'
            })
          }
        }

        // 后台脚本迁移至Service Worker https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers?hl=zh-cn#differences-with-sws
        const onHitBackgroundScripts = node => {
          const bgNodes = getJSONChildNode(node)
          const passed = bgNodes.some(n => (getJSONNodeKey(n) === 'service_worker' && typeof getJSONNodeValue(n) === 'string'))
          if (!passed) {
            reportRuleError(context, {
              node,
              messageId: 'background'
            })
          }
        }

        // 更新内容安全政策 https://developer.chrome.com/docs/extensions/develop/migrate/improve-security?hl=zh-cn#update-csp
        const onHitContentSecurityPolicy = node => {
          if (!getJSONChildNode(node).some(n => getJSONNodeKey(n) === 'extension_pages')) {
            reportRuleError(context, {
              node,
              messageId: 'contentSecurityPolicy'
            })
          }
        }

        // 匹配 manifest.json 文件中需要校验的 key
        const JSONPropertyHandlerMap = {
          'manifest_version': onHitManifestVersion,
          'permissions': onHitPermissions,
          'optional_permissions': onHitPermissions,
          'browser_action': onHitAction,
          'page_action': onHitAction,
          'web_accessible_resources': onHitWebAccessibleResources,
          'background': onHitBackgroundScripts,
          'content_security_policy': onHitContentSecurityPolicy
        }
        JSONPropertyHandlerMap[getJSONNodeKey(node)]?.(node)
      }
    }
  },
}
