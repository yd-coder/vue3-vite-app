<template>
  <!-- 会话区域 -->
  <ChatDomain class="lg:block hidden" />
  <!-- 聊天区域 -->
  <div class="lg:w-73% w-100%">
    <!-- 聊天头部 -->
    <ChatHead></ChatHead>

    <!-- 聊天内容 -->
    <div class="px-20px h-320px">
      <el-scrollbar
        class="rounded-6px box-border shadow"
        max-height="100%"
        ref="chatScrollbar"
        style="background: var(--el-color-primary-light-9)"
      >
        <div class="p-20px">
          <template v-for="(item, index) in conversitionList" :key="index">
            <!-- 聊天时间 -->
            <div
              class="text-12px my-20px text-center"
              style="color: var(--el-color-primary-light-3)"
            >
              {{ renderMessageDate(item, index, conversitionList) }}
            </div>
            <el-row
              type="flex"
              class="mb-20px"
              :class="
                item.sendId == store.personalInfo.id && 'flex-row-reverse'
              "
            >
              <el-avatar :size="42" :src="item.avatar" />
              <div
                v-if="item.type === 0"
                :class="
                  item.sendId == store.personalInfo.id ? 'mr-10px' : 'ml-10px'
                "
                style="color: var(--el-color-primary)"
                class="text break-words px-15px rounded-6px text-left py-12px"
                v-html="item.content"
              ></div>
              <div
                v-else
                :class="
                  item.sendId == store.personalInfo.id ? 'mr-10px' : 'ml-10px'
                "
              >
                <el-image
                  v-if="item.type === 1"
                  class="w-200px ha max-h-200px"
                  :src="item.content"
                  :preview-src-list="[item.content]"
                  :initial-index="4"
                  fit="cover"
                />
                <video v-if="item.type === 2" width="300" height="180" controls>
                  <source :src="item.content" type="video/mp4" />
                  您的浏览器不支持 HTML5 video 标签。
                </video>
              </div>
              <el-icon
                v-if="item.status === 0"
                :class="
                  item.sendId == store.personalInfo.id ? 'mr-10px' : 'ml-10px'
                "
                class="is-loading pt-5px"
                size="40px"
              >
                <i
                  i="ep-loading"
                  style="color: var(--el-color-primary-light-3)"
                ></i>
              </el-icon>
            </el-row>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <!-- 聊天底部 -->
    <ChatFoot class="mt-20px"></ChatFoot>
  </div>
</template>

<script setup lang="ts">
import ChatDomain from './ChatDomain.vue'
import ChatHead from './ChatHead.vue'
import ChatFoot from './ChatFoot.vue'
import { useMainStore } from '@/store/index'
import { computed, ref, watch } from 'vue'
import Conversition from '@/store/interface/index'
import { formatTime } from '@/utils/formatTime'
const store = useMainStore()

// 获取会话列表
const conversitionList = computed(() => {
  return store.conversitionList.filter(
    (x: Conversition) =>
      (x.sendId == store.personalInfo.id &&
        x.recipientId == store.recipient?.id) ||
      (x.recipientId == store.personalInfo.id &&
        x.sendId == store.recipient?.id)
  )
})

// 渲染时间每隔5分钟显示一次
const renderMessageDate = computed(() => {
  return (message: any, index: number, messages: Array<any>) => {
    if (
      (message && index === 0) ||
      (message &&
        message.timestamp - messages[index - 1].timestamp > 5 * 60 * 1000)
    ) {
      return `- - ${formatTime(message.timestamp)} - -`
    }
    return ''
  }
})

// 发送消息
function readySend() {}
</script>

<style scoped></style>
