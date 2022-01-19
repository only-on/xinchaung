import request from "src/api/index"
const courseApi = request.teachCourse

/**
 * 
 * @param params {course_id:课程id}
 * @description 获取课程详情
 */
export async function getCourseDetailApi(params: { course_id: number }) {
    return await courseApi.getCourseDetailApi({ urlParams: params })
}

/**
 * @description 修改课程基本信息
 * @param params {urlParams:{course_id:课程id},param:{课程基本信息}}
 */
export async function updateCourseBaseApi(param: any) {
    return await courseApi.updateCourseBaseApi({ ...param })
}

/**
 * @description 获取教学指导
 */
export async function getDataSetGuideApi(params: {
    "query[course_id]": number,
    "query[chapter_id]": number,
    "pageinfo[index]": number,
    "pageinfo[size]": number
}) {
    return await courseApi.getDataSetGuideApi({ param: params })
}