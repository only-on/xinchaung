<template>
  <div>
    <top></top>
    <content
      :examData="examData"
      @search="searchExam"
      :params="params"
    ></content>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, provide } from "vue";
import top from "./top.vue";
import content from "./content.vue";
import storage from "src/utils/extStorage";
import { getStudentExaminationlList, startExam } from "../studentExam.model";
import { IExamListParams, IexamData } from "../studentExam.type";
interface IReactiveData {
  examData: IexamData;
  startExamInfoData: any;
}
export default defineComponent({
  components: {
    top,
    content,
  },
  setup() {
    const uid = storage.lStorage.get("uid");
    const startExamInfo = {
      code: 1,
      status: 1,
      msg: "成功",
      data: {
        id: 5,
        name: "试卷5",
        code: "1emtHr55mG3cJiQ51NVxFluubvkiz1wM",
        type: "exam",
        author_id: 105,
        is_publish: 1,
        description: "desc-5",
        note: "note-5",
        rate: 60,
        all_score: 150,
        pass_score: 90,
        questions_count: 6,
        students_count: 2,
        author_name: "文和",
        exam_status: 2,
        question_ids: [17, 7, 2, 18, 19, 20],
        student_ids: [104, 112],
        start_date: "2021-08-30",
        times: "18:53:53 ~ 19:53:46",
      },
    };
    const reactiveData: IReactiveData = reactive({
      examData: {
        list: [],
        page: {},
      },
      startExamInfoData: {},
    });

    let { examData, startExamInfoData } = toRefs(reactiveData);
    provide("startExamInfoData", startExamInfoData);
    let params: any = {
      limit: 20,
      name: "",
      page: 1,
      status: "",
    };
    onMounted(() => {
      studentExamList();
      getStartExam();
      reactiveData.startExamInfoData = startExamInfo.data;
    });

    // 学生试卷列表
    function studentExamList() {
      let param: IExamListParams = {
        param: params,
        urlParams: {
          student_id: uid,
        },
      };
      getStudentExaminationlList(param).then((res: any) => {
        reactiveData.examData = res.data;
      });
    }

    // 开始考试
    function getStartExam() {
      startExam({
        urlParams: {
          student_id: uid,
        },
      }).then((res) => {
        console.log(res);
      });
    }
    // 查找考试列表
    function searchExam(param: any) {
      params = Object.assign(params, param);
      console.log(params);
      studentExamList();
    }

    return { ...toRefs(reactiveData), searchExam, params, provide };
  },
});
</script>
