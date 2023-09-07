import { log } from "console"
import { GameState } from "src/enums/GameState"
import { ResponseType } from "src/enums/ResponseType"
import {appStore} from "src/stores/app"

export default class WebSocketClient{
  static baseUrl:string= 'wss://evacsocket.origamicore.com'
  static id:number = 0
  static temp:any = {}
  static client:WebSocket = new WebSocket(this.baseUrl , 'echo-protocol')
  static token:string | null = window.localStorage.getItem("token")

  static async callApiSocket(domain:string,service:any,param:any,callBack:any=null){
    this.id++;
    const obj:any = {
      domain ,
      service ,
      param ,
      id:this.id ,
      token:this.token
    }
    if(callBack){
      this.temp[this.id.toString()]={callBack}
      this.client.send(JSON.stringify(obj));
    }
    else{
      return new Promise((res,rej)=>{
        this.temp[this.id.toString()]={res,rej}
        this.client.send(JSON.stringify(obj));
      })
    }
  }

  static async connectToServer(){
    let newModel = await this.callApiSocket('game','getGame',{})
    this.reloadGame(newModel)
    this.callApiSocket('game','listen',{},(data:any)=>{
      const store = appStore()
      let dt = data.data.response.data
      if(!dt)return
      if(dt.game.state == GameState.TurnChanging){
        store.changingTurn = true
        setTimeout(() => {
          store.changingTurn = false
        } , 5000)
      }
      console.log('event:',dt.game );
      this.reloadGame(dt.game)
    })
  }

  static messages(data:any){
    var id = data.id.toString();
    if(data.session?.token){
      this.token=data.session?.token;
    }
    if(this.temp[id])
    {
      if(this.temp[id].callBack)
      {
        this.temp[id].callBack(data)
      }
      else
      {
        if(data.error)this.temp[id].rej(data.error)
        else this.temp[id].res(data.data.response.data)
      }
    }
  }

  static reloadGame(newModel:any){
    const store = appStore()
    store.game = newModel
  }


}
