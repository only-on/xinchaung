
export default [{
    path: "/",
    component: () => import("src/views/common/Layout.vue"),
    meta: {
        title: "首页",
    },
    // redirect: "/home",
    children: [
            {
                path: "home",
                name: "Home",
                component: () => import("src/components/HelloWorld.vue"),
                // component: () => import("src/views/common/Layout.vue"),
                meta: {
                    title: "首页",
                },
            },
    ],
},
{
    path: "/login",
    name: "login",
    component: () => import("src/views/common/Login.vue"),
    meta: {
      title: "登录",
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