<template>
  <div class="chapter-exercise-tab-wrap">
    <div v-if="showPanel === 'loading'" class="prepare-lessons-loading">
      <SyncOutlined spin />
    </div>
    <div v-if="showPanel === 'list'" class="exercise-list-tab">
      <div class="exercise-list-head">
        <span
          >共<i>{{ questionCount }}</i
          >道题</span
        >
        <span
          >共记<i>{{ scores }}</i
          >分</span
        >
        <a-button type="primary" @click="openSelectPanel" v-role="[tab]"
          >选择习题</a-button
        >
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
            v-role="[tab]"
            class="exam-list-detele iconfont icon-shanchu"
            @click="deleteChapterExercise(item)"
          ></span>
        </div>
      </div>
    </div>
    <div v-if="showPanel === 'none'" class="no-exercise-wrap">
      <empty text="您还没有添加习题，请从数据中心选择习题！"> </empty>
      <div
        class="action-btn"
        style="text-align: center; width: 100%"
        v-role="[tab]"
      >
        <a-button type="primary" @click="openSelectPanel">选择习题</a-button>
      </div>
    </div>
    <div v-if="showPanel === 'select'" class="select-exercise-tab">
      <div class="select-list-head">
        <before-icon :icon="group12">
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
        </before-icon>
       <before-icon :icon="group3">
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
       </before-icon>
        <div class="btns" v-role="[tab]">
          <a-button @click="selectExercise" type="primary">选择</a-button>
          <a-button @click="backList" type="primary">返回</a-button>
        </div>
      </div>
    <a-config-provider>
      <a-table
        :columns="columns"
        :data-source="questionList"
        :row-selection="selectRowSelection"
        :pagination="false"
        :row-key="rowKey"
      />
      <template #renderEmpty>
        <div><empty type="tableEmpty"></empty></div>
      </template>
    </a-config-provider>
    </div>
    <div v-if="showPanel === 'nodata'" class="no-exercise-wrap">
      <empty text="未选中章节！"> </empty>
    </div>
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
  getChapterExerciseApi,
  getExercisesMapApi,
  getQuestionTypesApi,
  getPoolsExerciseListApi,
  chapterAddExerciseApi,
  deleteChapterExerciseApi,
  getChapterExerciseAnalysisApi,
} from "../api";
import empty from "src/components/Empty.vue";
import beforeIcon from "src/components/aiAnt/beforeIcon.vue"
import group12 from "src/assets/images/screenicon/Group12.png"
import group3 from "src/assets/images/screenicon/Group3.png"
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
  questionCount: number;
  scores: number;
};
export default defineComponent({
  components: {
    SyncOutlined,
    empty,
    "before-icon":beforeIcon
  },
  props:['sum'],
  setup(props,{emit}) {
    const chapter_id: any = inject("chapter_id");
    const tab: any = inject("tab");
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
      questionCount: 0,
      scores: 0,
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
      if (!chapter_id.value) {
        reactiveData.showPanel = "nodata";
        return;
      }
      getChapterExercise();
      getChapterExerciseAnalysis();
    });
    const selectedRowKeys = ref<number[]>([]);
    const onSelectChange = (changableRowKeys: number[]) => {
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
          res.data.list.forEach((item: any) => {
            reactiveData.selfData.push(item);
          });
          if (!reactiveData.pools_id && res.data.list.length > 0) {
            reactiveData.pools_id = res.data.list[0].id;
          }
          resolve(res);
        });
      }).catch();
    }
    // 获取题型
    function getQuestionTypes() {
      return new Promise((resolve, reject) => {
        getQuestionTypesApi().then((res: any) => {
          reactiveData.questionTypes = res.data;
          reactiveData.questionTypeId = reactiveData.questionTypes[0].id;
          resolve(res);
        });
      });
    }
    // 获取目录习题列表
    function getPoolsExerciseList() {
      if (!reactiveData.pools_id) {
        return;
      }
      getPoolsExerciseListApi(
        { type_id: reactiveData.questionTypeId, limit: 500 },
        { pool_id: reactiveData.pools_id }
      ).then((res: any) => {
        reactiveData.questionList = res.data.list;
      });
    }
    // 获取章节习题
    function getChapterExercise() {
      getChapterExerciseApi(
        {
          page: 1,
          limit: 500,
        },
        { chapter_id: chapter_id.value }
      ).then((res: any) => {
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
    function getChapterExerciseAnalysis() {
      getChapterExerciseAnalysisApi({ chapter_id: chapter_id.value }).then(
        (res: any) => {
          reactiveData.questionCount = res.data.question_total;
          reactiveData.scores = res.data.score_total;
          emit("update:sum",reactiveData.questionCount)
        }
      );
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
      chapterAddExerciseApi(
        { question_ids: selectedRowKeys.value },
        { chapter_id: chapter_id.value }
      ).then((res: any) => {
        getChapterExercise();
        getChapterExerciseAnalysis();
      });
    }
    // 返回
    function backList() {
      getChapterExercise();
      getChapterExerciseAnalysis();
    }

    // 删除章节习题
    function deleteChapterExercise(val: any) {
      Modal.confirm({
        title: "删除提示",
        content: "确认删除习题" + val.question + "吗？",
        onOk: () => {
          deleteChapterExerciseApi({ relation_ids: [val.relation_id] }).then(
            (res: any) => {
              message.success(res.msg);
              getChapterExercise();
              getChapterExerciseAnalysis();
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
      tab,
      group12,
      group3
    };
  },
});
</script>

<style lang="less">
.chapter-exercise-tab-wrap {
  height: 100%;
  overflow-y: auto;
  .no-exercise-wrap{
    margin-top: 80px;
  }
}
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
        font-size: 14px;
        
        &:nth-child(1) {
          flex: 1;
          color: rgba(@black,0.65);
        }
        &:nth-child(2) {
          width: 160px;
          flex-shrink: 0;
          color: rgba(@black,0.25);
        }
        &:nth-child(3) {
          width: 160px;
          flex-shrink: 0;
          color: rgba(@black,0.25);
        }
        &:nth-child(4) {
          flex-shrink: 0;
          cursor: pointer;
          color: rgba(@black,0.65);
          &:hover{
            color: @theme-color;
          }
        }
      }
    }
  }
}
</style>