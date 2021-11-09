<template>
  <div class="chapter-detail-box">
    <a-tabs v-model:activeKey="activeKey" size="small">
      <a-tab-pane key="1" tab="章节概述" force-render>
        <div class="chapter-intro-tab">
          <div v-if="isNoChapterIntro" style="height: calc(100% - 26px)">
            <div class="intro-action-btn">
              <a-button
                v-if="isEditIntro"
                type="primary"
                size="small"
                @click="saveIntro"
                >保存</a-button
              >
              <a-button v-else type="primary" size="small" @click="editIntro"
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
          <div v-else>
            <empty text="暂无章节概述，可点击下方按钮添加"> </empty>
            <div class="action-btn">
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
      <a-tab-pane key="4" tab="课后习题" force-render
        >Content of Tab Pane 3</a-tab-pane
      >
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
} from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import empty from "src/components/Empty.vue";
import { getChapterDetailApi, saveChapterIntro } from "./api";
import prepareOrGuide from "./components/prepareOrGuide/prepareOrGuide.vue";
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
  },
  setup() {
    const course_id: any = inject("course_id");
    const chapter_id: any = inject("chapter_id");
    const chapterDetailData:Ref<any> = ref({});
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
        getChapterDetail();
      },
      { deep: true, immediate: true }
    );

    watch(
      () => reactiveData.chapterIntro,
      () => {
        console.log("reactiveData.chapterIntro", reactiveData.chapterIntro);
      },
      { deep: true }
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

    return {
      ...toRefs(reactiveData),
      saveIntro,
      editIntro,
      chapterDetailData,
    };
  },
});
</script>

<style lang="less">
.chapter-detail-box {
  padding: 15px;
  height: calc(100% - 30px);
  background: @white;
  display: flex;
  flex-direction: column;
  .ant-tabs {
    height: calc(100% - 30px);
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
      text-align: center;
    }
    .intro-action-btn {
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
}
</style>
