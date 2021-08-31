<template>
  <div>
    <top></top>
    <content :examData="examData" @search="searchExam"></content>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import top from "./top.vue";
import content from "./content.vue";
import request from "src/request/getRequest";

export default defineComponent({
  components: {
    top,
    content,
  },
  setup() {
    const studentExam = request.studentExam;
    const examData:any = {
      status: 1,
      msg: "成功",
      data: {
        list: [
          {
            id: 1,
            name: "试卷1",
            status: "已结束",
            start_date: "2021-10-01",
            times: "14:00 ~ 15:30",
            teacher: "老师1",
          },
          {
            id: 2,
            name: "试卷2",
            status: "进行中",
            start_date: "2021-10-02",
            times: "14:00 ~ 15:30",
            teacher: "老师2",
          },
        ],
        page: {
          currentPage: 1,
          pageCount: 3,
          perPage: 2,
          totalCount: 5,
        },
      },
    };
    const reactiveData = reactive({ examData: examData.data });
    let params = {
      student_id: 1212,
      limit: 20,
      name: "",
      page: 2,
      status: "",
    };
    onMounted(() => {
      getStudentExaminationlList()
        .then(() => {})
        .catch(() => {});
    });

    function searchExam(param: any) {
      params = Object.assign(params, param);
      console.log(params);
    }

    function getStudentExaminationlList() {
      return new Promise((resolve: any, reject: any) => {
        studentExam
          .studentExaminationlList({
            param: {
              student_id: 3409,
              name: "",
              limit: "",
              page: 1,
            },
          })
          .then((res: any) => {
            if (res.status === 1) {
              reactiveData.examData = res.data;
              resolve(res.data);
            }
          });
      });
    }
    return { ...toRefs(reactiveData), searchExam };
  },
});
</script>
