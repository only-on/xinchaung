<template>
    <div>
        <div class="exerciseList">
            <div class="directoryList" v-if="componentData?.length">
                <div class="data-set-listItem" v-for="(item,index) in componentData" :key="index.toString()" @click="toExerDetail(item)">
                    <div class="exam-list-title">{{item.name}}</div>
                    <div class="exam-list-time"><i class="iconfont icon-shijian"></i>{{item.created_at.split(" ")[0]}}</div>
                    <div class="exam-list-num"><i class="iconfont icon-xiangmu"></i>{{item.questions_count}}</div>
                    <div class="exam-list-delete" @click.stop="deleteExamItem(item.id)"><i class="iconfont icon-shanchu-copy"></i></div>
                </div>
                <a-modal
                    title="提示"
                    :visible="visible"
                    @ok="handleOk"
                    @cancel="handleCancel"
                    >
                    <p>目录删除后将无法恢复，确定要删除吗？</p>
                </a-modal>
            </div>
            <div v-else>
                <empty type="empty"></empty>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
interface State{
    visible:boolean,
    poolId?:number,
}
import {defineComponent, toRefs,reactive}from 'vue'
import { useRouter } from 'vue-router';
export default defineComponent({
    name:'privateExercises',
    props: ["componentData","searchValue"],
     setup:(props,context)=>{
    const router = useRouter();
     const state:State=reactive({
         visible:false
     })
        function deleteExamItem(id:any){
           state.visible=true
           state.poolId=id
        }
        function toExerDetail(item:any){
            console.log(item,'item')
            router.push({path:'/exercisesDetail',query:{id:item.id,initial:0}})
        }
        function handleOk(){
           state.visible=false
           context.emit('poolId',state.poolId)
        }
        function handleCancel(){
            state.visible=false
        }
        return {deleteExamItem,toExerDetail,handleOk,handleCancel,...toRefs(state)}
    }
})
</script>
<style lang="less" scoped>
    .directoryList{
      margin: 2px;  
    }
    .data-set-listItem:hover{
            border: 1px solid rgba(42, 191, 158, 0.05);
            box-shadow: 0 0 5px 3px rgb(0 0 0 / 10%);
        }
    .data-set-listItem{
        border-radius: 5px;
        border: 1px solid #DDDDDD;
        padding: 6px 10px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        cursor: pointer;
        transition: all 0.5s;  
        height: 60px;
        align-items: center;
        .exam-list-title {
        width: 50%;
        margin-left: 25px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #595B5A;
        font-size: 16px;
        cursor: pointer;
        margin-right: 10%;
    }
    .exam-list-time{
        width: 10%;
        height: 30px;
        display: flex;
        align-items: center;
        color: #B7B7B7;
        .icon-shijian{
            margin-right: 5px;
            font-size: 12px;
        }
    }
    .exam-list-num {
        width: 10%;
        height: 30px;
        display: flex;
        align-items: center;
        color: #B7B7B7;
        .icon-xiangmu{
            margin-right: 5px;
            font-size: 12px;
        }
    }
    .exam-list-delete{
        margin-right: 25px;
    }
    .icon-shanchu-copy{
         font-size:16px;
         color: #B7B7B7;
    }
}

</style>