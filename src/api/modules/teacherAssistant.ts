import { TFHttpSend } from "src/typings/getRequest";
export default{
  getAssistantList:{url:`/assistant`,method: "GET",},
  addAssistant:{url:`/assistant/add`,method: "POST",dataType: 'json'},
  delAssistant:{url:`/assistant/delall?id={ids}`,method: "GET",dataType: 'json'},
  changeStatus:{url:`/assistant/teacher-bind`,method: "POST",dataType: 'json'},
}

export interface ITeacherAssistant {
  getAssistantList: TFHttpSend;
  addAssistant: TFHttpSend;
  delAssistant: TFHttpSend;
  changeStatus: TFHttpSend;
}

export const MODULE_NAME = 'teacherAssistant'