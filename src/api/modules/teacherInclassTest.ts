import { TFHttpSend } from "src/typings/getRequest";
export default {

    inClasstestList: { url: 'api/v1/xinchuang/question/contents/{content_id}/questions', method: "GET" },
}
export interface IStudentCourseAps {
    inClasstestList:TFHttpSend
}

export const MODULE_NAME = 'teacherInclassTest'