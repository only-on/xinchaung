<template>
  <a-pagination
    v-if="props.totalCount > 12"
    v-model:current="props.page"
    :pageSize="props.limit"
    :total="props.totalCount"
    @change="pageChange"
    />
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
interface Props {
  totalCount: number;
  page:number
  limit:number
}
const props = withDefaults(defineProps<Props>(), {
  totalCount: 0,
  page:1,
  limit:0
});

const emit = defineEmits<{
  (e: "pageChange", val: any): void;
}>();

const pageChange=()=>{

}
// const pageChange=()=>{
  
// }
// const pageChange=()=>{
  
// }
// const pageChange=()=>{
  
// }
// const pageChange=()=>{
  
// }
</script>
<style scoped lang="less"></style>
