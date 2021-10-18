<template>
    <div class="addTask">
        <div>
            <div><span class="star">*</span>任务名称</div>
            <a-input style="width:400px;margin-top:5px" placeholder='请输入任务名称'></a-input>
        </div>
        <div class="points">
            <!-- <a-form-item required label="知识点">
                <div class="knowledge">
                <span v-for="(v, i) in selectedKnowledgeList" :key="v.id">
                    {{v.text}}
                    <i class="iconfont icon-guanbi1-copy" @click="delKnowledge(i)"></i>
                </span>
                </div>
                <a-button type="primary" @click="selectKnowledge">选择</a-button>
            </a-form-item>
            <knowledge-modal v-model:isShow="isShowKnowledge" v-model:selectedList="selectedKnowledgeList"></knowledge-modal> -->
        </div>
    </div>
</template>
<script lang="ts">
interface Istate{
    isShowKnowledge:boolean
} 
import { defineComponent,onMounted,inject,reactive,toRefs,ref} from 'vue'
import knowledgeModal from '../../../teachCourse/createTestPaper/knowledgeModal.vue'
export default defineComponent({
    name:'addTask',
    components:{knowledgeModal},
    props:['contentList','edit'],
    setup(props,context){
    const state:Istate=reactive({
        isShowKnowledge:false,
        selectedKnowledgeList:[]
    })
    const methods={
        selectKnowledge(){
            state.isShowKnowledge= true
        }
    }
    return {...toRefs(state),...methods}
    }
})
</script>
<style lang="less">
   .points{
       margin-top:30px;
   }
</style>