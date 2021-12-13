import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 镜像列表列表接口
    imageList: { url: '/api/env/images', method: "GET" },
    //批量删除
    deleteImage: { url: '/api/env/images/deletes', method: 'POST' }
}

export interface IadminImage {
    imageList: TFHttpSend
    deleteImage: TFHttpSend
}