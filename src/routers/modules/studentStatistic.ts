// import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";

export default {
    path: "/studentStatistic",
    component: Layout,
    meta: {
        title: "统计",
        authCode: "studentStatistic",
    },
    children: [
        {
            path: "",
            name: "studentStatistic",
            component: () => import("src/views/studentStatistic/index.vue"),
            meta: {
                title: "studentStatistic",
                authCode: ""
            },
        }
    ]
}