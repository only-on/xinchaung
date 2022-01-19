<template>
    <div v-layout-bg>
      <component :is="componentName" />
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref,inject,watch } from 'vue'
import LatelyCourseList from './LatelyCourseList.vue'
import MyCourseList from './MyCourseList.vue'

export default defineComponent({
  name: '',
  components: {
   MyCourseList,
   LatelyCourseList
  },
  setup: (props,context) => {
  
    const componentNames=['LatelyCourseList','MyCourseList']
    const tabs=[{name:'最近学习',componenttype:0},{name:'我的课程',componenttype:1}]
    var componentName:Ref<string>=ref('LatelyCourseList')
    
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    watch(()=>{return configuration.componenttype},(val)=>{
      // console.log(val)
      componentName.value=componentNames[val]
    })
    onMounted(()=>{
    
    })
    return {componentName ,tabs};
  },
})
</script>

<style scoped lang="less">

</style>
