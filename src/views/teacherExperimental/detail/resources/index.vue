<template>
    <div class="resources" v-layout-bg>
       实训资源
    </div>
</template>
<script lang="ts">
interface Istate{
   
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'resources',
    props:['propTrainDetailInfo','trainId'],
    components:{
        Empty
    },
    setup(props,context){
    const http=(request as any).teacherExperimental
    const state:Istate=reactive({
      
    })
    const methods={
      
    }
    onMounted(()=>{
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.resources{

}
</style>