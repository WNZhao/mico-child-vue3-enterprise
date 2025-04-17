import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { config, CancelToken } from './config'
import { setupRequestInterceptors, setupResponseInterceptors } from './interceptors'

// 创建axios实例
const instance = axios.create(config)

// 设置拦截器
setupRequestInterceptors(instance)
setupResponseInterceptors(instance)

// 请求方法
export async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  try {
    return await instance.request(config)
  } catch (error) {
    throw error
  }
}

// GET请求
export function get<T = any>(
  url: string,
  params?: any,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return request({
    method: 'get',
    url,
    params,
    ...config,
  })
}

// POST请求
export function post<T = any>(
  url: string,
  data?: any,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return request({
    method: 'post',
    url,
    data,
    ...config,
  })
}

// PUT请求
export function put<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
  return request({
    method: 'put',
    url,
    data,
    ...config,
  })
}

// DELETE请求
export function del<T = any>(
  url: string,
  params?: any,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return request({
    method: 'delete',
    url,
    params,
    ...config,
  })
}

// 导出实例和取消token
export { instance, CancelToken }
