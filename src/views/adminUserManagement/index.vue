<template>
    <div v-layout-bg >
      <component :is="componentName" />
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref,inject,watch  } from 'vue'
import assistantManagement from './assistantManagement.vue'
import classManagement from './classManagement.vue'
import studentManagement from './studentManagement.vue'
import teacherManagement from './teacherManagement.vue'
import { useRouter,useRoute } from 'vue-router';
export default defineComponent({
  name: '',
  components: {
   assistantManagement,
   classManagement,
   studentManagement,
   teacherManagement
  },
  setup: (props,context) => {  // adminUserManagement
    const route=useRoute();
    const componentNames=['teacherManagement','studentManagement','assistantManagement','classManagement']
    const tabs=[{name:'教师管理',componenttype:0},{name:'学生管理',componenttype:1},{name:'助教管理',componenttype:2},{name:'班级管理',componenttype:3}]
    var componentName:Ref<string>=ref('teacherManagement')
    
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    watch(()=>{return configuration.componenttype},(val)=>{
      // console.log(val)
      // const {page}= route.query
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
