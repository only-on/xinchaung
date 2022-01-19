export default {
    // 课程详情
    experimentalResults: { url: `/api/operate/studentResults/detail`, method: "GET", },
    // 实训详情
    courseExperimentSccore: { url: `/api/operate/studentResults/detail`, method: "GET", },
    // 课程成绩列表
    courseAchievement: { url: `/api/operate/studentResults/list`, method: "GET", },
    // 实训成绩列表
    trainingResults: { url: `/api/operate/studentResults/list`, method: "GET", },
    //get score
    // getScore: { url: `/student-course/get-score`, method: "POST", dataType: 'formdata' },
    // 资源列表
    getResources: { url: `/api/service/resources`, method: "GET", dataType: 'json' },

    //课程实验的分
    courseScore: { url: `/api/operate/studentResults/info`, method: "GET", dataType: 'json' },
    // 学生查看实验成果详情
    studentResults: { url: `/api/operate/studentResults/show`, method: "GET", dataType: 'json' },

}