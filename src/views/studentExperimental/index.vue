<template>
  <div v-layout-bg>
    <component :is="componentName" />
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref} from 'vue'
import LatelyExperimentalList from './LatelyExperimentalList.vue'
import MyExperimentalList from './MyExperimentalList.vue'
import {useStore} from "vuex"

export default defineComponent({
  name: '',
  components: {
   MyExperimentalList,
   LatelyExperimentalList
  },
  setup: (props,context) => {
    const store=useStore()

    const componentNames=['LatelyExperimentalList','MyExperimentalList']
    const tabs=[{name:'最近实训',componenttype:0},{name:'我的实训',componenttype:1}]
    var componentName:Ref<string>=ref('')

    // var tabType:Ref<number>=ref(0)
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true})

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
