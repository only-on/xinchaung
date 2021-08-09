<template>
  <!-- <router-view  name="outward" /> -->
  <div class="row">
    <div style="logo">人工智能教学系统</div>
    <div class="nav">
      <router-link to="/Experimental" tag="span">实训</router-link>
      <router-link to="/Course" >课程</router-link>
    </div>
  </div>
  <div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { ref, defineComponent,watch ,getCurrentInstance, onMounted } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
import { useRouter } from 'vue-router';
// import router from "../../routers/index";
export default defineComponent({
  name: "Layout",
  setup: () => {
    const router = useRouter();
    const count = ref(0);
    onBeforeRouteUpdate ((to,from,next) => {
      console.log(45);
      
      console.log(to.path);
      console.log(from.path);
    });
    function goTo(){
      
    }
    // watch(()=>(router as any).path,()=>{
    //   console.log(465);
      
    // })
    onMounted(()=>{
      // router.push('/Course/index')
    })
    return { count ,goTo};
  },
  beforeRouteUpdate(to,from,next){
    console.log(to.path);
    console.log(from.path);
  }
});
</script>
<style scoped lang="scss">
  .row,.nav{
    display: flex;
  }
  .row{
    padding: 3em 0;
  }
  .logo{
    padding: 0 2em;
  }
  .nav{
    padding: 0 2em;
    span{
      font-size: 18px;
      padding: 0 2em;
    }
  }
</style>