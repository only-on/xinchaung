<template>
  <div class="experimental-note">
    <QuillEditor
      v-model="noteContent"
      height="100%"
      :uploadPathName="'ExperimentalNote'"
    ></QuillEditor>
    <div class="experimental-action">
      <a-button type="primary" @click="submitNote">提交笔记</a-button>
      <a-button type="primary" @click="downloadNote" class="brightBtn">下载笔记</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref} from "vue";
import QuillEditor from "src/components/editor/quill.vue";
import request from "src/request/getRequest";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";

const noteApi = request.vmApi;
const route = useRoute();

const {taskId}=route.query

const noteContent = ref({
      ops: [],
    });
 
onMounted(() => {
      getNoteContent();
    });

    // 获取笔记
    function getNoteContent() {
      noteApi.getNoteApi({ param: { task_id: taskId } }).then((res:any) => {
        if (res?.data) {
          noteContent.value = JSON.parse(res.data);
        }
      });
    }

    // 提交笔记
    function submitNote() {
      let obj = { content: JSON.stringify(noteContent.value), taskId: taskId };

      noteApi
        .saveNoteApi({ param: { ...obj } })
        .then((res:any) => {
          message.success("保存成功");
        })
        .catch((err:any) => {
          console.log(err);
        });
    }

    // 下载笔记
    function downloadNote() {
      console.log('downloadNote')
    }
</script>

<style lang="less" scoped>
.experimental-note {
  white-space: break-spaces;
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 120px);
  .ql-container {
    min-height: 600px !important;
  }
  .quill-editor-wrap {
    height: 100%;
  }
  :deep(.ant-spin-nested-loading),
  :deep(.ant-spin-container) {
    height: 100%;
  }
  .experimental-action {
    // text-align: center;
    margin-top: 15px;
    flex-shrink: 0;
    .brightBtn {
      margin-left: 16px;
    }
  }
}
</style>