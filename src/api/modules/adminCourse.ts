import { TFHttpSend } from "src/typings/getRequest";

export default {
    getTeacherCourseListApi:{url:"/api/course/admin/courses/uninitialized",method: "GET"},
    clearVideoApi:{url:"/api/course/admin/courses/{course_id}/clean-videos",method:"DELETE"},
    updateArchiveApi:{url:"/api/course/admin/courses/update-archive",method:"PUT", dataType: 'json'},
    deleteCourseApi:{url:"/api/course/admin/courses/destroy",method:"DELETE", dataType: 'json'},
    clearVideosApi:{url:"/api/course/admin/courses/videos",method:"DELETE", dataType: 'json'},
    lookCourseResultApi:{url:"/api/course/admin/courses/{course_id}/result",method: "GET"},
    getInitCourseListApi:{url:"/api/course/admin/courses/initialized",method:"GET"},
    getArchiveCourseListApi:{url:"/api/course/admin/courses/archived",method:"GET"},
    getCareerDirectionListApi:{url:"/api/course/courses/directions",method:"GET"},
    addCareerDirectionApi:{url:"/api/course/courses/directions",method:"POST",dataType: 'json'},
    deleteCareerDirectionApi:{url:"/api/course/courses/directions/{direction_id}",method:"DELETE"},
    getCourseDirectionListApi:{url:"/api/course/courses/categories",method:"GET"},
    addCourseDirectionApi:{url:"/api/course/courses/categories",method:"POST",dataType: 'json'},
    deleteCourseDirectionApi:{url:"/api/course/courses/categories/{category_id}",method:"DELETE"},
    deleteVideoLogApi:{url:"/api/course/admin/videos/{video_id}",method:"DELETE"}
}

export interface TAdminCourse{
    getTeacherCourseListApi:TFHttpSend
    clearVideoApi:TFHttpSend
    updateArchiveApi:TFHttpSend
    deleteCourseApi:TFHttpSend
    clearVideosApi:TFHttpSend
    lookCourseResultApi:TFHttpSend
    getInitCourseListApi:TFHttpSend
    getArchiveCourseListApi:TFHttpSend
    getCareerDirectionListApi:TFHttpSend
    addCareerDirectionApi:TFHttpSend
    deleteCareerDirectionApi:TFHttpSend
    getCourseDirectionListApi:TFHttpSend
    addCourseDirectionApi:TFHttpSend
    deleteCourseDirectionApi:TFHttpSend
    deleteVideoLogApi:TFHttpSend
}