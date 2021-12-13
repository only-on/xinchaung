import Layout from 'src/views/common/Layout.vue';
import { LocationQuery, RouteParams } from 'vue-router';

export default {
    path: "adminCourse",
    name: "adminCourse",
    component: Layout,
    meta: {
        title: (params?: RouteParams, query?: RouteParams) => {
            // console.log(query)
            const dataDetailMap = {
                '0': '教师课程',
                '1': '内置课程',
                '2': '归档课程',
            }
            return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:'课程管理'
          },
        authCode: 'adminCourse',
        showInBreadcrumb: false
    },
    children: [
        {
            path: "",
            name: "admincourseList",
            component: () => import("src/views/adminCourse/courseList/index.vue"),
            meta: {
                title: " ",
                authCode: 'courseList'
            },
        },
        {
            path: "courseResult",
            name: "admincourseResult",
            component: () => import("src/views/adminCourse/courseList/courseResult.vue"),
            meta: {
                title: "成果",
                authCode: 'courseResult'
            },
        },
        {
            path: "courseDetail",
            name: "admincourseDetail",
            component: () => import("src/views/adminCourse/courseDetail/courseDetail.vue"),
            meta: {
                title: "课程详情",
                authCode: 'courseResult'
            },
        },
        {
            path: "evalute",
            name: "admincourseevalute",
            component: () => import("src/views/adminCourse/evalute/evalute.vue"),
            meta: {
                title: "归档课程分析",
                authCode: 'courseResult'
            },
        },
        {
            path: "careerDirection",
            name: "adminCareerDirection",
            component: () => import("src/views/adminCourse/careerDirection/careerDirection.vue"),
            meta: {
                title: "职业方向",
                authCode: 'careerDirection'
            },
        },
        {
            path: "courseDirection",
            name: "adminCourseDirection",
            component: () => import("src/views/adminCourse/courseDirection/courseDirection.vue"),
            meta: {
                title: "课程方向",
                authCode: 'courseDirection'
            },
        },
    ]
}
