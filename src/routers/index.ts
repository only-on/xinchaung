import { createRouter, createWebHashHistory ,RouteRecordRaw} from "vue-router";
import store from "../store/index";
import RouterModule from './modules' // 引入业务逻辑模块
import RouterCommon from './common' // 引入通用模块
const routes: Array<RouteRecordRaw>=[...RouterModule,...RouterCommon,]
// console.log(routes);
const router= createRouter({
  history: createWebHashHistory(),
  routes
});
// console.log(router);

// 登录状态检查
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
function handleRouter(obj:any){
  const breadcrumbArr=[{name:'首页',path:'/'}] 
  store.commit('saveBreadcrumb',breadcrumbArr)
  if(obj.path==='/'){
    store.commit('saveBreadcrumb',breadcrumbArr)
    return
  }
  const moduleName=obj.path.split('/')[1]
  // let ParentPath=obj.path
  const curPath=obj.path.split('/').slice(-1)[0]
  let curModule={}
  routes.forEach((v:any)=>{
    if(v.path==='/' && v.meta.authCode===moduleName){
      curModule=v
    }
  })
  // console.log(curModule);
  console.log(curPath);
  addBreadcrumb(curModule)
  function addBreadcrumb(curObj:any){
    // console.log(curObj);
    if(curObj.children){
      if(curObj.path !=='/' && curObj.path !== ''){
        changeBread(curObj)
      }
      if(curObj.path === curPath){
        // changeBread(curObj)
        return
      }
      myFiller(curObj.children)
    }else{
      if(curObj.path !== ''){
        changeBread(curObj)
      }
    }
    // console.log(breadcrumbArr);
  }
  function myFiller(arr:any[]){
    const pathArr=arr.filter(v=> v.path === curPath)
    let curItem={}
    if(pathArr && pathArr.length){
      curItem=pathArr[0]
    }else{
      curItem=arr[0]
    }
    addBreadcrumb(curItem)
  }
  function changeBread(v:any){
    // let obj={
    //   path:`${v.path}`,
    //   name:v.meta.title,
    // }
    // breadcrumbArr.push(obj)
  }
  // console.log(breadcrumbArr);
  
  store.commit('saveBreadcrumb',breadcrumbArr)
}
export default router;