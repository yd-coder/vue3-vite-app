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

const store = useMainStore()
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
    if (!store.allSessionList.length) {
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
      store.allSessionList = res?.data.list
    } else {
      ElNotification.error(res?.msg)
    }
  })
}
</script>

<style scoped>
</style>
