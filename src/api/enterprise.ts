/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-04-17 15:19:47
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-04-17 17:18:10
 * @FilePath: /micro-child-vue3-enterprise/src/api/enterprise.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post, put, del } from '@/utils/request'

// 企业列表接口参数
export interface EnterpriseListParams {
  page: number
  pageSize: number
  keyword?: string
  status?: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
  [key: string]: unknown
}

// 企业信息接口
export interface EnterpriseInfo {
  id: string
  name: string
  code: string
  address: string
  contact: string
  phone: string
  email: string
  status: number
  logo?: string
  description?: string
  industry?: string
  scale?: string
  website?: string
  createTime: string
  updateTime: string
}

// 企业列表响应
export interface EnterpriseListResponse {
  list: EnterpriseInfo[]
  total: number
  page: number
  pageSize: number
}

// 企业状态选项
export interface EnterpriseStatusOption {
  value: number
  label: string
}

// 企业状态列表
export const enterpriseStatusOptions: EnterpriseStatusOption[] = [
  { value: 0, label: '禁用' },
  { value: 1, label: '启用' },
]

// 获取企业列表
export function getEnterpriseList(params: EnterpriseListParams) {
  return get<EnterpriseListResponse>('/api/enterprise/list', params as Record<string, unknown>)
}

// 获取企业详情
export function getEnterpriseDetail(id: string) {
  return get<EnterpriseInfo>(`/api/enterprise/${id}`)
}

// 创建企业
export function createEnterprise(data: Omit<EnterpriseInfo, 'id' | 'createTime' | 'updateTime'>) {
  return post<EnterpriseInfo>('/api/enterprise', data as Record<string, unknown>)
}

// 更新企业
export function updateEnterprise(id: string, data: Partial<EnterpriseInfo>) {
  return put<EnterpriseInfo>(`/api/enterprise/${id}`, data as Record<string, unknown>)
}

// 删除企业
export function deleteEnterprise(id: string) {
  return del<void>(`/api/enterprise/${id}`)
}

// 批量删除企业
export function batchDeleteEnterprise(ids: string[]) {
  return post<void>('/api/enterprise/batch-delete', { ids } as Record<string, unknown>)
}

// 更新企业状态
export function updateEnterpriseStatus(id: string, status: number) {
  return put<void>(`/api/enterprise/${id}/status`, { status } as Record<string, unknown>)
}

// 导出企业数据
export function exportEnterpriseData(params: EnterpriseListParams) {
  return get<Blob>('/api/enterprise/export', params as Record<string, unknown>, {
    responseType: 'blob',
  })
}

// 导入企业数据
export function importEnterpriseData(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return post<void>('/api/enterprise/import', formData as unknown as Record<string, unknown>, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
