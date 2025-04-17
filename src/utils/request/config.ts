import type { AxiosRequestConfig } from 'axios'

// 请求配置
export const config: AxiosRequestConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// 响应数据结构
export interface ResponseData<T = unknown> {
  code: number
  data: T
  message: string
}

// 请求错误
export class RequestError extends Error {
  code: number
  data: unknown

  constructor(message: string, code: number, data: unknown) {
    super(message)
    this.name = 'RequestError'
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
