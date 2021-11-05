import request from "src/api/index"
const courseApi=request.teachCourse

export async function getCourseDetailApi(params:{course_id:number}) {
    return await courseApi.getCourseDetailApi({urlParams:params})
}