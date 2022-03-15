import { TFHttpSend } from "src/typings/getRequest";
export default {
  // 实验模板
  mineTemplateList: {url: `/report/template/mine`, method: 'GET'},
  initTemplateList: {url: `/report/template/init`, method: 'GET'},
  sharedTemplateList: {url: `/report/template/shared`, method: 'GET'},
  teachersTemplateList: {url: `/report/template/teachers`, method: 'GET'},
  deleteTemplate: {url: `/report/template/delete`, method: 'POST'},
  copyTemplate: {url: `/report/template/copy`, method: 'POST'},
  shareTemplate: {url: `/report/template/share`, method: 'POST'},
  unshareTemplate: {url: `/report/template/unshare`, method: 'POST'},
  createTemplate: {url: `/api/xinchuang/report/template/create`, method: 'POST', dataType:'json'},
  viewTemplate: {url: `/report/template/view`, method: 'GET'},
  updateTemplate: {url: `/api/xinchuang/report/template/view`, method: 'POST', dataType:'json'},
}

export interface ITeacherTemplateApis {
  mineTemplateList: TFHttpSend;
  initTemplateList: TFHttpSend;
  sharedTemplateList: TFHttpSend;
  teachersTemplateList: TFHttpSend;
  deleteTemplate: TFHttpSend;
  copyTemplate: TFHttpSend;
  shareTemplate: TFHttpSend;
  unshareTemplate: TFHttpSend;
  createTemplate: TFHttpSend;
  viewTemplate: TFHttpSend;
  updateTemplate: TFHttpSend
}

export const MODULE_NAME = 'teacherTemplate'