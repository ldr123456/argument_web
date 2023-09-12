import log from 'loglevel';
import filePlugin from 'loglevel-plugin-file';

// 设置日志级别
log.setLevel('info');

// 启用文件插件
filePlugin(log);

// 配置文件插件，将日志写入指定文件
log.file.setLevel('info'); // 设置文件日志级别
log.file.setFileName('logs/loglevelLog.log'); // 设置日志文件名

export default log;
