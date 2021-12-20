<template>
    <div v-layout-bg >
      <component :is="componentName" />
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref,inject,watch  } from 'vue'
import BasicsExperimentManage from './BasicsExperimentManage.vue'
import TeacherExperimentManage from './TeacherExperimentManage.vue'
import ShareExperimentManage from './ShareExperimentManage.vue'
import TechnicalDirection from './TechnicalDirectionManage.vue'
import { useRouter,useRoute } from 'vue-router';
export default defineComponent({
  name: '',
  components: {
   TeacherExperimentManage,
   BasicsExperimentManage,
   ShareExperimentManage,
   TechnicalDirection
  },
  setup: (props,context) => {
    const route=useRoute();
    const componentNames=['TeacherExperimentManage','BasicsExperimentManage','ShareExperimentManage','TechnicalDirection']
    const tabs=[{name:'教师实验管理',componenttype:0},{name:'基础实验管理',componenttype:1},{name:'共享实验管理',componenttype:2},{name:'技术方向管理',componenttype:3}]
    var componentName:Ref<string>=ref('TestPaper')
    
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false,showPageEdit:false})

    watch(()=>{return configuration.componenttype},(val)=>{
      // console.log(val)
      // const {page}= route.query
      componentName.value=componentNames[val]
    })
    let currentTab=Number(route.query.currentTab) || 0
    componentName.value=componentNames[currentTab]
    // console.log(currentTab)
    onMounted(()=>{
    
    })
    return {componentName ,tabs};
  },
})
</script>

<style scoped lang="less">

</style>
