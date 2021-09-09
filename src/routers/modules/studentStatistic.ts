// import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";

export default {
    path: "",
    component: Layout,
    meta: {
        title: "统计",
        authCode: "studentStatistic",
    },
    children: [
        {
            path: "/studentStatistic",
            name: "studentStatistic",
            component: () => import("src/views/studentStatistic/index.vue"),
            meta: {
                title: "studentStatistic",
                authCode: ""
            },
        }
    ]
}