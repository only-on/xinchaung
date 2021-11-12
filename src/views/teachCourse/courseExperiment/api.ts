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
 * @param items:[
        {
            file_name:string,
            file_url:string,
            suffix:string,
            size:number
        }
    ],
    dataset_id: number
 */
export async function addDataSetFileApi(params:any) {
    return await courseApi.addDataSetFileApi({param:params})
}

/**
 * @description 获取章节习题
 */
export async function getChapterExerciseApi(params:{limit:number,page:number},urlParams:{chapter_id:number}) {
    return await courseApi.getChapterExerciseApi({param:params,urlParams:urlParams})
}

/**
 * @description 获取习题目录
 */
export async function getExercisesMapApi(params:{initial:number,limit:number}) {
    return await courseApi.getExercisesMapApi({param:params})
}

/**
 * @description 获取题型
 */
export async function getQuestionTypesApi() {
    return await courseApi.getQuestionTypesApi({})
}

/**
 * @description 获取目录习题列表
 */
export async function getPoolsExerciseListApi(params:{type_id:number|undefined,limit:number},urlParams:{pool_id:number|undefined}) {
    return await courseApi.getPoolsExerciseListApi({param:params,urlParams:urlParams})
}

/**
 * @description 创建课程章节
 */
export async function createCourseChapterApi(params:{chapter_name:string},urlParams:{course_id:number}) {
    return await courseApi.createCourseChapterApi({param:params,urlParams:urlParams})
}

/**
 * @description 章节添加习题
 */
export async function chapterAddExerciseApi(params:{question_ids:number[]},urlParams:{chapter_id:number}) {
    return await courseApi.chapterAddExerciseApi({urlParams:urlParams,param:params})
}
/**
 * @description 解除章节关联习题
 */
export async function deleteChapterExerciseApi(params:{relation_ids:number[]}) {
    return await courseApi.deleteChapterExerciseApi({param:params})
}

/**
 * @description 获取所有课程所有章节
 */
export async function getAllChapterListApi(params:{type:string,limit:number,page:number,name:string},urlParams:{course_id:number}) {
    return await courseApi.getAllChapterListApi({param:params,urlParams:urlParams})
}

/**
 * @description 保存章节到课程
 */
export async function saveChapterToCourseApi(params:{
    chapter_ids:number[],
    course_id:number
}) {
    return await courseApi.saveChapterToCourseApi({param:params})
}

/**
 * @description 保存实验到课程章节
 */
 export async function saveContentToChapterApi(params:{
    content_ids:number[],
    type:number // 1章节
},urlParams:{
    course_id:number,
    chapter_id:number
}) {
    return await courseApi.saveContentToChapterApi({param:params,urlParams:urlParams})
}