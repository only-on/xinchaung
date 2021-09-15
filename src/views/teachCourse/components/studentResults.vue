<template>
  <div class="studentResults">
    <div class="student" v-if="tabType === 'student'">
      <a-form layout="inline" :form="form">
        <a-form-item label="学号">
          <a-input
            v-model:value="form.username"
            @pressEnter="handleSearch(1)"
          ></a-input>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input
            v-model:value="form.name"
            @pressEnter="handleSearch(1)"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch(1)">查询</a-button>
        </a-form-item>
      </a-form>
      <a-table
        row-key="id"
        :loading="tableData.loading"
        :columns="columns"
        :data-source="tableData.data"
        :pagination="{
          current: form.page.currPage,
          pageSize: form.page.pageSize,
          total: tableData.total,
          showSizeChanger:true,
          onShowSizeChange: showSizeChange,
          onChange: pageChange,
          hideOnSinglePage: true,
        }"
      />
    </div>
    <div class="question" v-if="tabType === 'question'">
      <a-form layout="inline" :form="questionForm">
        <a-form-item label="题目">
          <a-input
            v-model:value="questionForm.question_name"
            @pressEnter="handleSearch(2)"
          ></a-input>
        </a-form-item>
        <a-form-item label="题型">
          <a-select
            v-model:value="questionForm.question_type"
            :options="options"
            @change="selectChange"
          ></a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch(2)">查询</a-button>
        </a-form-item>
      </a-form>
      <a-table
        row-key="ratio"
        :loading="questionTable.loading"
        :columns="columns1"
        :data-source="questionTable.data"
        :pagination="{
          current: questionForm.currPage,
          pageSize: questionForm.pageSize,
          total: questionTable.total,
          showSizeChanger:true,
          onShowSizeChange: questionSizeChange,
          onChange: questionChange,
          hideOnSinglePage: true,
        }"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  inject
} from "vue";
import { SelectTypes } from "ant-design-vue/es/select";
import request from "src/api/index";
import { Ihttp } from "../typings";
import { IBusinessResp } from "src/typings/fetch.d";
interface Ipage {
  currPage: number;
  pageSize: number;
}
interface Iform {
  course_id: number;
  chapter_id: number;
  name: string;
  username: string;
  classes_id: number | string;
  page: Ipage;
}
interface IlistData {
  accuracy: string;
  id: string;
  is_false: string;
  is_true: string;
  name: string;
  score: string;
  username: string;
}
interface ItableData {
  loading: boolean;
  data: IlistData[];
  total: number;
}
interface Iquestionform {
  course_id: number;
  chapter_id: number;
  question_name: string;
  question_type: string;
  currPage: number;
  pageSize: number;
}
interface IquestionData {
  question_name: string;
  question_type: string;
  true_num: string;
  ratio: string;
}
interface IquestionTable {
  loading: boolean;
  data: IquestionData[];
  total: number;
}
const columns = [
  {
    title: "学号",
    dataIndex: "username",
    align: "center",
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "正确题数",
    dataIndex: "is_true",
    align: "center",
  },
  {
    title: "错误题数",
    dataIndex: "is_false",
    align: "center",
  },
  {
    title: "正确率",
    dataIndex: "accuracy",
    align: "center",
  },
  {
    title: "成绩",
    dataIndex: "score",
    align: "center",
  },
];
const columns1 = [
  {
    title: "题目",
    dataIndex: "question_name",
    align: "center",
    ellipsis: true
  },
  {
    title: "类型",
    dataIndex: "question_type",
    align: "center",
  },
  {
    title: "正确人数",
    dataIndex: "true_num",
    align: "center",
  },
  {
    title: "正确率",
    dataIndex: "ratio",
    align: "center",
  },
];
export default defineComponent({
  props: {
    tabType: {
      default: ''
    },
    courseId: {},
    chapterId: {}
  },
  setup(props) {
    const http = (request as Ihttp).teachCourse;
    const chapterId:any = ref(props.chapterId)
    const courseId:any = ref(props.courseId)
    var form: Iform = reactive({
      course_id: courseId.value,
      chapter_id: chapterId.value,
      name: "",
      username: "",
      classes_id: "",
      page: {
        pageSize: 10,
        currPage: 1,
      },
    });
    var tableData = reactive<ItableData>({
      loading: false,
      data: [],
      total: 0,
    });
    // 题目
    const options = ref<SelectTypes["options"]>([
      {
        value: "",
        label: "全部",
      },
      {
        value: "1",
        label: "单选题",
      },
      {
        value: "2",
        label: "多选题",
      },
      {
        value: "3",
        label: "判断题",
      },
    ]);
    var questionForm = reactive<Iquestionform>({
      course_id: courseId.value,
      chapter_id: chapterId.value,
      question_name: "",
      question_type: "",
      currPage: 1,
      pageSize: 10
    });
    var questionTable = reactive<IquestionTable>({
      loading: false,
      data: [],
      total: 0,
    });
    var questionlist: any[] = reactive([]);
    function handleSearch(type: number) {
      if (type === 1) {
        // 学生成绩
        form.page.currPage = 1;
        getListData();
      } else {
        // 题目正确率
        questionForm.currPage = 1;
        getQuestionData();
      }
    }
    function pageChange(val: number) {
      form.page.currPage = val;
      getListData();
    }
    function showSizeChange(val:number, size: number){
      form.page.pageSize = size
      getListData();
    }
    // 学生成绩
    function getListData() {
      tableData.loading = true;
      let obj = {
        course_id: form.course_id,
        chapter_id: form.chapter_id,
        "CourseQuestStudentSearch[name]": form.name,
        "CourseQuestStudentSearch[username]": form.username,
        "CourseQuestStudentSearch[classes_id]": form.classes_id,
        "page[currPage]": form.page.currPage,
        "page[pageSize]": form.page.pageSize,
      };
      http.studentCount({ param: obj }).then((res: IBusinessResp) => {
        if (res) {
          let result = res.data;
          tableData.loading = false;
          tableData.data = result.data;
          tableData.total = result.page.totals;
        }
      });
    }
    // 题目正确率
    function getQuestionData() {
      questionTable.loading = true
      let params = {
        "CourseQuestSearch[course_id]": questionForm.course_id,
        "CourseQuestSearch[chapter_id]": questionForm.chapter_id,
        "CourseQuestSearch[question_name]": questionForm.question_name,
        "CourseQuestSearch[question_type]": questionForm.question_type,
        "page[currPage]": questionForm.currPage,
        "page[pageSize]": questionForm.pageSize,
      };
      http.resultCount({ param: params }).then((res: IBusinessResp) => {
        if (res) {
          let result = res.data;
          questionTable.loading = false;
          questionTable.data = result.data;
          questionTable.total = result.page.totals;
        }
      });
    }
    function questionChange(val: number) {
      questionForm.currPage = val;
      getQuestionData();
    }
    function questionSizeChange(val:number, size: number){
      questionForm.pageSize = size
      getListData();
    }
    function selectChange(val: string) {
      questionForm.currPage = 1;
      questionForm.question_type = val;
      getQuestionData();
    }
    onMounted(() => {
      if (props.tabType === "student") {
          getListData();
        } else {
          getQuestionData();
        }
    });
    return {
      form,
      columns,
      tableData,
      options,
      questionForm,
      questionTable,
      columns1,
      handleSearch,
      pageChange,
      questionChange,
      selectChange,
      questionlist,
      showSizeChange,
      questionSizeChange
    };
  },
});
</script>
<style lang="less" scoped>
.studentResults {
  margin-bottom: 30px;
  .ant-form {
    margin-bottom: 20px;
  }
  .ant-select {
    width: 120px;
  }
}
</style>
