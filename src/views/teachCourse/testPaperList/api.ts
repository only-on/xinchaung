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

// 更新选择学生
export async function updateStudentSelectApi(params:{paper_id:number,no_relation_student:string,relation_student:string}) {
    return await courseApi.updateStudentSelectApi({param:params})
}

/**
 * @description 删除试卷
 */
export async function deleteFollowApi(params:{id:number,"paper_data[paper_status]":any}) {
    return await courseApi.deleteFollowApi({param:params})
}

/**
 *  @description 获取随堂测试基本信息
 * @param id 试卷id
 */
export async function getDefaultPaperInfoApi(params:{id:number}) {
    return await courseApi.getDefaultPaperInfoApi({param:params})
}

/**
 * @description 成绩统计
 */

export async function getAchievStatisApi(params:{page:number,id:number}) {
    return await courseApi.getAchievStatisApi({param:params})
}

/**
 * @description 更新试题批注
 * @param
 */
export async function editQuestionApi(params:any) {
    return await courseApi.editQuestionApi({param:params})
}