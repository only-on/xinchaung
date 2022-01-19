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
 * @description 删除课程成果视频
 */
export async function deleteVideoLogApi(params:{video_id:number}) {
    return await courseApi.deleteVideoLogApi({urlParams:params})
}

/**
 * @description 查看课程成果
 */
export async function lookCourseResultApi(params:{page:number,limit:number},urlParams:{course_id:number}){
    return await courseApi.lookCourseResultApi({param:params,urlParams:urlParams})
}

/**
 * @description 获取初始端课程列表
 */
export async function getInitCourseListApi(params:{"search[course_name]":string,page:number,limit:number}) {
    return await courseApi.getInitCourseListApi({param:params})
}

/**
 * @description 获取归档课程列表
 */
export async function getArchiveCourseListApi(params:{"search[course_name]":string,"search[user_name]":string,"search[archive_time]":string,page:number,limit:number}) {
    return await courseApi.getArchiveCourseListApi({param:params})
}

/**
 * @description 获取职业方向列表
 */
export async function getCareerDirectionListApi(params:{"search[name]":string,page:number,limit:number}) {
    return await courseApi.getCareerDirectionListApi({param:params})
}

/**
 * @description 添加职业方向
 */
export async function addCareerDirectionApi(params:{name:string}) {
    return await courseApi.addCareerDirectionApi({param:params})
}

/**
 * @description 删除职业方向
 */
export async function deleteCareerDirectionApi(params:{direction_id:number}) {
    return await courseApi.deleteCareerDirectionApi({urlParams:params})
}

/**
 * @description 获取课程方向列表
 */
 export async function getCourseDirectionListApi(params:{"search[name]":string,page:number,limit:number}) {
    return await courseApi.getCourseDirectionListApi({param:params})
}

/**
 * @description 添加课程方向
 */
export async function addCourseDirectionApi(params:{name:string}) {
    return await courseApi.addCourseDirectionApi({param:params})
}

/**
 * @description 删除课程方向
 */
export async function deleteCourseDirectionApi(params:{category_id:number}) {
    return await courseApi.deleteCourseDirectionApi({urlParams:params})
}