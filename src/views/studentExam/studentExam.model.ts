import request from "src/request/getRequest";
import { IExamListParams ,IExamResult,TStartedExam,TSubmitAnswer} from "./studentExam.type"

const studentExam = request.studentExam;

/**
 * @description 获取试卷列表
 * @param params {param:{},urlParams:{}}
 */
async function getStudentExaminationlList(params: IExamListParams) {
   const data=  await studentExam
        .studentExaminationlList({...params})
        console.log(data);
        
    return data
}

/**
 * @description 成绩详情
 * @param params {urlParams:{student_id,paper_id}}
 */
async function studentExamResult(urlParams:IExamResult) {
   return await  studentExam.studentExamResult({urlParams})
}

/** 
 * @description 获取开始考试
 * @param params {urlParams:{student_id}}
*/

async function startExam(params:any) {
    return await studentExam.startExam(params)
}



/** 
 * @description 开始考试
 * @param params {urlParams:{student_id,exam_id}}
*/

async function startedExam(params:TStartedExam) {
    return await studentExam.startedExam(params)
}


/** 
 * @description 提交考试答案
 * @param params {param:{relation_id:习题学生关联ID,answers:[答案集合]},urlParams:{student_id,exam_id}}
*/

async function submitAnswer(params:TSubmitAnswer) {
    return await studentExam.submitAnswer(params)
}

/** 
 * @description 结束考试
 * @param params {urlParams:{student_id:习题学生关联ID,exam_id:[答案集合]}}
*/

async function endStudentAnswer(params:TStartedExam) {
    return await studentExam.endAnswer(params)
}

export {
    getStudentExaminationlList,
    studentExamResult,
    startExam,
    startedExam,
    submitAnswer,
    endStudentAnswer  
}


