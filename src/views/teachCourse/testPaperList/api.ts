import request from "src/api/index";
const courseApi=request.teachCourse
/**
 * @description 获取随测列表
 * @param params{
 *                  page: 1
                    pageSize: 15
                    course_id: 501378
 *              }
 */
export async function getTestPaperListApi(params:{page:number,pageSize:number,course_id:number}) {
    return await courseApi.getTestPaperListApi({param:params})
}

/**
 * @description 获取随测学生列表
 * @param params{
 *                  paper_id: number
 *              }
 */
export async function getStudentListApi(params:{paper_id:number}) {
    return await courseApi.getStudentListApi({param:params})
}

export async function updateStudentSelectApi(params:{paper_id:number,no_relation_student:string,relation_student:string}) {
    return await courseApi.updateStudentSelectApi({param:params})
}