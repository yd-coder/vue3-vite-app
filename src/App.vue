<template>
  <el-config-provider :locale="zhCn">
    <Header />
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import Header from '@/layouts/Header.vue'
</script>

<style>
#app {
  text-align: center;
  color: var(--el-text-color-primary);
}
</style>
