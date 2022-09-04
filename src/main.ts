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
import { useTestStore } from '@/store/index'

const app = createApp(App)
const pinia = createPinia()

const whileList = ['/'] // 不重定向白名单

// 前置导航守卫
router.beforeEach((to, from, next) => {
    document.title = to.meta.title as string
    const Test = useTestStore()
    let token = Test.token
    //白名单 有值 或者登陆过存储了token信息可以跳转 否则就去登录页面
    if (whileList.includes(to.path) || token) {
        next()
    } else {
        next({
            path:'/'
        })
    }
})

app.use(i18n)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
