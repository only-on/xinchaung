<template>
   <div class="selectEnvir"  v-layout-bg>
       分组信息
       <groupingInfor/>
      <div class="foot">
        <a-button  @click.prevent="onCancel"> 取 消 </a-button>
        <a-button class="next" type="primary" @click.prevent="previousStep"> 上一步 </a-button>
        <a-button class='save' type="primary" @click.prevent="nextStep">下一步</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
import groupingInfor from '../detail/groupingInfor/index.vue'
import messages from 'src/i18n/zh_CN'
const http=(request as any).teacherTrain
interface Istate{
}
export default defineComponent({
  name: 'CreatePosts',
   props:['trainId'],
  components: {
    groupingInfor
  },
  setup: (props,context) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})
    const http=(request as any).teacherTrain
     const state:Istate=reactive({
     })
     const methods={
        onCancel(){

        },
        previousStep(){
             context.emit('step-status',4)
        },
        nextStep(){
             context.emit('step-status',6)
        }
     }
    onMounted(()=>{
        
    })
    return {...toRefs(state),...methods};
  },
})
</script>

<style  lang="less">
.foot{
    display: flex;
    justify-content:center;
    .next{
      margin-left: 20px;
      margin-right: 20px;
    }
  }
</style>
