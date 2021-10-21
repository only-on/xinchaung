<template>
    <div class="groupModal" v-layout-bg>
      <a-modal
        title="学生分组"
        :visible="editvisible"
        :confirm-loading="editLoading"
        @ok="editOk"
        @cancel="editCancel"
        >
        <div class="editCon">
            <div class="hasGroup">
                <div>分组情况</div>
                <div>
                    <a-input style="width:140px"></a-input><a-button type="primary">修改</a-button>
                </div>
            </div>
            <div>
            <div class="transferBox">
                <div>
                    <span @click="leftMove" class="icon-chuansuojiantou iconfont"></span>
                </div>
                <div>
                    <span @click="rightMove" class="icon-chuansuojiantou-copy iconfont"></span>
                </div>
            </div>
            </div>
            <div class="unGroup">
                <div>未分组情况(未分组学生)</div>
            </div>
        </div>
        </a-modal>
    </div>
</template>
<script lang="ts">
interface Istate{
   editLoading:boolean,
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import request from 'src/api/index'
import Empty from 'src/components/Empty.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'resources',
    props:['propTrainDetailInfo','trainId','editvisible'],
    components:{
        Empty
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
        editLoading:false,
    })
    const methods={
      editOk(){
         context.emit('editModal',true)
      },
      editCancel(){
         context.emit('editModal',false)
      },
      getStuGroup(){
          const formdata=new FormData()
          formdata.append('train_id','50317')
          formdata.append('group_id','308')
          http.studentGroup({urlParams:{train_id:50317}},).then((res:any)=>{
              console.log(res)
          })
      },
      leftMove(){

      },
      rightMove(){
          
      }
    }
    onMounted(()=>{
        // methods.getStuGroup()
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.groupModal{
    .transferBox{
        display: flex;
        flex-direction: column;
        align-content: center;
    }
}
</style>