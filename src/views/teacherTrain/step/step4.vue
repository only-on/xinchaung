<template>
   <div class="createProgress4"  v-layout-bg>
       <resource :trainId='trainId' @step-four-info='stepFourInfo' :resource="step4Info"></resource>
      <div class="foot">
        <a-button  @click.prevent="onCancel"> 取 消 </a-button>
        <a-button class="next" type="primary" @click.prevent="previousStep"> 上一步 </a-button>
        <a-button class='save' type="primary" @click.prevent="nextStep">下一步</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import { useRouter ,useRoute } from 'vue-router';
import request from 'src/api/index'
import { message } from 'ant-design-vue';
import resource from '../detail/resources/index.vue'  
const http=(request as any).teacherTrain
interface Istate{
  step4Info:any;
}
export default defineComponent({
  name: 'createProgress4',
  props:['trainId'],
  components: {resource},
  setup: (props,context) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})
    const router = useRouter();
    const http=(request as any).teacherTrain
     const state:Istate=reactive({
       step4Info:{}
     })
     const methods={
        stepFourInfo(value:any){
          console.log(value,'step4Info222222')
          state.step4Info= value
        },
         onCancel(){
            router.go(-1)
            inject['stepInfoOne']={}
            inject['stepInfoTwo']={}
            inject['stepInfoThree']={}
            inject['stepInfoFour']={}
            inject['stepInfoFive']={}
        },
        previousStep(){
            context.emit('step-status',2)

        },
        nextStep(){
            inject['stepInfoFour']=state.step4Info
            context.emit('step-status',4)
        }
     }
    onMounted(()=>{
        if(inject['stepInfoFour']){
          state.step4Info=inject['stepInfoFour']
        }
    })
    return {...toRefs(state),...methods};
  },
})
</script>

<style  lang="less">
.createProgress4{
   margin: 0px 20px;
  .foot{
    margin-top:30px;
    text-align: center;
    .next,.save{
      margin-left: 10px;
    }
  }
}
</style>
