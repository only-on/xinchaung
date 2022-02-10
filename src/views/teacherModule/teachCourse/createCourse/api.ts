import request from "src/api/index"

const courseApi=request.teachCourse
/**
 * 
 * @description 创建课程
 * @param {name:string,is_available?:number,start_time:string,end_time:string,introduce:string,course_category_id:string,course_direction_id:string,url:string}
 */
export async function createCourseBaseApi(params:FormData) {
    return await courseApi.createCourseBaseApi({param:params})
}

/**
 * 
 * @description 更新课程
 * @param 
 */
export async function updateCourseBaseApi(params:{name:string,is_available?:number,start_time:string,end_time:string,introduce:string,course_category_id:string,course_direction_id:string,url:string,is_open?:number},urlParams:{course_id:number}) {
    return await courseApi.updateCourseBaseApi({param:params,urlParams:urlParams})
}