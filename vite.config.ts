import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isUseCloudApi = env.VITE_USE_CLOUD_API === 'true'
  const apiBaseUrl = env.VITE_API_BASE_URL

  return {
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      devSourcemap: true,
    },
    server: {
      port: 8083,
      proxy: {
        '/api': {
          target: isUseCloudApi ? apiBaseUrl : 'http://127.0.0.1:4523',
          changeOrigin: true,
          rewrite: (path: string): string => {
            if (isUseCloudApi) {
              return path
            }
            return `/m1/6241630-5935444-default${path}`
          },
        },
      },
      cors: true,
    },
    build: {
      cssCodeSplit: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'style-vendor': ['normalize.css'],
          },
        },
      },
    },
  }
})
