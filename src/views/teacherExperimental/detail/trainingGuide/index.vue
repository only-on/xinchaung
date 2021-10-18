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
                <task-list :contentList='content_list' :edit='edit' />
            </div>
        </div>
        <div v-else>
           <add-task/>
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
export default defineComponent({
    name:'trainingGuide',
    props:['propTrainDetailInfo'],
    components:{
        'antdv-markdown':AntdvMarkdown,
        'task-list':taskList,
        'add-task':addTask
    },
    setup(props,context){
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
            state.edit=true
        },
        doAddTask(){
            state.addTask=false
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
</style>