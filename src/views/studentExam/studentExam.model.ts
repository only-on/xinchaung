import request from "src/request/getRequest";
import { IExamListParams ,IExamResult,TStartedExam} from "./studentExam.type"

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


export {
    getStudentExaminationlList,
    studentExamResult,
    startExam,
    startedExam  
}


