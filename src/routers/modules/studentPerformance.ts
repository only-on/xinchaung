// import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";

export default {
    path: "",
    component: Layout,
    meta: {
        title: "成绩",
        authCode: "studentPerformance",
    },
    children: [
        {
            path: "/studentPerformance",
            name: "studentPerformance",
            component: () => import("src/views/studentPerformance/index.vue"),
            meta: {
                title: "studentPerformance",
                authCode: ""
            },
        }
    ]
}