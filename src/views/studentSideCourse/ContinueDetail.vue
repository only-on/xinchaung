<template>
  <h2>课程详情</h2>
  <div>
    <!-- <Breadcrumb /> -->
  </div>
  <h2 @click="go()">
    去子组件
  </h2>
  <router-view />
</template>

<script lang="ts">
import { defineComponent,ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'ContinueDetail',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
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

<style scoped lang="scss">

</style>
