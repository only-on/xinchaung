<template>
<div class="img-bg">
  <div>
    <NavTab :tabs="tabs" @tabSwitch="tabSwitch" />
    <h3>实训引导</h3>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive } from 'vue'

export default defineComponent({
  name: 'index',
  components: {
   
  },
  setup: (props,{emit}) => {
    const tabs=reactive([{name:'最近实训',componentName:'LatelyCourseList'},{name:'我的实训',componentName:'MyCourseList'}])
    function tabSwitch(item:any){
      // componentName.value=item.componentName
    }
    onMounted(()=>{
      console.log('[experimental] index')
    })
    return {tabSwitch,tabs };
  },
})
</script>

<style scoped lang="scss">

</style>
