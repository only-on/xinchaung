import { createRouter, createWebHashHistory ,RouteRecordRaw} from "vue-router";
import store from "../store/index";
import RouterModule from './modules' // 引入业务逻辑模块
import RouterCommon from './common' // 引入通用模块
const routes: Array<RouteRecordRaw>=[...RouterModule,...RouterCommon,
  
]
// console.log(routes);
const router= createRouter({
  history: createWebHashHistory(),
  routes
});
console.log(routes);

// 登录状态检查
router.beforeEach((to, _, next) => {
  // console.log(to);
  const isLogged = store.getters.isLogged;
  // 检查是否为公开页面（如登陆页面）
  if (to.meta && to.meta.outward) {
    // 登录状态访问登陆页面，跳转到登录后的首页无需再次登录，其它页面无论是否登录直接进入
    // isLogged && to.name === "Login" ? next("/") : next();
    next()
  } else {
    // 如果不是，判断是否登录，登录则直接进入，否则跳转到登录页面
    // isLogged ? next() : next("/login");
    next()
  }
});

export default router;