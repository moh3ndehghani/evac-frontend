export default class MessengerClient
{
    connection:any;
    isConneting:boolean;
    port:number;
    timeout:number;
    client:any;
    temp:Map<string,{res:Function,rej:Function}>=new Map<string,{res:Function,rej:Function}>();
    constructor(port:number,timeout?:number)
    {
        this.init(port,timeout)
    }
    async reconnect()
    {
        setTimeout(() => {
            this.init(this.port)
        }, 3000);
    }
    async close(id:string,name:string)
    {
        if(!this.isConneting) throw 'lost connection'
        this.connection.sendUTF(JSON.stringify(new SemaphoreMessage({id,name,state:States.Closed})) );
    }
    async open(name:string,timeout?:number):Promise<string>
    {

        if(!this.isConneting) throw 'lost connection'
        return new Promise((res,rej)=>{
            let id=uuid.v4();
            this.temp.set(id,{res,rej});
            this.connection.sendUTF(JSON.stringify(new SemaphoreMessage({id,name,timeout:this.timeout??timeout,state:States.Opened})) );
        })

    }
    init(port:number,timeout?:number)
    {
        this.port=port;
        this.timeout=timeout;
        this.client=new WebSocket("wss://evacsocket.origamicore.com" , 'echo-protocol');

        this.client.on('connect',  (connection:any)=> {
             console.log('>>>>>opend');
             this.isConneting=true;
             this.connection=connection
             connection.on('error', (error:any)=> {
                 console.log("Connection Error: " + error.toString());
                 this.isConneting=false;
                 this.reconnect()
             });
             connection.on('close', ()=> {
                console.log('closed');
                this.isConneting=false;
                this.reconnect()
             });
             connection.on('message', (message:any)=> {
                 if (message.type === 'utf8') {
                    let msg=JSON.parse(message.utf8Data);
                    let id=msg.id;
                    if(this.temp.has(id))
                    {
                        if(msg.state==States.Timeout)
                        {
                            this.temp.get(id).rej('Timeout')
                            this.temp.delete(id)
                        }
                        if(msg.state==States.Opened)
                        {
                            this.temp.get(id).res(id)
                        }
                        if(msg.state==States.Closed)
                        {
                            this.temp.delete(id)
                        }
                    }
                 }
             });
        });
        this.client.on('connectFailed', ( )=> {
             console.log('closed');
             this.isConneting=false;
             this.reconnect()
        });
    }
}
