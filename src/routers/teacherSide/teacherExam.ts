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
        // {
        //     path: 'resource',
        //     name: 'resource',
        //     component: () => import ("src/views/teacherExam/resource.vue"),
        //     meta: {
        //         title: "预约考试",
        //         authCode: 'resource'
        //     }
        // },
        // {
        //     path: 'evaluate',
        //     name: 'evaluate',
        //     component: () => import ("src/views/teacherExam/evaluate.vue"),
        //     meta: {
        //         title: "成绩详情",
        //         authCode: 'evaluate'
        //     }
        // }
    ]
}