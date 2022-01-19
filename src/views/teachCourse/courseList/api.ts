import request from "src/api/index"

const courseApi=request.teachCourse

/**
 * @description 获取课程列表
 * @param params    name: 
                    state: 1
                    page: 1
                    limit: 11
                    direction: 500006
 */
export async function getCourseListApi(params:any) {
    return courseApi.getCourseListApi({param:params})
}

/**
 * @description 开启实验指导
 * @param params courseId: 501697
                 guideStat: 0
 */
export async function settingGuideStateApi(params:any) {
    return courseApi.settingGuideStateApi({param:params})
}

/**
 * @description 复制课程
 * @param params courseId:课程id
 */

export async function copyCourseApi(urlParams:{course_id:number}) {
    return courseApi.copyCourseApi({urlParams:urlParams})
}

/**
 * @description 删除课程
 * @param params id:课程id
 */
export async function deleteCourseApi(params:{id:number}) {
    return courseApi.deleteCourseApi({urlParams:params})
}
/**
 * @description 保存到我的实验
 */
export async function saveToCourseApi(params:{courseId:number}) {
    return await courseApi.saveToCourseApi({param:params})
}

/**
 * @description 归档
 */
export async function setArchiveCourseApi(params:{courseId:number}) {
    return await courseApi.setArchiveCourseApi({param:params})
}