<template>
  <div>
    <top></top>
    <content :examData="examData" @search="searchExam" :params="params"></content>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import top from "./top.vue";
import content from "./content.vue";
import storage from "src/utils/extStorage"
import {getStudentExaminationlList} from  "../studentExam.model"
import {IExamListParams,IexamData} from "../studentExam.type"
interface IReactiveData{
  examData:IexamData
}
export default defineComponent({
  components: {
    top,
    content
  },
  setup() {
    const uid=storage.lStorage.get('uid')

    const reactiveData:IReactiveData = reactive({ examData:{
      list:[],
      page:{}
    }});
    let params:any = {
      limit: 20,
      name: "",
      page: 1,
      status: "",
    };
    onMounted(() => {
      studentExamList()
    
    });

    // 学生试卷列表
    function studentExamList(){
      let param:IExamListParams={
        param:params,
        urlParams:{
          student_id:uid
        }
      }
      getStudentExaminationlList(param).then((res:any)=>{
        reactiveData.examData = res.data;
      })
    }

    function searchExam(param: any) {
      params = Object.assign(params, param);
      console.log(params);
      studentExamList()
    }

    return { ...toRefs(reactiveData), searchExam,params };
  },
});
</script>
