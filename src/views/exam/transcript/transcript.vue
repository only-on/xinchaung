<template>
  <examLayout>
    <template v-slot>
      <div class="exam-transcript-content">
        <top class="transcript-top"></top>
        <div class="frist-box">
          <div class="score-detail-echarts">
            <p class="echarts-title">成绩详情</p>
            <div id="scoreDetail" class="score-detail">
              
            </div>
          </div>
          <div class="accuracy-echarts">
            <p class="echarts-title">正确率</p>
            <div id="accuracy" class="accuracy"></div>
          </div>
        </div>
        <div class="second-box">
          <p class="echarts-title">答题详情</p>
          <div class="" id="answerDetail"></div>
        </div>
      </div>
    </template>
  </examLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import top from "./top.vue";
import examLayout from "../examLayout.vue";
import echarts from "echarts"
export default defineComponent({
  components: {
    top,
    examLayout,
  },
  setup() {
    console.log(echarts);
    
  },
});
</script>

<style lang="less">
.exam-transcript-content {
  width: 100%;
  height: 100%;
  padding: 0px 80px;
  box-sizing: border-box;
  background: #e6e4ff;
  display: flex;
  flex-direction: column;
  .frist-box {
    height: 100%;
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 20px;
    > .score-detail-echarts {
      display: flex;
      flex-direction: column;
      width: 50%;
      #scoreDetail {
        height: 100%;
        overflow: hidden;
      }
    }
    > .accuracy-echarts {
      display: flex;
      flex-direction: column;
      width: 50%;
      #accuracy {
        height: 100%;
      }
    }
  }
  .second-box{
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
    #answerDetail{
      height: 100%;
    }
  }
  .second-box,
  .frist-box {
    height: calc(50% - 180px);
    flex-shrink: 0;
    .echarts-title {
      color: rgba(108, 110, 114, 1);
      border-left: 4px solid rgba(108, 110, 114, 1);
      text-indent: 10px;
      font-size: 15px;
      margin-bottom: 20px;
      flex-shrink: 0;
      &::after {
        content: "";
        width: 98%;
        height: 1px;
        margin-top: 4px;
        background-color: rgba(207, 213, 223, 1);
        display: block;
        transform: translate(-5px, 10px);
      }
    }
  }
}
</style>
