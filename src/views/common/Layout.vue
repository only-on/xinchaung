<template>
  <div class="app_content">
    <div class="header">
      <div :class="['headerBox', 'theme'+systemTheme]">
        <Header />
      </div>
      <NavTab @tabSwitch="tabSwitch" />
    </div>
    <div class="main-box" :class="configuration.tabs && configuration.tabs.length > 1 ? 'line' : ''" >
      <div :class="configuration.showContent ? 'regulations' : 'customized'">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import {
  ref,
  defineComponent,
  watch,
  onMounted,
  Ref,
  reactive,
  provide,
  toRefs,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import {getThemeData} from 'src/utils/theme'
const {systemTheme} = getThemeData()
// import router from "../../routers/index";
interface tab {
  name: string;
  componenttype: number;
}
interface config {
  showNav?: boolean;
  tabs?: tab[];
  componenttype: number | undefined;
  showContent: boolean;
}
export default defineComponent({
  name: "Layout",
  components: {
    Header,
    Footer,
  },
  setup: () => {
    const router = useRouter();
    var configuration: config = reactive({
      showNav: true, // 是否需要导航条
      tabs: [], // tab切换项 例 [{name:'随堂论坛',componenttype:0}]
      componenttype: undefined, //  tab选中项   传tabs时需赋值 undefined做初始化，随后navtab组件会改其值为tabs的首项。 可监听configuration.componenttype 回调处理
      showContent: false, //  是否需要内容区盒子   不需要则 layout只带顶部导航
    });
    function updataNav(val: config) {
      // console.log(val)
      // if(!val.activeMenuName){
      //   configuration.activeMenuName=''
      // }
      Object.assign(configuration, val);
    }
    provide("configuration", configuration);
    provide("updataNav", updataNav);
    onMounted(() => {});
    // watch(()=>configuration.tabs,()=>{
    //   console.log(configuration.tabs)
    // })
    function tabSwitch(val: any) {
      // console.log(val)
      configuration.componenttype = val;
    }
    watch(
      () => {
        return configuration.componenttype;
      },
      () => {}
    );
    return { tabSwitch, configuration ,systemTheme};
  },
});
</script>
<style lang="less" scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .app_content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .header {
      background: var(--menu-bg);
    }
    .headerBox{
      &.themeC{
        box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.14); 
      }
    }
  }
  .main-box {
    flex: 1;
    background: #fafafb;
    // background: rgba(240, 240, 240, 0.7);
    // padding-bottom: 32px;
    // min-height: 750px;
    overflow: auto;
    width: 100%;
    height: 100%;
    min-height: 700px;
    overflow-y: auto;
    .regulations {
      width: var(--center-width);
      margin: 0 auto;
      // padding-top: 20px;
      margin-top: 20px;
      // background-color: #fff;
      margin-bottom: 50px;
    }
    .customized {
      margin-bottom: 50px;
    }
  }
  .line {
    margin-top: 3px;
  }
}
</style>
