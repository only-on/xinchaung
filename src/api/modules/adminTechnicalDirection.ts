import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 技术方向管理列表接口
    technicalDirectionList: { url: '/api/content/admin/categories', method: "GET", dataType: 'formdata' },
    dirListDetail: { url: '/api/content/admin/categories/{category_id}', method: "GET", dataType: 'formdata' },
    deleteDetailList: { url: '/api/content/admin/categories/{category_id}', method: "DELETE", dataType: 'formdata' }
}

export interface IadminTechnicalDirection {
    technicalDirectionList: TFHttpSend
    dirListDetail: TFHttpSend
}