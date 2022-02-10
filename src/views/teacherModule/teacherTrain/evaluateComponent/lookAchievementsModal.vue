<template>
  <a-modal
    class="modal"
    title="实训成果"
    :footer="null"
    :visible="visible"
    @cancel="close()"
    :width="1000"
  >
    <!-- <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="(v, k) in lookAchievementsInfo" :key="k" :tab="v.name">
        <div v-if="v.note">
          <antdv-markdown v-model="v.note" :preview-only="true" class="markdown__editor"/>
        </div>
        <div v-else>该任务未提交笔记</div>
      </a-tab-pane>
    </a-tabs> -->
    <div>
      <a-tabs default-active-key="1">
        <a-tab-pane v-for="(v, k) in achievementsInfo" :key="k.toString()">
          <template #tab>
            <div>{{ v.name }}</div>
          </template>
          <div v-if="v.note">
            <xe-quill
              :toolbar="'none'"
              v-model:value="v.note"
              height="300px"
              :readOnly="true"
              ref="quilldom"
            />
          </div>
          <div v-else class="note">该任务未提交笔记</div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, computed, Ref } from "vue";
// import  XeQuill  from 'src/components/dev/Quill.vue';
import {XeQuill} from "@xianfe/vue3-quill";
import { goHtml } from "src/utils/common";

export default defineComponent({
  components: {
    XeQuill,
  },
  props: {
    isShowAchievements: Boolean,
    lookAchievementsInfo: {
      type: Array,
      default: [],
    },
  },
  emit: ["close"],
  setup(props, { emit }) {
    let activeKey = ref("");

    let visible = ref(false);
    let achievementsInfo: Ref<any> = ref([]);
    let note = ref();
    watch(
      () => props.isShowAchievements,
      (newVal) => {
        visible.value = newVal;
        if (newVal) {
          console.log(props.lookAchievementsInfo);
          activeKey.value = Object.keys(props.lookAchievementsInfo)[0];
        }
      },
      { deep: true }
    );
    const close = () => {
      emit("close");
      // activeKey.value = ''
    };
    const quillItem = (val: any) => {
      return JSON.parse(val);
    };
    watch(
      () => props.lookAchievementsInfo,
      () => {
        achievementsInfo.value = [];
        if (props.lookAchievementsInfo?.length) {
          props.lookAchievementsInfo.forEach((item: any) => {
            achievementsInfo.value.push({
              id: item.id,
              name: item.name,
              note: item.note ? JSON.parse(item.note) : item.note,
            });
          });
        }
      },
      { deep: true, immediate: true }
    );
    return {
      visible,
      close,
      activeKey,
      note,
      achievementsInfo,
      quillItem,
    };
  },
});
</script>

<style lang="less" scoped>
:deep(.ant-modal-body) {
  height: 750px;
}
.modal {
  height: 750px;
}
.markdown__editor {
  height: 100px;
}
:deep(.ql-toolbar.ql-snow) {
  display: none;
}
:deep(.ql-editor:nth-child(1)) {
  border-top: 1px solid #ccc;
}
.note{
  min-height: 200px;
}
</style>
