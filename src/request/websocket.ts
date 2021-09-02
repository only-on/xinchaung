import Wmc from "js-wm"


let conn:any
    
function getQueryString(name: string) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function wsConnect(options:any) {
    
    let schema = 'ws'
    if (getQueryString('wss')) {
        schema = 'wss'
    }
    try {
        // 创建Wm对象示实例
        conn = Wmc({
            url: schema + options.url,
            // 设置open事件处理器
            open: (ev:Event) => {
                console.log('[open]', ev)
            },
            // 设置close事件处理器
            close: (ev:CloseEvent) => {
                console.log('[close]', ev)
                options.close(ev)
            },
            // 设置error事件处理器
            error: (ev:Event) => {
                console.log('[error]', ev)
                wsConnect(options)
            },
            // 设置message事件处理器
            message: (ev:MessageEvent) => {
                console.log('[message]', ev)
                if (options.message) {
                    options.message(ev)
                }
               
            }
        })
    } catch (e:any) {
        console.error(e)
        throw new Error(e)
    }
    return conn
}

function disconnect() {
    // 断开连接
    conn.close()
}
function joinRoom(roomId:string) {
    // 加入房间
    conn.join(roomId)
}

function leaveRoom(roomId:string) {
    // 离开房间
    conn.leave(roomId)
}

function register(userId:string) {
    // 自注册身份标识
    conn.register(userId)
}

function sendToTarget(target:string, targetType:string, targetContent:string) {
    // 点对点发送消息
    conn.send(target, targetType, targetContent)
}

function broadcast(message:string) {
    // 发送广播
    conn.broadcast(message)
}

export {
    wsConnect,
    disconnect,
    joinRoom,
    leaveRoom,
    register,
    sendToTarget,
    broadcast
}

export default {
    wsConnect,
    disconnect,
    joinRoom,
    leaveRoom,
    register,
    sendToTarget,
    broadcast
}