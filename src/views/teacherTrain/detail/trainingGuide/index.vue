<template>
    <div class="trainingGuide" v-layout-bg>
        <div v-if="addTask">
            <div class="traindescribe">
                <div class="trainingOverview">
                    <div><span class="star">*</span>实训概述:</div>
                    <a-button type="primary" v-if="edit" @click="toEdit">编辑</a-button>
                    <a-button type="primary" v-else @click="toSave">保存</a-button>
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
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import taskList from '../../components/taskList/index.vue'
import addTask from '../../components/addTask/index.vue'
import request from 'src/api/index'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'trainingGuide',
    props:['propTrainDetailInfo','trainId'],
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
            const formdata=new FormData()
            formdata.append('train_id',props.trainId)
            formdata.append('detail',state.describe)
            state.content_list?.forEach((item:any,index:any)=>{
                formdata.append('list_content['+index+'][train_content_id]',item.train_content_id)
                formdata.append('list_content['+index+'][train_id]',item.train_id)
                formdata.append('list_content['+index+'][name]',item.name)
                formdata.append('list_content['+index+'][describe]',item.describe)
                formdata.append('list_content['+index+'][step][id]',item.step.id)
                formdata.append('list_content['+index+'][step][step_name]',item.step.step_name)
                formdata.append('list_content['+index+'][step][knowledge_id]',item.step.knowledge_id)
                formdata.append('list_content['+index+'][step][summary]',item.step.summary)
                formdata.append('list_content['+index+'][step][state]',item.step.state)
                formdata.append('list_content['+index+'][step][serial]',item.step.serial)
                formdata.append('list_content['+index+'][step][type]',item.step.type)
                item.step.knowledge?.forEach((it:any) => {
                    formdata.append('list_content['+index+'][step][nowledge][]',it)
                });
                item.step.knowledges?.forEach((j:any) => {
                    formdata.append('list_content['+index+'][step][knowledges][]',j)
                })
            })
            http.saveTrainGuide({param:formdata}).then((res:any)=>{
                console.log(res)
                state.edit=true
            })
        },
        doAddTask(){
            state.addTask=false
        },
        addtaskInfo(value:any){
            state.addTask=true
            state.content_list.push(value)
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
    onMounted(()=>{
        console.log(props.propTrainDetailInfo)
        state.describe=props.propTrainDetailInfo.detail
        state.content_list=props.propTrainDetailInfo.content_list
    })
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
.trainingGuide{
    margin: 10px;
}
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
</style>