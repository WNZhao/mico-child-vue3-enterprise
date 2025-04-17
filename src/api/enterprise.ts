import { get, post, put, del } from '@/utils/request'

// 企业列表接口参数
export interface EnterpriseListParams {
  page: number
  pageSize: number
  keyword?: string
  status?: number
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

// 获取企业列表
export function getEnterpriseList(params: EnterpriseListParams) {
  return get<EnterpriseListResponse>('/enterprise/list', params)
}

// 获取企业详情
export function getEnterpriseDetail(id: string) {
  return get<EnterpriseInfo>(`/enterprise/${id}`)
}

// 创建企业
export function createEnterprise(data: Omit<EnterpriseInfo, 'id' | 'createTime' | 'updateTime'>) {
  return post<EnterpriseInfo>('/enterprise', data)
}

// 更新企业
export function updateEnterprise(id: string, data: Partial<EnterpriseInfo>) {
  return put<EnterpriseInfo>(`/enterprise/${id}`, data)
}

// 删除企业
export function deleteEnterprise(id: string) {
  return del<void>(`/enterprise/${id}`)
}
