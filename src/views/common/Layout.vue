<template>
    <div class="app_content">
      <Header></Header>
      <div class="main-box" id="main-box">
        <NavTab @tabSwitch="tabSwitch" v-if="configuration.showNav && configuration.navPosition==='outside'" />
        <div :class="configuration.showContent?'content':'customized'">
          <NavTab @tabSwitch="tabSwitch" v-if="configuration.showContent && configuration.showNav && configuration.navPosition==='inside'" />
          <div  :class="configuration.showContent?'content_box':'customizedSon'">
            <div :class="configuration.showContent?'setScrollbar':'customizedSon'">
              <router-view />
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
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
      navPosition:'inside',            //  inside   outside   导航位于内容区   内or外
      navType:true,                     // 面包屑true未默认灰色    false为白色
      tabs:[],                          // tab切换项 例 [{name:'随堂论坛',componenttype:0}]
      componenttype:undefined,           //  tab选中项   传tabs时需赋值 undefined做初始化，随后navtab组件会改其值为tabs的首项。 可监听configuration.componenttype 回调处理
      showContent:false,                //  是否需要内容区盒子   不需要则 layout只带顶部导航
      backOff:false,                    // 顶部与面包屑平齐的 返回 按钮
    })
    function updataNav(val:config){
      // console.log(val)
      Object.assign(configuration,val)
    }
    provide('configuration',configuration)
    provide('updataNav', updataNav)
    onMounted(()=>{
     
    })
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
  .app_content{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .main-box{
    flex: 1;
    background-color: #edf0f5;
    // margin-top: 5px;     //遮挡了header阴影
    // margin: 0 auto;
    // max-width: 1330px;
    height: calc(100% - 87px);     // footer组件失去后 修改此
    padding-top: 32px;
    padding-bottom: 32px;
    margin-top: 5px;
    min-height: 750px;
    .content{
      width: @center-width;
      margin: 0 auto;
      background: #fff;
      height: calc(100% - 44px); 
      min-height: 750px;
      border-radius: 6px;
      .content_box{
        width: 100%;
        background: #fff;
        box-shadow: 0px 0 3px 3px rgb(0 0 0 / 10%);
        padding: 40px 50px 80px;
        height: 100%;
        overflow: hidden;
        border-radius: 6px;
        >div{
          height: 100%;
          overflow: auto;
        }
      }
    }
    .customized{
      height: 100%;
      overflow: hidden;
    }
    .customizedSon{
       height: 100%;
      overflow: hidden;
    }
  }
}
</style>