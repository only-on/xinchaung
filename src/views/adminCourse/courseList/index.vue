<template>
    <div v-layout-bg style="height:100%">
      <!-- <component ref="tabRef" :is="componentName" :currentTab="componentName"/> -->
      <teacherList ref="tabRef" v-if="componentName==='teacherList'" :currentTab="componentName"></teacherList>
      <initList ref="tabRef" v-if="componentName==='initList'" :currentTab="componentName"></initList>
      <archiveList ref="tabRef" v-if="componentName==='archiveList'" :currentTab="componentName"></archiveList>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,Ref,inject,watch  } from 'vue'
import teacherList from './teacherList.vue'
import initList from './initList.vue'
import archiveList from "./archiveList.vue"
import {useRoute} from "vue-router"
export default defineComponent({
  name: '',
  components: {
   teacherList,
   initList,
   archiveList
  },
  setup: (props,context) => {
    const route=useRoute()

    const componentNames=['teacherList','initList','archiveList']
    const tabs=[{name:'教师课程',componenttype:0},{name:'内置课程',componenttype:1},{name:'归档课程',componenttype:2}]
    var componentName:Ref<string>=ref('teacherList')
    
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
