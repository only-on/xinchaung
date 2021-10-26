import { TFHttpSend } from "src/typings/getRequest";
export default{
  getAssistantList:{url:`/assistant/index`,method: "POST",dataType: 'json'},
  getAssistantDetail: {url:`/assistant/view?id={id}`, method: 'GET',dataType: 'json'},
  addAssistant:{url:`/assistant/create`,method: "POST",dataType: 'json'},
  updateAssistant:{url:`/assistant/update?id={id}`,method: "POST",dataType: 'json'},
  delAssistant:{url:`/assistant/delall?id={ids}`,method: "GET",dataType: 'json'},
  changeStatus:{url:`/assistant/teacher-bind`,method: "POST",dataType: 'json'},
}

export interface ITeacherAssistantApis {
  getAssistantList: TFHttpSend;
  getAssistantDetail: TFHttpSend;
  addAssistant: TFHttpSend;
  updateAssistant: TFHttpSend;
  delAssistant: TFHttpSend;
  changeStatus: TFHttpSend;
}

export const MODULE_NAME = 'teacherAssistant'