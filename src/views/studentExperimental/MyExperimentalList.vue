<template>
  <h3>我的实训</h3>
  <h2 @click="go1()">实训详情</h2>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'MyExperimentalList',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    function go(){
      // console.log(path);
      router.push('/Experimental/CreateExperimental')
    }
    function go1(){
      // console.log(path);
      router.push('/Experimental/ExperimentalDetail')
    }
    onMounted(()=>{
     
    })
    return {go,go1 };
  },
})
</script>

<style scoped lang="scss">

</style>
