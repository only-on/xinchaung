// 创建一个tus实例
import  *  as  tus  from  "tus-js-client" 
function tusFileUpload(file:any){
  var upload:any = new tus.Upload(file, {
    // tus服务器的上传URL
    endpoint: "http://localhost:1080/files/",
    // 数组或null
    retryDelays: [0, 3000, 5000, 10000, 20000],
    // 在所有请求中使用的具有自定义头值的对象。用于添加身份验证细节
    headers: {
      Authorization: "Bearer ...",
       // 自定义的header字段，传给后台：存放上传文件的路径
      'Copy-Path': '....'
    },
    // 默认值：Infinity
    chunkSize: Infinity,
    // 附加元数据。当(且仅当)创建新的上传时，将传递给服务器。可以用于文件名，文件类型
    metadata: {
        filename: file.name,
        filetype: file.type
    },
    // 出现错误时调用的可选函数。该参数将是一个 Error 实例，其中包含有关所涉及请求​​的附加信息。
    onError: function(error) {
        console.log("Failed because: " + error)
    },
    // 获取进度信息时调用该函数
    onProgress: function(bytesUploaded, bytesTotal) {
        var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
        console.log(bytesUploaded, bytesTotal, percentage + "%")
    },
    // 上传完成时调用的函数
    onSuccess: function() {
        // console.log("Download %s from %s", upload.file.name, upload.url)
        
        console.log("Download %s from %s", upload)
        return upload
    }
  })
  
  // 检查是否有以前的上传，继续上传。
  upload.findPreviousUploads().then(function (previousUploads:any) {
    // 找到以前的上传，选择第一次上传的。
    if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0])
    }
  
    // Start the upload
    upload.start()
  })

}

export default tusFileUpload


