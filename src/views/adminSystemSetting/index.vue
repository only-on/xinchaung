<template>
  <div v-layout-bg>
    <component :is="componentName" />
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref} from 'vue'
import diskManagement from './diskManagement.vue'
import systemSetting from './systemSetting.vue'
import {useStore} from "vuex"

export default defineComponent({
  name: '',
  components: {
   systemSetting,
   diskManagement
  },
  setup: (props,context) => {
    const store=useStore()

    const componentNames=['systemSetting','diskManagement']
    const tabs=[{name:'系统设置',componenttype:0},{name:'磁盘管理',componenttype:1}]
    var componentName:Ref<string>=ref('systemSetting')

    // var tabType:Ref<number>=ref(0)
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    watch(()=>{return configuration.componenttype},(val)=>{
      console.log(val)
      // tabType.value=val
      componentName.value=componentNames[val]
    })
  
    onMounted(()=>{
     
    })
    return {componentName,};
  },
})
</script>

<style scoped lang="less">
  
</style>
