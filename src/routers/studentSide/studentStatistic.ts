// import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";

export default {
    path: "/studentStatistic",
    component: Layout,
    name:'studentStatistic',
    meta: {
        title: "统计",
        authCode: "studentStatistic",
    },
    children: [
        {
            path: "",
            component: () => import("src/views/studentModule/studentStatistic/index.vue"),
            meta: {
                title: "studentStatistic",
                authCode: ""
            },
        }
    ]
}