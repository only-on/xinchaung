<template>
   <div class="finish"  v-layout-bg>
      <div class='addSuccess'>
        <img src="src/assets/images/wc_dg_img_07.png" alt="" srcset="">
        <span class="tipInfo">恭喜您！添加成功</span>
      </div>
      <div class="foot">
        <a-button class="continueAdd"  @click.prevent="onCancel">继续添加</a-button>
        <a-button class="next" type="primary" @click.prevent="previousStep">查看实训</a-button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref, onMounted,reactive,toRefs ,inject,computed} from 'vue'
import request from 'src/api/index'
import uploadImage from '../components/uploadImage/uploadImage.vue'
import selectMirror from '../components/selectMirror/index.vue'
import messages from 'src/i18n/zh_CN'
const http=(request as any).teacherTrain
interface Istate{
}
export default defineComponent({
  name: 'finish',
   props:['trainId'],
  components: {
    uploadImage,
    selectMirror
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
             context.emit('step-status',5)
        }
     }
    onMounted(()=>{
        
    })
    return {...toRefs(state),...methods};
  },
})
</script>

<style  lang="less">
.finish{
  .addSuccess{
  display: flex;
  margin: 200px auto;
  justify-content:center;
  align-content: center;
  .tipInfo{
      font-size: 24px;
      color:#999;
    }
  }
  .foot{
    display: flex;
    justify-content:center;
    .continueAdd{
    margin-right: 20px;
    }
  }
}

</style>
