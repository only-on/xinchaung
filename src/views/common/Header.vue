<template>
  <header class="header-box">
    <div class="header-left">
      <img class="logo" src="../../assets/test/favicon.png" alt="" /><span
        class="web-title"
        >人工智能教学实训系统</span
      >
    </div>
    <div class="header-middle">
      <menu-bar></menu-bar>
    </div>
    <div class="header-right">
      <div class="help-message"><span></span><span>远程协助消息</span></div>
      <div class="user-name">
        <img src="../../assets/test/teacher_p.png" /><span>文和</span>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import { defineComponent,reactive } from "vue";
import MenuBar from "src/components/MenuBar.vue";
import request from '../../api/index'
import { IBusinessResp} from '../../typings/fetch';
import { FakeMenu, MenuItem } from "src/api/modules/common";
import extStorage from "src/utils/extStorage";
export default defineComponent({
  name: "Header",
  components: { MenuBar },
  setup() {
    const { lStorage } = extStorage
    const role = lStorage.get('role')
      const http=(request as any).common
      var menus:MenuItem[]=reactive([])
    //   http.getMenu().then((res:IBusinessResp)=>{
    //     menus.length=0
    //     let data=res.data
    //     // console.log('menus',data)
    //     menus.push(...data)
    //   //  html=renderMenu(res.data as MenuItem[]);
    // })
    return {menus}
  },
});
</script>

<style lang="less" scoped>
.header-box {
  height: 60px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-content: center;
  padding: 0 70px;
  background: #fff;
  min-width: 1330px;
  box-shadow: 0 0 5px #c2aad6;
  > .header-left {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 100px;
    .logo {
      width: 35px;
      height: 22px;
      margin-right: 10px;
    }
    .web-title {
      color: @theme-color;
      font-size: 22px;
    }
  }
  > .header-middle {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    > ul {
      display: flex;
      > a,
      > li {
        margin-left: 45px;
      }
    }
  }
  > .header-right {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    .help-message {
      margin-right: 15px;
    }
  }
}
</style>
