<template>
  <header class="text-center px-20px h-35px">
    <span class="fw-600">{{ store.recipient?.nick_name }} </span>
  </header>
</template>

<script setup lang="ts">
import { useMainStore } from '@/store/index'
const store = useMainStore()
</script>
