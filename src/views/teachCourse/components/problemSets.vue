<template>
  <div class="problemSets">
    <a-tabs v-model:activeKey="activeTab" :animated="false">
      <a-tab-pane key="1" tab="初学" v-if="examData.question_result.first && examData.question_result.first.length > 0">
        <exam-list :examData="examData" type="first"></exam-list>
      </a-tab-pane>
      <a-tab-pane key="2" tab="重修" v-if="examData.question_result.rebuild && examData.question_result.rebuild.length > 0">
        <exam-list :examData="examData" type="rebuild"></exam-list>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import ExamList from "./examList.vue";

export default defineComponent({
  components: {
    ExamList,
  },
  setup() {
    const activeTab = ref<string>("2");
    var examData = reactive(
      {
      examItems: [
        {
          id: 107,
          title: "啊啊",
          type: 2,
          score: 10,
          options: [
            {
              value: "11",
              is_ansewr: "1",
            },
            {
              value: "1",
              is_ansewr: "0",
            },
            {
              value: "1",
              is_ansewr: "0",
            },
            {
              value: "1",
              is_ansewr: "0",
            },
          ],
        },
         {
          id: 108,
          title: "判断题",
          type: 1,
          score: 10,
          options: [
            {
              value: "正确",
              is_ansewr: "1",
            },
            {
              value: "错误",
              is_ansewr: "0",
            }
          ],
        },
        {
          id: 109,
          title: "多选题",
          type: 3,
          score: 10,
          options: [
            {
              value: "1111",
              is_ansewr: "1",
            },
            {
              value: "22222",
              is_ansewr: "1",
            },
            {
              value: "333",
              is_ansewr: "0",
            }
          ],
        },
      ],
      question_result: {
        first: ['0', '1'],
        rebuild: ['2', '0', '0,1,2'],
      },
      type: 1,
    }
    );
    watch(examData, (newVal) => {
      if (newVal.question_result.first && newVal.question_result.first.length > 0) {
        activeTab.value = '1'
      } else {
        activeTab.value = '2'
      }
    })
    return {
      activeTab,
      examData
    };
  },
});
</script>
<style lang="less" scoped>
.problemSets {
}
</style>
