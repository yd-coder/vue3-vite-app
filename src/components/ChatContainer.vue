<template>
  <el-row type="flex" class="w-full border-rounded-33px">
    <!-- 导航区域 -->
    <ChatNav @on-click="getNav" class="lg:block hidden" />
    <!-- 聊天区域 -->
    <component :is="current.comName"></component>
  </el-row>
</template>

<script setup lang="ts">
import ChatNav from './ChatNav.vue'
import ChatContent from './ChatContent.vue'
import ArticleContent from './ArticleContent.vue'
import { onMounted, reactive, markRaw } from 'vue'
import { userList } from '@/api/user'
import { useMainStore } from '@/store/index'
import { ElNotification } from 'element-plus'
import io from "socket.io-client"
import Conversition from "@/store/interface/index"
import router from '@/router'

const store = useMainStore()
const chatUrl: any = import.meta.env.VITE_BASE_API || "/"
type Tabs = {
  name: string,
  comName: any
}
const data = reactive<Tabs[]>([
  {
    name: '聊天内容',
    comName: markRaw(ChatContent)
  },
  {
    name: '文章内容',
    comName: markRaw(ArticleContent)
  }
])

// 设置默认选中
let current = reactive({
  comName: data[0].comName
})

onMounted(() => {
  init()
})

async function init() {
  if (store.token) {
    initSocket()
    if (!store.sessionList.length) {
      getUserList()
    }
  }
}

// 获取子组件传的nav值
const getNav = (list: string) => {
  current.comName = data[Number(list) - 1].comName
}

// 获取用户列表
function getUserList() {
  userList().then((res: any) => {
    if (res?.code == 200) {
      store.sessionList = res?.data.list
    } else {
      ElNotification.error(res?.msg)
    }
  })
}

// 连接聊天
function initSocket() {

  store.socket = io(chatUrl, {
    // 通过token连接
    auth: {
      token: store.token
    }
  })

  // 初始化连接
  store.socket.on("connect", () => {
    console.log("连接成功")
    store.socket.emit("joinChat")
  })

  // 断开连接
  store.socket.on("disconnect", () => {
    console.log("连接已断开")
  })

  // 修改阅读状态
  store.socket.on("changMsgstatus", (data: any) => {
    store.conversitionList.map((x: Conversition) => {
      if (x.timestamp != null && x.timestamp == data.timestamp) {
        x.status = 1
      }
    })
  })

  // 加入会话成功
  store.socket.on("joinSuccess", (data: any) => {
    store.personalInfo && (store.personalInfo.onlineStatus = true)
    store.conversitionList = data.conversition
  })

  //接收信息
  store.socket.on("reviceMsg", (data: Conversition) => {
    if (data.recipientId == store.personalInfo.id) {
      store.playMusic()
      if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {
          var n = new Notification("消息通知", {
            body: "你有一条新的消息",
          })
        })
      }
      for (let item of store.sessionList) {
        if (item.id == data.sendId && store.sessionSelectId == data.sendId) {
          data.isRead = true
          let query = {
            sendId: data.sendId
          }
          store.socket.emit("changeMsgRead", query)
          break
        }
      }
    }
    // 接收的消息存入消息列表
    store.sendLocal(data)
    let len =
      store.sessionList.filter((x: any) => x.id == data.sendId)?.length ?? 0
    if (len === 0) {
      let item = store.sessionList.filter((x: any) => x.id == data.sendId)
      store.sessionList.push(...item)
    }
    store.toBottom()
  })

  // 强制旧设备下线
  store.socket.on("squeezeOut", () => {
    store.logout()
    ElNotification.error("账户在其它地方登陆，会话已断开！")
    router.push({
      name: "Login"
    })
  })

  // 过期下线
  store.socket.on("forceOut", () => {
    store.logout()
    ElNotification.error("登录已过期！")
    router.push({
      name: "Login"
    })
  })

}
</script>

<style scoped>

</style>
