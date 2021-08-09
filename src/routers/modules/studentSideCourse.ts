
import RouterView from "../../components/RouterView.vue";
export default {
    path: "/Course",
    component: () => import("src/views/common/Layout.vue"),
    meta: {
        title: "首页",
    },
    children:[
      {
        path: "index",
        component: RouterView,
        meta: {
          title: "我的课程",
          icon: "",
          authCode: "index",
        },
        children: [
                {
                  path: "",
                  name: "CreateExperimental",
                  component: () => import("src/views/studentSideCourse/index.vue"),
                  meta: {
                    title: "我的课程",
                    authCode: "",
                  },
              },
              {
                  path: "Create",
                  name: "Create",
                  component: () => import("src/views/studentSideCourse/Create.vue"),
                  meta: {
                    title: "新建课程",
                    authCode: "",
                  },
              },
            {
              path: "List",
              name: "List",
              component: () => import("src/views/studentSideCourse/List.vue"),
              meta: {
                title: "课程列表",
                authCode: "",
              },
            },
            {
              path: "Detail",
              name: "Detail",
              component: () => import("src/views/studentSideCourse/Detail.vue"),
              meta: {
                title: "课程详情",
                authCode: "",
              },
            },
          ],
      }]
}