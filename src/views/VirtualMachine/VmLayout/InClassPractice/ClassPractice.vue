<template>
  <div>
      <div v-for="(item,index) in data" :key="index">

      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import judge from "src/components/exercises/judge.vue";
import singleChoice from "src/components/exercises/singleChoice.vue";
import multipleChoice from "src/components/exercises/multipleChoice.vue";
export default defineComponent({
  components: {
      judge,
    "single-choice": singleChoice,
    "multiple-choice":multipleChoice
  },
  setup() {
    const paper = [
      {
        paperName: "测试试卷1",
        count: 5,
        score: 70,
        question: [
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
        ],
      },
      {
        paperName: "测试试卷2",
        count: 51,
        score: 122,
        question: [
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
        ],
      },
      {
        paperName: "测试试卷3",
        count: 12,
        score: 170,
        question: [
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
        ],
      },
    ];
    const data = reactive(paper);
    return {data}
  },
});
</script>
