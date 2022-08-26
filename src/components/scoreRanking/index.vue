<template>
    <div class="score_ranking">
        <div class="stu_score" v-if="info.id">
            <img src="/src/assets/images/task/person_img.png">
            <div class="name">{{info.user_profile.name}}</div>
            <div class="stu_number">{{info.user_profile.sno}}</div>
            <div class="rank">
                <div>NO.{{info.rank}}</div>
                <div>{{info.total_score}}</div>
            </div>
            <div class="score_rank">
                <span>成绩排名</span>
                <span>作业总分</span>
            </div>
             <a-table :columns="columns" :data-source="data2" :pagination='false'>
                <template #bodyCell="{ column, text }">
                <!-- <template v-if="column.dataIndex === 'name'">
                    <a>{{ text }}</a>
                </template> -->
                </template>
            </a-table>
        </div>
        <div class="submit_time">
            <div>提交时间</div>
            <div>{{info.sumbmit_time}}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
  PropType,
  createVNode
} from "vue";
import getTopicType from 'src/components/TopicDisplay/topictype'
import {NoToCh,TotalScore,Debounce} from 'src/utils/common'
interface optionType{
    name:string,
    value:any,
}
interface Props { 
  options?:optionType[];
  difficulty?:any;
  info:any
}
const props = withDefaults(defineProps<Props>(),{
  options: () =>[],
  difficulty:()=>1,
  info:() =>{},
});
const columns = [
  {
    title: '题型',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '得分',
    dataIndex: 'score',
    key: 'age'
  },
  {
    title: '答对',
    dataIndex: 'correct_cnt',
    key: 'address 1',
    ellipsis: true,
  },
  {
    title: '答错',
    dataIndex: 'wrong_cnt',
    key: 'address 2',
    ellipsis: true,
  }]

const data = [
  {
    key: '1',
    name: '选择',
    score: 32,
    correct_cnt: '8',
    wrong_cnt: '8',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: '判断',
    score: 42,
    correct_cnt: '8',
    wrong_cnt: '8',
    tags: ['loser'],
  },
  {
    key: '2',
    name: '填空',
    score: 42,
    correct_cnt: '8',
    wrong_cnt: '8',
    tags: ['loser'],
  },
  {
    key: '2',
    name: '解答',
    score: 42,
    correct_cnt: '8',
    wrong_cnt: '8',
    tags: ['loser'],
  },{
    key: '2',
    name: '编程',
    score: 42,
    correct_cnt: '8',
    wrong_cnt: '8',
    tags: ['loser'],
  },{
    key: '2',
    name: '模型',
    score: 12,
    correct_cnt: '18',
    wrong_cnt: '85',
    tags: ['loser'],
  },{
    key: '2',
    name: '全部',
    score: 42,
    correct_cnt: '8',
    wrong_cnt: '8',
    tags: ['loser'],
  }]
const data2:any=reactive([])  
watch(()=>{return props.info.exam_statistic},(val:any)=>{
  console.log(val)
  data2.length=0
  if(val && Object.keys(val).length){
    Object.keys(val).map((v:any)=>{
      let obj={
        name:getTopicType[v].subname,
        score:val[v].score,
        correct_cnt:val[v].correct_cnt,
        wrong_cnt:val[v].wrong_cnt,
      }
      data2.push(obj)
    })
    let obj2={
      name:'全部',
      score:TotalScore(data2,'score'),
      correct_cnt:TotalScore(data2,'correct_cnt'),
      wrong_cnt:TotalScore(data2,'wrong_cnt'),
    }
    data2.push(obj2)
  }
  console.log(data2)
},{immediate:true,deep:true})  
</script> 
<style lang="less" scoped>
.score_ranking{
    width:270px;
    background: white;
    color: var(--black-65);
}
.stu_score{
    padding: 15px;
    text-align: center;
    img{
        margin-bottom: 8px;
    }
    .name{
        font-size: 18px;
        color: black;
        font-weight: 400;
    }
    .stu_number{
        margin-bottom: 8px;
    }
    .rank{
        display: flex;
        justify-content: center;
        >div{
            width:100px;
            height:30px;
           color: white;
           display: flex;
           justify-content: center;
           align-items: center;
           font-size: 18px;
           font-weight: 700;
        }
        >div:nth-child(1){
           border-radius: 15px 0px 15px 15px;
           background: var(--brightBtn); 
           margin-right: 10px;
        }
        >div:nth-child(2){
           border-radius: 0px 15px 15px 15px;
           background: var(--primary-color);
        }
    }
    .score_rank{
        margin-top: 5px;
        margin-bottom:20px;
        >span{
            display: inline-block;
            width: 100px;
            font-size: 14px;
        }
        >span:nth-child(1){
            margin-right: 10px;
        }
    }
}
.submit_time{
    background: #f5f5f5;
    height: 80px;
    text-align: center;
    >div:nth-child(1){
        padding-top: 15px;
        margin-bottom: 10px;
    }
}
</style>
