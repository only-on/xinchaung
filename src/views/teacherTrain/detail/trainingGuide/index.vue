<template>
    <div class="trainingGuide">
        <div v-if="addTask">
            <div class="traindescribe">
                <div class="trainingOverview">
                    <div><span class="star">*</span>实训概述:</div>
                    <div v-if="trainType!=='1'">
                        <a-button type="primary" v-if="edit" @click="toEdit">编辑</a-button>
                        <a-button type="primary" v-else @click="toSave">保存</a-button>
                    </div>
                </div>
                <div class="markdown">
                    <div v-if="edit" >
                        <antdv-markdown :preview-only="true" v-model="describe" />
                    </div>
                    <div v-else>
                        <antdv-markdown v-model="describe" />
                    </div>
                </div>
            </div>
            <div>
                <div class="simulationTasks">
                    <div><span class="star">*</span>实训任务:</div>
                    <a-button type="primary" v-if="!edit" @click="doAddTask">添加任务</a-button>
                </div>
                <task-list :contentList='content_list' :edit='edit' @delete-item-index='deleteItemIndex' />
            </div>
        </div>
        <div v-else>
           <add-task @addtask-info='addtaskInfo' @cancel-add='cancelAdd' />
        </div>
    </div>
</template>
<script lang="ts">
interface Istate{
    edit:boolean,
    describe:any,
    content_list:any[],
    addTask:boolean,
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref,watch} from 'vue'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import taskList from '../../components/taskList/index.vue'
import addTask from '../../components/addTask/index.vue'
import request from 'src/api/index'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'trainingGuide',
    props:['propTrainDetailInfo','trainId','trainType'],
    components:{
        'antdv-markdown':AntdvMarkdown,
        'task-list':taskList,
        'add-task':addTask
    },
    setup(props,context){
    const http=(request as any).teacherTrain
    const state:Istate=reactive({
        edit:true,
        describe:'',
        content_list:[],
        addTask:true
    })
    const methods={
        toEdit(){
            state.edit=false
        },
        toSave(){
            if(!state.describe){
                message.warning("实训概述不能为空！")
                return
            }
            console.log(state.content_list.length)
            if(!state.content_list.length){
                message.warning('请添加实训任务！')
                return
            }
            const content:any=[]
            console.log(state.content_list)
            state.content_list.forEach((item:any,index:any)=>{
                content.push({
                    name:item.name,
                    describe:item.describe,
                    step:[{
                        detail:item.steps[0].detail,
                        state:item.steps[0].state,
                        knowledge_ids:item.steps[0].knowledge_map_id
                    }]
                })
            })
            http.saveTrainContents({urlParams:{train:props.trainId},param:{detail:state.describe,content:content}}).then((res:any)=>{
                 console.log(res)
                 if(res.code===1){
                     state.edit=true
                 }
             })
        },
        doAddTask(){
            state.addTask=false
        },
        addtaskInfo(value:any){
            console.log(value,'添加的每一项数据')
            state.addTask=true
            // state.content_list.push(value)
            state.content_list.push({
                describe:value.describe,
                name:value.name,
                steps:[{
                    detail:value.step.detail,
                    knowledge_id:{knowledge_name:value.step.knowledges.join(',')},
                    knowledge_map_id:value.step.knowledge_map_id
                }]
            })
            console.log(value,'hahhhha ')
        },
        cancelAdd(){
            state.addTask=true
        },
        deleteItemIndex(value:any){
            console.log(value)
            if(state.content_list.length===1){
                message.warning("实训至少需要一个任务！")
                return
            }
            state.content_list.splice(value,1)
        }
    }
    watch(()=>props.propTrainDetailInfo,(val:any)=>{
        state.describe=props.propTrainDetailInfo.detail
        state.content_list=props.propTrainDetailInfo.contents
    },{deep:true,immediate:true})
    onMounted(()=>{
        console.log(state.describe,state.content_list,'999999999999')
        state.describe=props.propTrainDetailInfo.detail
        state.content_list=props.propTrainDetailInfo.contents
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.trainingGuide{
    margin: 10px;
     .traindescribe{
        margin-bottom: 20px;
    }
    .star{
        width: 12px;
        color: red;
    }
    .trainingOverview,.simulationTasks{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .markdown{
        .mark__body .mark__preview{
            height: 370px;
        }
        .mark__tool-bar .mark__tool-bar--left{
            flex:none;
        }
    }
    .bottom-btn{
        margin-top: 50px;
        display: flex;
        justify-content:center;
        .return{
        margin-right:20px;
    }
    }
}
   
</style>