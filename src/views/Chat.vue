<template>
  <span @click.stop="toggleDark()">暗黑模式</span>
  <el-switch
    size="default"
    style="--el-switch-on-color: #2c2c2c"
    v-model="isDark"
    inline-prompt
    :active-icon="Moon"
    :inactive-icon="Sunny"
  />
  <div class="container">
    <div class="chat-content">
      <template v-if="chatData && chatData.length">
        <div
          v-for="(chat, index) in chatData"
          class="message-box"
          :class="{ 'right-message': chat.id === curUser.id }"
          :key="index"
        >
          <div v-if="chat.id !== curUser.id" class="user">
            <el-avatar class="avatar" :src="chat.avatar"></el-avatar>
            <div class="info">
              <div class="name">{{ chat.name }}</div>
              <div class="time">{{ chat.createTime }}</div>
            </div>
          </div>
          <div v-else class="user">
            <div class="info">
              <div class="time">{{ chat.createTime }}</div>
              <div class="name">{{ chat.name }}</div>
            </div>
            <el-avatar class="avatar" :src="chat.avatar"></el-avatar>
          </div>
          <div class="message">
            <div class="block">{{ chat.content }}</div>
          </div>
        </div>
      </template>
      <div v-else class="empty">没有消息</div>
    </div>
    <div class="chat-bottom">
      <el-input
        v-model="message"
        class="chat-input"
        placeholder="请输入内容"
        @keyup.enter="handleSend"
      />
      <el-button class="chat-btn" type="primary" @click="handleSend"
        >发送</el-button
      >
    </div>
    <div style="margin-top: 10px">
      当前用户：
      <el-select
        v-model="curUser.name"
        value-key="id"
        @change="selectUser"
        placeholder="Select"
      >
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="item.name"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import {
  ref,
  reactive,
  getCurrentInstance,
  ComponentInternalInstance,
} from 'vue'
import { io } from 'socket.io-client'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { appContext } = getCurrentInstance() as ComponentInternalInstance

// 创建 socket 实例
let socket = io('ws://192.168.0.197:3000')
const avatar =
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
interface ChatDataItem {
  id: string // 这条消息唯一的id
  name: string // 用户名称
  content: string // 聊天内容 || 提示内容
  avatar: string // 头像
  userId: string // 用户的id
  createTime: any
}
// 聊天数据
const chatData = ref<ChatDataItem[]>([])
// 当前用户
let curUser = reactive({ name: '', avatar: '', id: '' })
// 用户列表
const userList = ref([
  { name: '小明', avatar, id: '1111111111' },
  { name: '小红', avatar, id: '2222222222' },
])
const message = ref('')

const selectUser = (user: ChatDataItem) => {
  curUser = user
}
const handleSend = () => {
  if (!message.value) {
    appContext.config.globalProperties.$message.error('输入不能为空！')
    ;('')
  }
  const obj = {
    id: Math.random().toString().split('.')[1].slice(0, 10),
    name: curUser.name,
    avatar: curUser.avatar,
    content: message.value,
    userId: curUser.id,
    createTime: new Date(),
  }
  message.value = ''
  // 发出send事件，将消息发送出去
  socket.emit('message', obj)
}
// 监听消息的广播
socket.on('message', (e: any) => {
  chatData.value.push(e)
})
</script>

<style lang="scss" scoped>
@mixin flex($align) {
  display: flex;
  align-items: $align;
}
.container {
  width: 500px;
  height: 350px;
  padding: 24px;
}
.chat-bottom {
  @include flex(center);
}
.chat-content {
  width: 100%;
  height: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-bottom: none;
  box-sizing: border-box;
  .message-box {
    margin-bottom: 10px;
    .message {
      display: flex;
      margin-left: 42px;
      border-radius: 4px;
      box-sizing: border-box;
      margin-top: 5px;
      width: 100%;
      .block {
        display: inline-block;
        font-size: 14px;
        line-height: 1.5;
        border-radius: 4px;
        padding: 8px;
        background-color: #eee;
      }
    }
    .user {
      .avatar {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }
      @include flex(center);
    }
    .info {
      @include flex(center);
      font-size: 12px;
      color: #999;
      .name {
        margin-right: 10px;
      }
    }
    &.right-message {
      text-align: right;
      .message {
        padding-right: 42px;
        margin-left: auto;
      }
      .user {
        .name {
          margin-right: 0px;
          margin-left: 10px;
        }
        justify-content: flex-end;
      }
      .avatar {
        margin-right: 0px;
        margin-left: 10px;
      }
    }
  }
}
.empty {
  font-size: 14px;
  padding: 50px 0;
  text-align: center;
}
.chat-input {
  &:deep(.el-input__inner) {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
.chat-btn {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
