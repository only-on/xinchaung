import { TFHttpSend } from "src/typings/getRequest";
export default {

    inClasstestList: { url: 'api/v1/xinchuang/question/contents/{content_id}/questions', method: "GET" },//随堂测试列表
    addques:{url:'api/v1/xinchuang/question/contents/{content_id}/questions',method:'POST',dataType: 'json'},//新增习题
    achiStatistics:{url:'api/v1/xinchuang/question/contents/{content_id}/scored-analysis',method:'GET'}
}
export interface IStudentCourseAps {
    inClasstestList:TFHttpSend
    addques:TFHttpSend
    achiStatistics:TFHttpSend
}

export const MODULE_NAME = 'teacherInclassTest'