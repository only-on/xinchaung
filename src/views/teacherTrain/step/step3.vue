<template>
    <div class="createProgress3"  v-layout-bg>
        <div v-if="addTask">
            <div class="content">
            <div>
                <div class='describe'><span class="star">*</span>实训概述:</div>
                <div><antdv-markdown v-model="describe" /></div>
            </div>
            <div class="simulationTasks">
                <div><span class="star">*</span>实训任务:</div>
                <a-button type="primary" @click="doAddTask">添加任务</a-button>
            </div>
            <task-list :contentList='content_list'  @delete-item-index='deleteItemIndex' />
        </div>
        <div class="foot">
                <a-button  @click.prevent="onCancel"> 取 消 </a-button>
                <a-button class="next" type="primary" @click.prevent="previousStep"> 上一步 </a-button>
                <a-button class='save' type="primary" @click.prevent="nextStep">下一步</a-button>
            </div>
        </div>
        <div v-else>
            <add-task @addtask-info='addtaskInfo' @cancel-add='cancelAdd'/>
        </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,onMounted,reactive,toRefs ,inject} from 'vue'
import request from 'src/api/index'
import trainingGuide from '../detail/trainingGuide/index.vue'
import addTask from '../components/addTask/index.vue'
import taskList from '../components/taskList/index.vue'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue"
import { message } from 'ant-design-vue';
const http=(request as any).teacherTrain
interface Istate{
    describe:any,
    addTask:boolean,
    content_list:any[],
}
export default defineComponent({
 name: 'createProgress3',
 props:['trainId'],
  components: {trainingGuide,AntdvMarkdown,addTask,taskList},
  setup: (props,context) => {
    var updata=inject('updataNav') as Function
    updata({showContent:true,navType:false,tabs:[],navPosition:'outside'})
    const http=(request as any).teacherTrain
     const state:Istate=reactive({
         describe:'',
         addTask:true,
         content_list:[],
     })
     const methods={
         addtaskInfo(value:any){
            state.addTask=true
            state.content_list.push(value)
        },
         deleteItemIndex(value:any){
            console.log(value)
            if(state.content_list.length===1){
                message.warning("实训至少需要一个任务！")
                return
            }
            state.content_list.splice(value,1)
        },
         doAddTask(){
             state.addTask=false
         },
         cancelAdd(){
             state.addTask=true
         },
          onCancel(){

        },
       previousStep(){
             context.emit('step-status',1)
       },
       nextStep(){
         context.emit('step-status',3)    
    //        if(!state.describe){
    //             message.warning("实训概述不能为空！")
    //             return
    //         }
    //         const formdata=new FormData()
    //         formdata.append('train_id',props.trainId)
    //         formdata.append('detail',state.describe)
    //         state.content_list?.forEach((item:any,index:any)=>{
    //             formdata.append('list_content['+index+'][train_content_id]','')
    //             formdata.append('list_content['+index+'][name]',item.name)
    //             formdata.append('list_content['+index+'][describe]',item.describe)
    //             formdata.append('list_content['+index+'][step][id]','')
    //             formdata.append('list_content['+index+'][step][step_name]','')
    //             formdata.append('list_content['+index+'][step][knowledge_map_id]',item.step.knowledge_map_id.join())
    //             formdata.append('list_content['+index+'][step][state]',item.step.state)
    //             formdata.append('list_content['+index+'][step][serial]','')
    //             item.step.knowledge_map_id?.forEach((it:any) => {
    //                 formdata.append('list_content['+index+'][step][knowledge][]',it)
    //             });
    //             item.step.knowledges?.forEach((j:any) => {
    //                 formdata.append('list_content['+index+'][step][knowledges][]',j)
    //             })
    //         })
    //          http.saveTrainContents({param:formdata}).then((res:any)=>{
    //              context.emit('step-status',3)
    //              let step3Info:any={
    //                  describe:state.describe,
    //                  content_list:state.content_list,
    //              }
    //             inject['stepInfoThree']=step3Info
    //          })
        }
     }
    onMounted(()=>{
         if(inject['stepInfoThree']){
            state.content_list=inject['stepInfoThree'].content_list
            state.describe=inject['stepInfoThree'].describe
        }
    })
    return {...toRefs(state),...methods};
  },
})
</script>

<style  lang="less">
.createProgress3{
     margin: 0px 30px;
    .mark__body .mark__preview{
    height: 331px;
        .simulationTasks{
            margin-top: 20px;
        }
    }
    .star{
        width: 12px;
        color: red;
    }
    .describe{
        margin-bottom: 20px;
    }
    .simulationTasks{
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
    }
    .foot{
    margin-top:30px;
    text-align: center;
    .next,.save{
      margin-left: 10px;
    }
  }
}
</style>
