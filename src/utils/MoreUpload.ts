import SparkMD5 from 'spark-md5'
import { UUID } from 'src/utils/uuid'
import { message } from "ant-design-vue";
// 上传配置
export interface UploadOptions {
  startUploadURL: string
  multiUploadURL: string
  mergeUploadUrl: string
  file: File
  chunkSize: number
  // objectKey: string
  processFun: any
  startUploadFun: any
  endUploadFun: any
  // abortFun: any
  chunkFun?: any
  data_set_id: string
  eruptNum: number
  uploadFileUuid?: string
}
export interface FileChunk {
  range: string
  disposition: string
  length: number // 总文件长度
  upload_file: any
  percent: number
  size: number
  chunk: number
  key: string
  failed: boolean
  status?: 'start' | 'loading' | 'end'
}
// http请求参数
export interface UploadRequestParameter {
  url: string
  body: any
  onProgress?(e: ProgressEvent, xhr: XMLHttpRequest): void
  onBefore?(xhr: XMLHttpRequest): void
  onError?: any
}
// 文件拆分
export const createFileChunk = (file: File, size: number) => {
  let chunk = 0
  let chunkSize = 0
  const fileChunkList: FileChunk[] = []
  const length = file.size

  while (chunkSize < length) {
    const limit = chunkSize + size
    const upload_file = file.slice(chunkSize, limit)
    fileChunkList.push({
      length,
      upload_file,
      percent: 0,
      chunk,
      range: `bytes ${chunkSize}-${limit}/${length}`,
      disposition: `attachment; filename="${file.name}"`,
      size: upload_file.size,
      key: `chunk-${chunk}`,
      failed: false,
    })

    chunk++
    chunkSize += size
  }

  return fileChunkList
}
// 处理http返回数据
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
// xmlhttprequest请求
export const request = ({ url, body, onProgress, onBefore, onError }: UploadRequestParameter) => {
  return new Promise((resolve: any) => {
    var xhr = new XMLHttpRequest()
    xhr.upload.onprogress = (e: ProgressEvent) => {
      if (onProgress) {
        onProgress(e, xhr)
      }
    }
    xhr.open('post', url)
    if (onBefore) {
      onBefore(xhr)
    }

    xhr.send(body)
    xhr.onload = function () {
      resolve(getResponseBody(this))
    }
    xhr.onerror = function () {
      // const ex = createRequestException('failed', xhr)
      onError(true)
      // const ex = new Error(`出错了`)
      console.error('出错了')
      // reject(ex)
    }

    xhr.onabort = function () {
      // const ex = createRequestException('abort', xhr)
      // const ex = new Error('终止成功！')
      // console.log('终止成功！')
      // reject(ex)
    }
  }).catch(err => {
    console.error(err)
  })
}
export default function Upload(option: UploadOptions) {
  // console.log(121)
  const ObjectKey = 'key' + UUID.uuid4()
  let md5String: any = ''
  let upload_id: any = ''
  let currentIndex: any = 0
  const uploadStatus = []
  var FilesChunk: any = []
  // 封装http请求

  // 文件生成md5码
  function fileToMd5() {
    return new Promise((resolut: any, reject: any) => {
      // console.log(1)
      const file = option.file
      const chunkSize = option.chunkSize || 2096963
      var running = false //running用于判断是否正在计算md5
      //这里假设直接将文件选择框的dom引用传入
      if (running) {
        return
      }

      var blobSlice = File.prototype.slice
      var chunks = Math.ceil(file.size / chunkSize)
      var currentChunk = 0
      var spark = new SparkMD5()
      var fileReader = new FileReader()
      function loadNext() {
        var start = currentChunk * chunkSize,
          end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsBinaryString(blobSlice.call(file, start, end))
      }
      fileReader.onload = function (e: any) {
        spark.appendBinary(e.target.result)
        currentChunk += 1
        if (currentChunk < chunks) {
          option.chunkFun(file.name, chunks, currentChunk, ObjectKey)
          loadNext()
        } else {
          running = false
          const str = spark.end()
          option.chunkFun(file.name, chunks, currentChunk, ObjectKey)
          resolut(str)
          // return spark.end() // 完成计算，返回结果
        }
      }
      fileReader.onerror = function () {
        running = false
        reject()
      }
      running = true
      loadNext()
    })
  }

  // 开启分片上传
  function startUpload() {
    // console.log(2)
    return new Promise((resolve: any, reject: any) => {
      // console.log(md5String)

      if (md5String != '') {
        const body = new FormData()
        body.append('file_name', option.file.name)
        body.append('md5', md5String)
        body.append('data_id', option.data_set_id)
        if (option.uploadFileUuid) {
          body.append('uuid', option.uploadFileUuid)
        }
        request({ url: option.startUploadURL, body })
          .then((res: any) => {
            if (res.code === 200) {
              resolve(res.data.upload_id)
            } else {
              reject(new Error('获取上传upload_id错误'))
            }
          })
          .catch()
      } else {
        reject(new Error('缺少md5码，出错了'))
      }
    }).catch()
  }
  // 分片上传
  function multiUpload(FilesChunk: any, i?: any) {
    return new Promise((resolve, reject) => {
      const index = i||i==0 ? i : currentIndex
      const body = new FormData()
      body.append('upload_id', upload_id)
      body.append('upload_file', FilesChunk[index].upload_file)
      body.append('chunk', index)
      // if (option.uploadFileUuid) {
      body.append('md5', md5String)
      // }
      option.eruptNum++
      // console.log(currentIndex)

      request({
        url: option.multiUploadURL,
        body,
        onBefore: (xhr: XMLHttpRequest) => {
          // console.log(xhr)
        },
        onProgress: (e: ProgressEvent, xhr: XMLHttpRequest) => {
          option.processFun(e, { fileMd5: ObjectKey, index: index, xhr: xhr }, FilesChunk.length)
        },
        onError: () => {
          // if (e) {
          multiUpload(FilesChunk, index)
          // }
        },
      })
        .then(async (res: any) => {
          if (res.code === 200) {
            option.eruptNum--
            uploadStatus.push(true)
            if (option.eruptNum < 5 && currentIndex < FilesChunk.length - 1) {
              currentIndex++
              // console.log(currentIndex)
              // console.log('FilesChunk.length',FilesChunk.length)
              await multiUpload(FilesChunk)
            }
            if (currentIndex === FilesChunk.length - 1) {
              // console.log('currentIndex === FilesChunk.length - 1', currentIndex === FilesChunk.length - 1)
              resolve(currentIndex)
            }
          } else {
            console.log(res)
            console.log(currentIndex)
            console.log('FilesChunk.length',FilesChunk.length)
            message.warning('第' + index + '分片上传失败');
            reject(new Error(res))
          }
        })
        .catch(err => {
          option.eruptNum = 6
          // console.error(err)
          reject(new Error(err))
          return
        })
    }).catch()
  }
  // 合并分片
  function mergeUpload(part_count: any, type: string) {
    console.log(type)
    const body = new FormData()
    body.append('data_id', option.data_set_id)
    body.append('file_size', (option.file as any).size)
    body.append('part_count', part_count)
    body.append('upload_id', upload_id)
    body.append('md5', md5String)
    request({
      url: option.mergeUploadUrl,
      body,
    })
      .then((res: any) => {
        if (res.code === 200) {
          // console.log('分片文件合并成功')

          option.endUploadFun(ObjectKey, res.data)
        } else if (res.code === 20000) {
          const queue: any = []
          res.data?.chunk.forEach((v: number) => {
            queue.push(multiUpload(FilesChunk, v))
          })
          Promise.all(queue).then(() => {
            mergeUpload(FilesChunk.length, 'mergeUpload')
          }).catch(() => {
            mergeUpload(FilesChunk.length, 'mergeUploadError')
          })
        }
      })
      .catch()
  }
  // 切片开始上传
  async function multiUploadStart() {
    option.eruptNum = 1
    FilesChunk = createFileChunk(option.file, option.chunkSize)
    const queue: any = []
    queue.push(multiUpload(FilesChunk))
    if (FilesChunk.length > 3) {
      currentIndex++
      queue.push(multiUpload(FilesChunk))
      currentIndex++
      queue.push(multiUpload(FilesChunk))
    }

    // currentIndex++
    // queue.push(multiUpload(FilesChunk))
    // console.log(queue)

    Promise.all(queue).then(() => {
      // console.log('分片上传成功')

      mergeUpload(FilesChunk.length, 'multiUploadStart')
    })
    // timer = setInterval(() => {
    //   if (FilesChunk.length - 1 === currentIndex && uploadStatus.length === FilesChunk.length) {
    //     // console.log('完成')

    //     clearInterval(timer)
    //   }
    // }, 1000)
  }

  async function startFun() {
    try {
      // // console.log(option)
      if (option.file && option.file.size === 0) {
        // console.log('文件大小不能为空')
        return
      }
      option.startUploadFun(ObjectKey, option.file.name, option.file.size)
      // 文件转md5码
      md5String = await fileToMd5()
      // console.log('md', md5String)

      upload_id = await startUpload()
      // console.log('m2', upload_id)
      multiUploadStart()
    } catch (error) {
      // console.log(error)
    }
  }
  startFun()
  return fileToMd5
}
