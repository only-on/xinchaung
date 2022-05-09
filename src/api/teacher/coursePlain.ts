import { TFHttpSend } from "src/typings/getRequest";

export default {
// 排课
  getLeftTime: {
    url: "/timetable/timetable-set/time-table",
    method: "GET"
  },
  getTimeTable: {
    url: "/timetable/timetable/index",
    method: "GET"
  },
  getStudentList: {
    url: "/timetable/timetable/students",
    method: "POST",
    dataType: "json"
  },
  getClassestList: {
    url: "/timetable/timetable/classes",
    method: "POST",
    dataType: "json"
  },
  classStuIntersect: {
    url: "/timetable/timetable/class-stu-intersect",
    method: "POST",
    dataType: "json"
  },
  createSchedule: {
    url: "/timetable/timetable/create",
    method: "POST",
    dataType: "json"
  },
  scheduleDetail: {
    url: "/timetable/timetable/view",
    method: "GET",
    dataType: "json"
  },
  scheduleUpdate: {
    url: "/timetable/timetable/update",
    method: "POST",
    dataType: "json"
  },
  scheduleDelete: {
    url: "/timetable/timetable/delete",
    method: "POST",
    dataType: "json"
  },
  setTimeTable: {
    url: "/timetable/timetable-set/set",
    method: "POST",
    dataType: 'json'
  },
  updateTimeTable: {
    url: "/timetable/timetable-set/update",
    method: "POST",
    dataType: 'json'
  },
  deleteTimeTable: {
    url: "/timetable/timetable-set/delete/",
    method: "POST",
    dataType: 'json'
  },
  envMonitoringList: {
    url: "/timetable/online-resource/index",
    method: "POST",
    dataType: 'json'
  },
  forbiddenUser: {
    url: "/timetable/online-resource/disable",
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
