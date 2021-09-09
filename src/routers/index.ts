import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordNormalized, RouteRecordRaw } from "vue-router";
import store from "../store/index";
import RouterModule from './modules' // 引入业务逻辑模块
import RouterCommon from './common' // 引入通用模块
import RoutesTeacherSide from './teacherSide'
const routes: Array<RouteRecordRaw> = [...RouterModule, ...RouterCommon, ...[RoutesTeacherSide]]
// console.log('all routes: ', routes);
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
// console.log(router);

// 登录状态检查
import { inject } from 'vue'
router.beforeEach((to, _, next) => {
  // handleRouter(to)
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

// 在路由后置守卫中来处理面包屑导航
router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const breadcrumbs = [{ name: '首页', path: '/' }]
  let processedPath: string[] = []
  to.matched.forEach((routeSegment: RouteRecordNormalized) => {
    // 避免父级页面由子级来显示导致面包屑重复
    if (!processedPath.includes(routeSegment.path)) {
      breadcrumbs.push({ path: `${routeSegment.path}`, name: routeSegment.meta.title as string, })
      processedPath.push(routeSegment.path)
    }
  })
  store.commit('saveBreadcrumb', breadcrumbs)

  // console.log('[routers] afterEach to: ', to, ' from: ', from)
})

export default router;