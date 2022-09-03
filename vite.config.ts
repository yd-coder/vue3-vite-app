import { fileURLToPath, URL } from 'url';
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
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }
})
