const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' }, // 输出到控制台
    file: { type: 'file', filename: '/log/log4js.log' }, // 输出到文件
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'info' }, // 设置默认的日志级别和输出目标
  },
});

module.exports = log4js.getLogger(); // 获取Logger实例
