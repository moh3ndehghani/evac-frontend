import webSocket from "src/boot/web-socket.js"

export default async ({ app }:any) => {
  app.use(webSocket)
}
