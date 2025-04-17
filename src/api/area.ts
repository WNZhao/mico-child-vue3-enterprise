import { get } from '@/utils/request'

/**
 * 地区数据项接口
 */
export interface AreaItem {
  label: string // 地区名称
  value: string // 地区编码
  isLeaf: boolean // 是否是叶子节点
  children?: AreaItem[] // 子地区列表
}

/**
 * 地区API响应数据接口
 */
export interface AreaResponse {
  code: number // 响应状态码
  msg: string // 响应消息
  data: AreaItem[] // 地区数据列表
}

/**
 * 获取地区树数据
 * @param parentId - 上级区域ID（为空表示请求省级）
 * @returns Promise<AreaResponse> 返回地区数据
 */
export function getAreaTree(parentId?: string) {
  return get<AreaResponse>('/api/code/common/areaTree.json', {
    params: { parentId },
  }).then((response) => response as unknown as AreaResponse)
}

/**
 * 地区选择结果接口
 */
export interface AreaSelectResult {
  provinceCode: string // 省份编码
  provinceName: string // 省份名称
  cityCode: string // 城市编码
  cityName: string // 城市名称
}

/**
 * 地区数据缓存接口
 */
export interface AreaCache {
  timestamp: number // 缓存时间戳
  data: AreaItem[] // 缓存的地区数据
}

/**
 * 缓存有效期（24小时）
 */
export const CACHE_DURATION = 24 * 60 * 60 * 1000

/**
 * 缓存key
 */
export const CACHE_KEYS = {
  PROVINCES: 'area_provinces',
  CITIES_PREFIX: 'area_cities_',
}

/**
 * 从缓存中获取地区数据
 * @param key - 缓存key
 * @returns AreaItem[] | null
 */
export function getAreaCache(key: string): AreaItem[] | null {
  try {
    const cache = localStorage.getItem(key)
    if (!cache) return null

    const { timestamp, data } = JSON.parse(cache) as AreaCache
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return data
  } catch {
    return null
  }
}

/**
 * 设置地区数据缓存
 * @param key - 缓存key
 * @param data - 地区数据
 */
export function setAreaCache(key: string, data: AreaItem[]) {
  try {
    const cache: AreaCache = {
      timestamp: Date.now(),
      data,
    }
    localStorage.setItem(key, JSON.stringify(cache))
  } catch (error) {
    console.error('缓存地区数据失败:', error)
  }
}

/**
 * 获取省份数据（优先从缓存获取）
 * @returns Promise<AreaItem[]>
 */
export async function getProvinces(): Promise<AreaItem[]> {
  // 尝试从缓存获取
  const cached = getAreaCache(CACHE_KEYS.PROVINCES)
  if (cached) {
    return cached
  }

  // 从接口获取
  const res = await getAreaTree()
  if (res.code === 0 && res.data) {
    // 设置缓存
    setAreaCache(CACHE_KEYS.PROVINCES, res.data)
    return res.data
  }

  return []
}

/**
 * 获取城市数据（优先从缓存获取）
 * @param provinceCode - 省份编码
 * @returns Promise<AreaItem[]>
 */
export async function getCities(provinceCode: string): Promise<AreaItem[]> {
  // 尝试从缓存获取
  const cacheKey = CACHE_KEYS.CITIES_PREFIX + provinceCode
  const cached = getAreaCache(cacheKey)
  if (cached) {
    return cached
  }
  debugger
  // 从接口获取
  const res = await get<AreaResponse>('/api/code/common/areaTree.json', undefined, {
    params: {
      parentId: provinceCode,
    },
  })

  if (res.code === 0 && res.data) {
    // 设置缓存
    setAreaCache(cacheKey, res.data)
    return res.data
  }

  return []
}

/**
 * 清除地区数据缓存
 * @param provinceCode - 可选，省份编码。如果提供则只清除该省份的城市缓存
 */
export function clearAreaCache(provinceCode?: string) {
  if (provinceCode) {
    localStorage.removeItem(CACHE_KEYS.CITIES_PREFIX + provinceCode)
  } else {
    localStorage.removeItem(CACHE_KEYS.PROVINCES)
    // 清除所有城市缓存
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(CACHE_KEYS.CITIES_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }
}

/**
 * 格式化地区选择结果
 * @param province - 省份数据
 * @param city - 城市数据
 * @returns AreaSelectResult
 */
export function formatAreaResult(
  province: AreaItem | null,
  city: AreaItem | null,
): AreaSelectResult {
  return {
    provinceCode: province?.value || '',
    provinceName: province?.label || '',
    cityCode: city?.value || '',
    cityName: city?.label || '',
  }
}
