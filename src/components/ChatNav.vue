<template>
  <div class="lg:w-7% w-30%">
    <el-menu default-active="1" class="h-100% flex flex-col justify-start items-center" @select="handleSelect">
      <div align="center" class="mb-20px mt-50px">
        <el-avatar :src="store.personalInfo?.avatar">user</el-avatar>
        <div class="truncate mt-10px text-14px" :title="store.personalInfo?.nick_name" style="width: 80%">
          {{ store.personalInfo?.nick_name }}
        </div>
      </div>
      <el-menu-item index="1" class="fw-bold text-24px mb-5">
        <el-badge :value="getUnReadCount" :hidden="!getUnReadCount" class="absolute bottom-7 right-1" />
        <i i-ep-chat-dot-round></i>
      </el-menu-item>
      <el-menu-item index="2" class="fw-bold text-24px">
        <i i-ep-tickets></i>
      </el-menu-item>
      <el-button type="danger" class="mt-40px bg-red-6" size="large" circle @click="logout">
        <i i="ep-switch-button" class="fw-bold"></i>
      </el-button>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMainStore } from '@/store/index'
import router from '@/router'
import Conversition from '@/store/interface/index';
const store = useMainStore()
const emit = defineEmits(['on-click'])
// 点击切换事件
const handleSelect = (key: string, keyPath: string[]) => {
  emit('on-click', key)
}

// 获取未读消息数量
const getUnReadCount = computed(() => {
  let currentContent = store.conversitionList.filter(
    (x: Conversition) => x.recipientId == store.personalInfo.id && !x.isRead
  )
  return currentContent.length as number
})

// 注销登录
const logout = () => {
  store.logout()
  router.replace({
    name: 'Login',
  })
}

</script>

<style scoped lang="scss">

</style>
