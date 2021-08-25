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
  }
  
}