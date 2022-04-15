<template>
  <div class="experimental-note">
    <QuillEditor
      v-model="noteContent"
      height="100%"
      :uploadPathName="'ExperimentalNote'"
    ></QuillEditor>
    <div class="experimental-action">
      <a-button type="primary" @click="submitNote">提交笔记</a-button>
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
      noteApi.getNoteApi({ param: { task_id: taskId } }).then((res) => {
        console.log(res);
        if (res?.data) {
          noteContent.value = JSON.parse(res.data);
        }
        console.log(noteContent.value.ops);
      });
    }

    // 提交笔记
    function submitNote() {
      let obj = { content: JSON.stringify(noteContent.value), taskId: taskId };

      noteApi
        .saveNoteApi({ param: { ...obj } })
        .then((res) => {
          message.success("保存成功");
        })
        .catch((err) => {
          console.log(err);
        });
    }
</script>

<style lang="less" scoped>
.experimental-note {
  white-space: break-spaces;
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
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
    text-align: center;
    margin-top: 15px;
    flex-shrink: 0;
  }
}
</style>