import { TFHttpSend } from "src/typings/getRequest";
export default {
  courseScore:{
    url: '/api/course/teaching-quality/courses/score',
    method: 'GET'
  },
  categoryTags:{
    url: '/api/category/职业方向/tags',
    method: 'GET'
  },
  jobAbility:{
    url: '/api/course/teaching-quality/job/{jobName}',
    method: 'GET'
  },
  coursesSwitch:{
    url: '/api/course/teaching-quality/courses/switch',
    method: 'GET'
  },
  coursesResult:{
    url: ' /api/course/teaching-quality/courses/{courseId}/result',
    method: 'GET'
  },
}
export interface ITeachingQuality{
  courseScore: TFHttpSend;
  categoryTags: TFHttpSend;
  jobAbility: TFHttpSend;
  coursesSwitch: TFHttpSend;
  coursesResult: TFHttpSend;
}