import { TFHttpSend } from "src/typings/getRequest";
export default {
   stuGrandsList:{url:'/api/course/courses/contents/{content_id}/student-scores',method:'GET'},//课程分析学生成绩列表
   grandsStatisAnalysis:{url:'/api/course/courses/contents/{content_id}/scored-analysis',method:'GET'}//成绩统计分析
}

export interface IteacherAcademicAnalysis {
    stuGrandsList:TFHttpSend
    grandsStatisAnalysis:TFHttpSend
}

export const MODULE_NAME = 'teacherAcademicAnalysis'