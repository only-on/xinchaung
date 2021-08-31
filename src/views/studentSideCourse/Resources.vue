<template>
  <h2 v-layout-bg>课程资源</h2>
  <div>
    <!-- <Breadcrumb /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,inject } from 'vue'
import { useRouter } from 'vue-router';
export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:[],navPosition:'outside',navType:false,showContent:false})
    onMounted(()=>{
     
    })
    function go(){
      // console.log(path);
      router.push('/Course/ContinueLearning/ContinueLearningSon')
    }
    return { go};
  },
})
</script>

<style scoped lang="less">

</style>
