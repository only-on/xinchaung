// import RouterViews from "../../components/RouterView.vue";
import Layout from "../../views/common/Layout.vue";

export default {
    path: "",
    component: Layout,
    meta: {
        title: "统计",
        authCode: "statistic",
    },
    children: [
        {
            path: "/statistic",
            name: "statistic",
            component: () => import("src/views/statistic/index.vue"),
            meta: {
                title: "statistic",
                authCode: ""
            },
        }
    ]
}