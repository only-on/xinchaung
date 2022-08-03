<template>
  <div class="outlineinfo flexCenter">
    <div class="title">{{props.title}}</div>
    <div class="explain">{{props.explain}}</div>
    <div class="explainText">{{props.explainText}}</div>
    <!-- <div>无说明文字</div> -->
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
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
const router = useRouter();
const route = useRoute();

interface Props {
  title: string;
  explain:string;
  explainText:string
}
const props = withDefaults(defineProps<Props>(), {
  title:'',
  explain:'',
  explainText:'',
});

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();

</script>
<style scoped lang="less">
  .outlineinfo{
    flex-direction: column;
    padding-bottom: 32px;
    .title{
      margin: 0 auto;
      font-size: 18px;
      color: var(--black-85);
      margin-bottom: 56px;
    }
    .explainText{
      padding: 16px 30px 24px;
    }
  }

</style>
