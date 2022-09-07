import request from '@/api/request'

// 上传文件
export function uploadFile(data: any) {
  return request({
    url: '/api/uploadFile',
    method: 'post',
    data,
  })
}
