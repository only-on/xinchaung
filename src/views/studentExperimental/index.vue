<template>

  <NavTab :tabs="tabs" @tabSwitch="tabSwitch" />
  <component :is="componentName" />
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive } from 'vue'
import LatelyExperimentalList from './LatelyExperimentalList.vue'
import MyExperimentalList from './MyExperimentalList.vue'

export default defineComponent({
  name: '',
  components: {
   MyExperimentalList,
   LatelyExperimentalList
  },
  setup: (props,context) => {
    const tabs=[{name:'最近实训',componentName:'LatelyExperimentalList'},{name:'我的实训',componentName:'MyExperimentalList'}]
    const componentName=ref('LatelyExperimentalList')
    function tabSwitch(item:any){
      componentName.value=item.componentName
    }
    onMounted(()=>{
      // console.
    })
    return {componentName,tabSwitch ,tabs};
  },
})
</script>

<style scoped lang="scss">

</style>
