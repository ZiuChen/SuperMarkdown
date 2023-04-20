import path from 'path'
import fs from 'fs'
import process from 'process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import utools from 'vite-plugin-utools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import postBuildPlugin from './build/postBuildPlugin'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue']
  },
  // external
  build: {
    rollupOptions: {
      external: ['electron', 'utools', 'process', 'vm', 'fs'],
      output: {
        sanitizeFileName(name) {
          const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g
          const DRIVE_LETTER_REGEX = /^[a-z]:/i

          const match = DRIVE_LETTER_REGEX.exec(name)
          const driveLetter = match ? match[0] : ''
          // substr 是被淘汰語法，因此要改 slice
          return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, '')
        }
      }
    }
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console'] : []
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      },
      sass: true
    }
  },
  server: {
    port: 8083
  },
  plugins: [
    vue(),
    utools({
      external: 'uTools',
      preload: {
        path: './public/preload.js',
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
            const p = `@arco-design/web-vue/es/${name}/style/css.js`
            const actualPath = path.resolve(__dirname, 'node_modules', p)
            if (fs.existsSync(actualPath)) return p
            return ''
          }
        }
      ]
    }),
    postBuildPlugin({
      files: ['index.html', 'plugin.json', 'preload.js']
    })
  ]
})
