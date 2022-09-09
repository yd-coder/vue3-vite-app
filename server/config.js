module.exports = {
  // jwt认证配置
  jwtConfig: {
    // 加密和解密 Token 的秘钥
    secret: 'yudong',
    // 加密方式
    algorithms: ['HS256'],
    // token过期时间
    expiresIn: '48h',
  },
}
