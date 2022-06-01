import { TFHttpSend } from "src/typings/getRequest";
export default {

    inClasstestList: { url: 'api/v1/xinchuang/question/contents/{content_id}/questions-with-answer', method: "GET" },//随堂测试列表
    addques:{url:'api/v1/xinchuang/question/contents/{content_id}/questions',method:'POST',dataType: 'json'},//新增习题
    achiveStatistics:{url:'api/v1/xinchuang/question/contents/{content_id}/scored-analysis',method:'GET'},//随测统计
    achivelist:{url:'api/v1/xinchuang/question/contents/{content_id}/student-scores',method:'GET'},//成绩列表
    deleteInclassTestItem:{url:'api/v1/xinchuang/question/contents/questions/{question_id}',method:'DELETE'}//删除随测习题
}
export interface IStudentCourseAps {
    inClasstestList:TFHttpSend
    addques:TFHttpSend
    achiStatistics:TFHttpSend
    achivelist:TFHttpSend
    deleteInclassTestItem:TFHttpSend
}

export const MODULE_NAME = 'teacherInclassTest'