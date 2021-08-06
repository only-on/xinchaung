
export default {
    path: "/",
    component: () => import("src/views/common/Layout.vue"),
    // redirect: "/home",
    children: [
        {
            path: "createExperimental",
            name: "createExperimental",
            component: () => import("src/views/teacherExperimental/createExperimental.vue"),
            meta: {
              title: "新建实验",
            },
        },
      {
        path: "experimentalList",
        name: "experimentalList",
        component: () => import("src/views/teacherExperimental/experimentalList.vue"),
        meta: {
          title: "实验列表",
        },
      },
      {
        path: "experimentalDetail",
        name: "experimentalDetail",
        component: () => import("src/views/teacherExperimental/experimentalDetail.vue"),
        meta: {
          title: "实验详情",
        },
      },
    ],
}