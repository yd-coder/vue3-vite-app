import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.scss'
import router from './router';
import App from './App.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import i18n from './i18n'
import 'uno.css'

const app = createApp(App)
const pinia = createPinia()

app.use(i18n)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
