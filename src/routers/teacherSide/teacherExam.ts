import Layout from 'src/views/common/Layout.vue';

export default {
    path: "teacherExam",
    component: Layout,
    meta: {
        title: "考试管理",
        authCode: 'teacherExam'  
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherExam/index.vue"),
            meta: {
                title: "考试管理",
                authCode: 'teacherExam'
            },
        },
        {
            path: "CreateTestPaper",
            name: "CreateTestPaper",
            component: () => import("src/views/teacherExam/CreateTestPaper.vue"),
            meta: {
                title: "创建试卷",
                authCode: 'CreateTestPaper'
            },
        },
        {
            path: 'Achievement',
            name: 'Achievement',
            component: () => import ("src/views/teacherExam/Achievement.vue"),
            meta: {
                title: "成绩统计",
                authCode: 'Achievement'
            }
        },
        {
            path: 'CreatedExamination',
            name: 'CreatedExamination',
            component: () => import ("src/views/teacherExam/CreatedExamination.vue"),
            meta: {
                title: "预约考试",
                authCode: 'CreatedExamination'
            }
        }
    ]
}