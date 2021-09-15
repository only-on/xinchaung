import request from "src/request/getRequest";

const vmApi = request.vmApi

export interface FilesVersion {
    type: string
    opType: string
    taskId: number
    version_id: number
    file_name: string | null
}

export interface WebideBase {
    type: string
    opType: string
    taskId: number
}


export interface ICreateVersion extends WebideBase {
    version_name: string
}

export interface ISwitchFile extends WebideBase {
    file_id: string
}

export interface ISaveFile extends ISwitchFile {
    file_content: string
}
/**
 * 
 * @param params WebideBase类型
 * @description 获取实验详情
 */

function getTaskInfo(params: WebideBase) {
    return vmApi.taskDetailApi({ param: params })
}

/**
 * 
 * @param params {type	    是	string	学习类别：course:课程实验/实训；train:实训	course
          opType	是	string	操作类型:start/continue/rebuild/test	0
          taskId	是	int	课程实验id/实训id	0 }
 * @description 获取版本列表
 */
function getVersionList(params: WebideBase) {
    return vmApi.webideVersionsApi({ param: params })
}

/**
 * @param  params{} type	是	string	学习类别：course:课程实验/实训；train:实训null	course
            opType	是	string	操作类型:start/continue/rebuild/test	0
            taskId	是	int	课程实验id/实训id	0
            version_id	是	int	版本id	0
            file_name	否	sting	默认打开文件的文件名	null}
 * @description 获取文件列表
 */
function getFileList(params: FilesVersion) {
    return vmApi.cryptsFilesVersionApi({ param: params })
}

/**
 * @description 创建版本
 * @param params type	是	string	学习类别：course:课程实验/实训；train:实训	course
                 opType	是	string	操作类型:start/continue/rebuild/test	0
                 taskId	是	int	课程实验id/实训id	0
                 version_name	是	string	版本名称	0
 */
function createVersion(params: ICreateVersion) {
    return vmApi.createVersionApi({ param: params })
}

/**
 * @description 版本文件切换
 * @param params type	是	string	学习类别：course:课程实验/实训；train:实训	course
                opType	是	string	操作类型:start/continue/rebuild/test	0
                taskId	是	int	课程实验id/实训id	0
                file_id	是	string	版本文件id	0
 */
function switchFile(params: ISwitchFile) {
    return vmApi.cryptsSwitchFileApi({ param: params })
}

/**
 * @description 版本文件切换
 * @param params type	是	string	学习类别：course:课程实验/实训；train:实训	course
                opType	是	string	操作类型:start/continue/rebuild/test	0
                taskId	是	int	课程实验id/实训id	0
                file_id	是	string	版本文件id	0
 */
function saveFile(params: ISaveFile) {
    return vmApi.cryptsSaveFileApi({ param: params })
}


export {
    getTaskInfo,
    getVersionList,
    getFileList,
    createVersion,
    switchFile,
    saveFile
}