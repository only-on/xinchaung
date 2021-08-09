<template>
  <NavTab @tabSwitch="tabSwitch" :tabs="tabs" />
  <div>课程引导</div>
  <component :is="componentName" />
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive } from 'vue'
import LatelyCourseList from './LatelyCourseList.vue'
import MyCourseList from './MyCourseList.vue'

export default defineComponent({
  name: '',
  components: {
   MyCourseList,
   LatelyCourseList
  },
  setup: (props,context) => {
    const tabs=[{name:'最近学习',componentName:'LatelyCourseList'},{name:'我的课程',componentName:'MyCourseList'}]
    const componentName=ref('MyCourseList')
    function tabSwitch(item:any){
      componentName.value=item.componentName
    }
    onMounted(()=>{
     
    })
    return {componentName,tabSwitch ,tabs};
  },
})
</script>

<style scoped lang="scss">

</style>
