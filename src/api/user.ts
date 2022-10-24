import request from './request'

// 发送邮箱验证码
export function sendMailCode(data: any) {
  return request({
    url: '/api/sendMailCode',
    method: 'post',
    data,
  })
}

// 注册
export function register(data: any) {
  return request({
    url: '/api/register',
    method: 'post',
    data,
  })
}

// 登录
export function login(data: any) {
  return request({
    url: '/api/login',
    method: 'post',
    data,
  })
}

// 获取用户列表
export function userList() {
  return request({
    url: '/api/getUserList',
    method: 'get',
  })
}

// 用户头像上传接口
export const uploadAvatarUrl =
  import.meta.env.VITE_BASE_API + '/api/uploadAvatar'

// 更改用户资料
export function updateUserInfo(data: any) {
  return request({
    url: '/api/updateUserInfo',
    method: 'post',
    data,
  })
}
