import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import utools from 'vite-plugin-utools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import process from 'process'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue']
  },
  // external
  build: {
    rollupOptions: {
      external: ['electron', 'utools', 'process', 'vm']
    }
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console'] : []
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 8082
  },
  plugins: [
    vue(),
    utools({
      external: 'uTools',
      preload: {
        path: './src/preload/index.ts',
        watch: true,
        name: 'window.preload',
        minify: true
      },
      buildUpx: false
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ArcoResolver()]
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        })
      ]
    }),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: '@arco-design/web-vue',
          esModule: true,
          resolveStyle: (name) => {
            if (name === 'button-group') {
              return `@arco-design/web-vue/es/button/style/css.js`
            }
            if (name === 'input-search') {
              return `@arco-design/web-vue/es/input/style/css.js`
            }
            return `@arco-design/web-vue/es/${name}/style/css.js`
          }
        }
      ]
    })
  ]
})
