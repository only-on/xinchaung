import { TFHttpSend } from "src/typings/getRequest";

export default {
  getTreeList: {
    url: '/api/course/courses/{courseId}/chapters/tree',
    method: 'GET',
  },
  chapterSort: {
    url: `/api/course/courses/{courseId}/chapters/tree`,
    method: 'PUT',
    dataType: 'json'
  },
  contentSort: {
    url: `/api/course/courses/{courseId}/contents/tree`,
    method: 'PUT',
    dataType: 'json'
  },
  deleteNode: {
    url: '/api/course/courses/{courseId}/chapters/{nodeId}',
    method: 'DELETE'
  },
  editNode: {
    url: '/api/course/courses/{courseId}/chapters/{nodeId}',
    method: 'PUT',
    dataType: 'json'
  }
}

export interface ICourseTreeApis {
  getTreeList: TFHttpSend,
  chapterSort: TFHttpSend,
  contentSort: TFHttpSend,
  editNode: TFHttpSend,
  deleteNode: TFHttpSend,
}