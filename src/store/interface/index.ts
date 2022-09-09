export interface Main {
  token: string | undefined
  userInfo: User | null
  drawer: boolean
  recipient: User | null
  readyRecipient: User | null
  sessionList: Array<any>
  sessionSelectId: number
  socket: any
  conversitionList: Array<any>
  sendInfo: User | null
  emojiList: Array<{ title: string; icon: string }>
  chatScrollbar: any
  chatEditor: any
  editor: any
  editorData: string
  openMusic: boolean
  tipMusic: HTMLMediaElement | null
}

export class User {
  id: number
  username: string
  onlineStatus: boolean
  mobile: string
  nick_name: string
  avatar: string
  constructor(
    id: number,
    username: string,
    onlineStatus: boolean,
    mobile: string,
    nick_name: string,
    avatar: string
  ) {
    this.id = id
    this.username = username
    this.onlineStatus = onlineStatus
    this.mobile = mobile
    this.nick_name = nick_name
    this.avatar = avatar
  }
}
export default class Conversition {
  sendId: number
  recipientId: number
  content: string
  type: number
  status: number
  timestamp: string | number
  createAt: string
  isRead: boolean
  avatar: string
  constructor(
    sendId: number,
    recipientId: number,
    content: string,
    type: number,
    status: number,
    timestamp: string,
    createAt: string,
    isRead: boolean,
    Avatar: string
  ) {
    this.sendId = sendId
    this.recipientId = recipientId
    this.content = content
    this.type = type
    this.status = status
    this.timestamp = timestamp
    this.createAt = createAt
    this.isRead = isRead
    this.avatar = Avatar
  }
}
