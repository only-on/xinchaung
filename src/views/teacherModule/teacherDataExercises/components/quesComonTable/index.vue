<template>
  <div class="quesComonTable">
    <div class="question-content-operate">
      <div class="question-search">
        <a-form-item>
          <a-input
            class="search-input"
            v-model:value="searchExercise"
            @keyup.enter="searchExerData"
            @search="searchExerData"
            placeholder="题目"
          >
            <template #prefix>
              <img src="src/assets/images/screenicon/Group6.png" />
            </template>
          </a-input>
        </a-form-item>
        <div class="select">
          <a-form-item>
            <before-icon :icon="iconDicfult">
              <a-select
                @change="handleChange"
                placeholder="请选择难度"
                v-model:value="selectLeves"
              >
                <a-select-option
                  v-for="item in difficultyLevel"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </before-icon>
          </a-form-item>
        </div>
      </div>
      <div class="question-btn" v-if="initial === '0'">
        <a-button type="primary" @click="addTestQuestions">添加试题</a-button>
        <a-button type="primary" @click="deleteCurrentRowMany"
          >批量删除</a-button
        >
        <a-button type="primary" @click="batchImport">批量导入</a-button>
      </div>
    </div>
    <div>
      <batch-import
        :isShowImport="isShowImport"
        :poolid="poolid"
        @batch-import-close="batchImportClose"
        :selectedId="selectedId"
      ></batch-import>
    </div>
    <a-modal
      :visible="visibleDelete"
      title="提示"
      ok-text="确定"
      cancel-text="取消"
      @ok="deleteOk"
      @cancel="deleteCancel"
    >
      <p>习题删除后将无法恢复，确定要删除吗?</p>
    </a-modal>
    <div class="question-content-table">
      <a-config-provider>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :columns="columns"
          rowKey="id"
          :loading="loading"
          :pagination="false"
          :data-source="tabledata"
        >
        <template v-slot:bodyCell="{column,record}">
          <template v-if="column.dataIndex === 'difficulty'">
            <span>{{ record.level.name }}</span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div>
              <span
                class="iconfont icon-bianji1 a-link"
                @click="editCurrentRow(record, true)"
              ></span>
              <span
                class="iconfont icon-shanchu-copy a-link"
                @click="deleteCurrentRow(record.id)"
              ></span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'select-answers'">
            <div v-if="record.type_id !== 5" class="select-answers">
              {{ answer(record) }}
            </div>
            <div v-else @click="viewAnswers(record)"><a>查看</a></div>
          </template>
        </template>
        </a-table>
        <template #renderEmpty>
          <div v-if="!searchExercise"><empty type="tableEmpty"></empty></div>
          <div v-else><empty type="tableSearchEmpty"></empty></div>
        </template>
      </a-config-provider>
    </div>
    <div>
      <a-modal
        :title="edit ? '编辑' + createmodal.title : '添加' + createmodal.title"
        :visible="createmodal.visible"
        :confirm-loading="createmodal.confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        width="820px"
        class="addModal"
      >
        <div class="modal-content">
          <a-form layout="vertical">
            <a-form-item required label="题目描述">
              <a-textarea v-model:value="expermodelValue.question"></a-textarea>
            </a-form-item>
            <!-- 单选题 或者 多选题 -->
            <div v-if="selectedId === 1 || selectedId === 2">
              <a-radio-group v-model:value="value" @change="onRadioChange">
                <a-checkbox-group
                  v-model:value="value1"
                  name="checkboxgroup"
                  @change="onMutilChange"
                >
                  <div
                    class="option"
                    v-for="(item, index) in single"
                    :key="index.toString()"
                  >
                    <div class="option-item">
                      <a-form-item required :label="'选项' + item.optionLable">
                        <a-input
                          v-model:value="expermodelValue.options[index]"
                        ></a-input>
                      </a-form-item>
                    </div>
                    <div class="setAnswer">
                      <!-- 单选框 -->
                      <a-radio v-if="selectedId === 1" :value="index"
                        >设为答案</a-radio
                      >
                      <!-- 多选框 -->
                      <a-checkbox v-if="selectedId === 2" :value="index"
                        >设为答案</a-checkbox
                      >
                    </div>
                  </div>
                </a-checkbox-group>
              </a-radio-group>
            </div>
            <!-- 判断题 -->
            <div v-if="selectedId === 3" class="judgeBox">
              <div class="check">
                <a-form-item required label="答案"> </a-form-item>
              </div>
              <div>
                <a-radio-group v-model:value="value" @change="onJudgeChange">
                  <a-radio :value="0">正确</a-radio>
                  <a-radio :value="1">错误</a-radio>
                </a-radio-group>
              </div>
            </div>
            <!-- 填空题 -->
            <div v-if="selectedId === 4">
              <div>
                <a-form-item required label="答案">
                  <a-input v-model:value="stringAnswer"></a-input>
                </a-form-item>
              </div>
              <div class="check">
                <a-checkbox
                  :checked="expermodelValue.ordered_answer"
                  @change="orderAnswerChange"
                >
                  答案有序
                </a-checkbox>
              </div>
            </div>
            <!-- 解答题 -->
            <div v-if="selectedId === 5">
              <div>
                <a-form-item required label="答案">
                  <a-textarea v-model:value="stringAnswer"></a-textarea>
                </a-form-item>
              </div>
              <div>
                <a-form-item required label="关键字">
                  <a-textarea v-model:value="stringKeywords"></a-textarea>
                </a-form-item>
              </div>
            </div>
            <div class="difficultyAndScore">
              <div class="difficult">
                <a-form-item required label="难度">
                  <a-select
                    @change="handleChangeLeves"
                    v-model:value="expermodelValue.level_id"
                  >
                    <a-select-option
                      v-for="item in difficultyLevel"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="score">
                <a-form-item required label="分数">
                  <a-input
                    v-model:value="expermodelValue.origin_score"
                  ></a-input>
                </a-form-item>
              </div>
            </div>
            <div>
              <a-form-item label="知识点">
                <div class="knowledge">
                  <span v-for="(v, i) in selectedKnowledgeList" :key="v.id">
                    {{ v.text }}
                    <i
                      class="iconfont icon-guanbi1-copy"
                      @click="delKnowledge(i)"
                    ></i>
                  </span>
                </div>
                <a-button type="primary" @click="selectKnowledge"
                  >选择</a-button
                >
              </a-form-item>
              <knowledge-modal
                v-model:isShow="isShowKnowledge"
                v-model:selectedList="selectedKnowledgeList"
              ></knowledge-modal>
            </div>
          </a-form>
        </div>
      </a-modal>
    </div>
    <!-- 解答题答案 -->
    <a-modal v-model:visible="answerVisible" :footer="null" title="答案">
      <p>{{ rightAnswer }}</p>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  watch,
  ref,
  Ref,
} from "vue";
import { useRouter } from "vue-router";
import request from "src/api";
import knowledgeModal from "../../../teachCourse/createTestPaper/knowledgeModal.vue";
import batchImport from "../batchImport.vue";
import Empty from "src/components/Empty.vue";
import beforeIcon from "src/components/aiAnt/beforeIcon.vue";
import iconDicfult from "src/assets/images/screenicon/Group3.png";
import { message, Modal } from "ant-design-vue";

interface levelType {
  name: string;
  id: number;
}
interface modalType {
  title: string;
  visible: boolean;
  confirmLoading: boolean;
}
interface exerType {
  optionLable: string;
}
interface optionsType {
  index: any;
}
interface paramsType {
  pool_id?: number; //习题目录ID
  question: string; //习题描述
  type_id?: number; //习题类型id
  level_id?: any; //习题难易程度ID
  origin_score?: string; //习题默认分数
  ordered_answer?: boolean; //答案是否有序
  options: any[]; //习题选项  单选题多选题判断题题型使用
  keywords?: any; //关键字
  points?: any[]; // 知识点
  answers: any[];
}
interface State {
  difficultyLevel: levelType[];
  selectLeves: any;
  createmodal: modalType;
  single: exerType[];
  exerparams?: paramsType;
  expermodelValue: paramsType;
  loading: boolean;
  columns: any[];
  list: any[];
  deleteid?: number;
  deleteidArr: number[];
  edit: any;
  searchExercise: string;
  value: any;
  value1: any[];
  question_id: any;
  visibleDelete: boolean;
  deleteRowId?: number;
  answerVisible: boolean;
  rightAnswer: any;

  stringAnswer: string;
  stringKeywords: string;
  selectedRowKeys: any[];
}
interface ItreeData {
  selectedKnowledgeList: ItreeDatalist[];
}
interface ItreeDatalist {
  id: string;
  text: string;
  children?: ItreeDatalist[];
  disabled?: boolean;
  state?: string;
}
export default defineComponent({
  name: "quesComonTable",
  components: { knowledgeModal, batchImport, Empty, beforeIcon },
  props: ["selectedId", "poolid", "tabledata", "total", "initial"],
  setup: (props, context) => {
    // 删除行还是批量
    let deleteRowOrMany: Ref<string> = ref(""); // 一行
    // 知识点
    let isShowKnowledge = ref(false);
    // 批量导入
    let isShowImport = ref(false);
    let knowledgeList = reactive<ItreeData>({
      selectedKnowledgeList: [],
    });
    const router = useRouter();
    const teacherDataExerApi = (request as any).teacherDataExercises;
    const columns1 = [
      {
        title: "题目",
        dataIndex: "question",
        key: "question",
        ellipsis: true,
      },
      {
        title: "难度",
        dataIndex: "difficulty"
      },
      {
        title: "答案",
        dataIndex: "select-answers",
        ellipsis: true,
      },
      {
        title: "分数",
        dataIndex: "origin_score",
        key: "origin_score",
      },
      {
        title: "操作",
        dataIndex: "operation",
        width: 100,
        align: "center"
      },
    ];
    const state: State = reactive({
      edit: "",
      searchExercise: "",
      difficultyLevel: [],
      selectLeves: undefined,
      createmodal: {
        title: "单选题",
        visible: false,
        confirmLoading: false,
      },
      single: [
        { optionLable: "A" },
        { optionLable: "B" },
        { optionLable: "C" },
        { optionLable: "D" },
      ],
      expermodelValue: {
        question: "",
        options: [],
        level_id: "",
        origin_score: "",
        answers: [],
        keywords: "",
      },
      deleteidArr: [],
      loading: false,
      columns: columns1,
      list: [],
      value: "",
      value1: [],
      question_id: "",
      visibleDelete: false,
      answerVisible: false,
      rightAnswer: "",
      stringAnswer: "",
      stringKeywords: "",
      selectedRowKeys: [],
    });
    const methods = {
      onSelectChange(selectedRowKeys: any, selectedRows: any) {
        state.selectedRowKeys = selectedRowKeys;
        state.deleteidArr = [];
        selectedRows.forEach((item: any) => {
          state.deleteidArr.push(item?.id);
        });
      },
      answer(record: any) {
        if (record.type_id === 4 || record.type_id === 5) {
          return record.answers[0].answer;
        } else {
          const answer: any = [];
          const answerIndex: any = [];
          record.answers.forEach((it: any) => {
            record.options.forEach((item: any, index: any) => {
              if (it.answer === item.id.toString()) {
                answerIndex.push(index);
                // const answersOptions=['A','B','C','D']
                // answer.push(item.option)
                // answer.push(answersOptions[index])
              }
            });
          });
          const answersOptions =
            record.type_id === 3 ? ["正确", "错误"] : ["A", "B", "C", "D"];
          answerIndex.sort();
          answerIndex.forEach((it: any) => {
            answer.push(answersOptions[it]);
          });
          return answer.join(",");
        }
      },
      viewAnswers(record: any) {
        state.answerVisible = true;
        state.rightAnswer = methods.answer(record);
      },
      exerciseLevels() {
        teacherDataExerApi.getDetailExerLevels().then((res: any) => {
          state.difficultyLevel = res?.data;
        });
      },
      handleChange(value: any) {
        state.selectLeves = value;
        context.emit("selectLeves", state.selectLeves);
      },
      handleChangeLeves(value: any) {
        state.expermodelValue.level_id = value;
      },
      addTestQuestions() {
        state.edit = false;
        state.createmodal.visible = true;
      },
      batchImportClose(value: any) {
        isShowImport.value = value;
        context.emit("finishCreate", true);
      },
      // 批量导入
      batchImport() {
        isShowImport.value = true;
      },
      selectKnowledge() {
        isShowKnowledge.value = true;
      },
      delKnowledge(i: number) {
        knowledgeList.selectedKnowledgeList.splice(i, 1);
      },
      createExercise() {
        state.expermodelValue.points = knowledgeList.selectedKnowledgeList.map(
          (v) => v.id
        );

        state.expermodelValue.keywords =
          state.expermodelValue.type_id === 5 ? [state.stringKeywords] : [];
        state.expermodelValue.answers =
          state.expermodelValue.type_id === 4 ||
          state.expermodelValue.type_id === 5
            ? [state.stringAnswer]
            : state.expermodelValue.answers;
        teacherDataExerApi
          .detailExerCreate({
            urlParams: { pool_id: props.poolid },
            param: state.expermodelValue,
          })
          .then((res: any) => {
            (state.value = ""), (state.value1 = []);
            delete state.expermodelValue.ordered_answer;
            // state.expermodelValue={
            //     question:'',
            //     origin_score:'',
            //     options:[],
            //     keywords:'',
            //     answers:[]
            // }
            state.expermodelValue.question = "";
            state.expermodelValue.origin_score = "";
            state.expermodelValue.options = [];
            state.expermodelValue.keywords = "";
            state.expermodelValue.answers = [];
            state.expermodelValue.level_id = "";

            state.stringAnswer = "";
            if (res.code) {
              message.success("添加成功！");
              state.createmodal.visible = false;
              knowledgeList.selectedKnowledgeList = [];
              state.stringKeywords = "";
              context.emit("finishCreate", true);
            }
          });
      },
      editExercise() {
        console.log(
          state.expermodelValue,
          state.expermodelValue.type_id,
          "state.expermodelValue"
        );
        state.expermodelValue.points = knowledgeList.selectedKnowledgeList.map(
          (v) => v.id
        );
        state.expermodelValue.keywords =
          props.selectedId === 5 ? [state.stringKeywords] : [];
        state.expermodelValue.answers =
          props.selectedId === 4 || props.selectedId === 5
            ? [state.stringAnswer]
            : state.expermodelValue.answers;
        teacherDataExerApi
          .detailExerUpdate({
            urlParams: { question_id: state.question_id },
            param: state.expermodelValue,
          })
          .then((res: any) => {
            if (res.code) {
              message.success("编辑成功！");
              (state.value = ""),
                (state.value1 = []),
                delete state.expermodelValue.ordered_answer;
              state.expermodelValue = {
                question: "",
                origin_score: "",
                options: [],
                keywords: "",
                answers: [],
              };
              state.createmodal.visible = false;
              knowledgeList.selectedKnowledgeList = [];
              state.stringKeywords = "";
              context.emit("finishCreate", true);
            }
          });
      },
      handleOk() {
        // 校yan
        if (!state.expermodelValue.question) {
          message.warning("题目不能为空");
          return;
        }
        if (props.selectedId === 1 || props.selectedId === 2) {
          if (
            !state.expermodelValue.options[0] ||
            !state.expermodelValue.options[1] ||
            !state.expermodelValue.options[2] ||
            !state.expermodelValue.options[3]
          ) {
            message.warning("选项不能为空");
            return;
          }
        }
        if (
          props.selectedId === 1 ||
          props.selectedId === 2 ||
          props.selectedId === 3
        ) {
          if (!state.expermodelValue.answers.length) {
            message.warning("请选择答案");
            return;
          }
        } else {
          if (!state.stringAnswer) {
            message.warning("答案不能为空");
            return;
          }
        }
        if (!state.expermodelValue.level_id) {
          message.warning("请选择试题难度");
          return;
        }
        if (!state.expermodelValue.origin_score) {
          message.warning("分数不能为空");
          return;
        }
        if (
          Number(state.expermodelValue.origin_score) < 1 ||
          Number(state.expermodelValue.origin_score) > 100 ||
          Number(state.expermodelValue.origin_score) % 1 !== 0
        ) {
          message.warning("分数请输入1-100的整数");
          return;
        }
        // 校验完成
        if (props.selectedId === 3) {
          state.expermodelValue.options = ["正确", "错误"];
        }
        if (state.edit) {
          methods.editExercise();
        } else {
          methods.createExercise();
        }
      },
      handleCancel() {
        state.createmodal.visible = false;
        (state.value = ""),
          (state.value1 = []),
          (state.expermodelValue = {
            question: "",
            origin_score: "",
            options: [],
            keywords: "",
            answers: [],
          });
        knowledgeList.selectedKnowledgeList = [];
        state.stringKeywords = "";
      },
      onJudgeChange(e: any) {
        state.expermodelValue.answers = [e.target.value];
      },
      onMutilChange(checkedValues: any) {
        state.expermodelValue.answers = checkedValues;
      },
      onRadioChange(e: any) {
        state.expermodelValue.answers = [e.target.value];
      },
      orderAnswerChange(e: any) {
        state.expermodelValue.ordered_answer = e.target.checked;
      },
      deleteCancel() {
        state.visibleDelete = false;
      },
      // 删除一行
      deleteCurrentRow(id: any) {
        deleteRowOrMany.value = "row";
        state.visibleDelete = true;
        state.deleteRowId = id;
      },
      //批量删除
      deleteCurrentRowMany() {
        deleteRowOrMany.value = "many";
        if (!state.deleteidArr.length) {
          message.warning("请至少选择一条记录");
          return;
        }
        state.visibleDelete = true;
      },
      // 删除调用
      deleteDetailExer(id: any) {
        teacherDataExerApi
          .detailExerDelete({ urlParams: { question_id: id } })
          .then((res: any) => {
            if (res.code === 1) {
              state.deleteidArr = [];
              context.emit("finishCreate", true);
            }
          });
      },
      // 确认删除弹框
      deleteOk() {
        state.visibleDelete = false;
        if (deleteRowOrMany.value === "many") {
          methods.deleteDetailExer(state.deleteidArr.join(","));
        } else {
          methods.deleteDetailExer(state.deleteRowId);
        }
      },
      //编辑
      editCurrentRow(record: any, edit: any) {
        state.edit = edit; //显示弹框

        state.question_id = record.id;
        const options1: any = [];
        const answer1: any = [];
        const keywords1: any = [];
        state.createmodal.visible = true;
        state.expermodelValue = {
          question: record.question,
          level_id: record.level_id,
          origin_score: record.origin_score,
          // keywords:keywords1,
          // answers:answer1,
          options: options1,
          answers: [],
          ordered_answer: record.ordered_answer,
        };
        // 单选题 多选题 判断题
        if (
          record.type_id === 1 ||
          record.type_id == 2 ||
          record.type_id === 3
        ) {
          // 选项
          record.options.forEach((item: any) => {
            options1.push(item.option);
          });
        }
        //选择判断答案回显
        record.options.forEach((item: any, index: any) => {
          record.answers.forEach((it: any, j: any) => {
            if (item.id.toString() === it.answer) {
              console.log(item.id, it.answer);
              if (record.type_id === 1 || record.type_id === 3) {
                state.value = index;
              } else if (record.type_id === 2) {
                state.value1.push(index);
              }
            }
          });
        });
        // 填空 解答答案回显  及 回显时对应的答案
        if (record.type_id === 4 || record.type_id === 5) {
          // state.expermodelValue.answers=record.answers[0].answer
          state.stringAnswer = record.answers[0].answer;
        } else if (record.type_id === 1 || record.type_id === 3) {
          state.expermodelValue.answers = [state.value];
        } else {
          state.expermodelValue.answers = state.value1;
        }
        console.log(state.value1);
        //关键词
        state.stringKeywords = record.keywords[0]?.keyword;
        // 知识点
        const knownames = record.points.knowledge_name.split(",");

        console.log(knownames, "knownames");
        knownames.forEach((item: string, index: any) => {
          knowledgeList.selectedKnowledgeList.push({
            id: record.points.knowledge_ids[index].toString(),
            text: item,
            state: "open",
          });
        });
        console.log(
          knowledgeList.selectedKnowledgeList,
          "knowledgeList.selectedKnowledgeList end"
        );
      },
      //查询
      searchExerData() {
        context.emit("searchExercise", state.searchExercise);
      },
      uploadSuccess() {},
    };
    watch(
      () => props.selectedId,
      (newVal) => {
        console.log(props.selectedId, newVal, "props.selectedId");
        state.selectLeves = "";
        state.searchExercise = "";
        state.stringAnswer = "";
        state.selectedRowKeys = [];
        state.expermodelValue = {
          question: "",
          level_id: "",
          origin_score: "",
          options: [],
          keywords: [],
          answers: [],
        };
        const titleArr: string[] = [
          "单选题",
          "多选题",
          "判断题",
          "填空题",
          "简答题",
        ];
        state.selectLeves = undefined;
        state.expermodelValue.type_id = newVal;
        return (state.createmodal.title = titleArr[newVal - 1]);
      },
      {
        immediate: true,
        deep: true,
      }
    );
    watch(
      () => props.initial,
      (newVal) => {
        state.columns =
          props.initial === "0"
            ? columns1
            : columns1.splice(0, columns1.length - 1);
      },
      { deep: true }
    );
    onMounted(() => {
      methods.exerciseLevels();
    });
    return {
      ...methods,
      ...toRefs(state),
      isShowKnowledge,
      isShowImport,
      ...toRefs(knowledgeList),
      deleteRowOrMany,
      iconDicfult,
    };
  },
});
</script>
<style lang="less">
.question-content-table {
  .icon-bianji1 {
    margin-right: 20px;
    color: var(--primary-color);
  }
  .icon-shanchu-copy {
    color: var(--primary-color);
  }
}
.ant-table-tbody > tr > td > .iconfont {
  color: var(--primary-color);
}
.question-content-operate {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  .question-search {
    display: flex;
    .serch-input {
      width: 352px;
      padding: 0px 5px 0px 30px;
      border-left: none;
    }
    .select {
      width: 190px;
      margin-left: 20px;
    }
    .input-search {
      margin-right: 20px;
    }
  }
  .question-btn {
    .ant-btn {
      margin-left: 10px;
    }
  }
}
.modal-content {
  .judgeBox {
    display: flex;
    height: 50px;
  }
  .check {
    margin-right: 20px;
  }
  .option {
    display: flex;
    justify-content: space-between;
    .option-item {
      width: 630px;
    }
    .setAnswer {
      width: 105px;
      text-align: center;
    }
    .ant-radio-wrapper,
    .ant-checkbox-wrapper {
      width: 105px;
      height: 35px;
      line-height: 35px;
      margin-top: 33px;
      background: #f5f5f5;
    }
  }
  .difficultyAndScore {
    width: 630px;
    display: flex;
    justify-content: space-between;
    .difficult {
      width: 285px;
    }
    .score {
      width: 285px;
    }
  }
}
.addModal {
  .ant-modal-footer {
    text-align: center;
  }
}
.knowledge {
  margin: 20px 0;
  span {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    color: var(--primary-color);
    margin-right: 12px;
    .iconfont {
      cursor: pointer;
    }
  }
}
.select-answers {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
