<template>
  <div v-layout-bg>
    <component :is="componentName" />
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref} from 'vue'
import SetList from './SetList.vue'
import {useStore} from "vuex"
import extStorage from "src/utils/extStorage";
export default defineComponent({
  name: '',
  components: {
   SetList
  },
  setup: (props,context) => {
    // const componentNames=['OperationList','Information']
    const tabs=[{name:'公共数据',componenttype:0},{name:'我的数据',componenttype:1}]
    var componentName:Ref<string>=ref('SetList')
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    //
    if(role===3){
      updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})
    }else{
      updata({tabs:[],navPosition:'outside',navType:false,showContent:true,showNav:true,backOff:false,showPageEdit:false})
    }
    watch(()=>{return configuration.componenttype},(val)=>{
      // console.log(val)
      // if(role===2 || role===4){
      //    componentName.value=componentNames[val]
      // }
    })
  
    onMounted(()=>{
     
    })
    return {componentName,};
  },
})
</script>

<style scoped lang="less">
  
</style>
