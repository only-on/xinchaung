<template>
    <div v-layout-bg >
      <component :is="componentName" />
    </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,Ref,inject,watch  } from 'vue'
import ExaminationEenter from './ExaminationEenter.vue'
import TestPaper from './TestPaper.vue'
import { useRouter,useRoute } from 'vue-router';
export default defineComponent({
  name: '',
  components: {
   ExaminationEenter,
   TestPaper,
  },
  setup: (props,context) => {
    const route=useRoute();
    const componentNames=['TestPaper','ExaminationEenter']
    const tabs=[{name:'试卷管理',componenttype:0},{name:'考试中心',componenttype:1}]
    var componentName:Ref<string>=ref('TestPaper')
    
    var configuration:any=inject('configuration')
    var updata=inject('updataNav') as Function
    updata({tabs:tabs,navPosition:'outside',navType:false,showContent:true,componenttype:undefined,showNav:true,backOff:false})

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
