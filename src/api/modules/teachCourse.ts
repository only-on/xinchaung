import { TFHttpSend } from "src/typings/getRequest";

export default {
  getPre: {
    url: `/base-study/get-pre-topoinst`,
    method: 'POST',
    dataType: 'json'
  },
  vmOpen: {
    url: '/base-study/start',
    method: 'POST',
    dataType: 'json'
  },
  vmClose: {
    url: '/base-study/close',
    method: 'POST',
    dataType: 'json'
  },
  vmRevert: {
    url: '/base-study/revert',
    method: 'POST',
    dataType: 'json'
  },
  vmReset: {
    url: '/base-study/reset',
    method: 'POST',
    dataType: 'json'
  },
  preLimit: {
    url: '/base-study/pre-create-limit',
    method: 'POST',
    dataType: 'json'
  },
  saveTopoinst: {
    url: '/base-study/pre-save-topoinst',
    method: 'POST',
    dataType: 'json'
  },
  getTreeList: {
    url: 'api/course/courses/{courseId}/chapters/tree',
    method: 'GET',
  },
  canAccessVm: {
    url: '/teacher-course/can-access-vm',
    method: 'POST',
    dataType: 'json'
  }
  
}

export interface ITeacherCourseApis {
  getPre: TFHttpSend,
  vmOpen: TFHttpSend,
  vmClose: TFHttpSend,
  vmRevert: TFHttpSend,
  vmReset: TFHttpSend,
  preLimit: TFHttpSend,
  saveTopoinst: TFHttpSend,
  getTreeList: TFHttpSend,
  canAccessVm: TFHttpSend,
}