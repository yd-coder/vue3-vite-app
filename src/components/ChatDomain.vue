<template>
  <div class="chat-session lg:w-20% w-70% p-8px box-border">
    <el-scrollbar max-height="100%">
      <!-- 会话列表 -->
      <template v-for="item in store.sessionList" :key="item">
        <div class="session-item px-20px py-10px cursor-pointer rounded-6px" :class="[
        (item.id === store.sessionSelectId) ? 'session-active' : '']" @click="selectSession(item)">
          <el-row type="flex" align="middle">
            <el-badge :value="getUnReadCount(item.id)" :max="10" :hidden="!(getUnReadCount(item.id))">
              <el-avatar shape="square" class="!block" :size="40" fit="cover" :src="item.avatar" />
            </el-badge>
            <div class="w-50% ml-10px text-left">
              <div class="truncate">{{ item.nick_name }}</div>
              <div class="truncate text-12px mt-2px" style="color: var(--el-color-primary-light-3)"
                v-html="getLastSession(item.id)"></div>
            </div>
          </el-row>
        </div>
      </template>
      <el-empty v-if="!store.sessionList.length" :image-size="100" description="好友列表为空" />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { User } from '@/store/interface/index'
import Conversition from '@/store/interface/index'
import { computed, onMounted } from 'vue'
import { useMainStore } from '@/store/index'
const store = useMainStore()

onMounted(() => {
  setTimeout(() => {
    if (store.sessionList.length) {
      selectSession(store.sessionList[0])
    }
  }, 500)
})
// 获取未读数量
const getUnReadCount = computed(() => {
  return (id: Number) => {
    return getUnReadCountById(id)
  }
})


// 获取最后一条消息内容
const getLastSession = computed(() => {
  return (id: Number) => {
    let currentContent: Array<Conversition> = store.conversitionList.filter(
      (x: Conversition) =>
        (x.sendId === store.personalInfo.id && x.recipientId === id) ||
        (x.sendId === id && x.recipientId === store.personalInfo.id)
    )
    let result = ''
    if (currentContent.length > 0) {
      let len = currentContent.length - 1
      switch (currentContent[len].type) {
        case 0:
          result = currentContent[len].content
          break
        case 1:
          result = '图片'
          break
        case 2:
          result = '视频'
          break
      }
    }
    return result
  }
})

// 获取未读消息数量
function getUnReadCountById(id: Number) {
  let currentContent = store.conversitionList.filter(
    (item: Conversition) =>
      item.sendId === id &&
      item.recipientId === store.personalInfo.id &&
      !item.isRead
  )
  return currentContent.length
}

// 选择聊天用户
function selectSession(item: User) {
  store.drawer = false
  store.sessionSelectId = item.id
  store.recipient = item
  store.changeReaded(item.id)
  store.initEditor()
  store.toBottom()
}
</script>

<style scoped lang="scss">
$selectBg: var(--el-color-primary-light-9);

.chat-session {
  :deep(p) {
    margin: 0;
  }

  border-right: 1px solid var(--el-border-color);

  @media (max-width: 1024px) {
    border-right: none;
  }

  .session-item {
    &:hover {
      background: $selectBg;
    }
  }

  .session-active {
    background: $selectBg;
  }
}
</style>
