
import Layout from "../views/common/Layout.vue";
export default [
    {
        path: "/",
        name: 'index',
        component: Layout,
        meta: {
            title: "首页",
            authCode: "Home",
        },
        redirect: "/studentStatistic",
        // children: [
        //     {
        //         path: "home",
        //         name: "Home",
        //         component: () => import("src/components/HelloWorld.vue"),
        //         meta: {
        //             title: "首页",
        //         },
        //     },
        // ],
    },
    {
        path: "/login",
        name: "login",
        component: () => import("src/views/common/Login.vue"),
        meta: {
            title: "登录",
            authCode: 'login',
            exclude: true,
            outward: true,
        },
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("src/views/common/NotFound.vue"),
    },
]
