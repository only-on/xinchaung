<template>
  <div class="ModelDetail">
    <div class="details details1">
      <div class="detailsTit">题目描述</div>
      <MarkedEditor v-model="props.desc" class="markdown__editor" :preview="true"/>
    </div>
    <div class="details details1">
      <div class="detailsTit">评测说明</div>
      <MarkedEditor v-model="props.evaluating" class="markdown__editor" :preview="true"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import MarkedEditor from "src/components/editor/markedEditor.vue";
interface Iinfo{
  desc: string;
  evaluating:string;
}
interface Props {
  desc?: string;
  evaluating?:string;
}
const props = withDefaults(defineProps<Props>(), {
  desc: '',
  evaluating:''
});

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();

</script>
<style scoped lang="less">
.markdown__editor{
  // min-height: 200px;
}
  .ModelDetail{
    .details{
      padding: 14px 0;
      margin-bottom: 1rem;
      .detailsTit{
        font-size: 16px;
        font-weight: 900;
        color: var(--black);
        // padding-bottom: 1rem;
        padding-bottom: 10px;
      }
    }
  }
</style>
