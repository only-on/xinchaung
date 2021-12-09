import request from "src/api/index"

const courseApi=request.adminCourse

/**
 * @description 获取课程列表
 * @param params    search: 
                    course_name:
                    user_name
                    course_state
                    page: 1
                    limit: 11
 */
export async function getTeacherCourseListApi(params:any) {
    return await courseApi.getTeacherCourseListApi({param:params})
}

/**
 * @description 清除录屏记录
 */
export async function clearVideoApi(params:{course_id:number}) {
    return await courseApi.clearVideoApi({urlParams:params})
}

/**
 * @description 批量归档
 */
export async function updateArchiveApi(params:{course_ids:any[]}) {
    return await courseApi.updateArchiveApi({param:params})
}
/**
 * @description 删除课程
 * @param params id:课程id
 */
export async function deleteCourseApi(params:{course_ids:any[]}) {
    return courseApi.deleteCourseApi({param:params})
}


/**
 * @description 批量清除录屏记录
 */
export async function clearVideosApi(params:{course_ids:any[]}) {
    return await courseApi.clearVideosApi({param:params})
}

/**
 * @description 查看课程成果
 */
export async function lookCourseResultApi(params:{page:number,limit:number},urlParams:{course_id:number}){
    return await courseApi.lookCourseResultApi({param:params,urlParams:urlParams})
}