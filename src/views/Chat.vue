<template>
  <el-row type="flex" align="middle" justify="center" class="row-height">
    <el-card shadow="hover" class="lg:w-1200px w-full h-full rounded-3 chat-container">
      <ChatContainer></ChatContainer>
    </el-card>
  </el-row>
</template>

<script setup lang="ts">
import ChatContainer from '@/components/ChatContainer.vue'
</script>
<style lang="scss" scoped>
.row-height {
  height: calc(100vh - 63px);

  .chat-container {
    :deep(.el-card__body) {
      padding: 0 !important;
      height: calc(100% - 100px) !important;

      @media (max-width: 1024px) {
        padding-right: 0 !important;
      }
    }
  }
}
</style>
