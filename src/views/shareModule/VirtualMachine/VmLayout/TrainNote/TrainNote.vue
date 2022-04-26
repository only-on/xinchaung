<template>
  <div style="white-space: break-spaces" class="train-note-box">
    <div v-if="notes.length > 0">
      <h2>
        任务{{ NoToCh(currentIndex + 1) }}：{{ notes[currentIndex].name }}
      </h2>
      <QuillEditor
        v-model="noteContent"
        v-if="quillLoading"
        height="500px"
        :uploadPathName="'TrainNote'"
      ></QuillEditor>
      <div class="action-box">
        <a-button type="primary" @click="lastStep" v-if="currentIndex != 0"
          >上一任务</a-button
        >
        <a-button
          type="primary"
          @click="nextStep"
          v-if="currentIndex < notes.length - 1"
          >下一任务</a-button
        >
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from "vue";
import QuillEditor from "src/components/editor/quill.vue";
import request from "src/request/getRequest";
import { useRoute } from "vue-router";
import { NoToCh } from "src/utils/common";

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup() {
    const noteApi = request.vmApi;
    const route = useRoute();
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

    const noteContent = ref({
      ops: [],
    });

    const notes:Ref<any> = ref([]);
    const currentIndex = ref(0);
    const quillLoading = ref(true);
    onMounted(() => {
      getNotes();
    });
    function getNotes() {
      noteApi
        .getTrainNoteApi({
          param: {
            trainId: taskId,
          },
        })
        .then((res:any) => {
          console.log(res);
          notes.value = res?.data;
          noteContent.value = getNoteContent();
          quillLoading.value=true
        });
    }

    function getNoteContent() {
      quillLoading.value = false;
      noteContent.value = {
        ops: [],
      };
      return (notes as any).value[currentIndex.value].content?JSON.parse((notes as any).value[currentIndex.value].content):{
        ops:[]
      };
    }

    // 上一个
    function lastStep() {
      saveNote().then(() => {
        currentIndex.value--;
        noteContent.value = getNoteContent();
        setTimeout(() => {
          quillLoading.value = true;
        }, 100);
      });
    }

    // 下一个
    function nextStep() {
      saveNote().then(() => {
        currentIndex.value++;
        noteContent.value = getNoteContent();
        setTimeout(() => {
          quillLoading.value = true;
        }, 100);
      });
    }

    function saveNote() {
      return new Promise((resolve: any, reject: any) => {
        let obj = {
          content_id: (notes as any).value[currentIndex.value].id,
          note: JSON.stringify(noteContent.value),
          train_id: taskId,
        };
        noteApi
          .saveTrainNoteApi({ param: { ...obj } })
          .then((res:any) => {
            (notes as any).value[currentIndex.value].content = JSON.stringify(
              noteContent.value
            );
            resolve(true);
          })
          .catch((err:any) => {
            reject(false);
          });
      });
    }
    return {
      noteContent,
      notes,
      currentIndex,
      NoToCh,
      // getNoteContent,
      lastStep,
      nextStep,
      quillLoading,
    };
  },
});
</script>

<style lang="less">
.train-note-box {
  padding: 15px;
  .action-box {
    margin-top: 15px;
    > button {
      margin-right: 15px;
    }
  }
}
</style>
