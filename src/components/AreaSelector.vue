<template>
  <div class="area-selector">
    <!-- 省份列表 -->
    <div class="area-list">
      <template v-if="!showAll">
        <el-button
          v-for="area in displayedProvinces"
          :key="area.value"
          :type="selectedProvince === area.value ? 'primary' : 'default'"
          @click="handleProvinceClick(area)"
        >
          {{ area.label }}
        </el-button>
        <el-button
          v-if="provinces.length > displayLimit"
          type="primary"
          link
          @click="showAll = true"
        >
          更多
        </el-button>
      </template>
      <template v-else>
        <el-button
          v-for="area in provinces"
          :key="area.value"
          :type="selectedProvince === area.value ? 'primary' : 'default'"
          @click="handleProvinceClick(area)"
        >
          {{ area.label }}
        </el-button>
      </template>
    </div>

    <!-- 城市列表 -->
    <div class="city-list" v-if="cities.length">
      <el-button
        v-for="city in cities"
        :key="city.value"
        :type="selectedCity === city.value ? 'primary' : 'default'"
        @click="handleCityClick(city)"
      >
        {{ city.label }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getProvinces,
  getCities,
  formatAreaResult,
  type AreaItem,
  type AreaSelectResult,
} from '@/api/area'

const emit = defineEmits<{
  (e: 'change', value: AreaSelectResult): void
}>()

// 状态管理
const provinces = ref<AreaItem[]>([])
const cities = ref<AreaItem[]>([])
const showAll = ref(false)
const selectedProvince = ref('')
const selectedCity = ref('')
const loading = ref(false)
const displayLimit = 8

// 计算属性：显示的省份列表
const displayedProvinces = computed(() => {
  return showAll.value ? provinces.value : provinces.value.slice(0, displayLimit)
})

// 加载省级数据
const loadProvinces = async () => {
  loading.value = true
  try {
    const data = await getProvinces()
    provinces.value = data
  } catch (error) {
    console.error('加载省份数据失败:', error)
    ElMessage.error('加载省份数据失败')
  } finally {
    loading.value = false
  }
}

// 加载城市数据
const loadCities = async (provinceCode: string) => {
  loading.value = true
  cities.value = [] // 清空现有城市数据
  try {
    const data = await getCities(provinceCode)
    cities.value = data
  } catch (error) {
    console.error('加载城市数据失败:', error)
    ElMessage.error('加载城市数据失败')
  } finally {
    loading.value = false
  }
}

// 处理省份点击
const handleProvinceClick = async (province: AreaItem) => {
  if (selectedProvince.value === province.value) {
    return
  }

  selectedProvince.value = province.value
  selectedCity.value = ''

  // 加载该省份的城市数据
  await loadCities(province.value)

  // 触发变更事件
  emit('change', formatAreaResult(province, null))
}

// 处理城市点击
const handleCityClick = (city: AreaItem) => {
  selectedCity.value = city.value

  const province = provinces.value.find((p) => p.value === selectedProvince.value)
  // 触发变更事件
  emit('change', formatAreaResult(province || null, city))
}

// 组件挂载时加载省份数据
onMounted(() => {
  loadProvinces()
})
</script>

<style scoped>
.area-selector {
  width: 100%;
}

.area-list,
.city-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.area-list .el-button,
.city-list .el-button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
