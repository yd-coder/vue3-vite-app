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
