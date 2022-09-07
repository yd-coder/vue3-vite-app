<template>
  <footer class="px-20px">
    <!--工具栏-->
    <el-row type="flex" class="mb-10px">
      <el-popover placement="top" popper-class="chat-icon-popover" trigger="click">
        <template #reference>
          <svg width="21" height="21" viewBox="0 0 16 16" class="cursor-pointer mt-1px">
            <g fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75a.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25a.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
            </g>
          </svg>
        </template>
        <el-scrollbar class="emoji" height="150px">
          <ul class="m0 p0 pr-2px flex flex-wrap">
            <li v-for="item in store.emojiList" :key="item.title"
              class="p-5px list-none hover:animate-heart-beat animate-count-animated animate-duration-1s cursor-pointer"
              :title="item.title">
              <img width="30" height="30" :src="item.icon" @click="selectIcon(item.icon)" />
            </li>
          </ul>
        </el-scrollbar>
      </el-popover>
      <div class="ml-10px text-20px i-ep-picture-rounded !cursor-pointer">
        <input ref="referenceUpload" class="opacity-0" name="customerService" type="file" value="" accept="image/*"
          v-on:change="sendImage" />
      </div>
      <div class="ml-10px text-20px i-ep-video-camera !cursor-pointer">
        <input ref="referenceUploadVideo" class="opacity-0" name="customerService" type="file" value="" accept="video/*"
          v-on:change="sendVideo" />
      </div>
    </el-row>
    <ChatEditor v-model="store.sendInfo" ref="editor" id="chatEditor" :height="135" class="answer-editor"></ChatEditor>
  </footer>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from "vue"
import ChatEditor from './ChatEditor.vue'
import { useMainStore } from '@/store/index'
import Conversition from "@/store/interface/index"
import { uploadFile } from "@/api/chat"
const store = useMainStore()
const { proxy }: any = getCurrentInstance()
const editor = ref(null)

// 选择表情
function selectIcon(icon: string) {
  let iconContent = `<img src='${icon}' class='emo-image' />`
  store.editor.cmd.do("insertHTML", iconContent)
}

function blurHighLight(data: any) {
  // 这里做数据过滤或样式变更操作
  store.sendInfo = data
}

//发送图片
async function sendImage(e: any) {
  const fileData = e.target.files[0]
  if (fileData != null) {
    if (!/image\/\w+/.test(fileData.type)) {
      return alert("请选择图片文件!")
    }
    if (fileData.size > 1024 * 1024 * 10) {
      return alert("上传图片不能超过10M!")
    } else {
      console.log(fileData)
      const tempFilePath = URL.createObjectURL(fileData)
      let conversition = new Conversition(
        store.personalInfo.id,
        store.recipient!.id,
        tempFilePath,
        1,
        0,
        +new Date() + "",
        "",
        false,
        store.personalInfo.avatar
      )
      store.sendLocal(conversition)
      const result: any = await _uploadFile(e.target.files[0])
      if (result) {
        conversition.content = result.url
        store.sendInfos(conversition)
      }
      proxy.$refs.referenceUpload.value = null
    }
  }
}

//发送视频
async function sendVideo(e: any) {
  const resultFile = e.target.files
  const fileObj = new Blob([resultFile[0]], { type: "video/mp4" })
  const tempFilePath = URL.createObjectURL(fileObj)
  let conversition = new Conversition(
    store.personalInfo.id,
    store.recipient!.id,
    tempFilePath,
    2,
    0,
    +new Date() + "",
    "",
    false,
    store.personalInfo.avatar
  )
  store.sendLocal(conversition)
  const result: any = await _uploadFile(e.target.files[0])
  if (result) {
    conversition.content = result.url
    store.sendInfos(conversition)
  }
  proxy.$refs.referenceUploadVideo.value = null
}

//上传文件资源
function _uploadFile(tempFilePath: string) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append("file", tempFilePath)
    uploadFile(formData)
      .then((res: any) => {
        if (res.code === 200)
          resolve(res.data)
        resolve(undefined)
      })
      .catch(() => {
        resolve(undefined)
      })
  })
}
</script>

<style scoped>

</style>
