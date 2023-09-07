const baseUrl = 'wss://evacsocket.origamicore.com'
const client = new WebSocket(baseUrl , 'echo-protocol')

const webSocket = {
  install: (app, options) => {
    app.provide("WebSocketClient" , client)
  }
}

export default webSocket
