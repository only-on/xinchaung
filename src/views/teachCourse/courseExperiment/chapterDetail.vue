<template>
  <div class="chapter-detail-box">
    <a-tabs v-model:activeKey="activeKey" size="small">
      <a-tab-pane key="1" tab="章节概述" force-render>
        <div class="chapter-intro-tab">
          <div v-if="isNoChapterIntro" style="height: calc(100% - 26px)">
            <div class="intro-action-btn" v-role="[tab]">
              <a-button
                v-if="isEditIntro"
                type="primary"
                @click="saveIntro"
                >保存</a-button
              >
              <a-button v-else type="primary" @click="editIntro"
                >编辑</a-button
              >
            </div>
            <marked-editor
              v-if="isEditIntro"
              v-model="chapterIntro"
              :preview="false"
            />
            <marked-editor
              v-else
              v-model="chapterDetailData.chapter_des"
              :preview="true"
            />
          </div>
          <div v-else class="no-data-wrap">
            <empty text="暂无章节概述，可点击下方按钮添加"> </empty>
            <div class="action-btn" v-role="[tab]">
              <a-button
                type="primary"
                @click="
                  isNoChapterIntro = true;
                  isEditIntro = true;
                "
                >添加章节概述</a-button
              >
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="备课资料"
        force-render
        class="prepare-lessons-tab"
      >
        <template v-if="activeKey === '2'">
          <prepare-or-guide :activeKey="activeKey" />
        </template>
      </a-tab-pane>
      <a-tab-pane key="3" tab="教学指导" force-render>
        <template v-if="activeKey === '3'">
          <prepare-or-guide :activeKey="activeKey" />
        </template>
      </a-tab-pane>
      <a-tab-pane
        key="4"
        :tab="'课后习题(' + exerciseSum + ')'"
        force-render
      >
        <template v-if="activeKey === '4'">
          <chapter-exercise-tab v-model:sum="exerciseSum" />
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  inject,
  watch,
  Ref,
  ref,
  onMounted,
} from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import empty from "src/components/Empty.vue";
import {
  getChapterDetailApi,
  saveChapterIntro,
  getChapterExerciseAnalysisApi,
} from "./api";
import prepareOrGuide from "./components/prepareOrGuide/prepareOrGuide.vue";
import chapterExerciseTab from "./components/chapterExerciseTab.vue";
type TreactiveData = {
  activeKey: string;
  isEditIntro: boolean;
  chapterIntro: string;
  isNoChapterIntro: boolean;
};

export default defineComponent({
  components: {
    "marked-editor": markedEditor,
    empty,
    "prepare-or-guide": prepareOrGuide,
    "chapter-exercise-tab": chapterExerciseTab,
  },
  setup() {
    const course_id: any = inject("course_id");
    const chapter_id: any = inject("chapter_id");
    const tab: any = inject("tab");
    const chapterDetailData: Ref<any> = ref({});
    const exerciseSum = ref(0);
    const reactiveData: TreactiveData = reactive({
      activeKey: "1",
      isEditIntro: false,
      chapterIntro: "",
      isNoChapterIntro: true,
    });

    watch(
      () => chapter_id,
      () => {
        reactiveData.activeKey = "1";
        exerciseSum.value = 0;
        getChapterDetail();
        getChapterExerciseAnalysis();
      },
      { deep: true, immediate: true }
    );

    // 获取章节详情
    function getChapterDetail() {
      getChapterDetailApi({
        course_id: course_id,
        chapter_id: chapter_id.value,
      }).then((res: any) => {
        chapterDetailData.value = res.data;
        reactiveData.isNoChapterIntro = (chapterDetailData.value as any)
          .chapter_des
          ? true
          : false;
      });
    }
    // 保存章节概述
    function saveIntro() {
      let urlParams = {
        course_id: course_id,
        chapter_id: chapter_id.value,
      };
      saveChapterIntro(urlParams, {
        chapter_des: reactiveData.chapterIntro,
      }).then((res: any) => {
        reactiveData.isEditIntro = false;
        (chapterDetailData.value as any).chapter_des =
          reactiveData.chapterIntro;
      });
    }
    // 编辑章节概述
    function editIntro() {
      reactiveData.isEditIntro = true;
      reactiveData.chapterIntro = (chapterDetailData.value as any).chapter_des;
    }

    // 获取习题统计
    function getChapterExerciseAnalysis() {
      getChapterExerciseAnalysisApi({ chapter_id: chapter_id.value }).then(
        (res: any) => {
          exerciseSum.value = res.data.question_total;
        }
      );
    }
    return {
      ...toRefs(reactiveData),
      saveIntro,
      editIntro,
      chapterDetailData,
      tab,
      exerciseSum,
    };
  },
});
</script>

<style lang="less">
.chapter-detail-box {
  padding: 15px;
  height: calc(100%);
  background: var(--white-100);
  display: flex;
  flex-direction: column;

  .ant-tabs {
    height: calc(100%);
    display: flex;
    flex-direction: column;
    .ant-tabs-bar {
      flex-shrink: 0;
    }
    .ant-tabs-content {
      flex: 1;
      height: calc(100% - 60px);
    }
  }
  .chapter-intro-tab {
    display: flex;
    flex-direction: column;
    height: 100%;
    .action-btn {
      width: 100%;
      text-align: center;
    }
    .intro-action-btn {
      width: 100%;
      text-align: right;
      flex-shrink: 0;
      margin-bottom: 15px;
      > button {
        font-size: 14px;
        // margin-left: 15px;
      }
    }
    .demo__container {
      height: calc(100% - 26px);
      .mark__container {
        height: 100%;
        overflow-y: 100%;
      }
    }
    .mark__body {
      display: flex;
      .mark__editor,
      .markdown-body {
        min-width: unset;
        width: 50%;
      }
    }
  }
  .chapter-intro {
    width: 100%;
    height: 100%;
    > iframe {
      width: 100%;
      height: 100%;
    }
  }
  .chapter-intro-none {
    .action-btn {
      text-align: center;
      > button {
        margin-left: 15px;
      }
    }
  }
  .prepare-lessons-tab {
    height: 100%;
    overflow-y: auto;
  }
  .ant-tabs-tabpane {
    height: 100%;
    overflow: auto;
  }
  .no-data-wrap {
    margin-top: 80px;
  }
}
</style>
