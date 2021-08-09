import RouterView from "../../components/RouterView.vue";
export default {
    path: "/Experimental",
    component: () => import("src/views/common/Layout.vue"),
    meta: {
        title: "首页",
    },
    // component: () => import("src/components/HelloWorld.vue"), studentExperimental
    children:[
      {
        path: "index",
        component: RouterView,
        meta: {
          title: "我的实验",
          icon: "",
          authCode: "index",
        },
          children: [
                {
                  path: "",
                  name: "index",
                  component: () => import("src/views/studentExperimental/index.vue"),
                  meta: {
                    title: "我的实验",
                    authCode: "",
                  },
                },
                {
                    path: "CreateExperimental",
                    name: "CreateExperimental",
                    component: () => import("src/views/studentExperimental/CreateExperimental.vue"),
                    meta: {
                      title: "新建实验",
                      authCode: "",
                    },
                },
                {
                  path: "ExperimentalList",
                  name: "ExperimentalList",
                  component: () => import("src/views/studentExperimental/ExperimentalList.vue"),
                  meta: {
                    title: "实验列表",
                    authCode: "",
                  },
                },
                {
                  path: "ExperimentalDetail",
                  name: "ExperimentalDetail",
                  component: () => import("src/views/studentExperimental/ExperimentalDetail.vue"),
                  meta: {
                    title: "实验详情",
                    authCode: "",
                  },
                },
          ],
      }]
}