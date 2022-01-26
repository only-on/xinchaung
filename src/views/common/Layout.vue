<template>
    <div class="app_content">
      <div class="header">
        <Header></Header>
        <NavTab @tabSwitch="tabSwitch"/>
      </div>
      <div class="main-box" :class="configuration.tabs.length>1?'line':''">
        <div :class="configuration.showContent?'regulations':'customized'">
          <router-view />
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import { ref, defineComponent,watch , onMounted ,Ref,reactive,provide,toRefs, computed} from "vue";
import { useRouter } from 'vue-router';
// import router from "../../routers/index";
interface tab{
  name:string;
  componenttype:number;
}
interface config{
  showNav?:boolean;
  navPosition?:string;
  navType?:boolean;
  tabs?:tab[];
  componenttype:number | undefined;
  showContent:boolean;
  backOff:boolean;
  showPageEdit:boolean;
  pageEdit: () => void;
}
export default defineComponent({
  name: "Layout",
  components:{
    Header,
    Footer
  },
  setup: () => {
    const router = useRouter();
    var configuration:config=reactive({
      showNav:true,                    // 是否需要导航条
      tabs:[],                          // tab切换项 例 [{name:'随堂论坛',componenttype:0}]
      componenttype:undefined,           //  tab选中项   传tabs时需赋值 undefined做初始化，随后navtab组件会改其值为tabs的首项。 可监听configuration.componenttype 回调处理
      showContent:false,                //  是否需要内容区盒子   不需要则 layout只带顶部导航

      backOff:false,                    // 现已取消
      showPageEdit:false,               // 现已取消
      pageEdit:()=>{},                  // 现已取消
      navPosition:'inside',            //  现已取消
      navType:true,                     // 现已取消

    })
    function updataNav(val:config){
      console.log(val)
      Object.assign(configuration,val)
    }
    provide('configuration',configuration)
    provide('updataNav', updataNav)
    onMounted(()=>{
     
    })
    // watch(()=>configuration.tabs,()=>{
    //   console.log(configuration.tabs)
    // })
    function tabSwitch(val:any){
      // console.log(val)
      configuration.componenttype=val
    }
    watch(()=>{return configuration.componenttype}, () => {
     
    });
    return {tabSwitch,configuration};
  },
});
</script>
<style lang="less" scoped>
#app{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .app_content{
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .header{
      background: #192843;
    }
  }
  .main-box{
    flex: 1;
    opacity: 0.7;
    background: #f0f0f0;
    overflow: hidden;
    padding-bottom: 32px;
    min-height: 750px;
    overflow: auto;
    width: 100%;
    height: 100%;
    .regulations{
      width: var(--center-width);
      margin: 0 auto;
      padding-top: 20px;
    }
    .customized{}
  }
  .line{
    margin-top: 3px;
  }
}
</style>