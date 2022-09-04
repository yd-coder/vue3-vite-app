<template>
  <div class="login">
    <el-row
      class="login-container ma lg:w-1200px w-full"
      type="flex"
      align="middle"
      justify="center"
    >
      <el-col :lg="{ span: 8 }" :sm="{ span: 16 }" :span="24">
        <el-card shadow="hover" class="p-20px">
          <div
            class="text-3xl fw700 mb-20px animate-bounce-alt animate-count-infinite animate-duration-1s"
            style="color: var(--el-color-primary-light-3)"
            align="center"
          >
            {{ $t('login.title') }}
          </div>
          <el-form
            @keyup.enter="submitForm(formRef)"
            ref="formRef"
            :rules="rules"
            size="large"
            :model="form"
          >
            <el-form-item prop="username">
              <el-input
                type="text"
                clearable
                v-model="form.username"
                autofocus
                :placeholder="$t('login.usernameText')"
              >
                <template #prefix>
                  <el-icon i="ep-user"></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="code" v-if="useType === 'reg'">
              <el-input v-model="form.code" :placeholder="$t('login.codeText')">
                <template #prefix>
                  <el-icon i="ep-message"></el-icon>
                </template>
                <template #append>
                  <el-button type="primary" @click="getMailCode(formRef)">
                    {{ codeText }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                :placeholder="$t('login.passwordText')"
                show-password
              >
                <template #prefix>
                  <el-icon i="ep-lock"></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="againPwd" v-if="useType === 'reg'">
              <el-input
                v-model="form.againPwd"
                type="password"
                :placeholder="$t('login.againText')"
                show-password
              >
                <template #prefix>
                  <el-icon i="ep-unlock"></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                class="ma"
                type="primary"
                link
                @click="useTypeChange(formRef)"
                >{{ buttonText('text') }}</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                class="w-full"
                :loading="form.loading"
                round
                type="primary"
                size="large"
                @click="submitForm(formRef)"
              >
                {{ buttonText('button') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { sendMailCode, register, login } from '@/api/user'
import { useTestStore } from '@/store/index'
import { ElNotification } from 'element-plus'
import type { ElForm } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { validatorPassword } from '../utils/validate'
import { useI18n } from 'vue-i18n'
import router from '@/router'

const { t } = useI18n()
const formRef = ref<FormInstance>() // 表单实例
const useType = ref('login') // 类型
// 初始化表单项
const form = reactive({
  username: '',
  password: '',
  code: '',
  againPwd: '',
  loading: false,
})

// 验证码数据
const codeDatas = reactive({
  timer: null,
  num: 60,
})

// 按钮文字切换
const buttonText = computed(() => {
  return (type: String) => {
    return type === 'text' && useType.value === 'reg'
      ? t('login.loginNow')
      : type === 'text' && useType.value === 'login'
      ? t('login.registerNow')
      : useType.value === 'login'
      ? t('login.login')
      : t('login.register')
  }
})

// 登录时间戳
const timestamp = ref('')

// 验证再次输入密码规则
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('login.againText')))
  } else if (value !== form.password) {
    callback(new Error(t('login.theSame')))
  } else {
    callback()
  }
}

// 验证码倒计时
const codeText = computed(() => {
  return codeDatas.num !== 60 ? `剩余${codeDatas.num}秒` : t('login.getCode')
})

// 获取验证码
function getMailCode(formEl: InstanceType<typeof ElForm> | undefined) {
  // 防止重复点击
  if (!formEl || codeDatas.num !== 60) return
  // 验证表单实例的某个字段
  formEl.validateField('username', (bool) => {
    if (bool) {
      sendMailCode({ email: form.username })
        .then((res: any) => {
          if (res?.code === 200) {
            codeDatas.num--
            codeDatas.timer = setInterval(() => {
              if (codeDatas.num < 1) {
                if (codeDatas.timer != null) {
                  clearInterval(codeDatas.timer)
                  codeDatas.timer = null
                }
                codeDatas.num = 60
              } else {
                codeDatas.num--
              }
            }, 1000) as any
            ElNotification.success(res.msg)
            timestamp.value = res?.data?.timestamp
          } else ElNotification.error(res.msg)
        })
        .catch((err: any) => {
          ElNotification.error(err?.response?.data?.message || err.message)
        })
    }
  })
}

// 切换登录注册
const useTypeChange = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (useType.value === 'reg') useType.value = 'login'
  else useType.value = 'reg'
  if (!formEl) return
  formEl.resetFields()
}

// 表单验证规则
const rules = reactive({
  username: [
    {
      required: true,
      message: t('login.usernameText'),
      trigger: ['blur', 'change'],
    },
  ],

  password: [
    {
      required: true,
      message: t('login.passwordText'),
      trigger: ['blur', 'change'],
    },
    {
      validator: validatorPassword,
      trigger: ['blur', 'change'],
    },
  ],

  againPwd: [
    {
      validator: validatePass2,
      trigger: ['blur', 'change'],
    },
  ],

  code: [
    {
      required: true,
      message: t('login.codeText'),
      trigger: ['blur', 'change'],
    },
  ],
})

// 登录和注册
const submitForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      form.loading = true
      const { username, password, code, againPwd } = form
      if (useType.value === 'login') {
        login({ username, password })
          .then((res: any) => {
            if (res?.code == 200) {
              if (!formEl) return
              formEl.resetFields()
              ElNotification.success(res.msg)
              useTestStore().setToken(res?.token)
              router.push({ path: '/chat' })
            } else
              ElNotification({
                message: res.msg,
                type: 'error',
              })
          })
          .catch((err: any) => {
            ElNotification({
              message: err?.response?.data?.message || err.message,
              type: 'error',
            })
          })
          .finally(() => {
            form.loading = false
          })
      } else {
        register({ username, code, password, againPwd })
          .then((res: any) => {
            if (res?.code === 200) {
              ElNotification.success(res.msg)
              if (!formEl) return
              formEl.resetFields()
            } else ElNotification.error(res.msg)
          })
          .catch((err: any) => {
            ElNotification({
              message: err?.response?.data?.message || err.message,
              type: 'error',
            })
          })
          .finally(() => {
            form.loading = false
          })
      }
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.login {
  .login-container {
    min-height: calc(80vh - 60px);
  }
}
</style>
