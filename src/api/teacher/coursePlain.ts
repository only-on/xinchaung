import { TFHttpSend } from "src/typings/getRequest";

export default {
// 排课
  getLeftTime: {
    url: "/api/yii/timetable/timetable-set/time-table",
    method: "GET"
  },
  getTimeTable: {
    url: "/api/yii/timetable/timetable/index",
    method: "GET"
  },
  getStudentList: {
    url: "/api/yii/timetable/timetable/students",
    method: "POST",
    dataType: "json"
  },
  getClassestList: {
    url: "/api/yii/timetable/timetable/classes",
    method: "POST",
    dataType: "json"
  },
  classStuIntersect: {
    url: "/api/yii/timetable/timetable/class-stu-intersect",
    method: "POST",
    dataType: "json"
  },
  createSchedule: {
    url: "/api/yii/timetable/timetable/create",
    method: "POST",
    dataType: "json"
  },
  scheduleDetail: {
    url: "/api/yii/timetable/timetable/view",
    method: "GET",
    dataType: "json"
  },
  scheduleUpdate: {
    url: "/api/yii/timetable/timetable/update",
    method: "POST",
    dataType: "json"
  },
  scheduleDelete: {
    url: "/api/yii/timetable/timetable/delete",
    method: "POST",
    dataType: "json"
  },
  setTimeTable: {
    url: "/api/yii/timetable/timetable-set/set",
    method: "POST",
    dataType: 'json'
  },
  updateTimeTable: {
    url: "/api/yii/timetable/timetable-set/update",
    method: "POST",
    dataType: 'json'
  },
  deleteTimeTable: {
    url: "/api/yii/timetable/timetable-set/delete/",
    method: "POST",
    dataType: 'json'
  },
  envMonitoringList: {
    url: "/api/yii/timetable/online-resource/index",
    method: "POST",
    dataType: 'json'
  },
  forbiddenUser: {
    url: "/api/yii/timetable/online-resource/disable",
    method: "POST",
    dataType: 'json'
  },
  setArchiveCourseApi: {
    url: "/teacher-course/mycourse-archive",
    method: "POST",
    dataType: 'json'
  },
  chapterSortApi: {
    url: `/api/course/courses/{course_id}/chapters/tree`,
    method: "PUT",
    dataType: 'json'
  },
  experimentSortApi: {
    url: `/api/course/courses/{course_id}/contents/tree`,
    method: "PUT",
    dataType: 'json'
  }
}
