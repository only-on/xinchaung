import { createStore } from "vuex";
import CommonState from "./common/common"
import extStorage from "../utils/extStorage";
const { sStorage } = extStorage;
// 登录数据恢复和保存
const restore = (key:any) => sStorage.get(key);
const backup = (key:any, val:any) => sStorage.set(key, val);
const clearStore = (keys:any) =>
  keys.forEach((key:any) => {
    sStorage.del(key);
  });
  const breadcrumb = sStorage.get("breadcrumb") || [{name:132}];
  const store:any = createStore({
  // state() {
  //   return {
  //     adminInfo: restore("adminInfo") || {},
  //   };
  // },
  state:{
     adminInfo: restore("adminInfo") || {},
     breadcrumb:"1212121",
  },
  getters: {
    isLogged() {
      return store.state.adminInfo.token;
    },
  },
  mutations: {
    // 保存登录后管理员信息
    saveAdminInfo(state, adminInfo) {
      state.adminInfo = adminInfo;
      backup("adminInfo", adminInfo);
    },
    // 退出登录
    logout(state) {
      state.adminInfo = {};
      clearStore(["adminInfo"]);
    },
    saveBreadcrumb(state, breadcrumb){
      state.breadcrumb = breadcrumb;
      sStorage.set("breadcrumb", breadcrumb);
    }
  },
  actions: {
    
  },
  modules:{
    CommonState
  }
});

export default store;