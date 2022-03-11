import { TFHttpSend } from "src/typings/getRequest";

export default {
  createForum: {url: `/api/forum/create`, method: "PUT",dataType: 'json'},
  getHotLabels: {url: `/api/forum/hot-labels`, method: "GET"},
  getForumList: {url: `/api/forum/list`, method: "GET"},
  getForumTags: {url: `/api/category/帖子类型/tags`, method: "GET"},
  getReplyList: {url: `/api/forum/{id}/reply/list`, method: "GET"},
  replyForum: {url: `/api/forum/reply`, method: "POST",dataType: 'json'},
}

export interface ITeacherForum {
  createForum: TFHttpSend;
  getHotLabels: TFHttpSend;
  getForumList: TFHttpSend;
  getForumTags: TFHttpSend;
  getReplyList: TFHttpSend;
  replyForum: TFHttpSend;
}

export const MODULE_NAME = 'teacherForum'




