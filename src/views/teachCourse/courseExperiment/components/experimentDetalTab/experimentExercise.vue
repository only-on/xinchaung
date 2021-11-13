<template>
  <div v-if="showPanel === 'loading'" class="prepare-lessons-loading">
    <SyncOutlined spin />
  </div>
  <div v-if="showPanel === 'list'" class="exercise-list-tab">
    <div class="exercise-list-head">
      <span>共<i>{{questionCount}}</i>道题</span>
      <span>共记<i>{{scores}}</i>分</span>
      <a-button type="primary" @click="openSelectPanel">选择习题</a-button>
    </div>
    <div class="exercise-list-box">
      <div
        class="exercise-list-item"
        v-for="item in chapterExerciseList"
        :key="item.id"
      >
        <span>
          <i class="iconfont icon-danxuanxuanzhong"></i>
          {{ item.question }}
        </span>
        <span>
          <i class="iconfont icon-nandu"></i>
          {{ item.level_name }}
        </span>
        <span>
          <i class="iconfont icon-fenshu"></i>
          {{ item.score }}
        </span>
        <span
          class="exam-list-detele iconfont icon-shanchu"
          @click="deleteChapterExercise(item)"
        ></span>
      </div>
    </div>
  </div>
  <div v-if="showPanel === 'none'" style="height:100%;background:#fff">
    <empty text="您还没有添加习题，请从数据中心选择习题！"> </empty>
    <div class="action-btn" style="text-align: center">
      <a-button type="primary" @click="openSelectPanel">选择习题</a-button>
    </div>
  </div>
  <div v-if="showPanel === 'select'" class="select-exercise-tab">
    <div class="select-list-head">
      <a-select
        style="width: 200px"
        v-model:value="pools_id"
        placeholder="请选择目录"
        @change="poolsChange"
      >
        <a-select-opt-group>
          <template #label>
            <span> 共有 </span>
          </template>
          <a-select-option
            v-for="item in publicData"
            :key="item.id"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select-opt-group>
        <a-select-opt-group>
          <template #label>
            <span> 私有 </span>
          </template>
          <a-select-option
            v-for="item in selfData"
            :key="item.id"
            :value="item.id"
            >{{ item.name }}</a-select-option
          >
        </a-select-opt-group>
      </a-select>
      <label>题型：</label>
      <a-select
        style="width: 200px"
        v-model:value="questionTypeId"
        placeholder="请选择题型"
        @change="typeChange"
      >
        <a-select-option
          v-for="item in questionTypes"
          :key="item.id"
          :value="item.id"
          >{{ item.name }}</a-select-option
        >
      </a-select>
      <div class="btns">
        <a-button @click="selectExercise" type="primary">选择</a-button>
        <a-button @click="backList" type="primary">返回</a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="questionList"
      :row-selection="selectRowSelection"
      :pagination="false"
      :row-key="rowKey"
    />
  </div>
</template>
  <script lang="ts">
import { SyncOutlined } from "@ant-design/icons-vue";
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  computed,
  ref,
  unref,
} from "vue";
import {
  getContentExerciseApi,
  getExercisesMapApi,
  getQuestionTypesApi,
  getPoolsExerciseListApi,
  contentAddExerciseApi,
  deleteContentExerciseApi,
  getContentExerciseAnalysisApi
} from "../../api";
import empty from "src/components/Empty.vue";
import { message, Modal } from "ant-design-vue";
type TreactiveData = {
  showPanel: string;
  publicData: any[];
  selfData: any[];
  pools_id: undefined | number;
  questionTypes: any[];
  questionTypeId: number | undefined;
  questionList: any[];
  chapterExerciseList: any[];
  selectedIds: number[];
  questionCount:number
  scores:number
};
export default defineComponent({
  components: {
    SyncOutlined,
    empty,
  },
  setup() {
    const experiment_id: any = inject("experiment_id");
    console.log(experiment_id);
    const reactiveData: TreactiveData = reactive({
      showPanel: "loading",
      publicData: [],
      selfData: [],
      pools_id: undefined,
      questionTypes: [],
      questionTypeId: undefined,
      questionList: [],
      chapterExerciseList: [],
      selectedIds: [],
      questionCount:0,
      scores:0
    });
    const columns = [
      {
        title: "题目",
        dataIndex: "question",
      },
      {
        title: "类型",
        dataIndex: "type.name",
      },
      {
        title: "难度",
        dataIndex: "level.name",
      },
      {
        title: "分数",
        dataIndex: "origin_score",
      },
    ];
    onMounted(() => {
      getChapterExercise();
      getContentExerciseAnalysis()
    });
    const selectedRowKeys = ref<number[]>([]);
    const onSelectChange = (changableRowKeys: number[]) => {
      console.log("selectedRowKeys changed: ", changableRowKeys);
      selectedRowKeys.value = changableRowKeys;
    };
    const rowKey = (row: any) => {
      return row.id;
    };
    const selectRowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        getCheckboxProps: (record: any) => ({
          disabled: reactiveData.selectedIds.includes(record.id),
          name: record.name,
        }),
      };
    });
    // 获取共有章节目录
    function getPublicExercisesMap() {
      return new Promise((resolve, reject) => {
        getExercisesMapApi({ initial: 1, limit: 500 }).then((res: any) => {
          console.log(res);
          res.data.list.forEach((item: any) => {
            reactiveData.publicData.push(item);
          });
          if (res.data.list.length > 0) {
            reactiveData.pools_id = res.data.list[0].id;
          }
          resolve(res);
        });
      }).catch();
    }
    // 获取私有章节目录
    function getSelfExercisesMap() {
      return new Promise((resolve, reject) => {
        getExercisesMapApi({ initial: 0, limit: 500 }).then((res: any) => {
          console.log(res);
          res.data.list.forEach((item: any) => {
            reactiveData.selfData.push(item);
          });
          resolve(res);
        });
      }).catch();
    }
    // 获取题型
    function getQuestionTypes() {
      return new Promise((resolve, reject) => {
        getQuestionTypesApi().then((res: any) => {
          console.log(res);
          reactiveData.questionTypes = res.data;
          reactiveData.questionTypeId = reactiveData.questionTypes[0].id;
          resolve(res);
        });
      });
    }
    // 获取目录习题列表
    function getPoolsExerciseList() {
      getPoolsExerciseListApi(
        { type_id: reactiveData.questionTypeId, limit: 500 },
        { pool_id: reactiveData.pools_id }
      ).then((res: any) => {
        console.log(res);
        reactiveData.questionList = res.data.list;
      });
    }
    // 获取章节习题
    function getChapterExercise() {
      getContentExerciseApi(
        {
          page: 1,
          limit: 500,
        },
        { content_id: experiment_id.value }
      ).then((res: any) => {
        console.log(res);
        reactiveData.chapterExerciseList = res.data.list;
        reactiveData.selectedIds = [];
        if (reactiveData.chapterExerciseList.length > 0) {
          reactiveData.chapterExerciseList.map((item: any) => {
            reactiveData.selectedIds.push(item.id);
          });
          reactiveData.showPanel = "list";
        } else {
          reactiveData.showPanel = "none";
        }
      });
    }

    // 获取习题统计
    function getContentExerciseAnalysis() {
        getContentExerciseAnalysisApi({content_id:experiment_id.value}).then((res:any)=>{
            console.log(res);
            reactiveData.questionCount=res.data.question_total
            reactiveData.scores=res.data.score_total
        })
    }
    // 打开选择习题面板
    async function openSelectPanel() {
      reactiveData.showPanel = "select";
      selectedRowKeys.value = [];
      await getPublicExercisesMap();
      await getSelfExercisesMap();
      await getQuestionTypes();
      getPoolsExerciseList();
    }
    // 目录发生变化时
    function poolsChange() {
      getPoolsExerciseList();
    }
    // 题型发生变化时
    function typeChange() {
      getPoolsExerciseList();
    }
    // 选择按钮
    function selectExercise() {
      console.log(selectedRowKeys.value);
      contentAddExerciseApi(
        { question_ids: selectedRowKeys.value },
        { content_id: experiment_id.value }
      ).then((res: any) => {
        console.log(res);
        getChapterExercise();
        getContentExerciseAnalysis()
      });
    }
    // 返回
    function backList() {
      getChapterExercise();
      getContentExerciseAnalysis()
    }

    // 删除章节习题
    function deleteChapterExercise(val: any) {
      Modal.confirm({
        title: "删除提示",
        content: "确认删除习题" + val.question + "吗？",
        onOk: () => {
          deleteContentExerciseApi({ relation_ids: [val.relation_id] }).then(
            (res: any) => {
              message.success(res.msg);
              getChapterExercise();
              getContentExerciseAnalysis()
            }
          );
        },
      });
    }
    return {
      ...toRefs(reactiveData),
      openSelectPanel,
      selectExercise,
      backList,
      poolsChange,
      typeChange,
      columns,
      selectRowSelection,
      rowKey,
      deleteChapterExercise,
    };
  },
});
</script>
  
  <style lang="less">
.exercise-list-tab {
  height: 100%;
}
.prepare-lessons-loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  > .anticon-sync {
    font-size: 50px;
  }
}
.select-exercise-tab {
  height: 100%;
  .select-list-head {
    display: flex;
    > div {
      margin-right: 15px;
    }
    .btns {
      margin-left: auto;
      margin-right: 0;
      > button {
        margin-left: 15px;
      }
    }
  }
}
.exercise-list-tab {
  overflow-y: auto;
  .exercise-list-head {
    display: flex;
    > span {
      margin-right: 15px;
      > i {
        margin: 0 5px;
        font-style: normal;
        color: @theme-color;
        font-size: 18px;
      }
    }
    > button {
      margin-left: auto;
    }
  }
  .exercise-list-box {
    .exercise-list-item {
      display: flex;
      flex-direction: row;
      padding: 15px;
      align-items: center;
      border: 1px solid #e7e7e7;
      height: 60px;
      margin: 10px 0;
      transition: 0.5s;
      &:hover {
        border: 1px solid @theme-color;
      }
      span {
        &:nth-child(1) {
          flex: 1;
        }
        &:nth-child(2) {
          width: 160px;
          flex-shrink: 0;
        }
        &:nth-child(3) {
          width: 160px;
          flex-shrink: 0;
        }
        &:nth-child(4) {
          flex-shrink: 0;
          cursor: pointer;
        }
      }
    }
  }
}
</style>