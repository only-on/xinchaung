<template>
  <div class="exam-list-top">
    <div class="exam-top-img" v-layout-bg>
      <img src="../../../assets/exam/top-images.png" alt="" />
    </div>
    <div class="exam-info">
      <div class="exam-info-name">
        <span class="exam-title">{{infoData.name}}</span>
        <span class="back-btn" @click="back">返回</span>
      </div>
      <div class="exam-count">
        <span>
          试卷总分<i>{{infoData.paper_score_total}}</i>
        </span>
        <span>
          试题数量<i>{{infoData.questions_count}}</i>
        </span>
        <span>
          通过分数<i>{{infoData.pass_score}}</i>
        </span>
        <span>
          考试用时<i>{{infoData.use_time_seconds}}</i>
        </span>
        <span>
          班级排名<i>{{infoData.class_rank}}</i>
        </span>
      </div>
    </div>
    <div class="scoer-image">
      <img src="../../../assets/exam/stu-bg-score.jpg" alt="">
      <div class="result-score">
        <span>分数</span>
        <span>{{infoData.myself_score?infoData.myself_score:0}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  props:["data"],
  setup(props) {
    const router=useRouter()
    const infoData=ref(props.data)
    function back(){
      router.go(-1)
    }
    return {
      back,
      infoData
    };
  },
});
</script>

<style lang="less">
.exam-list-top {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  border-bottom: 1px solid #c5c5dc;
  .exam-info {
    margin-left: 25px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .exam-info-name{
      .exam-title{
        font-size: 18px;
        font-weight: 400;
      }
      .back-btn{
        font-size: 14px;
        border: 1px solid @theme-color;
        margin-left: 30px;
        padding: 5px 15px;
        border-radius: 3px;
        color: @theme-color;
        cursor: pointer;
      }
    }
    >div{
      &.exam-count{
        margin-bottom: 15px;
        >span{
          font-size: 14px;
          margin-right: 10px;
          >i{
            font-style: normal;
            color: @theme-color;
            font-size: 20px;
            margin-left: 5px;
          }
        }
      }
    }
  }
  .scoer-image {
    margin-left: auto;
    flex-shrink: 0;
    position: relative;
    .result-score{
      position: absolute;
      right: 132px;
      top: 20px;
      display: flex;
      flex-direction: column;
      color: red;
      align-items: center;
      >span{
        &:nth-child(1){
          font-size: 16px;
        }
        &:nth-child(2){
          font-size: 32px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>