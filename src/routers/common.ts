import Layout from "../views/common/Layout.vue";
import Port from "../views/common/Port.vue";
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage;
const role = lStorage.get("role") || 3;
const PathList = {
  1: "",
  2: "/admin/home",
  3: "/teacher/home",
  4: "/student/statistics",
  5: "/teacher/teacherCourse",
  9:'/login'
};

/**
 * 获取首页地址
 * @param roleId
 */
export function getHomePath(roleId: Number | String) {
  return PathList[Number(roleId)];
}

export default [
  {
    path: "/",
    name: "index",
    component: Port,
    meta: {
      title: "请稍候...",
      authCode: "Port",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("src/views/common/Login.vue"),
    meta: {
      title: "登录",
      authCode: "login",
      exclude: true,
      outward: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    // redirect: '/NotFound',
    component: () => import("src/views/common/NotFound.vue"),
  },
];
