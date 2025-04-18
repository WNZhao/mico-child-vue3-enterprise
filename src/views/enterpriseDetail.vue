<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-04-17 14:57:45
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-04-17 21:30:43
 * @FilePath: /micro-child-vue3-enterprise/src/views/enterpriseDetail.vue
 * @Description: 企业详情页面
-->
<template>
  <div class="enterprise-detail" v-loading="loading">
    <!-- 企业基本信息头部 -->
    <div class="enterprise-header">
      <div class="enterprise-info">
        <el-image
          :src="enterpriseData.logo"
          fit="contain"
          :error-src="'/src/assets/images/default_company.png'"
          class="enterprise-logo"
        />
        <div class="info-content">
          <h1 class="company-name">{{ enterpriseData.name }}</h1>
          <div class="company-meta">
            <span>{{ enterpriseData.scale }}</span>
            <span>{{ enterpriseData.industry }}</span>
          </div>
          <div class="welfare-tags">
            <el-tag
              v-for="(tag, index) in enterpriseData.welfare"
              :key="index"
              size="small"
              type="info"
              effect="plain"
              class="welfare-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-content">
      <div class="main-content">
        <!-- 公司简介 -->
        <el-card class="detail-section">
          <template #header>
            <div class="section-header">
              <span class="title">公司简介</span>
            </div>
          </template>
          <div class="section-content">
            {{ enterpriseData.description }}
          </div>
        </el-card>

        <!-- 公司地址 -->
        <el-card class="detail-section">
          <template #header>
            <div class="section-header">
              <span class="title">公司地址</span>
            </div>
          </template>
          <div class="section-content">
            {{ enterpriseData.address }}
          </div>
        </el-card>

        <!-- 该公司招聘职位 -->
        <el-card class="detail-section">
          <template #header>
            <div class="section-header">
              <span class="title">该公司招聘职位</span>
            </div>
          </template>
          <div class="job-list">
            <div v-for="job in enterpriseData.jobs" :key="job.title" class="job-item">
              <div class="job-header">
                <div class="job-title">{{ job.title }}</div>
                <div class="job-salary">{{ job.salary }}</div>
              </div>
              <div class="job-meta">
                <span>{{ job.location }}</span>
                <span>{{ job.experience }}</span>
              </div>
              <div class="job-welfare">
                <el-tag
                  v-for="(tag, index) in job.welfare"
                  :key="index"
                  size="small"
                  type="info"
                  effect="plain"
                  class="welfare-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="job-date">{{ job.date }}</div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧办公环境 -->
      <div class="side-content">
        <el-card class="environment-card">
          <template #header>
            <div class="section-header">
              <span class="title">办公环境</span>
            </div>
          </template>
          <div class="environment-content">
            <el-empty description="暂无公司照片" />
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getEnterpriseDetail } from '@/api/enterprise'

const route = useRoute()
const loading = ref(false)
const enterpriseData = ref({
  id: '',
  name: '',
  scale: '',
  industry: '',
  logo: '',
  address: '',
  welfare: [],
  description: '',
  jobs: [],
})

// 获取企业详情
const loadEnterpriseDetail = async () => {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  try {
    const res = await getEnterpriseDetail(id)
    if (res.code === 0 && res.data) {
      enterpriseData.value = res.data
    } else {
      ElMessage.error(res.msg || '获取企业详情失败')
    }
  } catch (error) {
    console.error('获取企业详情失败:', error)
    ElMessage.error('获取企业详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEnterpriseDetail()
})
</script>

<style lang="scss" scoped>
.enterprise-detail {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;

  .enterprise-header {
    background-color: #fff;
    padding: 24px;
    margin-bottom: 20px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .enterprise-info {
      display: flex;
      gap: 24px;
      align-items: center;

      .enterprise-logo {
        width: 120px;
        height: 120px;
        border-radius: 4px;
        border: 1px solid #eee;
      }

      .info-content {
        flex: 1;

        .company-name {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          margin: 0 0 12px;
        }

        .company-meta {
          color: #606266;
          margin-bottom: 12px;

          span {
            margin-right: 16px;

            &:last-child {
              margin-right: 0;
            }
          }
        }

        .welfare-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }
  }

  .detail-content {
    display: flex;
    gap: 20px;

    .main-content {
      flex: 1;

      .detail-section {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        .section-header {
          .title {
            font-size: 16px;
            font-weight: 500;
            color: #303133;
          }
        }

        .section-content {
          color: #606266;
          line-height: 1.6;
        }

        .job-list {
          .job-item {
            padding: 20px 0;
            border-bottom: 1px solid #eee;

            &:first-child {
              padding-top: 0;
            }

            &:last-child {
              padding-bottom: 0;
              border-bottom: none;
            }

            .job-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;

              .job-title {
                font-size: 16px;
                font-weight: 500;
                color: #303133;
              }

              .job-salary {
                color: #f56c6c;
                font-weight: 500;
              }
            }

            .job-meta {
              color: #909399;
              font-size: 13px;
              margin-bottom: 8px;

              span {
                margin-right: 16px;

                &:last-child {
                  margin-right: 0;
                }
              }
            }

            .job-welfare {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-bottom: 8px;
            }

            .job-date {
              color: #909399;
              font-size: 12px;
            }
          }
        }
      }
    }

    .side-content {
      width: 300px;
      flex-shrink: 0;

      .environment-card {
        position: sticky;
        top: 20px;
      }
    }
  }
}
</style>
