<template>
  <div class="exper">
    <div class="testTitle">初学</div>
    <div class="test" v-for="(item, index) in data" :key="index.toString()">
      <div class="title">
        <span>{{ index + 1 }}、{{ item.title }}</span>
        <span class="score">({{ item.score }})</span>
      </div>
      <div class="answer">
        <div v-for="(it, j) in item.answer" :key="j.toString()">
          {{ it.item }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
interface Istate {
  data: any[];
}
export default defineComponent({
  name: "CourseAchievement",
  props: ["detailInfo"],
  setup: (props, context) => {
    const state: Istate = reactive({
      data: [
        {
          title: "问题1（）",
          score: 100,
          answer: [
            { id: 1, item: "正确" },
            { id: 2, item: "错误" },
          ],
        },
      ],
    });
    return { ...toRefs(state) };
  },
});
</script>
<style lang="less" scoped>
.testTitle {
  color: @theme-color;
  padding: 15px;
  border-bottom: 1px solid @normal-color;
}
.test {
  padding: 20px;
  .title {
    background-color: @descriptions-bg;
  }
  .score {
    margin-left: 30px;
    color: @theme-color;
  }
  .answer {
    margin-top: 10px;
    margin-left: 30px;
  }
}
</style>
