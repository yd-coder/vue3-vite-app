import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno
} from 'unocss'


export default defineConfig({
  plugins: [vue() , unocss({
    presets:[presetIcons({
      scale: 1.2, // 图标缩放比例
      warn: true,
    }),presetAttributify(),presetUno()]
  })],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  server: {
    host: '127.0.0.1', //ip地址
    port: 5000, //端口号
    open: false //启动后是否自动打开浏览器
  }
})
