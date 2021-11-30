import Layout from "../../views/common/Layout.vue";
import RouterView from "/src/components/RouterView.vue"

export default {
    path: "/studentExam",
    component: RouterView,
    meta: {
        title: "考试",
        authCode: "studentExam",
    },
    children: [
        {
            path: "",
            component: Layout,
            meta: {
                title: "考试",
                authCode: "studentExam",
            },
            children: [
                {
                    path: "",
                    name: "list",
                    component: () => import("src/views/studentExam/examList/examList.vue"),
                    meta: {
                        title: "考试列表",
                        authCode: "studentExam"
                    },
                },

            ]
        },
        {
            path: "examDoing",
            name: "examDoing",
            component: () => import("src/views/studentExam/examDoing/examDoing.vue"),
            meta: {
                title: "正在考试",
                authCode: ""
            },
        },
        {
            path: "look",
            name: "look",
            component: () => import("src/views/studentExam/transcript/transcript.vue"),
            meta: {
                title: "查看成绩",
                authCode: ""
            },
        },
    ]
}