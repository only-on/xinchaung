<template>
  <div class="class-practice-box scrollbar">
    <div v-for="(item, index) in data" :key="index" class="test-paper-item">
      <h2 class="test-paper-title">{{ item.paperName }}</h2>
      <div class="test-paper-count">
        <span class="question-count"
          >共<i>{{ item.count }}</i
          >题</span
        >
        <span class="question-score"
          >满分<i>{{ item.score }}</i
          >分</span
        >
        <span class="open-close-btn" @click="openOrClose(index)"
          >{{openIndexs.includes(index) ?"收起":"展开"}}<i
            class="iconfont"
            :class="openIndexs.includes(index) ? 'icon-shouqi' : 'icon-zhankai'"
          ></i
        ></span>
      </div>
      <div
        class="test-paper-question-box"
        :style="{ height: openIndexs.includes(index) ? '100%' : '0' }"
      >
        <test-paper v-model="data[index].question"></test-paper>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import testPaper from "./testPaper.vue";
export default defineComponent({
  components: {
    "test-paper": testPaper,
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
                option: "A:好设计是诚实的2",
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧2",
              },
              {
                id: 3,
                option: "C:不怕输，才会赢2",
              },
              {
                id: 4,
                option: "D:改变别人之前，先改变自己吧2",
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
      {
        paperName: "测试试卷4",
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
          {
            name: "填空题名称",
            type: 4,
            options: [
              {
                id: 1,
                option: "A:好设计是诚实的",
                score:10,
              },
              {
                id: 2,
                option: "B:改变别人之前，先改变自己吧",
                score:21,
              },
              {
                id: 3,
                option: "C:不怕输，才会赢",
                score:31,
              },
              {
                id: 4,
                option: "改变别人之前，先改变自己吧",
                score:41,
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

    const openIndexs: Array<number> = reactive([]);
    function openOrClose(i: number) {
      if (openIndexs.includes(i)) {
        openIndexs.splice(openIndexs.indexOf(i), 1);
      } else {
        openIndexs.push(i);
      }
    }
    watch(data, () => {
      console.log(data);
    });
    return { data, openIndexs, openOrClose };
  },
});
</script>

<style lang="less">
.class-practice-box {
  height: calc(100% - 30px);
  padding: 8px;
  margin-right: 8px;
  overflow: auto;
  box-sizing: content-box;
  white-space: normal;

  .test-paper-item {
    background: linear-gradient(270deg, #ecf0ff 0%, #fdf5ff);
    margin-bottom: 12px;
    padding: 0 15px;
    .test-paper-title {
      font-size: 16px;
    }
    .test-paper-count {
      margin-right: 15px;
      //   padding-bottom: 12px;
      border-bottom: 1px dashed rgba(187, 156, 214, 0.24);
      //   margin-bottom: 12px;
      display: flex;
      flex-direction: row;
      > span {
        font-size: 12px;
        color: rgba(5, 1, 1, 0.45);
        > i {
          font-style: normal;
          margin: 0 5px;
        }
        &.question-score {
          margin-left: 24px;
        }
        &.open-close-btn {
          margin-left: auto;
          font-size: 14px;
          color: @theme-color;
          cursor: pointer;
        }
      }
    }
    .test-paper-question-box {
      overflow: hidden;
      box-sizing: border-box;
      .test-paper-question-list {
        margin-top: 12px;
      }
    }
  }
}
</style>
