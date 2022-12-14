<template>
  <!-- 聊天编辑区域 -->
  <div class="edit-box">
    <el-scrollbar height="100px" class="w-100% rounded-8px">
      <div class="text-left">
        <div ref="chatEditor" :id="id" @keydown.enter="keyDown($event)" />
        <input ref="upload" class="opacity-0 hidden" @change="handleChange" type="file" />
      </div>
    </el-scrollbar>
    <div class="text-right mt-10px">
      <el-tooltip placement="bottom" content="按enter键发送，按ctrl+enter键换行">
        <el-button type="primary" @click="sendVerify">发 送</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import Conversition from '@/store/interface/index'
import { getCurrentInstance, watch, reactive, onMounted, nextTick } from 'vue'
import { useMainStore } from '@/store/index'
import { ElNotification } from 'element-plus';
const store = useMainStore()
defineProps<{
  id: string
  height: number
}>()
const { proxy }: any = getCurrentInstance()

const state = reactive({
  editor: {},
  data: '',
})

watch(
  () => proxy.value,
  (newVal, oldVal) => {
    if (proxy.value !== store.editorData) {
      store.editorData = proxy.value
      if (store.editor && store.editor.txt) {
        store.editor.txt.html(store.editorData)
      }
    }
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  }
)

onMounted(() => {
  store.initEditor()
  nextTick(() => {
    store.chatEditor = proxy.$refs.chatEditor
  })
})

function handleChange() {
  let file = proxy.$refs.upload.files[0]
}

// 获取文本
function text() {
  try {
    return store.editor.txt.text()
  } catch (e) {
    console.warn(e)
  }
}

// 获取html 有值时为设置内容
function html(value: any) {
  try {
    return store.editor.txt.html(value)
  } catch (e) {
    console.warn(e)
  }
}

function browsertype() {
  var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
  var isOpera = false
  if (userAgent.indexOf('Edge') > -1) {
    return 'Edge'
  }
  if (userAgent.indexOf('.NET') > -1) {
    return 'IE'
  }
  if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    isOpera = true
    return 'Opera'
  } //判断是否Opera浏览器
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF'
  } //判断是否Firefox浏览器
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome'
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari'
  } //判断是否Safari浏览器
  if (
    userAgent.indexOf('compatible') > -1 &&
    userAgent.indexOf('MSIE') > -1 &&
    !isOpera
  ) {
    return 'IE'
  } //判断是否IE浏览器
}

// 按下回车键发送消息
function keyDown(event: any) {
  if (event.ctrlKey && event.keyCode === 13) {
    let len = store.editor.txt.html().trim().length
    if (browsertype() == 'IE' || browsertype() == 'Edge') {
      if (len == 0) {
        store.editor.cmd.do('insertHTML', '<div></div><div></div>')
      } else {
        store.editor.cmd.do('insertHTML', '<div></div>')
      }
    } else if (browsertype() == 'FF') {
      if (len == 0) {
        store.editor.cmd.do('insertHTML', '<br/><br/><br/><br/>')
      } else {
        store.editor.cmd.do('insertHTML', '<br/><br/>')
      }
    } else {
      if (len == 0) {
        store.editor.cmd.do('insertHTML', '<div><br/></div><div><br/></div>')
      } else {
        store.editor.cmd.do('insertHTML', '<div><br/></div>')
      }
    }
  } else if (event.keyCode === 13) {
    event.preventDefault() // 阻止浏览器默认换行操作
    sendVerify()
    return false
  }
}

// 发送校验
function sendVerify() {
  // 校验是否有内容
  let sendContent = store.editor.txt.html().trim()
  if (!sendContent.length) {
    return
  } else {
    let timestamp = +new Date() + ''
    let conversition = new Conversition(
      store.personalInfo.id, // 发送者id
      store.recipient!.id, // 接收者id
      sendContent, // 发送内容
      0,
      0,
      timestamp, // 发送时间戳
      '',
      false,
      store.personalInfo.avatar // 发送者头像
    )
    if (store.socket == null) {
      ElNotification.error('socket不存在')
      return
    }
    store.sendLocal(conversition)
    store.sendInfos(conversition)
  }
  clear()
}

// 发送成功后清空富文本编辑器内容
function clear() {
  try {
    return store.editor.txt.clear()
  } catch (e) {
    console.warn(e)
  }
}
</script>

<style scoped lang="scss">
.edit-box {
  .el-scrollbar {
    border: 1px solid var(--el-border-color);
  }

  :deep(.w-e-toolbar) {
    border: none !important;
  }

  :deep(.w-e-text-container) {
    border: none !important;
    background-color: transparent;
    height: auto !important;
    min-height: 88px;
  }
}
</style>
