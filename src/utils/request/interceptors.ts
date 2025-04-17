import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { RequestError, ResponseData } from './config'

// 请求拦截器
export function setupRequestInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => {
      // 在这里可以添加token等认证信息
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )
}

// 响应拦截器
export function setupResponseInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response: AxiosResponse<ResponseData>) => {
      const { data } = response

      // 根据后端约定的状态码判断请求是否成功
      if (data.code === 0) {
        return data.data
      }

      // 处理业务错误
      throw new RequestError(data.message, data.code, data.data)
    },
    (error) => {
      // 处理HTTP错误
      if (error.response) {
        const { status, data } = error.response
        switch (status) {
          case 401:
            // 未授权，清除token并跳转到登录页
            localStorage.removeItem('token')
            window.location.href = '/login'
            break
          case 403:
            // 权限不足
            throw new RequestError('权限不足', 403, null)
          case 404:
            // 资源不存在
            throw new RequestError('请求的资源不存在', 404, null)
          case 500:
            // 服务器错误
            throw new RequestError('服务器错误', 500, null)
          default:
            throw new RequestError(data.message || '请求失败', status, data)
        }
      }

      // 处理网络错误
      if (error.request) {
        throw new RequestError('网络错误，请检查网络连接', -1, null)
      }

      // 处理请求配置错误
      throw new RequestError('请求配置错误', -2, error.message)
    },
  )
}
