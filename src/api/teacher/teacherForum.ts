import { TFHttpSend } from "src/typings/getRequest";

export default {
  createForum: {url: `/api/forum/create`, method: "POST",dataType: 'json'},
  getHotLabels: {url:`/api/forum/hot-labels`,method: "GET"},
  getForumList: {url:`/api/forum/list`,method: "GET"},
  getForumTags: {url:`/api/category/帖子类型/tags`,method: "GET"},
}

export interface ITeacherForum {
  createForum: TFHttpSend;
  getHotLabels: TFHttpSend;
  getForumList: TFHttpSend;
  getForumTags: TFHttpSend;
}

export const MODULE_NAME = 'teacherForum'




