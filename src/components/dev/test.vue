<template></template>
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
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
defineProps<{
  // 采用ts专有声明，无默认值
  msg: string;
  num?: number;
}>();

// 采用ts专有声明，有默认值
interface Props {
  msg?: string;
  labels?: string[];
}
const props = withDefaults(defineProps<Props>(), {
  msg: "hello",
  labels: () => ["one", "two"],
});
</script>
<style scoped lang="less"></style>
