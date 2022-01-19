import { TFHttpSend } from "src/typings/getRequest";

export default{
  pubIndex:{url:`/forum/pub-index`,method: "GET"},
  attend:{url:'/forum/attend',method:'GET'},
  myself:{url:`/forum/myself`,method: "GET"},
  delateCard:{url:`/forum/delete`,method: "POST"},
  handleReply:{url:`/forum/list-reply`,method: "POST",dataType:'json'},
  createForum:{url:`/forum/create`,method: "POST",dataType:'json'},
  postsDetailed:{url:`/forum/view`,method: "GET"},
  editReply:{url:`/forum/reply`,method: "POST",dataType:'json'},
  delateReply:{url:`/forum/delete-forum-article`,method: "POST"}
}

export interface IForumAps {
  pubIndex: TFHttpSend;
  attend: TFHttpSend;
  myself: TFHttpSend;
  delateCard: TFHttpSend;
  handleReply:TFHttpSend;
  createForum:TFHttpSend;
  postsDetailed:TFHttpSend;
  editReply:TFHttpSend;
  delateReply:TFHttpSend;
}

export const MODULE_NAME = 'studentForum'




