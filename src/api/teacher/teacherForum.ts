import { TFHttpSend } from "src/typings/getRequest";

export default {
  createForum: {url: `/api/forum/create`, method: "PUT",dataType: 'json'},
  getHotLabels: {url: `/api/forum/hot-tags`, method: "GET"},
  getForumList: {url: `/api/forum/list/{keyword}`, method: "GET"},
  getAttendList: {url: `/api/forum/attend/{keyword}`, method: "GET"},
  getForumTags: {url: `/api/category/帖子类型/tags`, method: "GET"},
  getReplyList: {url: `/api/forum/{id}/reply/list`, method: "GET"},
  replyForum: {url: `/api/forum/reply`, method: "POST",dataType: 'json'},
  deleteForum: {url: `/api/forum/forum/{id}`, method: "DELETE"},
  deleteReply: {url: `/api/forum/Reply/{id}`, method: "DELETE"},
}

export interface ITeacherForum {
  createForum: TFHttpSend;
  getHotLabels: TFHttpSend;
  getForumList: TFHttpSend;
  getForumTags: TFHttpSend;
  getReplyList: TFHttpSend;
  replyForum: TFHttpSend;
  getAttendList: TFHttpSend;
  deleteForum: TFHttpSend;
  deleteReply: TFHttpSend;
}

export const MODULE_NAME = 'teacherForum'




