/**
 * 报告规则校验问题
 * @param {object} ctx     create函数唯一参数，规则信息上下文对象 
 * @param {object} config 
 */
exports.reportRuleError = (ctx, config = {}) => {
  ctx.report(config)
}
