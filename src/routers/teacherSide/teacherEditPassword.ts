
import extStorage from "src/utils/extStorage";
import { LocationQuery, RouteParams } from 'vue-router';
const { lStorage } = extStorage
const role = lStorage.get('role')
// var title=''
// if(role===1 || role===3 || role===2){
//   title='修改密码'
// }else{
//   title='个人信息'
// }
import Layout from "src/views/common/Layout.vue";
export default {
  path: "personalInformation",
  component: Layout,
  name:'personalInformation',
  meta: {
    // title: title,
    title: (params?: RouteParams, query?: RouteParams) => {
      const dataDetailMap = {
          '0': '个人信息',
          '1': '修改密码',
      }
      if(role===4){
        return (query && query!.currentTab)?dataDetailMap[query!.currentTab.toString()]:dataDetailMap[0]
      }else{
        return '修改密码'
      }
    },
    authCode: "personalInformation",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/shareModule/personalInformation/Index.vue"),
      meta: {
        // title: title,
        icon: "",
        authCode: "personalInformation",
      }
    }
  ]
}