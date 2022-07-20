import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  NavigationFailure,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
  RouteRecordRaw,
} from "vue-router";
import store from "../store/index";
import RouterModule from "./shareModule"; // 引入公用逻辑模块
import RouterCommon from "./common"; // 引入通用模块
import RoutesTeacherSide from "./teacherSide";
import RoutesAdminSide from "./adminSide";
import RoutesStudentSide from "./studentSide";
import storage from "src/utils/extStorage";
import menusFn from 'src/routers/menuConfig'
const PathList = {
  1: "",
  2: "/admin/home",
  3: "/teacher/home",
  4: "/student/statistics",
  5: "/teacher/teacherCourse",
};
// 登录状态检查
import { IRouteTuple } from "src/types";
const routes: Array<RouteRecordRaw> = [
  ...RouterModule,
  ...[RoutesTeacherSide],
  ...[RoutesAdminSide],
  ...[RoutesStudentSide],
  ...RouterCommon,
];
const router = createRouter({
  history: createWebHistory(), // createWebHistory(process.env.BASE_URL),
  routes,
});
console.log(routes);
router.beforeEach((to: RouteLocationNormalized,from: RouteLocationNormalized,next: NavigationGuardNext) => {
    const isLogged = store.getters.isLogged;
    var menus: any[] = menusFn();
    console.log(to);
    console.log(from);
    var CanPass:boolean=false
    menus.forEach((item:any) => {  
      if( item.url && item.url.split('?')[0] === to.path){
        CanPass=true
      }else if(item.children.length){
        item.children.forEach((childItem:any) => {
          if(childItem.url && childItem.url.split('?')[0] === to.path){
            CanPass=true
          }
        })
      }
    })
    if(CanPass){
      // next();
    }else{
      // next("/NotFound")
    }
    next();
    // 检查是否为公开页面（如登陆页面）
    // if (to.meta && to.meta.outward) {
    //   // 登录状态访问登陆页面，跳转到登录后的首页无需再次登录，其它页面无论是否登录直接进入
    //   // isLogged && to.name === "Login" ? next("/") : next();
    //   next();
    // } else {
    //   // 如果不是，判断是否登录，登录则直接进入，否则跳转到登录页面
    //   // isLogged ? next() : next("/login");
    //   next();
    // }
  }
);

// 在路由后置守卫中来处理面包屑导航
router.afterEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    failure: NavigationFailure | void
  ) => {
    const role = storage.lStorage.get("role");
    const breadcrumbs: IRouteTuple[] = [
      // {
      //   control: { title: "首页", enabled: true },
      //   route: PathList[Number(role)],
      // },
    ];
    let processedPath: string[] = [];
    // console.log('matched:=',to.matched)
    // console.log('breadcrumbs:前=',breadcrumbs)
    to.matched.forEach((routeSegment: RouteRecordNormalized) => {
      // console.log('routeSegment:=',routeSegment)
      if (
        typeof routeSegment.meta.showInBreadcrumb !== "undefined" &&
        routeSegment.meta.showInBreadcrumb === false
      ) {
        // 显性要求不显示面包屑，直接跳过
        return;
      }
      // 避免父级页面由子级来显示导致面包屑重复
      if (!processedPath.includes(routeSegment.path)) {
        let routeTuple: IRouteTuple = {
          control: {
            title:
              typeof routeSegment.meta.title === "function"
                ? routeSegment.meta.title(to.params, to.query)
                : (routeSegment.meta.title as string),
            enabled: routeSegment.path !== to.path, // 禁用最后一截路由
          },
          route: router.resolve({
            name: routeSegment.name,
            query: routeSegment.path !== to.path ? {} : to.query,
            params: routeSegment.path !== to.path ? {} : to.params,
          }).fullPath,
        };
        // console.log('routeTuple:=',routeTuple)
        // 学生端推荐实验面包屑显示
        routeSegment.path==='/teacher/teacherExperimentResourcePool'&&role===4 ?
        '' : breadcrumbs.push(routeTuple);
        processedPath.push(routeSegment.path);
      }
    });
    // console.log("breadcrumbs:=", breadcrumbs);
    // console.log('processedPath:=',processedPath)
    store.commit("saveBreadcrumb", breadcrumbs);
  }
);

export default router;
