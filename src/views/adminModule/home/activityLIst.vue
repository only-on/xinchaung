<template>
    <div class="Ranking">
        <div class="gamePlayer flexCenter" v-for="(v,k) in activeList" :key="v">
            <div class="user flexCenter">
            <div class="rank" :class="Number(k)<3?`rank${Number(k)+1}`:''">{{Number(k)>2?Number(k)+1:''}}</div>
            <div class="name" :title="v.name">{{v.name}}</div>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, toRefs, onMounted ,reactive} from "vue";
  import request from 'src/api/index'
  interface Props {
    activeList:any;
  }
  const props = withDefaults(defineProps<Props>(), {
    activeList:[],
  });
  // var list:any=ref([])
  // function courseRankList(){
  //   list.value=['大数据技术原理课程相关概念大数据技术原理课程相关概念大数据技术原理课程相关概念','大数据技术原理课程相关概念讲解','大数据技术原理课程相关概念讲解','大数据技术原理课程相关概念哈阿啊阿啊阿啊阿啊阿啊阿啊阿啊']
  //   // list.length=0
  //   // http.courseRankList({urlParams: {courseId:props.courseId}}).then((res: any) => {
  //   //   const {data}=res
  //   //   list.push(...data)
  //   //   list=['大数据技术原理课程相关概念...','大数据技术原理课程相关概念讲解','大数据技术原理课程相关概念讲解','大数据技术原理课程相关概念...']
  //   // });
  // }
  onMounted(() => {
    // console.log(props.courseId)
    // courseRankList()
  });
  
  </script>
  
  <style lang="less" scoped>
    .Ranking{
      margin-bottom: 2rem;
      .flexCenter{
        width: 100%;
      }
      .gamePlayer{
        width: 100%;
        line-height: 40px;
        .rank{
          width: 24px;
          height: 20px;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          line-height: 20px;
          text-align: center;
          font-size: var(--font-size-sm);
          color: var(--black-45);
          margin-right: 20px;
          &.rank1{
            
            background-image: url('src/assets/images/admin/home/top1.png');   
          }
          &.rank2{
            background-image: url('src/assets/images/admin/home/top2.png');
          }
          &.rank3{
            background-image: url('src/assets/images/admin/home/top3.png');
          }
        }
        .name{
          color: var(--black-65);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow:ellipsis;
          
        }
        .progress{
          color: var(--black-45);
        }
      }
    }
  </style>