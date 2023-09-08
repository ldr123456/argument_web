import axios from 'axios' // 引入axios
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: "/api",
  timeout: 99999
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    }
    return config
  },
  error => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error'
    })
    return error
  }
)

// http response 拦截器
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return error
  }
)
export default service
