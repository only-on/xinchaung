import request from "src/api/index"
const courseApi = request.teachCourse


/**
 * @description 获取课程实验树
 */
export async function getCourseTreeApi(urlParams: { course_id: number }) {
    return await courseApi.getCourseTreeApi({ urlParams: urlParams })
}

/**
 * @description 修改课程实验tree
 */
export async function updateChapterApi(urlParams: { course_id: number, chapter_id: number }, param: { chapter_name: string }) {
    return await courseApi.updateChapterApi({ urlParams: urlParams, param: param })
}

/**
 * @description 获取章节详情
 */

export async function getChapterDetailApi(urlParams: { course_id: number, chapter_id: number }) {
    return await courseApi.getChapterDetailApi({ urlParams: urlParams })
}

/**
 * @description 保存章节概述
 */
export async function saveChapterIntro(urlParams: { course_id: number, chapter_id: number }, param: { chapter_des: string }) {
    return await courseApi.saveChapterIntroApi({ urlParams: urlParams, param: param })
}

/**
 * @description 获取备课资料
 */
export async function getPreparingDataApi(params: any) {
    return await courseApi.getPreparingDataApi({ param: { ...params } })
}

/**
 * 
 * @description 获取教学指导
 */
export async function getDataSetGuideApi(params: any) {
    return await courseApi.getDataSetGuideApi({ param: { ...params } })
}

/**
 * @description 获取数据集
 */
export async function getDataSetListApi(params: { type: number, name: string }) {
    return await courseApi.getDataSetListApi({ param: params })
}

/**
 * @description 获取数据集文件列表
 */
export async function getDataSetFileApi(params: {
    course_id: number,
    chapter_id: number,
    dataset_id: number |undefined,
    file_name: string,
    page: number,
    pageSize: number
}) {
    return await courseApi.getDataSetFileApi({ param: params })
}

/**
 * @description 保存备课资料
 */
export async function savePrepareLessonsFileApi(params:{course_id: number,
    chapter_id: number,
    item_id: number}) {
    return await courseApi.savePrepareLessonsFileApi({param:{...params}})
}

/**
 * @description 移除备课资料
 */

export  async function removePrepareLessonsFileApi(params:{aid: number}) {
    return await courseApi.removePrepareLessonsFileApi({param:params})
}

/**
 * @description 上传数据集文件
 * @ params 教学指导6，备课5
 */
export async function uploadFileApi(params:{dataset:File,pageType:number,dataId:number}) {
    return await courseApi.uploadFileApi({param:params})
}

/**
 * @description 添加文件到数据集
 */
export async function addDataSetFileApi(params:{
    "items[0][file_name]": string
    "items[0][file_url]":string
    "items[0][suffix]": string
    "items[0][size]": number
    dataset_id: number
}) {
    return await courseApi.addDataSetFileApi({param:params})
}

