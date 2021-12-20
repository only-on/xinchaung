<template>
    <div v-layout-bg style="height:100%">
      <component ref="tabRef" :is="componentName" />
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,Ref,inject,watch,reactive,toRefs} from 'vue'
import workbench from './workbench/index.vue'
import myImage from './myImage/index.vue'
import preinstallImage from "./preinstallImage/index.vue"
import { onBeforeRouteLeave, useRouter,useRoute } from "vue-router";

import { number } from 'echarts'
interface state{
  componentName:any,
}
export default defineComponent({
  name: '',
  components: {
   workbench,
   myImage,
   preinstallImage
  },
  setup: (props,context) => {
    const componentNames=['workbench','myImage','preinstallImage']
    const tabs=[{name:'工作台',componenttype:0},{name:'我的镜像',componenttype:1},{name:'预设镜像',componenttype:2}]
    var componentName=ref('workbench')
    const route= useRoute()
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    const tabRef=ref(null)
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    watch(()=>{return configuration.componenttype},(val)=>{
       componentName.value=componentNames[val]
      if (tabRef.value && (tabRef.value as any).clearTimer) {
           clearInterval(Number((tabRef.value as any).clearTimer()))
      }
    })
    watch(()=>{return route.query.currentTab},(val:any)=>{
        componentName.value=componentNames[val]
    },{immediate:true})
    onMounted(()=>{
    })
    return {componentName,tabs,tabRef};
  },
})
</script>

<style scoped lang="less">

</style>
