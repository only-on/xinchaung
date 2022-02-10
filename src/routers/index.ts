import { createRouter, createWebHashHistory, NavigationFailure, NavigationGuardNext, RouteLocationNormalized, RouteRecordNormalized, RouteRecordRaw } from "vue-router";
import store from "../store/index";
import RouterModule from './modules' // 引入业务逻辑模块
import RouterCommon from './common' // 引入通用模块
import RoutesTeacherSide from './teacherSide'
import RoutesAdminSide from './adminSide'
import RoutesStudentSide from './studentSide'
import storage   from "src/utils/extStorage";
const PathList={1:'',2:'/admin/home',3:'/teacher/home',4:'/studentStatistic',5:''}
// 登录状态检查
import { IRouteTuple } from "src/types";
const routes: Array<RouteRecordRaw> = [...RouterModule, ...RouterCommon, ...[RoutesTeacherSide], ...[RoutesAdminSide],...[RoutesStudentSide]]
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
console.log(routes)
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
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
router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized, failure: NavigationFailure | void) => {
  const role = storage.lStorage.get('role')
  const breadcrumbs: IRouteTuple[] = [{ control: { title: '首页', enabled: true }, route: PathList[Number(role)] }]
  let processedPath: string[] = []
  // console.log('matched:=',to.matched)
  // console.log('breadcrumbs:前=',breadcrumbs)
  to.matched.forEach((routeSegment: RouteRecordNormalized) => {
    // console.log('routeSegment:=',routeSegment)
    if (typeof routeSegment.meta.showInBreadcrumb !== 'undefined' && routeSegment.meta.showInBreadcrumb === false) {
      // 显性要求不显示面包屑，直接跳过
      return
    }
    // 避免父级页面由子级来显示导致面包屑重复
    if (!processedPath.includes(routeSegment.path)) {
      let routeTuple: IRouteTuple = {
        control: {
          title: (typeof routeSegment.meta.title === 'function' ? routeSegment.meta.title(to.params, to.query) : routeSegment.meta.title as string),
          enabled: routeSegment.path !== to.path // 禁用最后一截路由
        }, route: router.resolve({
          name: routeSegment.name,
          query:to.query,
          params: to.params,
        }).fullPath
      }
      // console.log('routeTuple:=',routeTuple)
      breadcrumbs.push(routeTuple)
      processedPath.push(routeSegment.path)
    }   
  })
  console.log('breadcrumbs:=',breadcrumbs)
  // console.log('processedPath:=',processedPath)
  store.commit('saveBreadcrumb', breadcrumbs)
})

export default router;
