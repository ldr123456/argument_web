const { exec } = require('child_process');
const fs = require('fs');

const command = 'npm run serve';
const keyword = '关键字';
console.log('准备执行命令');
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行命令时出错：${error}`);
    return;
  }
  console.log('执行命令');
  
  // 过滤和编辑输出
  const filteredOutput = stdout.split('\n').filter(line => line.includes(keyword)).join('\n');
  console.log('完成过滤');
  
  // 保存到文件
  fs.writeFile('log.log', filteredOutput, err => {
    if (err) {
      console.error(`保存文件时出错：${err}`);
    } else {
      console.log('输出已保存到 log.log');
    }
  });
});
