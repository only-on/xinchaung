<template>
  <div class="exam-list-top">
    <div class="exam-top-img">
      <img :src="topImages" alt="" />
    </div>
    <div class="exam-info">
      <div class="exam-count">
        <span>总分：{{ startExamInfoData?.all_score }}</span>
        <span>试题数量：{{ startExamInfoData?.questions_count }}</span>
        <span>通过分数：{{ startExamInfoData?.pass_score }}</span>
      </div>
      <div>试卷名称</div>
      <div class="teacher-or-start-status">
        <span
          ><i class="teacher-icon"></i
          >{{ startExamInfoData?.author_name }}</span
        >
        <span class="exam-status">进行中</span>
      </div>
    </div>
    <div class="exam-action">
      <span class="count-down-time">
        <i>倒计时：</i>
        {{ times.h > 9 ? times.h : "0" + times.h }}<i>小时</i>
        {{ times.m > 9 ? times.m : "0" + times.m }}<i>分</i>
        {{ times.s > 9 ? times.s : "0" + times.s }}<i>秒</i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref, watch } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { countDown, Itimes } from "src/utils/common";
import topImages from "src/assets/images/exam/top-images.png";
export default defineComponent({
  setup(props,{emit}) {
    const router = useRouter();
    let startExamInfoData: any = inject("startExamInfoData");
    const times: Ref<Itimes> | undefined = ref({
      d: "00",
      h: "00",
      m: "00",
      s: "00",
    });
    let timers: NodeJS.Timer | null = null;
    onBeforeRouteLeave(() => {
      clearInterval(Number(timers));
    });
    watch(
      () => startExamInfoData,
      () => {
        if (!startExamInfoData?.value) return;
        if (!startExamInfoData?.value.times) return;
        let endTime = startExamInfoData?.value.times.split("~");
        times.value = countDown(new Date(), startExamInfoData?.value.closed_at);
      },
      { deep: true, immediate: true }
    );
    function calculateTime() {
      if (!times?.value) {
        return;
      }
      times.value = countDown(new Date(), startExamInfoData?.value.closed_at);
      if (times.value.s <= 0 && times.value.m <= 0 && times.value.h <= 0) {
        times.value.s = 0;
        times.value.m = 0;
        times.value.h = 0;
        times.value.d = 0;
        emit("finsh")
      }
    }

    timers = setInterval(() => {
      calculateTime();
    }, 1000);
    return {
      startExamInfoData,
      times,
      topImages,
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
          background-image: url(/src/assets/images/exam/teacher.png);
          background-size: 100%;
          width: 24px;
          height: 24px;
          vertical-align: sub;
          margin-right: 3px;
        }
        .exam-status {
          color: var(--glod-6);
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
      background: var(--glod-6);
      border-radius: 20px;
      padding: 5px 10px;
      color: var(--white-100);
      i {
        font-style: normal;
        font-size: 12px;
      }
    }
  }
}
</style>