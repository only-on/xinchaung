<template>
    <div v-layout-bg style="height:100%">
      <!-- <component ref="tabRef" :is="componentName" :currentTab="componentName"/> -->
      <myCourse ref="tabRef" v-if="componentName==='myCourse'" :currentTab="componentName"></myCourse>
      <initCourse ref="tabRef" v-if="componentName==='initCourse'" :currentTab="componentName"></initCourse>
      <archiveCourse ref="tabRef" v-if="componentName==='archiveCourse'" :currentTab="componentName"></archiveCourse>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,Ref,inject,watch  } from 'vue'
import myCourse from './myCourse.vue'
import initCourse from './initCourse.vue'
import archiveCourse from "./archiveCourse.vue"
import {useRoute} from "vue-router"
export default defineComponent({
  name: '',
  components: {
   myCourse,
   initCourse,
   archiveCourse
  },
  setup: (props,context) => {
    const route=useRoute()

    const componentNames=['myCourse','initCourse','archiveCourse']
    const tabs=[{name:'我的课程',componenttype:0},{name:'内置课程',componenttype:1},{name:'归档课程',componenttype:2}]
    var componentName:Ref<string>=ref('myCourse')
    
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    const tabRef=ref(null)
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    watch(()=>{return configuration.componenttype},(val)=>{
      // if (val||val===0) {
        val=val?val:(route.query.currentTab?route.query.currentTab:0)
        componentName.value=componentNames[val]
      // }
      
    },{immediate:true})
    onMounted(()=>{
      if (route.query.currentTab) {
        componentName.value=componentNames[route.query.currentTab.toString()]
      }
    })
    return {componentName ,tabs,tabRef};
  },
})
</script>

<style scoped lang="less">

</style>
