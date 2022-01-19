<template>
  <div class="experimental-guide-tab">
    <train-guide
      v-if="!taskType"
      :opType="opType"
      :type="type"
      :taskId="taskId"
      :topoinst_id="topoinst_uuid"
    ></train-guide>
    <test-guide
      v-else
      :opType="opType"
      :type="type"
      :taskId="taskId"
      :topoinst_id="topoinst_uuid"
    ></test-guide>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, watch, onMounted, computed } from "vue";
import markedEditor from "src/components/editor/markedEditor.vue";
import { Modal } from "ant-design-vue";
import { stepAction } from "src/utils/vncInspect";
import { useRoute, useRouter } from "vue-router";
import trainGuide from "./trainGuide.vue";
import testGuide from "./testGuide.vue";

export default defineComponent({
  components: {
    "marked-editor": markedEditor,
    "train-guide": trainGuide,
    "test-guide": testGuide,
  },
  setup(props, { emit }) {
    const preview = true;
    const route = useRoute();
    const router = useRouter();
    let vmQuery = route.query as any;
    const {
      opType,
      connection_id,
      topoinst_uuid,
      taskId,
      type,
      topoinst_id,
      routerQuery,
    }: any = vmQuery;
    console.log(opType, taskId, type, topoinst_id);
    let allInfo: any = inject("allInfo");
    let taskType: any = inject("taskType");
    console.log(taskType)
    return {
      allInfo,
      preview,
      opType,
      taskId,
      type,
      topoinst_id,
      taskType,
      topoinst_uuid
    };
  },
});
</script>

<style lang="less">
.experimental-guide-tab {
  padding: 16px 25px;
  white-space: break-spaces;
  overflow: auto;
  height: calc(100% - 23px);
  .train-experimental-guide {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > .start-train {
        margin-left: auto;
        >button{
          margin-left: 10px;
        }
      }
  }
  .experimental-step-title {
    display: flex;
    justify-content: space-between;
    button {
      flex-shrink: 0;
    }
  }
  .action {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    button {
      margin-left: 15px;
    }
  }
  .guide-title {
    font-size: 20px;
    color: #050101;
    font-weight: 700;
  }
  .demo__container {
    .mark__container {
      border: none;
    }
  }
  .markdown-body.mark__preview {
    min-width: auto;
    overflow: hidden;
  }
  .guide-waraing{
    background: #f19100;
    color: var(--black-100);
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    >span{
      margin-right: 5px;
      font-size: 12px;
    }
  }
}
</style>