import request from "src/request/getRequest";
import { IExamListParams ,IExamResult} from "./studentExam.type"

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


export {
    getStudentExaminationlList,
    studentExamResult  
}


