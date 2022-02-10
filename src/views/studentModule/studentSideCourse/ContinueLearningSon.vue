<template>
  <div>
    <h2>课程详情儿子</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';

export default defineComponent({
  name: '',
  components: {
   
  },
  setup: (props,{emit}) => {
    const router = useRouter();
    onMounted(()=>{
     
    })
    function go(){
      // console.log(path);
      router.push('/Course/ContinueLearning')
    }
    return { go};
  },
})
</script>

<style scoped lang="less">

</style>
