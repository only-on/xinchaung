<template>
  <examLayput>
      <template v-slot>
          <div class="exam-doing-content">
        <top></top>
        <div class="exam-content-box">
          <div class="exam-content-left">111</div>
          <div class="exam-content-right">
            <div class="exam-topic-box">选择题</div>
            <div class="finish-btn">
              <a-button type="primary" class="" @click="finshExam"
                >结束考试</a-button
              >
            </div>
          </div>
        </div>
      </div>
      </template>
    </examLayput>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import top from "./top.vue";
import { useRouter } from "vue-router";
import examLayput from "../examLayout.vue"
export default defineComponent({
  components: {
    top,
    examLayput
  },
  setup() {
    const router = useRouter();
    function finshExam() {
      router.push({
        path: "/exam/list",
      });
    }
    return {
      finshExam,
    };
  },
});
</script>


<style lang="less">

    .exam-doing-content {
      width: 100%;
      height: 100%;
      padding: 0px 80px;
      box-sizing: border-box;
      background: #e6e4ff;
      display: flex;
      flex-direction: column;
      .exam-content-box {
        flex: 1;
        display: flex;
        flex-direction: row;
        .exam-content-left {
          flex: 1;
        }
        .exam-content-right {
          padding: 50px 10px 50px 0px;
          width: 460px;
          background-image: url("../../../assets/exam/answer-card.png");
          background-position: center 0px;
          background-repeat: no-repeat;
          background-origin: content-box;
          display: flex;
          flex-direction: column;
          .exam-topic-box {
            flex: 1;
            margin-top: 80px;
            width: 300px;
            margin-left: 83px;
          }
          > .finish-btn {
            margin-top: auto;
            margin-bottom: 80px;
            text-align: center;
          }
        }
      }
    }
</style>