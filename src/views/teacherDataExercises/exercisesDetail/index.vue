<template>
  <div class="exerciseDetail" v-layout-bg>
    <div class="exercise">
      <div class="exam-basic">
        <div class="eaxm-basic-left">
          <div class="titleinfo">
            <div class="exam-basic-left-title">{{ exambasic.name }}</div>
            <div class="datainfo">
              <span class="createdate"
                >创建日期:{{ exambasic.created_at?.split(" ")[0] }}</span
              ><span>修改日期:{{ exambasic.updated_at?.split(" ")[0] }}</span>
            </div>
          </div>
          <div class="desc">描述</div>
        </div>
        <div class="exam-basic-right">
          <watermark-icon
            :title="exambasic.questions_count"
            description="习题个数"
            style="background-color: #5e68da"
          />
        </div>
      </div>
      <div class="exam-descript">
        {{ exambasic.description }}
      </div>
    </div>
    <a-modal
      title="编辑目录"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="900"
      class="edit"
    >
      <div>
        <a-form ref="formRef" :model="form" :rules="rules">
          <a-form-item label="名称" name="name">
            <a-input v-model:value="form.name"></a-input>
          </a-form-item>
          <a-form-item label="描述" name="description">
            <a-textarea v-model:value="form.description"></a-textarea>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <div class="exam-question-type">
      <a-tabs
        class="exercise-tab"
        default-active-key="1"
        tabBarExtraContent
        @change="switchExer"
      >
        <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.tab"> </a-tab-pane>
      </a-tabs>
    </div>
    <div class="exam-question-content">
      <ques-comon-table
        @finish-create="finishCreate"
        @select-leves="selectLeves"
        @search-exercise="searchExercise"
        :initial="initial"
        :tabledata="tabledata"
        :selectedId="Number(selectedId)"
        :poolid="poolid"
      ></ques-comon-table>
      <div v-if="total" class="pagination">
        <a-pagination
          show-size-changer
          :default-current="pagination.current"
          :pageSize="pagination.pageSize"
          :total="total"
          @change="changePage"
          @showSizeChange="onShowSizeChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { message } from "ant-design-vue";
import { number } from "echarts";
import { defineComponent, inject, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import request from "../../../api";
import quesComonTable from "../components/quesComonTable/index.vue";
import WatermarkIcon from "../../../components/common/WatermarkIcon.vue";
import { Pagination } from "swiper";
interface examBasic {
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  questions_count?: any;
}
interface examType {
  id?: number;
  name?: string;
}
interface quesType {
  type_id: number;
  type_name: string;
  count: number;
}
interface exerciseList {
  initial: any;
  type_id?: number;
  level_id?: any;
  name?: string;
  include?: string;
  limit?: number;
  page?: number;
}
interface fromType {
  name?: string;
  description?: string;
}
interface paginationType {
  current: number;
  pageSize: number;
}
interface stateData {
  rules: any;
  exambasic: examBasic;
  examtype: examType[];
  // componentNames:any[],
  currentView: string;
  question_info: quesType[];
  selectedId: any;
  levelId: any;
  searchname: string;
  poolid: number;
  tabledata: any[];
  total?: number;
  exerListParams: exerciseList;
  visible: boolean;
  initial?: any;
  initialIfEdit: any;
  form: fromType;
  pagination: paginationType;
  tabs: any[];
}
export default defineComponent({
  name: "exerciseDetail",
  components: { quesComonTable, WatermarkIcon },
  setup: (props, context) => {
    const router = useRouter();
    const teacherDataExerApi = (request as any).teacherDataExercises;
    var updata = inject("updataNav") as Function;
    const state: stateData = reactive({
      rules: {
        name: [{ required: true, message: "请输入内容", trigger: "blur" }],
        description: [{ required: true, message: "请输入描述", trigger: "blur" }],
      },
      exambasic: {
        name: "",
        description: "",
        created_at: "",
        updated_at: "",
      },
      form: {},
      examtype: [],
      // componentNames:['singleChoice','multipleChoice','judge','fillBlanks','answer'],
      currentView: "singleChoice",
      question_info: [],
      selectedId: 1,
      searchname: "",
      levelId: "",
      poolid: 0,
      tabledata: [],
      exerListParams: { initial: 0, type_id: 1 },
      visible: false,
      initialIfEdit: true,
      initial: 1,
      total: 0,
      pagination: {
        current: 1,
        pageSize: 10,
      },
      tabs: [
        { key: 1, tab: "单选题" },
        { key: 2, tab: "多选题" },
        { key: 3, tab: "判断题" },
        { key: 4, tab: "填空题" },
        { key: 5, tab: "解答题" },
      ],
    });
    updata({
      showContent: true,
      navType: false,
      tabs: [],
      navPosition: "outside",
      componenttype: 0,
      backOff: true,
      showPageEdit: state.initialIfEdit,
      pageEdit: myFn2,
    });
    function myFn2() {
      console.log("编辑目录");
      state.visible = true;
    }
    const methods = {
      exerciseDetail() {
        state.initial = router.currentRoute.value.query.initial;
        state.initialIfEdit = state.initial === "0" ? true : false;
        updata({
          showContent: true,
          navType: false,
          tabs: [],
          navPosition: "outside",
          componenttype: 0,
          backOff: true,
          showPageEdit: state.initialIfEdit,
          pageEdit: myFn2,
        });
        const id: any = router.currentRoute.value.query.id;
        teacherDataExerApi
          .detailExercise({ urlParams: { pool_id: id } })
          .then((res: any) => {
            state.exambasic = res.data;
            state.form.name = state.exambasic.name;
            state.form.description = state.exambasic.description;
          });
      },
      handleOk() {
        if (!state.form.name) {
          message.warning("请输入名称");
          return;
        }
        if (!state.form.description) {
          message.warning("请输入描述");
          return;
        }
        state.visible = false;
        const id: any = router.currentRoute.value.query.id;
        teacherDataExerApi
          .updateExercise({
            urlParams: { pool_id: id },
            param: {
              initial: 0,
              name: state.form.name,
              description: state.form.description,
            },
          })
          .then((res: any) => {
            console.log(res);
            methods.exerciseDetail();
          });
        // 习题更新
        // detailExerUpdate
      },
      handleCancel() {
        state.visible = false;
        state.form.name = state.exambasic.name;
        state.form.description = state.exambasic.description;
      },
      exerciseType() {
        teacherDataExerApi.typeExercise().then((res: any) => {
          console.log(res);
          let arr = res.data;
          arr.sort((a: any, b: any) => {
            return a.id + "" > b.id + "" ? 1 : -1;
          });
          state.examtype = arr;
        });
      },
      switchExer(key: any) {
        state.selectedId = key;
        state.exerListParams.type_id = key;
        // state.exerListParams.level_id='';
        state.levelId = "";
        state.searchname = "";
        state.pagination.current = 1;
        state.pagination.pageSize = 10;
        methods.exerciseDetailList(state.exerListParams);
      },
      exerciseDetailList(exerListParams: exerciseList) {
        const id: any = router.currentRoute.value.query.id;
        exerListParams.include = "answers";
        exerListParams.limit = state.pagination.pageSize;
        exerListParams.page = state.pagination.current;
        teacherDataExerApi
          .getDetailExerciseList({ urlParams: { pool_id: id }, param: exerListParams })
          .then((res: any) => {
            state.tabledata = res.data.list;
            state.total = res.data.page.totalCount;
          });
      },
      finishCreate(val: any) {
        methods.exerciseDetailList(state.exerListParams);
      },
      selectLeves(val: any) {
        state.levelId = val;
        state.exerListParams.level_id = val;
        methods.exerciseDetailList(state.exerListParams);
      },
      searchExercise(val: any) {
        console.log(val, "val");
        state.searchname = val;
        state.exerListParams.name = val;
        console.log(state.searchname, "state.searchname");
        methods.exerciseDetailList(state.exerListParams);
      },
      changePage(page: any, pageSize: any) {
        console.log(page, pageSize);
        state.pagination.current = page;
        methods.exerciseDetailList(state.exerListParams);
      },
      onShowSizeChange(current: any, pageSize: any) {
        console.log(current, pageSize);
        state.pagination.pageSize = pageSize;
        methods.exerciseDetailList(state.exerListParams);
      },
    };
    onMounted(() => {
      methods.exerciseDetail();
      methods.exerciseDetailList(state.exerListParams);
      const id: any = router.currentRoute.value.query.id;
      state.poolid = id;
    });
    return { ...toRefs(state), ...methods };
  },
});
</script>
<style lang="less">
.exerciseDetail {
  color: #777777;
  .exam-basic .eaxm-basic-left .desc {
    color: #333333;
  }
  .exam-basic-title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #b2b2b2;
    padding: 10px 0;
    .title {
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
    }
    .edit {
      color: @theme-color;
    }
    .iconfont {
      font-size: 16px;
    }
    .editText {
      font-size: 14px;
      margin-left: 5px;
    }
  }
  .exam-basic-content {
    padding: 20px 0;
  }
  .exam-question-type {
    display: flex;
    .selected {
      background-color: #f2f2f2;
    }
  }
  .question-content-operate {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    .question-btn {
      .ant-btn {
        margin-left: 10px;
      }
    }
  }
}
.exam-basic {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #b2b2b2;
  padding-bottom: 10px;
  .eaxm-basic-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .desc {
      font-weight: 500;
    }
  }
  .exam-basic-left-title {
    font-size: 24px;
    color: #333333;
  }
  .datainfo {
    margin-top: 10px;
    font-size: 14px;
    .createdate {
      display: inline-block;
      margin-right: 20px;
    }
  }
}
.exam-descript {
  padding: 18px 0;
}
.exam-question-type .ant-tabs {
  width: 100%;
}
.exercise-tab .ant-tabs-nav .ant-tabs-tab {
  padding: 7px 0px;
  margin-right: 35px;
}
.edit .ant-modal-footer {
  text-align: center;
}
.pagination {
  padding: 30px;
  text-align: center;
}
</style>
