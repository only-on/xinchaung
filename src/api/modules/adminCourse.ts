import { TFHttpSend } from "src/typings/getRequest";

export default {
    getTeacherCourseListApi:{url:"/api/course/admin/courses/uninitialized",method: "GET"},
    clearVideoApi:{url:"/api/course/admin/courses/{course_id}/clean-videos",method:"DELETE"},
    updateArchiveApi:{url:"/api/course/admin/courses/update-archive",method:"PUT", dataType: 'json'},
    deleteCourseApi:{url:"/api/course/admin/courses/destroy",method:"DELETE", dataType: 'json'},
    clearVideosApi:{url:"/api/course/admin/courses/videos",method:"DELETE", dataType: 'json'},
    lookCourseResultApi:{url:"/api/course/admin/courses/{course_id}/result",method: "GET"}
}

export interface TAdminCourse{
    getTeacherCourseListApi:TFHttpSend
    clearVideoApi:TFHttpSend
    updateArchiveApi:TFHttpSend
    deleteCourseApi:TFHttpSend
    clearVideosApi:TFHttpSend
    lookCourseResultApi:TFHttpSend
}