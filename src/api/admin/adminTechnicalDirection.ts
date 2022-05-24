import { TFHttpSend } from "src/typings/getRequest";
export default {
    // 技术方向管理列表接口
    technicalDirectionList: { url: '/api/content/admin/categories', method: "GET", dataType: 'formdata' },
    dirListDetail: { url: '/api/content/admin/categories/{category_id}', method: "GET", dataType: 'formdata' },
    deleteDetailList: { url: '/api/content/admin/categories/{category_id}', method: "DELETE", dataType: 'formdata' },
    /**方向规划新增接口 */
    technologyAdd: { url: '/api/plan/category/技术方向/tags', method: "POST"},//技术
    classAdd: { url: '/api/plan/category/课程方向/tags', method: "POST"},//课程
    occupationAdd: { url: ' /api/plan/category/职业方向/tags', method: "POST"},//职业
    LabelingrulesAdd: { url: '/api/plan/tags', method: "POST"},//标签
    /**方向规划列表接口 */
    technologyList: { url: '/api/plan/category/技术方向/tags', method: "GET", dataType: 'json' },//技术
    classList: { url: '/api/plan/category/课程方向/tags', method: "GET", dataType: 'json' },//课程
    occupation: { url: ' /api/plan/category/职业方向/tags', method: "GET", dataType: 'json' },//职业
    LabelingrulesList: { url: '/api/plan/tags', method: "GET", dataType: 'json' },//标签
    /**方向规划标签修改接口*/
    technologyedit:{ url: '/api/plan/category/技术方向/tags/{ID} ', method: "PUT", dataType: 'json' },//技术
    classedit: { url: '/api/plan/category/课程方向/tags/{ID}', method: "PUT", dataType: 'json' },//课程
    occupationedit: { url: ' /api/plan/category/职业方向/tags/{ID}', method: "PUT", dataType: 'json' },//职业
    Labelingruleseditt: { url: '/api/plan/tags/{ID}', method: "PUT", dataType: 'json' },//标签 
      /**方向规划标签删除接口*/
    technologydel:{ url: '/api/plan/category/技术方向/tags/{ID} ', method: "DELETE", dataType: 'json' },//技术
    classdel: { url: '/api/plan/category/课程方向/tags/{ID}', method: "DELETE", dataType: 'json' },//课程
    occupationdel: { url: ' /api/plan/category/职业方向/tags/{ID}', method: "DELETE", dataType: 'json' },//职业
    Labelingrulesdel: { url: '/api/plan/tags/{ID}', method: "DELETE", dataType: 'json' },//标签
}

export interface IadminTechnicalDirection {
    technicalDirectionList: TFHttpSend
    dirListDetail: TFHttpSend
}