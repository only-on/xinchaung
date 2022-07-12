// 虚拟机链接信息配置
type  VmConnectSetting={
    VNCPASS:string
    VNCPORT:string
    VNCPROTOC:"ws" |"wss"
    SSHHOST:string
    SSHPORT: number
    SSHConnectSpace: number
    SSHConnectNum: number
}

const isDev=process.env.NODE_ENV == 'development' ? true : false;
export const getVmConnectSetting:VmConnectSetting={
    VNCPASS:'vncpassword',
    VNCPORT:"8888",
    VNCPROTOC:'ws',
    SSHHOST:isDev?'http://192.168.101.221':location.protocol+"//"+location.hostname,
    SSHPORT: 2230,
    SSHConnectSpace: 5000,
    SSHConnectNum: 5
}

export default {
    getVmConnectSetting
}