<template>
  <div class="course-experiment-box">
    <div class="course-experiment-left">
      <div class="action-top-box">
        <a-button type="primary" size="small" @click="openAddChapterModal" v-role="[tab]"
          >+自定义章节</a-button
        >
        <a-button type="primary" size="small" @click="openAddChapter" v-role="[tab]"
          >+添加章节</a-button
        >
        <a-button type="primary" size="small" @click="openAddExperiment" v-role="[tab]"
          >+添加实验</a-button
        >
      </div>
      <div class="bacGray" v-role="[tab]">
        <span data-v-d3afaa76="" class="waring-icon">!</span>已添加的实验/章节可以拖动排序
      </div>
      <div class="course-menu-tree">
        <drag-tree
          :treeData="treeData"
          @selectChapter="selectChapter"
          @selectExperiment="selectExperiment"
          @editNode="editNode"
          @deleteNode="deleteNode"
        ></drag-tree>
      </div>
    </div>
    <div v-if="chapter_id||rightTab === 'addChapter'" class="course-experiment-right">
      <chapterDetail v-if="rightTab === 'chapterDetail'" />
      <addChapter v-if="rightTab === 'addChapter'" />
      <addExperiment v-if="rightTab === 'addExperiment'" />
      <experimentDetail v-if="rightTab === 'experimentDetail'" />
    </div>

    <template v-else>
      <empty class="emptyContent" text="暂无数据，请点击左侧自定义章节/添加章节按钮，进行添加章节"></empty>
    </template>
  </div>
  <a-modal
    :visible="createChapterVisible"
    title="添加章节"
    @cancel="closeCreateChapterModel"
    @ok="submitCreateChapter"
  >
    <label>章节名称：</label>
    <a-input v-model:value="chapterName" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, provide, ref, watch } from "vue";
import DragTree from "src/components/dragTree.vue";
import {
  getCourseTreeApi,
  updateChapterApi,
  createCourseChapterApi,
  deleteChapterApi,
} from "./api";
import { useRoute } from "vue-router";
import chapterDetail from "./chapterDetail.vue";
import addChapter from "./addChapter.vue";
import addExperiment from "./addExperiment.vue";
import experimentDetail from "./experimentDetail.vue";
import { message } from "ant-design-vue";
import empty from "src/components/Empty.vue";

export default defineComponent({
  components: {
    "drag-tree": DragTree,
    chapterDetail,
    experimentDetail,
    addChapter,
    addExperiment,
    empty,
  },
  setup() {
    const route = useRoute();
    const course_id = (route.query.course_id as any) as number;
    const currentTab = route.query.currentTab;
    const chapter_id = ref("");
    const experiment_id = ref("");
    const tab = ref(-1);
    provide("course_id", course_id);
    provide("chapter_id", chapter_id);
    provide("experiment_id", experiment_id);

    watch(
      () => currentTab,
      () => {
        if (currentTab) {
          if (currentTab === "myCourse") {
            tab.value = 0;
          }
          if (currentTab === "initCourse") {
            tab.value = 1;
          }
        } else {
          tab.value = 0;
        }
      },
      {
        immediate: true,
      }
    );
    const reactiveData = reactive({
      treeData: [],
      rightTab: "chapterDetail",
      createChapterVisible: false,
      chapterName: "",
    });
    onMounted(() => {
      getCourseTree();
    });
    function selectChapter(val: any, isinit: boolean) {
      chapter_id.value = val.id;
      if (isinit) {
        reactiveData.rightTab = "chapterDetail";
      }
    }
    function selectExperiment(val: any) {
      experiment_id.value = val.id;
      reactiveData.rightTab = "experimentDetail";
    }
    // 打开添加章节面板
    function openAddChapter() {
      reactiveData.rightTab = "addChapter";
    }
    // 打开添加实验面板
    function openAddExperiment() {
      reactiveData.rightTab = "addExperiment";
    }
    // 获取课程实验树
    function getCourseTree() {
      getCourseTreeApi({ course_id: course_id }).then((res: any) => {
        reactiveData.treeData = res.data;
      });
    }
    provide("updateTree", getCourseTree);
    // 编辑课程实验
    function editNode(val: string, nodeId: number) {
      updateChapterApi(
        { course_id: course_id, chapter_id: nodeId },
        { chapter_name: val }
      ).then((res: any) => {
        getCourseTree();
      });
    }

    // 打开添加章节弹框
    function openAddChapterModal() {
      reactiveData.createChapterVisible = true;
    }
    // 关闭创建章节弹框
    function closeCreateChapterModel() {
      reactiveData.createChapterVisible = false;
    }
    // 提交创建章节
    function submitCreateChapter() {
      createCourseChapterApi(
        { chapter_name: reactiveData.chapterName },
        { course_id: course_id }
      ).then((res: any) => {
        reactiveData.createChapterVisible = false;
        message.success(res.msg);
        reactiveData.chapterName = "";
        getCourseTree();
      });
    }
    // 删除章节或者实验
    function deleteNode(val: any) {
      deleteChapterApi({ course_id: course_id, chapter_id: val.id }).then((res: any) => {
        message.success(res.msg);
        chapter_id.value = "";
        getCourseTree();
        reactiveData.rightTab = "chapterDetail";
      });
    }
    return {
      selectChapter,
      selectExperiment,
      editNode,
      ...toRefs(reactiveData),
      openAddChapter,
      openAddExperiment,
      provide,
      openAddChapterModal,
      closeCreateChapterModel,
      submitCreateChapter,
      deleteNode,
      tab,
      chapter_id,
    };
  },
});
</script>

<style lang="less">
.course-experiment-box {
  display: flex;
  flex-direction: row;
  height: 900px;
  .emptyContent{
    background-color: @white;
    margin-left: 15px;
  }
  .course-experiment-left {
    width: 440px;
    flex-shrink: 0;
    height: 100%;
    background: @white;
    border-radius: @border-radius-base;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .action-top-box {
      padding: 15px;
      flex-shrink: 0;
      > button {
        margin-right: 15px;
        font-size: 14px;
      }
    }
    .bacGray {
      flex-shrink: 0;
      padding: 0 26px;
      color: rgba(5, 1, 1, 0.25);
      font-size: 12px;
      line-height: 30px;
      background: #fafafa;
      .waring-icon {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 0.5px solid rgba(5, 1, 1, 0.25);
        display: inline-block;
        line-height: 13px;
        text-align: center;
        margin-left: 5px;
      }
    }
    .course-menu-tree {
      flex: 1;
    }
  }
  .course-experiment-right {
    height: 100%;
    flex: 1;
    width: 200px;
    margin-left: 15px;
    // background: @white;
    border-radius: @border-radius-base;
    overflow-y: auto;
  }
}
</style>
