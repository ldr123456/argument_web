import service from "@/utils/request"

// @Summary 获取所有文件名称
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
export const listFiles = () => {
  return service({
    url: '/list_files',
    method: 'get'
  });
};

// @Summary 异步执行笔记本逻辑
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
export const executeNotebook = (data) => {
  return service({
    url: '/execute_notebook',
    method: 'post',
    data
  });
};

// @Summary 查询指定任务的状态
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
export const taskStatus = (params) => {
  return service({
    url: `/task_status/${params}`,
    method: 'get'
  });
};

// @Summary 下载文件
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
export const download = (params) => {
  return service({
    url: `/download`,
    method: 'get',
    responseType: 'blob',
    params
  });
};