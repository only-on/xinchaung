// 虚拟机链接信息配置
type  VmConnectSetting={
    VNCPASS:string
    VNCPORT:string
    VNCPROTOC:"ws" |"wss"
    SSHHOST:string
}

const isDev=process.env.NODE_ENV == 'development' ? true : false;
export const getVmConnectSetting:VmConnectSetting={
    VNCPASS:'vncpassword',
    VNCPORT:"8888",
    VNCPROTOC:'ws',
    SSHHOST:isDev?'http://192.168.101.150':location.protocol+"//"+location.hostname
}

export default {
    getVmConnectSetting
}