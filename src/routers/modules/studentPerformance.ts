// import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";
import { LocationQuery, RouteParams } from 'vue-router';

export default {
    path: "/studentPerformance",
    name:'studentPerformance',
    component: Layout,
    meta: {
        // title: "课程成绩",
        title: (params?: RouteParams, query?: RouteParams) => {
            const dataDetailMap = {
                '0': '课程成绩',
                '1': '实训成绩',
            }
            return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
          },
        authCode: "studentPerformance",
    },
    children: [
        {
            path: "",
            // name: "studentPerformance",
            component: () => import("src/views/studentPerformance/index.vue"),
            meta: {
                title: "",
                authCode: "studentPerformance"
            },
        },
        {
            path: "courseScore",
            name: "courseScore",
            component: () => import("src/views/studentPerformance/CourseAchievement/courseScore/index.vue"),
            meta: {
                title: "课程得分",
                authCode: ""
            },
        },
        {
            path: "courseResources",
            name: "courseResources",
            component: () => import("src/views/studentPerformance/CourseAchievement/courseResources/index.vue"),
            meta: {
                title: "课程资源",
                authCode: ""
            },
        },
    ]
}