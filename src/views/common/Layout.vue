<template>
    <div class="app_content">
      <Header></Header>
      <div class="main-box" id="main-box">
        <NavTab @tabSwitch="tabSwitch" v-if="configuration.showNav && configuration.navPosition==='outside'" />
        <div class="content" v-if="configuration.showContent">
          <NavTab @tabSwitch="tabSwitch" v-if="configuration.showNav && configuration.navPosition==='inside'" />
          <div class="content_box">
            <router-view />
          </div>
        </div>
        <div v-else class="customized">
          <router-view />
        </div>
      </div>
      <Footer></Footer>
    </div>
</template>
<script lang="ts">
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import { ref, defineComponent,watch , onMounted ,Ref,reactive,provide,toRefs} from "vue";
import { useRouter } from 'vue-router';
// import router from "../../routers/index";
interface config{
  showNav?:boolean;
  navPosition?:string;
  navType?:boolean;
  tabs?:any[];
  componenttype:number | undefined,
  showContent:boolean
}
type Titem ='showNav' | 'navPosition' | 'navType' | 'tabs' ;
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
      showContent:true,                //  是否需要内容区盒子   不需要则 layout只带顶部导航
    })
    function updataNav(val:config){
      // console.log(val)
      Object.assign(configuration,val)
      // val?Object.keys(val).forEach((v)=>{
      //   let key=v as Titem
      //   if(configuration[key]){
      //       configuration[key]=val[key]
      //     }
      // }):''
      // console.log(configuration)
    }
    provide('configuration',configuration)
    provide('updataNav', updataNav)
    onMounted(()=>{
      // router.push('/Course/index')
    })
    function tabSwitch(val:any){
      // console.log(val)
      configuration.componenttype=val
    }
    watch(configuration, () => {
      // navType.value=props.configuration.navType
      // console.log(tabs[props.configuration.componenttype])
      // activeName.value = tabs[props.configuration.componenttype].name;
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
    .content{
      width: @center-width;
      margin: 0 auto;
      background: #fff;
      height: 100%;
      min-height: 750px;
      .content_box{
        width: 100%;
        background: #fff;
        box-shadow: 0px 0 3px 3px rgb(0 0 0 / 10%);
        border-radius: 3px;
        padding: 40px 50px 100px;
        // height: calc(100% - 102px);
        height: calc(100% - 44px);
        overflow: hidden;
        border-radius: 4px;
      }
    }
    .customized{
      height: 100%;
    }
  }
}
</style>