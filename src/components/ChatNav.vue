<template>
  <div class="lg:w-7% w-30%">
    <el-menu default-active="1" class="h-100% flex flex-col justify-start items-center" @select="handleSelect">
      <div align="center" class="mb-20px mt-50px">
        <!-- 用户头像 -->
        <el-avatar :src="store.personalInfo.avatar" @click="dialogVisible = true">user</el-avatar>
        <!-- 用户昵称 -->
        <div class="truncate mt-10px text-14px" :title="store.personalInfo?.nick_name" style="width: 80%">
          {{ store.personalInfo.nick_name }}
        </div>
        <!-- 编辑用户信息对话框 -->
        <el-dialog v-model="dialogVisible" title="个人资料修改" width="30%" draggable>
          <el-upload class="avatar-uploader" :action="uploadAvatarUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :on-error="handleAvatarFail" :before-upload="beforeAvatarUpload"
            :headers="{ 'Authorization': 'Bearer ' + store.token }">
            <img :src="avatar" class="avatar" />
            <el-icon class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <el-input v-model="nick_name" class="w-69 mt-6" size="large" placeholder="请输入个人昵称" clearable
            :prefix-icon="EditPen" />
          <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              保存
            </el-button>
          </template>
        </el-dialog>
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
import { ref, computed } from 'vue'
import { useMainStore } from '@/store/index'
import router from '@/router'
import Conversition from '@/store/interface/index';
import { uploadAvatarUrl } from '@/api/user'
import { ElMessage } from 'element-plus'
import { Plus, EditPen } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

const store = useMainStore()
const avatar = ref(store.personalInfo.avatar)
const nick_name = ref(store.personalInfo.nick_name)
const dialogVisible = ref(false)
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

// 头像上传成功时的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  avatar.value = URL.createObjectURL(uploadFile.raw!)
  ElMessage.success('头像上传成功')
}

// 头像上传失败时的钩子
const handleAvatarFail: UploadProps['onError'] = (err, file, fileList) => {
  console.log(err, file, fileList);
  ElMessage.error('上传失败！请尝试重新上传')
}

// 上传头像前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('上传的头像必须为JPG格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传的头像大小不得超过2MB!')
    return false
  }
  return true
}

// 注销登录
const logout = () => {
  store.logout()
  router.replace({
    name: 'Login',
  })
}

</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 138px;
  height: 138px;
  display: block;
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  text-align: center;
}
</style>
