<template>
    <div class="addTask">
        <div class="taskName">
            <div><span class="star">*</span>任务名称</div>
            <a-input style="width:400px;margin-top:5px" v-model:value='addtaskInfo.name' placeholder='请输入任务名称'></a-input>
        </div>
        <div class="points">
            <div>
                <span class="star">*</span>知识点
                <a-button type="primary" @click="selectKnowledge">选择</a-button>
            </div>
            <div class="knowledge">
                <span v-for="(v, i) in selectedKnowledgeList" :key="v.id">
                    {{v.text}}
                    <i class="iconfont icon-guanbi1-copy" @click="delKnowledge(i)"></i>
                </span>
            </div>
            <knowledge-modal v-model:isShow="isShowKnowledge" v-model:selectedList="selectedKnowledgeList"></knowledge-modal>
        </div>
        <div class="taskDescribe">
            <div>
                <span class="star">*</span>任务描述
                <span class="status">状态</span><a-switch class="switch" size="midile" :checked="addtaskInfo.disabled" @change="handleDisabledChange" />
            </div>
            <div class="markdown">
                <antdv-markdown v-model="addtaskInfo.describe" />
            </div>
        </div>
        <div class="taskStep">
            <div><span class="star">*</span>任务步骤</div>
            <div class="markdown">
                <antdv-markdown v-model="addtaskInfo.taskStep" />
            </div>
        </div>
        <div class="bottom-btn">
               <a-button class="return" type='primary' @click="cancelAddTask">返回</a-button>
               <a-button type='primary' @click="saveAddTask">保存</a-button>
        </div>
    </div>
</template>
<script lang="ts">
interface ItaskInfoType{
    name:string,
    disabled:boolean,
    describe:any,
    taskStep:any,
    points:any[]
}
interface Istate{
    addtaskInfo:ItaskInfoType
}
interface ItreeData {
  selectedKnowledgeList: ItreeDatalist[]
}
interface ItreeDatalist {
  id: string
  text: string
  children?: ItreeDatalist[]
  disabled?: boolean
}
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
import knowledgeModal from '../../../teachCourse/createTestPaper/knowledgeModal.vue'
import { message } from 'ant-design-vue';
export default defineComponent({
    name:'addTask',
    components:{knowledgeModal,'antdv-markdown':AntdvMarkdown,},
    props:['contentList','edit'],
    setup(props,context){
        // 知识点
         let isShowKnowledge = ref(false)
         let knowledgeList = reactive<ItreeData>({
            selectedKnowledgeList: []
        })
    const state:Istate=reactive({
      addtaskInfo:{
        name:'',
        disabled:false,
        describe:'',
        taskStep:'',
        points:[]
      }
    })
    const methods={
        selectKnowledge(){
            isShowKnowledge.value= true
        },
        delKnowledge(i: number){
            knowledgeList.selectedKnowledgeList.splice(i, 1)
        },
        handleDisabledChange(disabled:any) {
        state.addtaskInfo.disabled = disabled;
        },
        saveAddTask(){
            console.log(knowledgeList.selectedKnowledgeList,'知识点知识点知识点知识点知识点')
            state.addtaskInfo.points=knowledgeList.selectedKnowledgeList.map(v => v.text)
            let knowledge_map_id=knowledgeList.selectedKnowledgeList.map(v => v.id)
            if(!state.addtaskInfo.name){
                message.warning('实训任务名称不能为空！')
                return
            }
            if(!knowledgeList.selectedKnowledgeList.length){
                message.warning('实训任务知识点不能为空！')
                return
            }
            if(!state.addtaskInfo.describe){
                message.warning('实训任务描述不能为空！')
                return
            }
            if(!state.addtaskInfo.taskStep){
                message.warning('实训任务步骤不能为空！')
                return
            }
            console.log(state.addtaskInfo,'哈啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊')
            const taskInfo={
                describe:state.addtaskInfo.describe,
                name:state.addtaskInfo.name,
                step:{
                    knowledges:state.addtaskInfo.points,
                    state:state.addtaskInfo.disabled?1:0,
                    detail:state.addtaskInfo.taskStep,
                    knowledge_map_id:knowledge_map_id
                },

            }
            context.emit('addtask-info',taskInfo)
        },
        cancelAddTask(){
            context.emit('cancel-add')
        }
    }
    return {...toRefs(state),...methods,isShowKnowledge,...toRefs(knowledgeList)}
    }
})
</script>
<style lang="less">
.addTask{
       .points{
       margin-top:30px;
   }
   .knowledge {
  margin: 20px 0;
  span {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    color: @theme-color;
    margin-right: 12px;
    .iconfont {
      cursor: pointer;
    }
  }
}
  .markdown{
      margin-top: 10px;
        .mark__body .mark__preview{
            height: 370px;
        }
        .mark__tool-bar .mark__tool-bar--left{
            flex:none;
        }
    }
    .taskStep{
        margin-top: 20px;
    }
.taskDescribe{
    .status{
        margin-left:20px;
        margin-right:10px;
        color:#ccc;
    }
}
.bottom-btn{
    display:flex;
    justify-content:center;
    margin-top: 20px;
    .return{
        margin-right: 20px;
    }
}
}
</style>