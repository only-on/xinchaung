<template>
    <div>
        <div class="exerciseList">
            <div class="directoryList" v-if="componentData.length">
                <div class="data-set-listItem" v-for="(item,index) in componentData" :key="index.toString()" @click="toExerDetail(item)">
                    <div class="exam-list-title">{{item.name}}</div>
                    <div class="exam-list-time"><i class="iconfont icon-shijian"></i>{{item.created_at.split(' ')[0]}}</div>
                    <div class="exam-list-num"><i class="iconfont icon-xiangmu"></i>{{item.questions_count}}</div>
                </div>
            </div>
            <div v-else>
                <div v-if="searchValue">
                    <empty type="searchEmpty"></empty>
                </div>
                <div v-else>
                    <empty type="empty"></empty>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent}from 'vue'
import { useRouter } from 'vue-router';
import Empty from 'src/components/Empty.vue'
export default defineComponent({
    name:'shareExercises',
    components:{Empty},
    props: ["componentData","searchValue"],
    setup:(props,context)=>{
        console.log(props,'props')
        const router = useRouter();
         function toExerDetail(item:any){
            console.log(item,'item')
            // router.push({path:'/exercisesDetail',query:{item:JSON.stringify(item),initial:1}})
            router.push({path:'/exercisesDetail',query:{id:item.id,initial:1}})
        }
        return {toExerDetail}
    }
})
</script>
<style lang="less" scoped>
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
}

</style>