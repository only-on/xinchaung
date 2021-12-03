<template>
  <div>
    <div v-for="(v, k) in achievementsInfo" :key="k.toString()">
      <xe-quill
        :toolbar="'none'"
        v-model:value="v.note"
        height="300px"
        :readOnly="true"
        ref="quilldom"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import XeQuill from "@xianfe/vue3-quill/src/index.vue";
export default defineComponent({
  name: "CourseAchievement",
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
            achievementsInfo.value.push({
              id: item.id,
              note: JSON.parse(item.note),
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
