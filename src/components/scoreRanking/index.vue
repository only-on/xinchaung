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
             <a-table :columns="columns" :data-source="data" :pagination='false'>
                <template #bodyCell="{ column, text }">
                <template v-if="column.dataIndex === 'name'">
                    <a>{{ text }}</a>
                </template>
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
  defineProps,
  withDefaults,
} from "vue";
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
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '答对',
    dataIndex: 'address',
    key: 'address 1',
    ellipsis: true,
  },
  {
    title: '答错',
    dataIndex: 'address',
    key: 'address 2',
    ellipsis: true,
  }]

const data = [
  {
    key: '1',
    name: '选择',
    age: 32,
    address: '8',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: '判断',
    age: 42,
    address: '9',
    tags: ['loser'],
  },
  {
    key: '2',
    name: '填空',
    age: 42,
    address: '9',
    tags: ['loser'],
  },
  {
    key: '2',
    name: '解答',
    age: 42,
    address: '9',
    tags: ['loser'],
  },{
    key: '2',
    name: '编程',
    age: 42,
    address: '9',
    tags: ['loser'],
  },{
    key: '2',
    name: '模型',
    age: 42,
    address: '9',
    tags: ['loser'],
  },{
    key: '2',
    name: '全部',
    age: 42,
    address: '9',
    tags: ['loser'],
  }]
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
