export type FileChunk = {
  range: string
  disposition: string
  length: number
  chunk: any
  percent: number
  size: number
  index: number
  key: string
  failed: boolean
}

export type UploadRequestParameter = {
  url: string
  body: any
  onProgress?(e: ProgressEvent): void
  onBefore(xhr: XMLHttpRequest): void
}

export type OperateAction = 'resume' | 'delete' | 'pause' | 'upload' | 'serial' | 'parallel' | 'validate' | 'merged'


export const staticMessage = {
  deleteFailed: '移除上传的切片的过程中服务器端返回了异常，程序意外中止',
  cancelTooltip: '取消后，服务器将会删除已经上传的文件切片',
  fileNameHasChinese: '文件名中不能含有中文',
  serialUploadFailure: '串行上传中断，当前的切片序号是：',
  parallelUploadFailure: '并行上传失败，当前的切片的序号是：',
  resumeFailure: '恢复上传失败，可能的原因是：',
  pleaseSelectFile: '请选择文件',
  noSelectableFile: '没有选择文件，请选择需要上传的文件',
  chunkUploadFailed: '切片上传失败',
  chunkSizeText: '切片大小(bytes)',
  chunkIndexText: '切片索引',
  chunkUploadStatusText: '上传进度与状态',
  chunkDetailTitleText: '文件上传进度(点击空白处退出)',
  fileNameText: '文件名称：',
  fileSizeText: '文件大小：',
  uploadTotalProgressText: '上传总进度',
  lookUploadDetailText: '查询进度详情',
  uploadButtonText: '上传',
  resumeButtonText: '恢复',
  pauseButtonText: '暂停',
  deleteButtonText: '删除',
  placeholderText: '上传文件',
  hintText: '仅支持上传xxx格式的文件',
  chunkProgressText: '分片进度',
  showText: '',
  showTextPaw: '',
}

export const transformByte = (val: number) => {
  return Number((val / 1024 / 1024).toFixed(2))
}
export const getWorkerJsPath = () => {
  // const baseUrl = process.env.NODE_ENV !== 'development' ? process.env.BASE_URL : '/'

  // const NODE_ENV = process.env.NODE_ENV;
  // const BASE_URL = process.env.BASE_URL

  // return `${NODE_ENV === 'development' ? '/' : BASE_URL}upload-breakpoint-continuation.hash.js`
  return `/worker/upload-breakpoint-continuation.hash.js`
}


// 文件拆分 chunk
export const createFileChunk = (file: File, size: number) => {
  let index = 0
  let chunkSize = 0
  const fileChunkList: FileChunk[] = []
  const length = file.size

  while (chunkSize < length) {
    const limit = chunkSize + size
    const chunk = file.slice(chunkSize, limit)

    fileChunkList.push({
      length,
      chunk,
      percent: 0,
      index,
      range: `bytes ${chunkSize}-${limit}/${length}`,
      disposition: `attachment; filename="${file.name}"`,
      size: chunk.size,
      key: `chunk-${index}`,
      failed: false,
    })

    index++
    chunkSize += size
  }

  return fileChunkList
}

export const fileChunkUploaded = (chunk: FileChunk) => {
  if (chunk) {
    chunk.percent = 100
    chunk.failed = false
  }
}

export const fileChunkIsUploaded = (chunk: FileChunk): boolean => {
  return chunk && chunk.percent >= 100
}

// 上传
export const createRequestException = (level: string, xhr: XMLHttpRequest) => {
  // return new Error(`文件上传[${level}]: ${xhr.status}-${xhr.statusText}`)
  console.log(xhr)

  return new Error(`文件上传${level}`)
}

// 获取请求返回值
export const getResponseBody = (xhr: XMLHttpRequest) => {
  var text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

// 文件上传
export const request = ({ url, body, onProgress, onBefore }: UploadRequestParameter) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e: ProgressEvent) => {
      if (onProgress) {
        onProgress(e)
      }
    }

    xhr.open('POST', url)
    onBefore(xhr)

    xhr.send(body)

    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        // return reject(createRequestException('server-error', this))
        return reject(createRequestException('服务器错误！！', this))
      }

      resolve(getResponseBody(this))
    }

    xhr.onerror = function () {
      // const ex = createRequestException('failed', xhr)
      const ex = createRequestException('失败！！', xhr)
      reject(ex)
    }

    xhr.onabort = function () {
      // const ex = createRequestException('abort', xhr)
      const ex = createRequestException('终止成功！', xhr)

      reject(ex)
    }
  })
}

