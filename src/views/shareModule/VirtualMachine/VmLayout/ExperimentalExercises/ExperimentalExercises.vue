<template>
  <div class="experimental-exercises">
    <div v-if="judgeData.length === 0">
      <empty></empty>
    </div>
    <template v-else v-for="(item, index) in judgeData" :key="index">
      <single-choice
        class="experimental-exercises-item"
        v-model="judgeData[index]"
        :index="index"
        v-if="item.type_id === 1"
      ></single-choice>
      <multiple-choice
        class="experimental-exercises-item"
        v-model="judgeData[index]"
        :index="index"
        v-if="item.type_id === 2"
      ></multiple-choice>
      <judge
        class="experimental-exercises-item"
        v-model="judgeData[index]"
        :index="index"
        v-if="item.type_id === 3"
      ></judge>
      <gap-fillings
        class="experimental-exercises-item"
        v-model="judgeData[index]"
        :index="index"
        v-if="item.type_id === 4"
      ></gap-fillings>
      <short-answer-question
      class="experimental-exercises-item"
        v-model="judgeData[index]"
        :index="index"
        v-if="item.type_id === 5" 
      ></short-answer-question>
    </template>
    <div class="exercise-action" v-if="judgeData.length > 0">
      <a-button type="primary" @click="submitAnswer">提交</a-button>
      <!-- <i>您以提交过习题答案</i> -->
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  toRefs,
  reactive,
  onMounted,
  inject,
} from "vue";
import judge from "src/components/exercises/judge.vue";
import singleChoice from "src/components/exercises/singleChoice.vue";
import multipleChoice from "src/components/exercises/multipleChoice.vue";
import gapFillings from "src/components/exercises/gapFillings.vue";
import shortAnswerQuestion from "src/components/exercises/shortAnswerQuestion.vue"
import request from "src/request/getRequest";
import { useRoute } from "vue-router";
import empty from "src/components/Empty.vue";
import { message } from "ant-design-vue";

export default defineComponent({
  components: {
    judge,
    "single-choice": singleChoice,
    "multiple-choice": multipleChoice,
    empty,
    "gap-fillings": gapFillings,
    "short-answer-question":shortAnswerQuestion
  },
  setup(props) {
    let experApi = request.studentExam;
    const route = useRoute();

    let taskId = route.query.taskId;
    let opType = route.query.opType;
    // const data: Array<any> = [
    //   {
    //     name: "判断题",
    //     type: 1,
    //     options: [
    //       {
    //         id: 1,
    //         option: "正确",
    //       },
    //       {
    //         id: 2,
    //         option: "错误",
    //       },
    //     ],
    //     answers: [
    //       {
    //         id: 2,
    //         answer: "正确",
    //       },
    //     ],
    //   },
    //   {
    //     name: "单选题名称",
    //     type: 2,
    //     options: [
    //       {
    //         id: 1,
    //         option: "A:好设计是诚实的",
    //       },
    //       {
    //         id: 2,
    //         option: "B:改变别人之前，先改变自己吧",
    //       },
    //       {
    //         id: 3,
    //         option: "C:不怕输，才会赢",
    //       },
    //       {
    //         id: 4,
    //         option: "D:改变别人之前，先改变自己吧",
    //       },
    //     ],
    //     answers: [
    //       {
    //         id: 3,
    //         answer: "正确",
    //       },
    //     ],
    //   },
    //   {
    //     name: "多选题名称",
    //     type: 3,
    //     options: [
    //       {
    //         id: 1,
    //         option: "A:好设计是诚实的",
    //       },
    //       {
    //         id: 2,
    //         option: "B:改变别人之前，先改变自己吧",
    //       },
    //       {
    //         id: 3,
    //         option: "C:不怕输，才会赢",
    //       },
    //       {
    //         id: 4,
    //         option: "改变别人之前，先改变自己吧",
    //       },
    //     ],
    //     answers: [
    //       {
    //         id: 4,
    //         answer: "改变别人之前，先改变自己吧",
    //       },
    //       {
    //         id: 1,
    //         answer: "A:好设计是诚实的",
    //       },
    //     ],
    //   },
    // ];
    const reactiveData: { judgeData: any[] } = reactive({ judgeData: [] });
    console.log();
    onMounted(() => {
      getQuestionListData();
    });
    watch(
      reactiveData.judgeData,
      () => {
        console.log(reactiveData.judgeData);
      },
      { deep: true }
    );

    let allInfo = inject("allInfo");
    console.log(allInfo);

    let course_student_content_id = (allInfo as any)?.value.current.id;
    console.log(course_student_content_id);

    function getQuestionListData() {
      let params = {
        entity_type: "content",
        entity_id: taskId,
      };
      experApi.getQuestionsListApi({ urlParams: params }).then((res) => {
        console.log(res);
        reactiveData.judgeData = res?.data;
      });
    }

    function submitAnswer() {
      console.log(reactiveData.judgeData);
      let answer: Array<any> = [];

      reactiveData.judgeData.forEach((item) => {
        answer.push({
          answers: item.student_answer,
          relation_id: item.relation_id,
        });
      });
      let params = {
        is_rebuild: opType === "rebuild" ? true : false,
        course_student_content_id: course_student_content_id,
        answer: answer,
      };
      experApi.submitAnswerApi({ param: params }).then(()=>{
        message.success("提交成功")
      });
    }

    // function getExperimentStatus() {
    //   return new Promise((resolve: any, reject: any) => {
    //     let params = {
    //       entity_type: "content",
    //       entity_id: taskId,
    //     };
    //     experApi
    //       .getExperimentStatusApi({ urlParams: params })
    //       .then((res: any) => {
    //         if (res.data&&res.data.has_submit_answer) {
    //           resolve(res.data.has_submit_answer)
    //         }else{
    //           resolve(false)
    //         }
    //       }).catch((err)=>{
    //         reject(err)
    //       });
    //   });
    // }
    return { ...toRefs(reactiveData), submitAnswer };
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
