
import Layout from "../views/common/Layout.vue";
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage
const role = lStorage.get('role') || 3
const PathList={1:'',2:'/admin/home',3:'/teacher/home',4:'/studentStatistic',5:''}
const homePath=PathList[Number(role)]
export default [
    {
        path: "/",
        name: 'index',
        component: Layout,
        meta: {
            title: "首页",
            authCode: "Home",
        },
        redirect: homePath,
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
