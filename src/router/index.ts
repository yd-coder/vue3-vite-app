import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/views/Login.vue"

const routes = [
  { path: "/", name: "Login", component: Login, meta: { title: "登录" } },
  { path: "/chat", name: "Chat", component: () => import("@/views/Chat.vue"), meta: { title: "首页" } },
]

const router = createRouter({
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})
export default router
