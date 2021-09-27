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
        row-key="user_id"
        :loading="tableData.loading"
        :columns="columns"
        :data-source="tableData.data"
        :pagination="{
          current: form.page,
          pageSize: form.limit,
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
            v-model:value="questionForm.question"
            @pressEnter="handleSearch(2)"
          ></a-input>
        </a-form-item>
        <a-form-item label="题型">
          <a-select
            v-model:value="questionForm.type_id"
            :options="options"
            @change="selectChange"
          ></a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch(2)">查询</a-button>
        </a-form-item>
      </a-form>
      <a-table
        row-key="id"
        :loading="questionTable.loading"
        :columns="columns1"
        :data-source="questionTable.data"
        :pagination="{
          current: questionForm.page,
          pageSize: questionForm.limit,
          total: questionTable.total,
          showSizeChanger:true,
          onShowSizeChange: questionSizeChange,
          onChange: questionChange,
          hideOnSinglePage: true,
        }">
        <template #level_id="{ record }">
          <span>{{showLevel(record.level_id)}}</span>
        </template>
      </a-table>
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
  page: number;
  limit: number;
}
interface Iform {
  name: string;
  username: string;
  page: number;
  limit: number;
}
interface IlistData {
  correct_rate: string;
  user_id: number|string;
  wrong_answers_number: number|string;
  correct_answers_number: number|string;
  name: string;
  score_total: number|string;
  username: string;
}
interface ItableData {
  loading: boolean;
  data: IlistData[];
  total: number;
}
interface Iquestionform {
  question: string;
  type_id: number|string;
  page: number;
  limit: number;
}
interface IquestionData {
  id: number,
  question: string;
  level_id: number|string;
  correct_student_number: number|string;
  correct_rate: string;
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
    dataIndex: "correct_answers_number",
    align: "center",
  },
  {
    title: "错误题数",
    dataIndex: "wrong_answers_number",
    align: "center",
  },
  {
    title: "正确率",
    dataIndex: "correct_rate",
    align: "center",
  },
  {
    title: "成绩",
    dataIndex: "score_total",
    align: "center",
  },
];
const columns1 = [
  {
    title: "题目",
    dataIndex: "question",
    align: "center",
    ellipsis: true
  },
  {
    title: "类型",
    dataIndex: "level_id",
    align: "center",
    slots: { customRender: 'level_id' }
  },
  {
    title: "正确人数",
    dataIndex: "correct_student_number",
    align: "center",
  },
  {
    title: "正确率",
    dataIndex: "correct_rate",
    align: "center",
  },
];
const options = [
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
]
export default defineComponent({
  props: ['tabType', 'courseId', 'chapterId'],
  setup(props) {
    const http = (request as Ihttp).teachCourse;
    const chapterId= ref<any>(props.chapterId)
    const courseId= ref<any>(props.courseId)
    var form = reactive<Iform>({
      name: "",
      username: "",
      page: 1,
      limit: 10
    });
    var tableData = reactive<ItableData>({
      loading: false,
      data: [],
      total: 0,
    });
    var questionForm = reactive<Iquestionform>({
      question: "",
      type_id: "",
      page: 1,
      limit: 10
    });
    var questionTable = reactive<IquestionTable>({
      loading: false,
      data: [],
      total: 0,
    });
    var questionlist= reactive<any[]>([]);
    function handleSearch(type: number) {
      if (type === 1) {
        // 学生成绩
        form.page = 1;
        getListData();
      } else {
        // 题目正确率
        questionForm.page = 1;
        getQuestionData();
      }
    }
    function pageChange(val: number) {
      form.page = val;
      getListData();
    }
    function showSizeChange(val:number, size: number){
      form.limit= size
      getListData();
    }
    // 学生成绩
    function getListData() {
      tableData.loading = true;
      tableData.data.length = 0
      http.studentCount({param: form, urlParams: {chapter_id: chapterId.value} }).then((res: IBusinessResp) => {
        if (res && res.data) {
          let result = res.data;
          tableData.loading = false;
          tableData.data.push(...result.list);
          tableData.total = result.page.totalCount;
        }
      });
    }
    // 题目正确率
    function getQuestionData() {
      questionTable.loading = true
      questionTable.data.length = 0
      http.resultCount({param: questionForm,urlParams: {chapter_id:chapterId.value}}).then((res: IBusinessResp) => {
        if (res && res.data) {
          let result = res.data;
          questionTable.loading = false;
          questionTable.data.push(...result.list);
          questionTable.total = result.page.totalCount;
        }
      });
    }
    function questionChange(val: number) {
      questionForm.page = val;
      getQuestionData();
    }
    function questionSizeChange(val:number, size: number){
      questionForm.limit = size
      getListData();
    }
    function selectChange(val: string) {
      questionForm.page = 1;
      questionForm.type_id = val;
      getQuestionData();
    }
    function showLevel(val:any) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == val) {
          return options[i].label
        }
      }
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
      questionSizeChange,
      showLevel
    };
  }
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
