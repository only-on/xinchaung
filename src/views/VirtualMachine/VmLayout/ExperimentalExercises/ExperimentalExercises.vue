<template>
  <div class="experimental-exercises">
    <template v-for="(item, index) in judgeData" :key="index">
      <judge
        class="experimental-exercises-item"
        v-model="judgeData[index]"
        :index="index"
        v-if="item.type === 1"
      ></judge>
      <single-choice
        class="experimental-exercises-item"
        v-model="judgeData[index]"
        :index="index"
        v-if="item.type === 2"
      ></single-choice>
      <multiple-choice
        class="experimental-exercises-item"
        v-model="judgeData[index]"
        :index="index"
        v-if="item.type === 3"
      ></multiple-choice>
      
    </template>
    <div class="exercise-action">
      <a-button type="primary">提交</a-button><i>您以提交过习题答案</i>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, toRefs, reactive } from "vue";
import judge from "src/components/exercises/judge.vue";
import singleChoice from "src/components/exercises/singleChoice.vue";
import multipleChoice from "src/components/exercises/multipleChoice.vue";

export default defineComponent({
  components: {
    judge,
    "single-choice": singleChoice,
    "multiple-choice": multipleChoice,
  },
  setup(props) {
    const data: Array<any> = [
      {
        name: "判断题",
        type: 1,
        options: [
          {
            id: 1,
            option: "正确",
          },
          {
            id: 2,
            option: "错误",
          },
        ],
        answers: [
          {
            id: 2,
            answer: "正确",
          },
        ],
      },
      {
        name: "单选题名称",
        type: 2,
        options: [
          {
            id: 1,
            option: "A:好设计是诚实的",
          },
          {
            id: 2,
            option: "B:改变别人之前，先改变自己吧",
          },
          {
            id: 3,
            option: "C:不怕输，才会赢",
          },
          {
            id: 4,
            option: "D:改变别人之前，先改变自己吧",
          },
        ],
        answers: [
          {
            id: 3,
            answer: "正确",
          },
        ],
      },
      {
        name: "多选题名称",
        type: 3,
        options: [
          {
            id: 1,
            option: "A:好设计是诚实的",
          },
          {
            id: 2,
            option: "B:改变别人之前，先改变自己吧",
          },
          {
            id: 3,
            option: "C:不怕输，才会赢",
          },
          {
            id: 4,
            option: "改变别人之前，先改变自己吧",
          },
        ],
        answers: [
          {
            id: 4,
            answer: "改变别人之前，先改变自己吧",
          },
          {
            id: 1,
            answer: "A:好设计是诚实的",
          },
        ],
      },
    ];
    const judgeData = reactive(data);
    console.log();

    watch(
      judgeData,
      () => {
        console.log(judgeData);
      },
      { deep: true }
    );
    return { judgeData };
  },
});
</script>

<style lang="less">
.experimental-exercises {
  padding: 11px;
  height: calc(100% - 22px);
  overflow: auto;
  .exercise-action {
    margin-top: 40px;
    > i {
      font-style: normal;
      color: #ff8f00;
      font-size: 14px;
      margin-left: 21px;
    }
  }
}
</style>
