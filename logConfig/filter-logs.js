const fs = require('fs')

// 读取日志文件内容
fs.readFile('log.log', 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件时发生错误：', err)
    return
  }
  // 移除特殊字符
  const cleanedData = data.replace(/\x00/g, '').replace(/\u001b\[[0-9;]*[A-GK-Ra-z]/g, '').replace(/��/g, '');

  // 将文件内容按行拆分
  const lines = cleanedData.split('\n')

  // 使用正则过滤特定的行
  const patterns = [
    /onPlugin/,
    /\[\d+%] /,
    /Build finished at \d{2}:\d{2}:\d{2} by \d+\.\d+s/,
  ]
  // 过滤不需要的信息 
  const filteredLines = lines.filter((line) => {
    for (const pattern of patterns) {
      if (line.match(pattern)) {
        return false // 如果任何一个模式匹配，排除该行
      }
    }
    return true // 如果没有模式匹配，保留该行
  })

  // 将过滤后的日志保存到新文件
  const filteredLog = filteredLines.join('\n')
  // console.log(filteredLog);
  fs.writeFile('logfile.log', filteredLog, 'utf8', (err) => {
    if (err) {
      console.error('写入文件时发生错误：', err)
    } else {
      console.log('已成功保存过滤后的日志文件。')
    }
  })
})
