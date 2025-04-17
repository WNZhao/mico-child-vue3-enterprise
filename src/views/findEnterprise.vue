<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-04-17 14:57:45
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-04-17 21:08:51
 * @FilePath: /micro-child-vue3-enterprise/src/views/findEnterprise.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="find-enterprise">
    <!-- Banner区域 -->
    <div class="banner">
      <div class="search-box">
        <el-input
          v-model="searchParams.keyword"
          placeholder="请输入公司名称"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-wrapper">
        <!-- 地点筛选 -->
        <div class="filter-item" :class="{ 'expanded-locations': showAll }">
          <span class="label">地点：</span>
          <div class="options">
            <el-button
              type="primary"
              :class="{ active: !selectedProvince }"
              @click="handleProvinceClick(null)"
            >
              全部
            </el-button>
            <el-button
              v-for="area in displayedProvinces"
              :key="area.value"
              :type="selectedProvince === area.value ? 'primary' : 'default'"
              link
              @click="handleProvinceClick(area)"
            >
              {{ area.label }}
            </el-button>
            <el-button
              v-if="provinces.length > displayLimit"
              type="primary"
              link
              @click="showAll = !showAll"
            >
              {{ showAll ? '收起' : '更多' }}
            </el-button>
          </div>
        </div>

        <!-- 城市列表 -->
        <div class="filter-item" v-if="showCityList">
          <span class="label"></span>
          <div class="options">
            <el-button
              v-for="city in cities"
              :key="city.value"
              :type="selectedCity === city.value ? 'primary' : 'default'"
              link
              @click="handleCityClick(city)"
            >
              {{ city.label }}
            </el-button>
          </div>
        </div>

        <!-- 规模筛选 -->
        <div class="filter-item">
          <span class="label">规模：</span>
          <div class="options">
            <el-button
              v-for="scale in scales"
              :key="scale.value"
              :type="searchParams.scale === scale.value ? 'primary' : 'default'"
              :link="scale.value !== ''"
              @click="handleScaleClick(scale.value)"
            >
              {{ scale.label }}
            </el-button>
          </div>
        </div>

        <!-- 福利筛选 -->
        <div class="filter-item">
          <span class="label">福利：</span>
          <div class="options">
            <el-button
              v-for="welfare in welfares"
              :key="welfare"
              :type="
                searchParams.welfare === welfare || (welfare === '全部' && !searchParams.welfare)
                  ? 'primary'
                  : 'default'
              "
              :link="welfare !== '全部'"
              @click="handleWelfareClick(welfare)"
            >
              {{ welfare }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧企业列表 -->
      <div class="enterprise-list">
        <template v-if="!loading">
          <el-card class="enterprise-card" v-for="item in enterpriseList" :key="item.id">
            <div class="enterprise-content">
              <div class="enterprise-logo">
                <el-image
                  :src="item.logo"
                  fit="contain"
                  :error-src="'/src/assets/images/default_company.png'"
                />
              </div>
              <div class="enterprise-info">
                <h3 class="enterprise-name">{{ item.name }}</h3>
                <div class="enterprise-meta">
                  <span>{{ item.industry }}</span>
                  <span>{{ item.scale }}</span>
                  <span>{{ item.address }}</span>
                </div>
                <div class="enterprise-tags">
                  <el-tag
                    v-for="(tag, index) in item.welfare"
                    :key="index"
                    size="small"
                    class="welfare-tag"
                    type="info"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="enterprise-jobs" v-if="item.hotJob">
                <div class="hot-job">
                  <el-tag type="danger" size="small" effect="plain" class="hot-tag">
                    <el-icon><StarFilled /></el-icon>
                    热招
                  </el-tag>
                  <span class="job-name">{{ item.hotJob.title }}</span>
                  <span class="job-salary">{{ item.hotJob.salary }}</span>
                </div>
              </div>
            </div>
          </el-card>

          <el-empty v-if="enterpriseList.length === 0" description="暂无企业数据" />

          <!-- 分页 -->
          <div class="pagination" v-if="enterpriseList.length > 0">
            <el-pagination
              v-model:current-page="pagination.current"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </template>

        <div v-else class="loading-container">
          <el-skeleton :rows="3" animated />
          <el-skeleton :rows="3" animated />
          <el-skeleton :rows="3" animated />
        </div>
      </div>

      <!-- 右侧推荐企业 -->
      <div class="recommended-enterprises">
        <el-card class="recommend-card">
          <template #header>
            <div class="card-header">
              <span>推荐企业</span>
            </div>
          </template>
          <div class="recommend-list" v-loading="recommendLoading">
            <template v-if="!recommendLoading">
              <div v-for="item in recommendedList" :key="item.id" class="recommend-item">
                <el-image
                  :src="item.logo"
                  fit="contain"
                  :error-src="'/src/assets/images/default_company.png'"
                />
                <div class="recommend-info">
                  <span class="company-name">{{ item.name }}</span>
                  <div class="company-meta">
                    <span>{{ item.industry }}</span>
                    <span>{{ item.scale }}</span>
                  </div>
                  <div class="company-welfare">
                    <el-tag
                      v-for="(tag, index) in item.welfare"
                      :key="index"
                      size="small"
                      type="info"
                      effect="plain"
                    >
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
              <el-empty v-if="recommendedList.length === 0" description="暂无推荐企业" />
            </template>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { StarFilled } from '@element-plus/icons-vue'
import { getEnterpriseList, getRecommendEnterprises } from '@/api/enterprise'
import { getProvinces, getCities } from '@/api/area'

// 类型定义
interface Enterprise {
  id: string
  name: string
  logo?: string
  address: string
  industry: string
  scale: string
  welfare: string[]
  hotJob?: {
    title: string
    salary: string
  }
}

interface Area {
  value: string
  label: string
}

// 搜索参数
const searchParams = reactive({
  keyword: '',
  provinceCode: '',
  cityCode: '',
  scale: '',
  welfare: '',
  page: 1,
  pageSize: 10,
})

// 状态管理
const loading = ref(false)
const recommendLoading = ref(false)
const enterpriseList = ref<Enterprise[]>([])
const recommendedList = ref<Enterprise[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 省份和城市管理
const provinces = ref<Area[]>([])
const cities = ref<Area[]>([])
const selectedProvince = ref('')
const selectedCity = ref('')
const showAll = ref(false)
const displayLimit = 8

// 计算显示的省份列表
const displayedProvinces = computed(() => {
  return showAll.value ? provinces.value : provinces.value.slice(0, displayLimit)
})

// 计算是否显示城市列表
const showCityList = computed(() => {
  if (!selectedProvince.value) return false
  // 直辖市不显示城市列表
  if (
    ['110000', '120000', '310000', '500000', '810000', '820000', '710000'].includes(
      selectedProvince.value,
    )
  )
    return false
  // 有城市数据时才显示
  return cities.value.length > 0
})

// 筛选选项
const scales = [
  { label: '全部', value: '' },
  { label: '50人以下', value: '50-' },
  { label: '51-100人', value: '51-100' },
  { label: '101-200人', value: '101-200' },
  { label: '201-500人', value: '201-500' },
  { label: '501-1000人', value: '501-1000' },
  { label: '1000人以上', value: '1000+' },
]

const welfares = [
  '全部',
  '加班补贴',
  '交通补贴',
  '住房补贴',
  '包住',
  '双休',
  '包吃',
  '带薪年假',
  '年终奖',
]

// 加载推荐企业数据
const loadRecommendedEnterprises = async () => {
  recommendLoading.value = true
  try {
    const res = await getRecommendEnterprises()
    if (res.code === 0) {
      recommendedList.value = res.data || []
    } else {
      ElMessage.error(res.msg || '加载推荐企业失败')
      recommendedList.value = []
    }
  } catch (error) {
    console.error('加载推荐企业失败:', error)
    ElMessage.error('加载推荐企业失败')
    recommendedList.value = []
  } finally {
    recommendLoading.value = false
  }
}

// 加载企业列表数据
const loadEnterpriseList = async () => {
  loading.value = true
  try {
    const res = await getEnterpriseList({
      ...searchParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
    })
    if (res.code === 0 && res.data) {
      enterpriseList.value = res.data.list || []
      pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '加载企业列表失败')
      enterpriseList.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('加载企业列表失败:', error)
    ElMessage.error('加载企业列表失败')
    enterpriseList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 加载省份数据
const loadProvinces = async () => {
  try {
    const data = await getProvinces()
    provinces.value = data
  } catch (error) {
    console.error('加载地区数据失败:', error)
    ElMessage.error('加载地区数据失败')
  }
}

// 加载城市数据
const loadCities = async (provinceCode: string) => {
  try {
    const data = await getCities(provinceCode)
    cities.value = data
  } catch (error) {
    console.error('加载城市数据失败:', error)
    ElMessage.error('加载城市数据失败')
  }
}

// 处理省份点击
const handleProvinceClick = async (province: Area | null) => {
  if (!province) {
    // 点击全部
    selectedProvince.value = ''
    cities.value = []
    searchParams.provinceCode = ''
    searchParams.cityCode = ''
  } else if (selectedProvince.value === province.value) {
    // 取消选择
    selectedProvince.value = ''
    cities.value = []
    searchParams.provinceCode = ''
    searchParams.cityCode = ''
  } else {
    selectedProvince.value = province.value
    selectedCity.value = ''
    searchParams.provinceCode = province.value
    searchParams.cityCode = ''

    // 判断是否是直辖市
    const isDirectCity = [
      '110000',
      '120000',
      '310000',
      '500000',
      '810000',
      '820000',
      '710000',
    ].includes(province.value)
    if (!isDirectCity) {
      // 非直辖市才加载城市数据
      await loadCities(province.value)
    } else {
      cities.value = []
    }
  }
  searchParams.page = 1
  loadEnterpriseList()
}

// 处理城市点击
const handleCityClick = (city: Area | null) => {
  if (!city) {
    // 点击全部
    selectedCity.value = ''
    searchParams.cityCode = ''
  } else if (selectedCity.value === city.value) {
    // 取消选择
    selectedCity.value = ''
    searchParams.cityCode = ''
  } else {
    selectedCity.value = city.value
    searchParams.cityCode = city.value
  }
  searchParams.page = 1
  loadEnterpriseList()
}

// 处理规模点击
const handleScaleClick = (scale: string) => {
  searchParams.scale = scale
  searchParams.page = 1
  loadEnterpriseList()
}

// 处理福利点击
const handleWelfareClick = (welfare: string) => {
  searchParams.welfare = welfare === '全部' ? '' : welfare
  searchParams.page = 1
  loadEnterpriseList()
}

// 处理分页大小变更
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.current = 1 // 切换每页数量时重置为第一页
  loadEnterpriseList()
}

// 处理页码变更
const handleCurrentChange = (val: number) => {
  pagination.current = val
  loadEnterpriseList()
}

// 处理搜索
const handleSearch = () => {
  pagination.current = 1 // 搜索时重置为第一页
  loadEnterpriseList()
}

// 组件挂载时加载数据
onMounted(() => {
  loadProvinces()
  loadEnterpriseList()
  loadRecommendedEnterprises()
})
</script>

<style lang="scss" scoped>
.find-enterprise {
  min-height: 100vh;
  background-color: #f5f7fa;

  .banner {
    height: 160px;
    background: url('@/assets/images/banner_enterprise.jpg') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    filter: brightness(1.1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      z-index: 1;
    }

    .search-box {
      width: 600px;
      position: relative;
      z-index: 2;

      .search-input {
        :deep(.el-input__wrapper) {
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.95);
          padding: 4px 8px;
          height: 50px;
          line-height: 50px;
        }

        :deep(.el-input__inner) {
          font-size: 16px;
          height: 50px;
          line-height: 50px;
        }

        :deep(.el-input-group__append) {
          padding: 0;
          .el-button {
            border-radius: 0 4px 4px 0;
            height: 50px;
            padding: 0 30px;
            font-size: 16px;
            background-color: var(--el-color-primary);
            border-color: var(--el-color-primary);
            color: white;

            &:hover {
              background-color: var(--el-color-primary-light-2);
              border-color: var(--el-color-primary-light-2);
            }
          }
        }
      }
    }
  }

  .filter-section {
    background-color: #fff;
    padding: 20px 0;
    margin-bottom: 20px;

    .filter-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .filter-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        width: 60px;
        color: #606266;
        flex-shrink: 0;
      }

      // 当展开更多地点时的特殊样式
      &.expanded-locations {
        align-items: flex-start;

        .label {
          line-height: 32px;
          margin-top: 4px;
        }
      }

      .options {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding-left: 0;
      }
    }
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    gap: 20px;

    .enterprise-list {
      flex: 1;

      .enterprise-card {
        margin-bottom: 20px;

        .enterprise-content {
          display: flex;
          gap: 20px;

          .enterprise-logo {
            width: 80px;
            height: 80px;
            border: 1px solid #eee;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            .el-image {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }

          .enterprise-info {
            flex: 1;
            min-width: 0;

            .enterprise-name {
              font-size: 16px;
              font-weight: 500;
              color: #303133;
              margin: 0 0 8px;
            }

            .enterprise-meta {
              color: #909399;
              font-size: 13px;
              margin-bottom: 12px;

              span {
                margin-right: 15px;
                display: inline-block;

                &:last-child {
                  margin-right: 0;
                }
              }
            }

            .enterprise-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;

              .welfare-tag {
                font-size: 12px;
              }
            }
          }

          .enterprise-jobs {
            min-width: 200px;
            border-left: 1px solid #eee;
            padding-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .hot-job {
              display: flex;
              flex-direction: column;
              gap: 8px;

              .hot-tag {
                width: fit-content;
                .el-icon {
                  margin-right: 4px;
                }
              }

              .job-name {
                color: #303133;
                font-weight: 500;
                font-size: 14px;
              }

              .job-salary {
                color: #f56c6c;
                font-weight: 500;
                font-size: 14px;
              }
            }
          }
        }
      }
    }

    .recommended-enterprises {
      width: 300px;

      .recommend-card {
        position: sticky;
        top: 20px;

        .card-header {
          font-weight: bold;
        }

        .recommend-list {
          .recommend-item {
            display: flex;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
              border-bottom: none;
              padding-bottom: 0;
            }

            &:first-child {
              padding-top: 0;
            }

            .el-image {
              width: 48px;
              height: 48px;
              border-radius: 4px;
              flex-shrink: 0;
            }

            .recommend-info {
              flex: 1;
              min-width: 0;

              .company-name {
                font-size: 14px;
                font-weight: 500;
                color: #303133;
                margin-bottom: 4px;
                display: block;
              }

              .company-meta {
                font-size: 12px;
                color: #909399;
                margin-bottom: 8px;

                span {
                  margin-right: 8px;

                  &:last-child {
                    margin-right: 0;
                  }
                }
              }

              .company-welfare {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;

                .el-tag {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    padding-bottom: 30px;
  }

  .loading-container {
    .el-skeleton {
      margin-bottom: 20px;
    }
  }
}
</style>
