import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 镜像列表列表接口
    imageList: { url: '/api/env/images', method: "GET" },
}

export interface IadminImage {
    imageList: TFHttpSend
}