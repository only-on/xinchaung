<template>
  <header class="header-box">
    <div class="header-left">
      <div class="logo"></div>
      <span
        class="web-title"
        >人工智能教学实训系统</span
      >
    </div>
    <div class="header-middle">
      <menu-bar></menu-bar>
    </div>
    <div class="header-right">
      <a-popover title="" trigger="click" placement="bottom">
        <template #content>
          <p class="assist">{{assistText}}</p>
        </template>
        <div class="help-message" v-if="isOperation" @click="helpMessage">
          <img src="../../assets/images/reqi_icon.png" alt="">
          <span>远程协助消息</span>
        </div>
      </a-popover>
      <a-popover title="" trigger="hover" placement="bottom">
        <template #content>
          <p class="operation" v-if="!power" @click="information">个人信息</p>
          <p class="operation" v-if="!power" @click="modifyPassword">修改密码</p>
          <p class="operation" @click="loginOut">退出登录</p>
        </template>
        <div class="user-name">
          <div class="nser-img"></div>
          <span>文和</span>
        </div>
      </a-popover>
    </div>
  </header>
</template>
<script lang="ts">
import { defineComponent,reactive,computed,Ref,ref } from "vue";
import MenuBar from "src/components/MenuBar.vue";
import request from '../../api/index'
import { useRouter } from 'vue-router';
import { IBusinessResp} from '../../typings/fetch';
import { FakeMenu, MenuItem } from "src/api/modules/common";
import extStorage from "src/utils/extStorage";
export default defineComponent({
  name: "Header",
  components: { MenuBar },
  setup() {
    const router = useRouter();
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    const http=(request as any).common
    const assistText: Ref<string> = ref("您暂时还未收到远程协助请求！");
    const isOperation = computed(() => {
      // 教师有远程协助消息提醒
      return role === 3
    })
    const power = computed(() => {
      // 2 4  个人信息  3 1修改密码
      return role === 3 || role === 1
    })
    function information(){
      router.push('/personalInformation')
    }
    function loginOut(){
      
    }
    function helpMessage(){
      
    }
    function modifyPassword(){
      router.push('/personalInformation')
    }
    return {isOperation,power,loginOut,information,helpMessage,modifyPassword,assistText}
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
  align-items: center;
  padding: 0 50px;
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
      width: 32px;
      height: 32px;
      margin-right: 10px;
      background:url('../../assets/test/favicon.png') no-repeat center;
      background-size: 100% 100%;
     
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
    cursor: pointer;
    .help-message {
      margin-right: 30px;
      img{
        -webkit-filter: brightness(30%); /* Chrome, Safari, Opera */
        filter: brightness(.3);
        margin-right: 7px;
      }
    }
    .user-name{
      display: flex;
      align-items: center;
      .nser-img{
        width:28px;
        height:28px;
         background:url('../../assets/test/teacher_p.png') no-repeat center;
         background-size: 100% 100%;
      }
    }
  }
}
.ant-popover-inner-content{
  .operation{
    margin-bottom: 0;
    padding: .5em;
  }
  .operation:hover{
    cursor: pointer;
    color: @theme-color;
  }
  
}
.assist{
  color: #857878;
  margin: 5px;
}
</style>
