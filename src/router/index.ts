/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-04-17 14:52:44
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-04-18 13:09:15
 * @FilePath: /micro-child-vue3-enterprise/src/router/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import FindEnterprise from '../views/findEnterprise.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/enterprise',
    },
    {
      path: '/enterprise',
      name: 'enterprise',
      component: FindEnterprise,
      meta: {
        title: '企业列表',
      },
    },
    {
      path: '/enterprise/detail/:id',
      name: 'enterpriseDetail',
      component: () => import('../views/enterpriseDetail.vue'),
      meta: {
        title: '企业详情',
      },
    },
  ],
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 企业管理系统` : '企业管理系统'
  next()
})

export default router
