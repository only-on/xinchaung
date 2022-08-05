<template>
  <div class="outlineinfo flexCenter">
    <div class="title">{{props.title}}</div>
    <div class="explainTextBox">
      <div class="explain">{{props.explain}}</div>
      <div class="explainText">{{props.explainText?props.explainText:'无说明文字'}}</div>
    </div>
    <!-- <div>无说明文字</div>  --lightgray-2-->
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
    background-color: var(--white);
    flex-direction: column;
    // padding-bottom: 32px;
    padding: 32px 30px;
    margin-bottom: 24px;
    border-radius: 10px;
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.07); 
    .title{
      margin: 0 auto;
      font-size: 18px;
      color: var(--black-85);
      margin-bottom: 32px;
    }
    .explainTextBox{
      background-color: var(--lightgray-2);
      padding: 24px 30px;
      .explain{
        text-align: center;
        padding-bottom: 16px;
      }
    }
    .explainText{
      // padding: 16px 30px 24px;
    }
  }

</style>
