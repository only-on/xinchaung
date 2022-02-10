<template>
  <div v-layout-bg>
    <component :is="componentName" />
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive, toRefs,watch ,inject,Ref} from 'vue'
import Information from './Information.vue'
// component: () => import("src/views/adminSystemManage/systemLog/index.vue"),
// import OperationList from 'src/views/adminSystemManage/systemLog/index.vue'
import OperationList from './OperationList.vue'
import {useStore} from "vuex"
import extStorage from "src/utils/extStorage";
export default defineComponent({
  name: '',
  components: {
   OperationList,
   Information
  },
  setup: (props,context) => {
    const store=useStore()

    const componentNames=['OperationList','Information']
    const tabs=[{name:'操作日志',componenttype:0},{name:'修改密码',componenttype:1}]
    var componentName:Ref<string>=ref('OperationList')
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    const { lStorage } = extStorage
    const role = lStorage.get('role')
    // 4   个人信息  3 1 2修改密码
    if(role===1 || role===3  || role===2){
      componentName.value='Information'
      updata({tabs:[],navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})
    }else{
      updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})
    }
    watch(()=>{return configuration.componenttype},(val)=>{
      // console.log(val)
      if(role===2 || role===4){
         componentName.value=componentNames[val]
      }
    })
  
    onMounted(()=>{
     
    })
    return {componentName,};
  },
})
</script>

<style scoped lang="less">
  
</style>
