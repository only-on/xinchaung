<template>
    <div v-layout-bg style="height:100%">
      <component ref="tabRef" :is="componentName" :currentTab="componentName"/>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,Ref,inject,watch  } from 'vue'
import myCourse from './myCourse.vue'
import initCourse from './initCourse.vue'
import archiveCourse from "./archiveCourse.vue"

export default defineComponent({
  name: '',
  components: {
   myCourse,
   initCourse,
   archiveCourse
  },
  setup: (props,context) => {
  
    const componentNames=['myCourse','initCourse','archiveCourse']
    const tabs=[{name:'我的课程',componenttype:0},{name:'内置课程',componenttype:1},{name:'归档课程',componenttype:2}]
    var componentName:Ref<string>=ref('myCourse')
    
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    const tabRef=ref(null)
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    watch(()=>{return configuration.componenttype},(val)=>{
     
      componentName.value=componentNames[val]
    },{immediate:true})
    onMounted(()=>{
    
    })
    return {componentName ,tabs,tabRef};
  },
})
</script>

<style scoped lang="less">

</style>
