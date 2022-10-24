import { defineStore } from 'pinia'
import { Main } from '@/store/interface'
import emojiList from '@/json/emoji.json'
import Conversition from '@/store/interface/index'
import edit from 'wangeditor'
import Cookies from 'js-cookie'
import { nextTick } from 'vue'

export const useMainStore = defineStore({
  id: 'Main',
  state: (): Main => {
    return {
      token: Cookies.get('Authorization'),
      userInfo: null, // 用户信息
      drawer: false,
      recipient: null, // 当前聊天对象
      readyRecipient: null,
      sessionList: [], // 会话列表
      sessionSelectId: 0, // 会话列表选中id
      socket: null, // socket实例
      conversitionList: [], // 聊天记录列表
      sendInfo: null,
      emojiList: emojiList, // 表情列表
      chatScrollbar: null,
      chatEditor: null, // 富文本编辑器ref
      editor: null, // 富文本编辑器实例
      editorData: '', // 富文本编辑器数据
      openMusic: true, // 是否打开提示音
      tipMusic: null, // 提示音
    }
  },
  //类似于computed 可以帮我们去修饰我们的值
  getters: {
    personalInfo(state) {
      if (!state.userInfo) {
        return JSON.parse(localStorage.getItem('userInfo') || '{}')
      } else {
        return state.userInfo
      }
    },
  },
  //可以操作异步 和 同步提交state
  actions: {
    // token持久化
    setToken(data: any) {
      Cookies.set('Authorization', data)
      this.token = data
    },
    // 声音提示
    playMusic() {
      if (this.tipMusic != null && this.openMusic) {
        this.tipMusic.currentTime = 0
        this.tipMusic.play()
      }
    },
    // 更新个人资料
    updatePersonalInfo(data: any) {
      this.userInfo = data
      localStorage.setItem('userInfo', JSON.stringify(data))
    },
    // 设置会话窗口到达底部
    toBottom() {
      const timer = setTimeout(() => {
        this.chatScrollbar?.setScrollTop(9999)
        clearTimeout(timer)
      }, 300)
    },
    // 修改信息已读状态
    changeReaded(id: number) {
      let userConversition = this.conversitionList.filter(
        (x) => x.sendId == id && x.recipientId == this.userInfo?.id && !x.isRead
      )
      if (userConversition.length) {
        userConversition.map((x) => {
          x.isRead = true
        })
      }
      const query = {
        sendId: id,
      }
      this.socket.emit('changeMsgRead', query)
    },
    // 初始化编辑器
    initEditor() {
      if (this.editor != null) {
        // 销毁富文本编辑器实例
        this.editor.destroy()
        this.editor = null
      }
      // 创建富文本编辑器实例
      this.editor = new edit('#chatEditor')
      // 配置富文本编辑器禁止全屏
      this.editor.config.showFullScreen = false
      // 配置富文本编辑器允许自动聚焦
      this.editor.config.focus = true

      // 配置富文本编辑器自带菜单栏为空
      this.editor.config.menus = []

      // 监听富文本编辑器内容变化
      this.editor.config.onchange = (html: any) => {
        this.editorData = html
      }

      // 限制图片上传最多1张
      this.editor.config.uploadImgMaxLength = 1
      // 添加上传本地图片接口
      this.editor.config.customUploadImg = function (
        files: any, // files 是 input 中选中的文件列表
        insert: Function // insert 是获取图片 url 后，插入到编辑器的方法
      ) {
        insert(files)
      }
      // 聚焦操作
      nextTick(() => {
        this.editor.create()
        this.editor.txt.html(this.editorData)
      })
    },
    // 本地新增信息记录
    sendLocal(conversition: Conversition) {
      this.conversitionList.push(conversition)
      this.toBottom()
    },
    // websocket发送消息
    sendInfos(conversition: Conversition) {
      let data = {
        // 发送内容
        conversition,
      }
      if (this.socket != null) {
        this.socket.emit('sendMsg', data)
      }
    },
    // 注销
    logout() {
      Cookies.remove('Authorization')
      this.$patch((state) => {
        state.userInfo = null
        state.token = undefined
        state.sessionList = []
        state.sessionSelectId = 0
        localStorage.removeItem('userInfo')
      })
      if (this.socket != null) {
        this.socket.disconnect()
      }
    },
  },
})
