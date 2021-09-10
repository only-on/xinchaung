// import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";

export default {
    path: "/studentPerformance",
    component: Layout,
    meta: {
        title: "成绩",
        authCode: "studentPerformance",
    },
    children: [
        {
            path: "",
            name: "studentPerformance",
            component: () => import("src/views/studentPerformance/index.vue"),
            meta: {
                title: "课程成绩",
                authCode: ""
            },
        },
        {
            path: "/courseScore",
            name: "courseScore",
            component: () => import("src/views/studentPerformance/CourseAchievement/courseScore/index.vue"),
            meta: {
                title: "课程得分",
                authCode: ""
            },
        },
        {
            path: "/courseResources",
            name: "courseResources",
            component: () => import("src/views/studentPerformance/CourseAchievement/courseResources/index.vue"),
            meta: {
                title: "课程资源",
                authCode: ""
            },
        },
    ]
}