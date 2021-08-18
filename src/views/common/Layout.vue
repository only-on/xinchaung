<template>
    <div class="app_content">
      <Header></Header>
      <div class="main-box" id="main-box">
        <router-view />
      </div>
      <!-- <Footer></Footer> -->
    </div>
</template>
<script lang="ts">
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import { ref, defineComponent,watch ,getCurrentInstance, onMounted } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useRouter } from 'vue-router';
// import router from "../../routers/index";
export default defineComponent({
  name: "Layout",
  components:{
    Header,
    Footer
  },
  setup: () => {
    const router = useRouter();
    
    const count = ref(0);
    function goTo(path:string){
      // console.log(path);
      router.push(path)
    }
    onMounted(()=>{
      // router.push('/Course/index')
    })
    // watch(router,()=>{
      
    // })
    onBeforeRouteUpdate((to,from,next)=>{
      // console.log(to.path);
      // console.log(from.path);
      next()
    })
    return { count ,goTo};
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
    >div{
      width: 1330px;
      margin: 0px auto;
      height: 100%;
      background: @white;
      // width: 100%;
    }
  }
}
</style>