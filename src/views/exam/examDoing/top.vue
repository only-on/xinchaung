<template>
  <div class="exam-list-top">
    <div class="exam-top-img">
      <img src="../../../assets/exam/top-images.png" alt="" />
    </div>
    <div class="exam-info">
      <div class="exam-count">
        <span>总分：12</span>
        <span>试题数量：1</span>
        <span>通过分数：6</span>
      </div>
      <div>试卷名称</div>
      <div class="teacher-or-start-status">
        <span><i class="teacher-icon"></i>文和</span>
        <span class="exam-status">即将开始</span>
      </div>
    </div>
    <div class="exam-action">
      <span class="count-down-time">
          <i>倒计时：</i>
          00<i>小时</i>
          00<i>分</i>
          52<i>秒</i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    return {
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
    > div {
      line-height: 45px;
      &.exam-count {
        > span {
          margin-right: 30px;
        }
      }
      &.teacher-or-start-status {
        .teacher-icon {
          display: inline-block;
          background-image: url(/src/assets/exam/teacher.png);
          background-size: 100%;
          width: 24px;
          height: 24px;
          vertical-align: sub;
          margin-right: 3px;
        }
        .exam-status {
          color: @gold-6;
          margin-left: 30px;
        }
      }
    }
  }
  .exam-action {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .count-down-time {
      margin-bottom: 30px;
      background: @gold-6;
      border-radius: 20px;
      padding: 5px 10px;
      color: @white;
      i {
        font-style: normal;
        font-size: 12px;
      }
    }
  }
}
</style>