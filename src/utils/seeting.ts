// 虚拟机链接信息配置
type  VmConnectSetting={
    VNCPASS:string
    VNCPORT:string
    VNCPROTOC:"ws" |"wss"
}

export const getVmConnectSetting:VmConnectSetting={
    VNCPASS:'vncpassword',
    VNCPORT:"8888",
    VNCPROTOC:'ws',
}

export default {
    getVmConnectSetting
}