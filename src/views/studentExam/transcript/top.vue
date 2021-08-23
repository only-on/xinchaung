<template>
  <div class="exam-list-top">
    <div class="exam-top-img" v-layout-bg>
      <img src="../../../assets/exam/top-images.png" alt="" />
    </div>
    <div class="exam-info">
      <div class="exam-info-name">
        <span class="exam-title">试卷名称</span>
        <span class="back-btn" @click="back">返回</span>
      </div>
      <div class="exam-count">
        <span>
          试卷总分<i>12</i>
        </span>
        <span>
          试题数量<i>12</i>
        </span>
        <span>
          通过分数<i>12</i>
        </span>
        <span>
          考试用时<i>12</i>
        </span>
        <span>
          班级排名<i>12</i>
        </span>
      </div>
    </div>
    <div class="scoer-image">
      <img src="../../../assets/exam/stu-bg-score.jpg" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router=useRouter()
    function back(){
      // router.push({
      //   path:"/exam/list"
      // })
      router.go(-1)
    }
    return {
      back
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
  }
}
</style>