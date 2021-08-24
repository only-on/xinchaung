import { TFHttpSend } from "src/typings/getRequest";

export default{
  pubIndex:{url:`/forum/pub-index`,method: "GET"},
  attend:{url:'/forum/attend',method:'GET'},
  myself:{url:`/forum/myself`,method: "GET"},
  delateCard:{url:`/forum/delete`,method: "POST"},
  handleReply:{url:`/forum/list-reply`,method: "POST",dataType:'json'},
  createForum:{url:`/forum/create`,method: "POST",dataType:'json'},
}

export interface IForumAps {
  pubIndex: TFHttpSend;
  attend: TFHttpSend;
  myself: TFHttpSend;
  delateCard: TFHttpSend;
  handleReply:TFHttpSend;
  createForum:TFHttpSend;
}

export const MODULE_NAME = 'forum'




