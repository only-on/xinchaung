import { TFHttpSend } from "src/typings/getRequest";
export default {
  mapList:{
    url: '/knowledge-map1/get-knowledge-map-list',
    method: 'POST'
  },
  examMapList:{
    url: '/exam/question-bank/get-knowledge-map-list',
    method: 'POST'
  },
  getContentlist:{
    url: '/knowledge-map1/get-content-list',
    method: 'POST'
  },
  addKnowledgeMap: {
    url: '/knowledge-map1/add-knowledge-map',
    method: 'POST'
  },
  delKnowledgeMap: {
    url: '/knowledge-map1/delete-knowledge-map',
    method: 'POST'
  }
}
export interface IKnowledgeMap{
  mapList: TFHttpSend,
  getContentlist: TFHttpSend,
  examMapList: TFHttpSend,
  addKnowledgeMap: TFHttpSend,
  delKnowledgeMap: TFHttpSend
}