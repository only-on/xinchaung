import { TFHttpSend } from "src/typings/getRequest";
export default {
  getLatelyExperimentalList: { url: `/student-train/latest`, method: "GET", },
  // 考核
  releaseScore: { url: `/teacher-train/train-score-release`, method: "POST", dataType: 'json' },
  exportScore: { url: `/teacher-train/train-score-export`, method: "POST", dataType: 'urlencoded' },
  showExperimentalNote: { url: `/teacher-train/show-note`, method: "GET" },
  resetExperimentalServer: { url: `/teacher-train/reset-server`, method: "POST", dataType: 'json' },
  setExperimentalScore: { url: `/teacher-train/set-score`, method: "POST", dataType: 'json' },
  // 资源
  delResource: { url: `/teacher-train/del-upload`, method: "GET", dataType: 'json' },
  uploadResource: { url: `/teacher-train/upload-resource`, method: 'POST', dataType: 'formdata' },
  getResourceList: { url: '/teacher-train/get-resource-list', method: 'POST', dataType: 'json' },

  // 新建实训  选择环境
  ImageList: { url: `/api/env/containers`, method: 'GET' },
  trainUpload: { url: `/teacher-train/upload`, method: 'POST', dataType: 'formdata' },
  // 列表
  trainList: { url: '/teacher-train/index', method: "GET" },
  changeStatus: { url: '/teacher-train/change-status', method: "GET" },
  trainComplex: { url: '/teacher-train/train-complex', method: "GET" },
  trainArchived: { url: '/teacher-train/train-archived', method: "GET" },
  trainDeleted: { url: '/teacher-train/train-deleted', method: "GET" },

  // 编辑实训
  trainDetailInfo: { url: '/teacher-train/details', method: "GET" }, // 获取详情
  trainUploadImage: { url: '/teacher-train/upload', method: "POST", dataType: 'formdata' },
  saveModefiy: { url: '/teacher-train/set-content', method: "POST" },
  saveTrainGuide: { url: '/teacher-train/train-content-update', method: "POST", dataType: 'formdata' },
  savepptModefiy: { url: '/teacher-train/set-content', method: "POST", dataType: 'formdata' },
  studentGroup: { url: '/teacher-train/set-student', method: "GET" },
  unSelectStudentGroup: { url: '/teacher-train/get-student-list', method: "GET" },
  unSelectClassGroup: { url: '/teacher-train/get-classes-list', method: "GET" },
  selectEnvirList: { url: '/api/env/containers', method: "GET" },
  saveSelectEnvir: { url: '/teacher-train/save-server', method: "POST", dataType: 'formdata' },

  // 创建实训
  uploadsFile: { url: `/api/instance/uploads/file`, method: 'POST', dataType: 'formdata' },
  createTrain: { url: '/teacher-train/set-content', method: "POST", dataType: 'formdata' },
  selectConfig: { url: '/api/env/images/config', method: "GET" },
  selectMirror: { url: '/api/env/images', method: "GET" },
  createMirrorTemplate: { url: '/api/env/topos/stores', method: "POST", dataType: 'json' },
  createMirror: { url: '/api/content/content/template', method: "POST" },
  saveMirrorEnvir: { url: '/teacher-train/save-env', method: "POST" },
  saveTrainContents: { url: '/teacher-train/save-train-contents', method: "POST", dataType: 'formdata' },// 保存实训内容
  // /teacher-train/get-resource-list
  resourceList: { url: '/teacher-train/get-resource-list', method: "POST", dataType: 'formdata' },
  deleteResource: { url: '/teacher-train/del-upload', method: "POST", dataType: 'formdata' },
  // 分组信息
  groupList: { url: '/api/course/student/group/list', method: "GET" },
  // 自动分组
  automaticGroup: { url: '/teacher-train/student-group', method: "POST" },
  // 获取分组的和没分组的学生列表
  getGroupAndNogroupStu: { url: '/teacher-train/get-student', method: "POST" }
}



export interface ITeacherTrainAps {
  getLatelyExperimentalList: TFHttpSend;
  releaseScore: TFHttpSend;
  exportScore: TFHttpSend;
  showExperimentalNote: TFHttpSend;
  resetExperimentalServer: TFHttpSend;
  setExperimentalScore: TFHttpSend;
  delResource: TFHttpSend;
  uploadResource: TFHttpSend;
  getResourceList: TFHttpSend;
  ImageList: TFHttpSend;
  trainUpload: TFHttpSend;
  trainList: TFHttpSend;
  changeStatus: TFHttpSend;
  trainComplex: TFHttpSend;
  trainArchived: TFHttpSend;
  trainDeleted: TFHttpSend;
  trainDetailInfo: TFHttpSend,
  trainUploadImage: TFHttpSend,
  saveModefiy: TFHttpSend,
  saveTrainGuide: TFHttpSend,
  savepptModefiy: TFHttpSend,
  studentGroup: TFHttpSend,
  uploadsFile: TFHttpSend,
  createTrain: TFHttpSend,
  selectConfig: TFHttpSend,
  selectMirror: TFHttpSend,
  createMirrorTemplate: TFHttpSend,
  createMirror: TFHttpSend,
  saveMirrorEnvir: TFHttpSend,
  saveTrainContents: TFHttpSend,
  resourceList: TFHttpSend,
  deleteResource: TFHttpSend,
  unSelectClassGroup: TFHttpSend
}

export const MODULE_NAME = 'teacherTrain'