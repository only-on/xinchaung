
import Layout from "../views/common/Layout.vue";
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage
const role = lStorage.get('role')
const PathList={1:'',2:'',3:'/teacher/home',4:'',5:'/studentStatistic'}
const homePath=PathList[role]
export default [
    {
        path: "/",
        name: 'index',
        component: Layout,
        meta: {
            title: "首页",
            authCode: "Home",
        },
        // redirect: homePath,
        redirect: '/studentStatistic',
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
