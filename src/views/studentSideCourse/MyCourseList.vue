<template>
  <div>
    <h2>我的课程</h2>
    <h2  @click="go()">去啊啊啊继续学习</h2>
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

<style scoped lang="scss">

</style>
