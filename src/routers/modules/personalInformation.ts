
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage
const role = lStorage.get('role')
var title=''
if(role===1 || role===3){
  title='修改密码'
}else{
  title='个人信息'
}
import Layout from "src/views/common/Layout.vue";
export default {
  path: "/personalInformation",
  component: Layout,
  meta: {
    title: title,
    authCode: "personalInformation",
  },
  children: [
    {
      path: "",
      // component: RouterViews,
      component: () => import("src/views/personalInformation/Index.vue"),
      meta: {
        title: title,
        icon: "",
        authCode: "personalInformation",
      }
    }
  ]
}