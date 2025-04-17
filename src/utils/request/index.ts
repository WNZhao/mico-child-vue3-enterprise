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
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await instance.request<T>(config)
    return response.data
  } catch (error) {
    throw error
  }
}

// GET请求
export function get<T>(
  url: string,
  params?: Record<string, unknown>,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return request<T>({
    method: 'get',
    url,
    params,
    ...config,
  })
}

// POST请求
export function post<T>(
  url: string,
  data?: Record<string, unknown>,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return request<T>({
    method: 'post',
    url,
    data,
    ...config,
  })
}

// PUT请求
export function put<T>(
  url: string,
  data?: Record<string, unknown>,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return request<T>({
    method: 'put',
    url,
    data,
    ...config,
  })
}

// DELETE请求
export function del<T>(
  url: string,
  params?: Record<string, unknown>,
  config: AxiosRequestConfig = {},
): Promise<T> {
  return request<T>({
    method: 'delete',
    url,
    params,
    ...config,
  })
}

// 导出实例和取消token
export { instance, CancelToken }
