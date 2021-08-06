
import Login from "src/views/common/Login.vue";
export default {
path: "/",
component: () => import("src/views/common/Layout.vue"),
// redirect: "/home",
children: [
        {
            path: "home",
            name: "Home",
            component: () => import("src/components/HelloWorld.vue"),
            meta: {
                title: "首页",
            },
        },
        {
            path: "login",
            name: "Login",
            components: {
                outward: Login,
            },
            meta: {
                outward: true,
                title: "登录",
            },
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("src/views/common/NotFound.vue"),
        },
  ],
}