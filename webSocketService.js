class webSocketService {
  constructor (options) {
    const { url, heartCheckOptions, onOpenCallBack, onMessageCallBack, onErrorCallBack } = options
    // 心跳检查配置
    const heartCheckDefaultOptions =  {
      open: false,  // 是否开启心跳检查
      message: 'heartCheck',  // 心跳检查传输数据
      time: 20*1000 // 心跳检查频率时间
    }
    this.url = url
    // 心跳检查相关
    this.heartCheckOptions = Object.assign(heartCheckDefaultOptions, heartCheckOptions)
    this.onOpenCallBack = onOpenCallBack
    this.onMessageCallBack = onMessageCallBack
    this.onErrorCallBack = onErrorCallBack
    this.lockReconnect = false
    this.timeoutObj = null // 外层心跳倒计时
    this.serverTimeoutObj = null // 内层心跳检测
    this.timeoutnum = null // 断开 重连倒计时
  }
  createWebSocket = () => {
    try {
      this.ws = new WebSocket(this.url)
      this.initEventHandle(this.url)
    } catch (e) {
      // this.reconnect(this.url);
      this.onErrorCallBack(e)
    }
  };
  closeWebSocket = () => {
    this.lockReconnect = true
    this.ws.close()
    this.timeoutnum && clearTimeout(this.timeoutnum)
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    console.log('结束')
    // this.initEventHandle()
  };
  initEventHandle = () => {
    this.ws.onclose = () => {
      console.log(' webSocket ====> 连接关闭 ')
      // this.reconnect(this.url);
    }
    this.ws.onerror = () => {
      console.log(' webSocket ====> 连接失败 ')
      this.onErrorCallBack()
      // this.reconnect(this.url)
    }
    this.ws.onopen = () => {
      console.log(' webSocket ====> 连接成功 ')
      this.onOpenCallBack()
      this.heartCheckOptions.open && this.startHeart() // 开启心跳
    }
    this.ws.onmessage = event => {
      this.messageCallBack(event)
    }
  };
  messageCallBack = event => {
    if (event.data) {
      if (event.data === 'heartCheck') {
        // console.log(event.data)
      } else {
        this.onMessageCallBack(event.data)
      }
      this.heartCheckOptions.open && this.startHeart() // 收到服务器信息，心跳重置
    }
  };
  reconnect = () => {
    if (this.lockReconnect) return
    this.lockReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    this.timeoutnum && clearTimeout(this.timeoutnum)
    this.timeoutnum = setTimeout(() => {
      console.log(' webSocket ====> 正在重连 ')
      this.lockReconnect = false
      this.createWebSocket(this.url)
    }, 2000)
  };
  startHeart = () => {
    // 开启心跳
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(() => {
      if (this.ws.readyState === 1) {
        // 如果连接正常
        console.log('heart check...')
        this.ws.send(JSON.stringify({ action: this.heartCheckOptions.message }))
      } else {
        // 否则重连
        this.reconnect(this.url)
      }
      this.serverTimeoutObj = setTimeout(() => {
        this.ws.close()
      }, this.heartCheckOptions.time)
    }, this.heartCheckOptions.time)
  };
  send = content => {
    (this.ws && this.ws.readyState === 1) && this.ws.send(content)
  };
}
export default webSocketService
