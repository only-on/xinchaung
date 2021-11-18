import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';
export default {
    path: "teacherExam",
    component: Layout,
    meta: {
        // title: "考试管理",
        title: (params?: RouteParams, query?: RouteParams) => {
            // console.log(query)
            const dataDetailMap = {
                '0': '试卷管理',
                '1': '考试中心',
            }
            return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
          },
        authCode: 'teacherExam'  
    },
    children: [
        {
            path: "",
            component: () => import("src/views/teacherExam/index.vue"),
            meta: {
                title: "",
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