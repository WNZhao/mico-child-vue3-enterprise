import type { AxiosRequestConfig } from 'axios'

// 环境变量
const env = import.meta.env

// 请求配置
export const config: AxiosRequestConfig = {
  baseURL: env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// 响应数据结构
export interface ResponseData<T = any> {
  code: number
  data: T
  message: string
}

// 请求错误
export class RequestError extends Error {
  code: number
  data: any

  constructor(message: string, code: number, data: any) {
    super(message)
    this.code = code
    this.data = data
  }
}

// 取消请求的token
export const CancelToken = {
  source: () => {
    const controller = new AbortController()
    return {
      token: controller.signal,
      cancel: () => controller.abort(),
    }
  },
}
