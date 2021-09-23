import { TFHttpSend } from "src/typings/getRequest";
export default{
  getLatelyExperimentalList:{url:`/student-train/latest`,method: "GET",},
  // 考核
  releaseScore:{url:`/teacher-train/train-score-release`, method: "POST", dataType: 'json'},
  exportScore:{url:`/teacher-train/train-score-export`, method: "POST", dataType: 'urlencoded'},
  showExperimentalNote:{url:`/teacher-train/show-note`, method: "GET"},
  resetExperimentalServer:{url:`/teacher-train/reset-server`, method: "POST", dataType: 'json'},
  setExperimentalScore:{url:`/teacher-train/set-score`, method: "POST", dataType: 'json'},
  // 资源
  delResource:{url:`/teacher-train/del-upload`, method: "GET", dataType: 'json'},
  uploadResource: {url: `/teacher-train/upload-resource`,method: 'POST',dataType: 'formdata'}
}

export interface ITeacherExperimentallAps {
  getLatelyExperimentalList: TFHttpSend;
  releaseScore: TFHttpSend;
  exportScore: TFHttpSend;
  showExperimentalNote: TFHttpSend;
  resetExperimentalServer: TFHttpSend;
  setExperimentalScore: TFHttpSend;
  delResource: TFHttpSend;
  uploadResource: TFHttpSend;
}

export const MODULE_NAME = 'teacherExperimental'