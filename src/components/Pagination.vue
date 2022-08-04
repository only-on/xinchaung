<template>
  <a-pagination
    :show-size-changer="showSizes"
    :current="page"
    :pageSize="size"
    :page-size-options="['10', '20', '30', '40', '50']"
    :total="total"
    :hideOnSinglePage="true"
    @showSizeChange="handleSizeChange"
    @change="handlePageChange"
  />
    <!-- :hideOnSinglePage="true" -->
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
  showSizes?: boolean,
  page: number,
  size: number,
  total: number,
}
const props = withDefaults(defineProps<Props>(), {
  showSizes: true,
  page:1,
  size: 10,
  total: 2,
});

const emit = defineEmits<{
  (e: "update:page", page: any): void;
  (e: "update:size", size:any): void;
  (e: "pageChange"): void;
}>();

const handlePageChange=(page:number)=>{
  emit('update:page', page)
  emit('pageChange')
}
const handleSizeChange = (page:number, size:number) => {
  emit('update:page', page)
  emit('update:size', size)
  emit('pageChange')
}
</script>
<style scoped lang="less"></style>
