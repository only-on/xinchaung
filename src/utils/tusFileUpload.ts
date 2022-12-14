// 创建一个tus实例
import * as tus from "tus-js-client";
import { message } from "ant-design-vue";
import { lStorage } from "./extStorage";
import { readFile } from "src/utils/getFileType";
var state: any = {
  upload: "",
  file: "",
  name: "",
  size: "",
  percent: 0,
};

const FileConfig: any = {};
const env = process.env.NODE_ENV === "development" ? true : false;
const baseChunkSize = 1048576; // 1M-基准分片大小

const largeFileSize = 500 * baseChunkSize; // 大于等于500M的算是大文件
const generalFileSize = 100 * baseChunkSize; // 100-500之间为一般大小文件
const smallFileSize = 20 * baseChunkSize; // 20-100之间为小型文件
// 预设指标
const preset = {
  tiny: {
    chunkSize: baseChunkSize,
    parallelUploads: 1,
  },
  small: {
    chunkSize: 2 * baseChunkSize,
    parallelUploads: 2,
  },
  general: {
    chunkSize: 3 * baseChunkSize,
    parallelUploads: 3,
  },
  large: {
    chunkSize: 5 * baseChunkSize,
    parallelUploads: 4,
  },
};

/**
 * 判断文件大小类型
 * @param size
 */
function judgeFilePreset(size: number) {
  if (size >= largeFileSize) {
    return "large";
  }
  if (size < largeFileSize && size >= generalFileSize) {
    return "general";
  }
  if (size < generalFileSize && size >= smallFileSize) {
    return "small";
  }
  return "tiny";
}

const tusFileUpload = {
  //   在组件onMounted 先调一次init   获取tusd上传的参数
  init: () => {
    const projectPath = lStorage.get("project_path");
    let options = {
      tusd_url: lStorage.get("tusd_url"),
      image_path: lStorage.get("tusd_image_path"),
      document_path: lStorage.get("tusd_document_path"),
      video_path: lStorage.get("tusd_video_path"),
    };
    Object.assign(FileConfig, options);
  },
  onUpload: (file: any, directory: string, accept: string[], data: any) => {
    if (!file) {
      message.warning("请先上传文件！");
      return;
    }
    /**
     * file:文件  directory:tusd上传目录名key accept：允许的文件类型如['md','doc','docx','pdf']
     *
      data:{    //  给父组件响应式数据添加/修改以下属性
      file_url:'',  上传至tusd 的文件地址
      suffix:'',    文件类型
      status:'',    文件上传开始 、结束标记
      name:'',      文件名称
      percent:'', 文件上传进度
      size:'',       文件大小
    }
     */
    const type = file.name.split(".")[file.name.split(".").length - 1].toLowerCase();
    // 视频文件限制在500M以内
    if (type == 'mp4' && file.size > 500*1024*1024) {
      message.warn("请上传小于500M的文件");
      return
    }
    data.percent = 0;
    data.name = file.name;
    data.size = file.size;
    data.suffix = type;
    (data.status = "uploading"), (data.UpState = {});

    // var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    // if (reg.test(state.name)) {
    //   message.warning("文件名不能包含汉字!");
    //   return;
    // }
    if (!accept.includes(type)) {
      message.warning(`只能上传${accept.join("、")}类型文件`);
      return;
    }
    // 创建一个tus实例
    data.UpState.upload = new tus.Upload(file, {
      // tus服务器的上传URL
      // endpoint: env ? "http://192.168.101.221:1080/files/" : "/tusd/files/",
      endpoint: FileConfig.tusd_url,
      // 默认值：Infinity
      chunkSize: preset[judgeFilePreset(data.size)]["chunkSize"],
      // 数组或null
      retryDelays: [0, 3000, 5000, 10000, 20000],
      // 并行数量
      parallelUploads: preset[judgeFilePreset(data.size)]["parallelUploads"],
      // 附加元数据。当(且仅当)创建新的上传时，将传递给服务器。可以用于文件名，文件类型
      metadata: {
        filename: file.name,
        filetype: type,
      },
      // 在所有请求中使用的具有自定义头值的对象。用于添加身份验证细节
      headers: {
        Authorization: "Bearer ...",
        // 自定义的header字段，传给后台：存放上传文件的路径
        "Project-Path": FileConfig[directory],
      },
      // uploadSize: data.size,
      // 出现错误时调用的可选函数。该参数将是一个 Error 实例，其中包含有关所涉及请求​​的附加信息。
      onError: function (error) {
        message.warning("[tusd] Failed because: " + error);
        console.warn("[tusd] Failed because: " + error);
      },
      // 获取进度信息时调用该函数
      onProgress: function (bytesUploaded, bytesTotal) {
        var percent = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        // state.percent = Number(percent);
        data.percent = Number(percent);
      },
      // 上传完成时调用的函数
      onSuccess: function () {
        // console.log(data.UpState.upload, data.UpState.upload.url, "data.UpState.upload data.UpState.upload");
        const name =
          data.UpState.upload.url.split("/")[
            data.UpState.upload.url.split("/").length - 1
          ];
        const type = file.name.split(".")[file.name.split(".").length - 1].toLowerCase();
        const file_url = `${FileConfig[directory]}/${name}.${type}`;
        // console.log(`${FileConfig[directory]}/${name}.${type}`)
        if (type === "mp4") {
          data.tusdVideoUrl = `${
            env ? "/proxyPrefix" : ""
          }/xinchuang-video/${name}.${type}`;
        }
        if (type === "pdf") {
          data.tusdDocumentUrl = `/document/${name}.${type}`;
        }
        if (type === 'md') {
          readFile(file).then((text:any)=>{
            data.mdValue = text;
          })
        }
        data.file_url = file_url;
        data.status = "done";
        // data.UpState={}
      },
    });
    // 检查是否有以前的上传，继续上传。
    data.UpState.upload
      .findPreviousUploads()
      .then(function (previousUploads: any) {
        // 找到以前的上传，选择第一次上传的。
        if (previousUploads.length) {
          data.UpState.upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        data.UpState.upload.start();
      });
    return false;
  },
  remove(data: any) {
    // data  同onUpload()  方法里的data
    data.UpState?.upload?.abort();
    data.UpState = {};
  },
};

export default tusFileUpload;
