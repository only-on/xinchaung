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
 * @description 获取章节习题统计
 */
 export async function getChapterExerciseAnalysisApi(urlParams:{chapter_id:number}) {
    return await courseApi.getChapterExerciseAnalysisApi({urlParams:urlParams})
}
/**
 * @description 获取所有课程所有章节
 */
export async function getAllChapterListApi(params:{type:string,limit:number},urlParams:{course_id:number}) {
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

/**
 * @description 删除章节或实验
 */
export async function deleteChapterApi(urlParams:{course_id:number,chapter_id:number}) {
    return await courseApi.deleteChapterApi({urlParams:urlParams})
}

/**
 * @description 获取实验列表
 */
export async function  getContentListApi(params:{type?:number,course_id:number,limit:number,page:number,name?:string,content_category_id?:number|undefined}) {
    return await courseApi.getContentListApi({param:params})
}

/**
 * @description 获取实训列表
 */
 export async function  getTrainListApi(params:{type?:number,course_id:number,limit:number,page:number,name?:string}) {
    return await courseApi.getTrainListApi({param:params})
}

/**
 * @description 获取视频列表
 */
 export async function  getVideosListApi(params:{course_id:number,limit:number,page:number,dataset_id?:number|undefined}) {
    return await courseApi.getVideosListApi({param:params})
}

/**
 * @description 获取文档列表
 */
 export async function  getDocumentsListApi(params:{course_id:number,limit:number,page:number,dataset_id?:number|undefined}) {
    return await courseApi.getDocumentsListApi({param:params})
}

/**
 * @description 获取数据集目录树
 */
export async function getDataSetCatalogApi(params:{type:number,name?:string}) {
    return await courseApi.getDataSetCatalogApi({param:params})
}

/**
 * @description 获取课程实验详情
 */

export async function getContentDetailApi(params:{id:number}) {
    return await courseApi.getContentDetailApi({param:params})
}

/**
 * @description 是否对学生开发资源
 */
export async function  isDisparkApi(params:{is_visible:boolean},urlParams:{course_id:number,experiment_id:number}) {
    return await courseApi.isDisparkApi({param:params,urlParams:urlParams})
}

/**
 * @description 获取实验报告
 * @param {owner_type:string,owner_id:number} owner_type "cc_mid"
 */
export async function getExperimentReportApi(params:FormData) {
    return await courseApi.getExperimentReportApi({param:params})
}

/**
 * @description 实验添加习题
 */
 export async function contentAddExerciseApi(params:{question_ids:number[]},urlParams:{content_id:number}) {
    return await courseApi.contentAddExerciseApi({urlParams:urlParams,param:params})
}
/**
 * @description 解除实验关联习题
 */
export async function deleteContentExerciseApi(params:{relation_ids:number[]}) {
    return await courseApi.deleteContentExerciseApi({param:params})
}

/**
 * @description 获取实验习题
 */
 export async function getContentExerciseApi(params:{limit:number,page:number},urlParams:{content_id:number}) {
    return await courseApi.getContentExerciseApi({param:params,urlParams:urlParams})
}

/**
 * @description 获取实验习题统计
 */
 export async function getContentExerciseAnalysisApi(urlParams:{content_id:number}) {
    return await courseApi.getContentExerciseAnalysisApi({urlParams:urlParams})
}

/**
 * @description 获取实验报告模板
 */
export async function getReportListApi(params:{name:string,page:number,pageSize:number}) {
    return await courseApi.getReportListApi({param:params})
}

/**
 * @description 保存实验报告模板
 * @param   owner_type: cc_mid
            owner_id: 523319
            template_id: 64
 */
 export async function saveReportTemplateApi(params:{owner_type:string,owner_id:number,template_id:number}) {
    return await courseApi.saveReportTemplateApi({param:params})
}