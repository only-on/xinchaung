<template>
  <div>
    <top></top>
    <content></content>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import top from "./top.vue";
import content from "./content.vue";
import request from "../../../api";
export default defineComponent({
  components: {
    top,
    content,
  },
  setup() {
    const studentExam = (request as any).studentExam;
    onMounted(() => {
      studentExam
        .studentExaminationlList({
          param: {
            paper_exam_name: "",
            status: "",
            "page[currPage]": 1,
            "page[pageSize]": 9,
          },
          concurrent: true,
        })
        .then((res: any) => {
        //   console.log(res);
        });
    });
  },
});
</script>
