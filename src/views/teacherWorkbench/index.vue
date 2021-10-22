<template>
    <div v-layout-bg >
      <component :is="componentName" />
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,Ref,inject,watch  } from 'vue'
import workbench from './workbench/index.vue'
import myImage from './myImage/index.vue'
import preinstallImage from "./preinstallImage/index.vue"

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
    var componentName:Ref<string>=ref('workbench')
    
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
