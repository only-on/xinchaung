<template>
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
        <div v-else>该任务未提交笔记</div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import XeQuill from "@xianfe/vue3-quill/src/index.vue";
export default defineComponent({
  name: "note",
  components: { XeQuill },
  props: ["detailInfo"],
  setup: (props, context) => {
    const achievementsInfo: any = ref([]);
    watch(
      () => props.detailInfo,
      () => {
        console.log(props.detailInfo, "achievementsInfo");
        achievementsInfo.value = [];
        if (props.detailInfo?.length) {
          props.detailInfo.forEach((item: any) => {
            console.log(item.name, item.note);
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
    return { achievementsInfo };
  },
});
</script>
<style lang="less" scoped>
:deep(.ql-toolbar.ql-snow) {
  display: none;
}
:deep(.ql-editor:nth-child(1)) {
  border-top: 1px solid #ccc;
}
</style>
