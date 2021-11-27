import { TFHttpSend } from "src/typings/getRequest";
export default {
  getLatelyExperimentalList: { url: `/student-train/latest`, method: "GET", },
  // 考核
  releaseScore: { url: `/teacher-train/train-score-release`, method: "POST", dataType: 'json' },
  exportScore: { url: `/teacher-train/train-score-export`, method: "POST", dataType: 'urlencoded' },
  showExperimentalNote: { url: `/teacher-train/show-note`, method: "GET" },
  resetExperimentalServer: { url: `/teacher-train/reset-server`, method: "POST", dataType: 'json' },
  setExperimentalScore: { url: `/teacher-train/set-score`, method: "POST", dataType: 'json' },
  // 考核列表
  assessmentList: { url: `/api/operate/teacherResults/index`, method: "GET" },
  // 考核任务统计
  assessmentStatistic: { url: `/api/operate/teacherResults/evaluate`, method: "GET" },
  // 资源
  delResource: { url: '/api/service/resources/{resource}', method: "DELETE", dataType: 'formdata' },
  uploadResource: { url: `/api/service/resources`, method: 'POST', dataType: 'json' },
  getResourceList: { url: '/api/service/resources', method: "GET", dataType: 'json' },

  // 新建实训  选择环境
  ImageList: { url: `/api/env/containers`, method: 'GET' },
  trainUpload: { url: `/teacher-train/upload`, method: 'POST', dataType: 'formdata' },
  // 列表
  // trainList: { url: '/teacher-train/index', method: "GET" },
  // 我的实训列表
  trainList: { url: '/api/train/trains', method: "GET" },
  // 内置实训列表
  builtTrainList: { url: '/api/train/trains/init', method: 'GET' },
  // 归档实训列表
  archiveTrainList: { url: '/api/train/trains/archive', method: 'GET' },
  changeStatus: { url: '/teacher-train/change-status', method: "GET" },
  // trainComplex: { url: '/teacher-train/train-complex', method: "GET" },
  // 复用实训
  trainComplex: { url: '/api/train/trains/resuse/{train}', method: "POST" },
  // 归档实训
  fileTrain: { url: '/api/train/trains/archived', method: "POST", dataType: 'json' },
  // 删除实训
  deleteTrain: { url: '/api/train/trains/{train}', method: "DELETE" },
  trainArchived: { url: '/teacher-train/train-archived', method: "GET" },
  trainDeleted: { url: '/teacher-train/train-deleted', method: "GET" },

  // 编辑实训
  trainDetailInfo: { url: '/api/train/trains/{train}', method: "GET" }, // 获取详情
  trainUploadImage: { url: '/teacher-train/upload', method: "POST", dataType: 'formdata' },
  // saveModefiy: { url: '/teacher-train/set-content', method: "POST" },
  saveModefiy: { url: '/api/train/trains/{train}', method: "PUT" },//编辑实训基本信息
  // saveTrainGuide: { url: '/teacher-train/train-content-update', method: "POST", dataType: 'formdata' },
  savepptModefiy: { url: '/teacher-train/set-content', method: "POST", dataType: 'formdata' },
  // studentGroup: { url: '/teacher-train/set-student', method: "GET" }, //学生列表接口
  studentGroup: { url: '/api/arrange/students/search', method: "GET" }, //学生列表接口
  classGroup: { url: '/api/arrange/classes/search', method: "GET" }, //班级列表接口
  classMembersList: { url: '/api/arrange/classes/members', method: "GET" },//班级成员列表 
  unSelectStudentGroup: { url: '/api/arrange/students', method: "GET" },//待选的学生列表
  unSelectClassGroup: { url: '/api/arrange/classes', method: "GET" },//待排课的班级列表
  scheduleStudent: { url: '/api/arrange/students', method: "POST", dataType: 'json' },//学生排课
  deleteScheduleStu: { url: '/api/arrange/students/{id}', method: "DELETE" },//删除学生排课
  resetPassWord: { url: '/teacher-train/reset-student-pwd', method: "POST" },//初始化密码
  deleteScheduleStuMany: { url: '/api/arrange/students/delete', method: "POST" },//批量删除学生排课
  scheduleClass: { url: '/api/arrange/classes', method: "POST", dataType: 'json' },//班级排课
  deleteScheduleClass: { url: '/api/arrange/classes/delete', method: "POST" },//删除班级排课
  selectEnvirList: { url: '/api/env/containers', method: "GET" },
  saveSelectEnvir: { url: '/teacher-train/save-server', method: "POST", dataType: 'formdata' },

  // 创建实训
  uploadsFile: { url: `/api/instance/uploads/file`, method: 'POST', dataType: 'formdata' },
  createTrain: { url: '/api/train/trains', method: "POST", dataType: 'formdata' },
  selectConfig: { url: '/api/env/images/config', method: "GET" },
  selectMirror: { url: '/api/env/images', method: "GET" },
  createMirrorTemplate: { url: `/api/train/trains/env/{train}`, method: "PUT", dataType: 'json' },
  createMirror: { url: '/api/content/content/template', method: "POST" },
  // 创建第三步
  saveTrainContents: { url: '/api/train/trains/content/{train}', method: "PUT", dataType: 'json' },// 保存实训内容
  resourceList: { url: '/api/service/resources', method: "GET", dataType: 'json' },
  deleteResource: { url: '/api/service/resources/{resource}', method: "DELETE", dataType: 'formdata' },

  createTrainLastStep: { url: '/api/train/trains/succeed/{train}', method: "PUT" },//创建实训最后一步


  automaticGroup: { url: '/api/arrange/groups/auto', method: "POST", dataType: 'json' }, // 自动分组
  deleteGroupListItem: { url: '/api/arrange/groups/{group}', method: "DELETE" },//删除分组
  usersTobeGrouped: { url: '/api/arrange/groups/search', method: "GET" },//待分组排课用户列表
  userHasGrouped: { url: '/api/arrange/groups/members', method: "GET" },//已经分组用户列表
  manualGrouping: { url: '/api/arrange/groups', method: "POST", dataType: 'json' },//手动分组
  groupList: { url: '/api/arrange/groups', method: "GET" },//分组列表
  groupMembersList: { url: '/api/arrange/groups/members', method: "GET" },//显示分组成员列表
  editGroupStu: { url: '/api/arrange/groups/{group}', method: "PUT", dataType: 'json' },//编辑分组
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
  builtTrainList: TFHttpSend;
  archiveTrainList: TFHttpSend;
  changeStatus: TFHttpSend;
  trainComplex: TFHttpSend;
  fileTrain: TFHttpSend;
  deleteTrain: TFHttpSend;
  trainArchived: TFHttpSend;
  trainDeleted: TFHttpSend;
  trainDetailInfo: TFHttpSend,
  trainUploadImage: TFHttpSend,
  saveModefiy: TFHttpSend,
  saveTrainGuide: TFHttpSend,
  savepptModefiy: TFHttpSend,
  studentGroup: TFHttpSend,
  classGroup: TFHttpSend,
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
  assessmentList: TFHttpSend
  assessmentStatistic: TFHttpSend
}

export const MODULE_NAME = 'teacherTrain'