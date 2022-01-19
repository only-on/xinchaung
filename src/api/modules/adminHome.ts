import { TFHttpSend } from "src/typings/getRequest";

export default {
    getStatisticsApi: { url: "/env/index", method: "GET" },
    getNodeIpControlApi: { url: "/env/get-control", method: "GET", dataType: 'json' },
    getGpuInfoApi: { url: "/env/get-gpu-info", method: "GET" },
    getNodeGraphAllApi:{url:"/env/get-node-graph-all", method: "GET" },
    getNodeGraphApi:{url:"/env/get-node-graph", method: "POST" , dataType: 'formdata' }
}

export interface IAdminHome {
    getStatisticsApi: TFHttpSend
    getNodeIpControlApi: TFHttpSend
    getGpuInfoApi: TFHttpSend
    getNodeGraphAllApi:TFHttpSend
    getNodeGraphApi:TFHttpSend
}