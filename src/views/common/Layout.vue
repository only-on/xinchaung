<template>
    <Header></Header>
    <div class="main-box">
      <router-view />
    </div>
    <Footer></Footer>
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
    watch(router,()=>{
      // console.log(n,o)
    })
    onBeforeRouteUpdate((to,from,next)=>{
      // console.log(to.path);
      // console.log(from.path);
      next()
    })
    return { count ,goTo};
  },
});
</script>
<style lang="scss">
#app{
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .main-box{
    flex: 1;
    // margin: 0 auto;
    // max-width: 1330px;
    >div{
      // width: 100%;
      &.img-bg{
        background-image: url("../../assets/common/layout_bg.jpg");
        background-size: 100% 312px;
        background-repeat: no-repeat;
        min-height: 700px;
      }
      >div{
        width: 1330px;
        margin: 0 auto;
      }
    }
  }
}
  // .row,.nav{
  //   display: flex;
  // }
  // .row{
  //   padding: 3em 0;
  // }
  // .logo{
  //   padding: 0 2em;
  // }
  // .nav{
  //   padding: 0 2em;
  //   div{
  //     cursor: pointer;
  //     font-size: 18px;
  //     padding: 0 2em;
  //   }
  // }
</style>